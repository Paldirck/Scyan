import { ACHIEVEMENTS, LESSONS, TOTAL_QUIZ_COUNT } from '../data/scienceData.js';
import {
  cancelQrPaymentTransaction,
  confirmQrPaymentAndActivatePremium,
  createQrPaymentTransaction,
  fetchLatestPendingPayment,
  fetchUserPrivateProfile,
  logoutFirebase,
  migrateLegacyPremiumFields,
  resetUserProgressInFirestore,
  saveUserProgressToFirestore,
  subscribeAuth,
  subscribeUserProgress,
  updateAliasInFirestore,
} from '../services/firebase.js';
import { triggerConfetti } from '../utils/confetti.js';
import { showToast } from '../utils/toast.js';

const STORAGE_KEY = 'sciencequest_user_state';

const DEFAULT_STATE = {
  namaAlias: 'plajar SCyan',
  xp: 0,
  level: 1,
  totalPoin: 0,
  materiSelesai: [],
  kuisSelesai: [],
  badges: [],
  dailyClaimedDate: '',
  isPremium: false,
  premiumPlan: '',
  premiumPaymentId: '',
};

let state = loadFromStorage();
let authMeta = {
  authReady: false,
  user: null,
  username: '',
  email: '',
  authProvider: '',
};

let unsubProgressSnapshot = null;
const listeners = new Set();

function loadFromStorage() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { ...DEFAULT_STATE };
    const parsed = JSON.parse(raw);
    const namaAlias =
      !parsed.namaAlias || parsed.namaAlias === 'Pelajar ScienceQuest'
        ? DEFAULT_STATE.namaAlias
        : parsed.namaAlias;
    return {
      ...DEFAULT_STATE,
      ...parsed,
      namaAlias,
      materiSelesai: Array.isArray(parsed.materiSelesai) ? parsed.materiSelesai : [],
      kuisSelesai: Array.isArray(parsed.kuisSelesai) ? parsed.kuisSelesai : [],
      badges: Array.isArray(parsed.badges) ? parsed.badges : [],
    };
  } catch {
    return { ...DEFAULT_STATE };
  }
}

function persistLocalOnly() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    // Storage quota or privacy mode fallback
  }
}

function persist() {
  if (authMeta.user) {
    saveUserProgressToFirestore(authMeta.user.uid, state).catch((err) => {
      console.error('Gagal menyimpan progres ke Firestore:', err);
      showToast('Gagal menyinkronkan progres ke Firebase.', 'warning');
    });
  } else {
    persistLocalOnly();
  }
  notify();
}

function notify() {
  const snapshot = getState();
  listeners.forEach((fn) => fn(snapshot));
}

export function initAuthSync(onAuthChange) {
  return subscribeAuth(async (firebaseUser) => {
    if (unsubProgressSnapshot) {
      unsubProgressSnapshot();
      unsubProgressSnapshot = null;
    }

    if (firebaseUser) {
      authMeta = {
        authReady: true,
        user: {
          uid: firebaseUser.uid,
          displayName: firebaseUser.displayName || '',
          email: firebaseUser.email || '',
        },
        username: '',
        email: firebaseUser.email || '',
        authProvider: firebaseUser.providerData?.[0]?.providerId || 'password',
      };

      try {
        const priv = await fetchUserPrivateProfile(firebaseUser.uid);
        if (priv) {
          authMeta.username = priv.username || '';
          authMeta.email = priv.email || authMeta.email;
          authMeta.authProvider = priv.authProvider || authMeta.authProvider;
        }
      } catch {
        // Private profile fetch handled via handleFirestoreError if critical
      }

      let legacyMigrationStarted = false;
      unsubProgressSnapshot = subscribeUserProgress(firebaseUser.uid, (remote) => {
        if (!('isPremium' in remote) && !legacyMigrationStarted) {
          legacyMigrationStarted = true;
          migrateLegacyPremiumFields(firebaseUser.uid).catch((err) => {
            console.error('Gagal migrasi kolom premium:', err);
          });
        }

        state = {
          namaAlias: remote.namaAlias || firebaseUser.displayName || authMeta.username || 'Pelajar',
          xp: typeof remote.xp === 'number' ? remote.xp : 0,
          level: typeof remote.level === 'number' ? remote.level : 1,
          totalPoin: typeof remote.totalPoin === 'number' ? remote.totalPoin : 0,
          materiSelesai: Array.isArray(remote.materiSelesai) ? remote.materiSelesai : [],
          kuisSelesai: Array.isArray(remote.kuisSelesai) ? remote.kuisSelesai : [],
          badges: Array.isArray(remote.badges) ? remote.badges : [],
          dailyClaimedDate: remote.dailyClaimedDate || '',
          isPremium: Boolean(remote.isPremium),
          premiumPlan: remote.premiumPlan || '',
          premiumPaymentId: remote.premiumPaymentId || '',
        };
        notify();
      });

      notify();
      onAuthChange?.(true);
    } else {
      authMeta = {
        authReady: true,
        user: null,
        username: '',
        email: '',
        authProvider: '',
      };
      state = loadFromStorage();
      notify();
      onAuthChange?.(false);
    }
  });
}

export function subscribe(fn) {
  listeners.add(fn);
  return () => listeners.delete(fn);
}

export function getState() {
  return {
    ...state,
    materiSelesai: [...state.materiSelesai],
    kuisSelesai: [...state.kuisSelesai],
    badges: [...state.badges],
    auth: { ...authMeta },
  };
}

export function getPlayerTitle(level) {
  if (level >= 6) return 'Profesor Sains Utama';
  if (level >= 4) return 'Peneliti Senior';
  if (level >= 3) return 'Eksplorator Sains';
  if (level >= 2) return 'Asisten Laboratorium';
  return 'Penjelajah Sains Muda';
}

export function getTodayDateString() {
  const now = new Date();
  const y = now.getFullYear();
  const m = String(now.getMonth() + 1).padStart(2, '0');
  const d = String(now.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

export function getLessonQuizStats(lesson) {
  const total = lesson.quizzes.length;
  const done = lesson.quizzes.filter((q) => state.kuisSelesai.includes(q.id)).length;
  return { done, total, allDone: done === total && total > 0 };
}

function countCompletedCategory(catId) {
  return LESSONS.filter(
    (l) => l.kategori === catId && state.materiSelesai.includes(l.id),
  ).length;
}

function evaluateBadges() {
  let unlockedAny = false;

  for (const badge of ACHIEVEMENTS) {
    if (state.badges.includes(badge.id)) continue;

    let shouldUnlock = false;
    if (badge.id === 'b-first-quiz' && state.kuisSelesai.length >= 1) shouldUnlock = true;
    if (badge.id === 'b-physics-master' && countCompletedCategory('fisika') >= 3) shouldUnlock = true;
    if (badge.id === 'b-chem-master' && countCompletedCategory('kimia') >= 3) shouldUnlock = true;
    if (badge.id === 'b-bio-master' && countCompletedCategory('biologi') >= 3) shouldUnlock = true;
    if (badge.id === 'b-astro-master' && countCompletedCategory('astronomi') >= 3) shouldUnlock = true;
    if (badge.id === 'b-score-100' && state.totalPoin >= 200) shouldUnlock = true;

    if (shouldUnlock) {
      state.badges.push(badge.id);
      unlockedAny = true;
      showToast(`Lencana terbuka: ${badge.nama}`, 'success');
    }
  }

  return unlockedAny;
}

function grantRewards(xpGained, pointsGained) {
  const prevLevel = state.level;
  state.xp += xpGained;
  state.totalPoin += pointsGained;
  state.level = Math.floor(state.xp / 100) + 1;

  const leveledUp = state.level > prevLevel;
  const badged = evaluateBadges();

  if (leveledUp) {
    showToast(`Naik ke Level ${state.level}!`, 'success');
  }
  if (leveledUp || badged) {
    triggerConfetti();
  }
}

export function recordQuizSuccess(lessonId, quizId, points) {
  const isFirstAttempt = !state.kuisSelesai.includes(quizId);

  if (isFirstAttempt) {
    state.kuisSelesai.push(quizId);
    grantRewards(30, points);
    triggerConfetti();
    showToast(`Benar! +${points} PTS & +30 XP diperoleh.`, 'success');
  } else {
    showToast('Jawaban benar. Poin soal ini sudah pernah diklaim.', 'info');
  }

  const lesson = LESSONS.find((l) => l.id === lessonId);
  if (lesson) {
    const allAnswered = lesson.quizzes.every((q) => state.kuisSelesai.includes(q.id));
    if (allAnswered && !state.materiSelesai.includes(lessonId)) {
      state.materiSelesai.push(lessonId);
      evaluateBadges();
    }
  }

  persist();
  return isFirstAttempt;
}

export function claimDailyChallenge() {
  const today = getTodayDateString();
  if (state.dailyClaimedDate === today) {
    return false;
  }

  state.dailyClaimedDate = today;
  grantRewards(50, 30);
  triggerConfetti();
  showToast('Tantangan harian selesai: +50 XP & +30 PTS.', 'success');
  persist();
  return true;
}

export function updateAlias(newAlias) {
  const cleaned = newAlias.trim().slice(0, 32);
  if (!cleaned) return false;
  state.namaAlias = cleaned;

  if (authMeta.user) {
    updateAliasInFirestore(authMeta.user.uid, cleaned).catch((err) => {
      console.error('Gagal memperbarui nama di Firestore:', err);
      showToast('Gagal menyimpan nama ke Firebase.', 'warning');
    });
  } else {
    persistLocalOnly();
  }

  showToast(`Nama pelajar diperbarui menjadi "${cleaned}".`, 'info');
  notify();
  return true;
}

export function resetProgress() {
  if (authMeta.user) {
    const currentAlias = state.namaAlias;
    const preservedPremium = {
      isPremium: state.isPremium,
      premiumPlan: state.premiumPlan,
      premiumPaymentId: state.premiumPaymentId,
    };
    state = { ...DEFAULT_STATE, ...preservedPremium, namaAlias: currentAlias };
    resetUserProgressInFirestore(authMeta.user.uid, currentAlias).catch((err) => {
      console.error('Gagal mereset progres di Firestore:', err);
      showToast('Gagal mereset progres di Firebase.', 'warning');
    });
    notify();
  } else {
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {
      // ignore
    }
    state = { ...DEFAULT_STATE };
    notify();
  }
  showToast('Seluruh progres belajar berhasil direset.', 'info');
}

export async function getPendingQrPayment() {
  if (!authMeta.user) return null;
  return fetchLatestPendingPayment(authMeta.user.uid);
}

export async function startQrPayment() {
  if (!authMeta.user) {
    throw new Error('Silakan masuk akun terlebih dahulu.');
  }
  const existingPending = await fetchLatestPendingPayment(authMeta.user.uid);
  if (existingPending) {
    return existingPending;
  }
  return createQrPaymentTransaction(authMeta.user.uid);
}

export async function completeQrPayment(paymentId) {
  if (!authMeta.user) {
    throw new Error('Silakan masuk akun terlebih dahulu.');
  }
  await confirmQrPaymentAndActivatePremium(authMeta.user.uid, paymentId);
  state.isPremium = true;
  state.premiumPlan = 'premium_achievements';
  state.premiumPaymentId = paymentId;
  triggerConfetti();
  showToast('Pembayaran Rp 1 berhasil! Tab Pencapaian kini terbuka.', 'success');
  notify();
}

export async function cancelQrPayment(paymentId) {
  if (!paymentId) return;
  await cancelQrPaymentTransaction(paymentId);
  showToast('Transaksi pembayaran QR dibatalkan.', 'info');
}

export async function signOutUser() {
  await logoutFirebase();
  showToast('Anda telah keluar dari akun ScienceQuest.', 'info');
}

export function getAccuracyPercentage() {
  if (TOTAL_QUIZ_COUNT === 0) return 0;
  return Math.round((state.kuisSelesai.length / TOTAL_QUIZ_COUNT) * 100);
}
