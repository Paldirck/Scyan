import { initializeApp } from 'firebase/app';
import {
  GoogleAuthProvider,
  createUserWithEmailAndPassword,
  getAuth,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  updateProfile,
} from 'firebase/auth';
import {
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocFromServer,
  getDocs,
  getFirestore,
  limit,
  onSnapshot,
  query,
  serverTimestamp,
  setDoc,
  updateDoc,
  where,
  writeBatch,
} from 'firebase/firestore';
import firebaseConfig from '../../firebase-applet-config.json';

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app, firebaseConfig.firestoreDatabaseId);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({ prompt: 'select_account' });

export const OperationType = Object.freeze({
  CREATE: 'create',
  UPDATE: 'update',
  DELETE: 'delete',
  LIST: 'list',
  GET: 'get',
  WRITE: 'write',
});

export function handleFirestoreError(error, operationType, path) {
  const errInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid || null,
      email: auth.currentUser?.email || null,
      emailVerified: auth.currentUser?.emailVerified ?? null,
      isAnonymous: auth.currentUser?.isAnonymous ?? null,
      tenantId: auth.currentUser?.tenantId || null,
      providerInfo:
        auth.currentUser?.providerData?.map((provider) => ({
          providerId: provider.providerId,
          email: provider.email,
        })) || [],
    },
    operationType,
    path,
  };
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

async function testConnection() {
  try {
    await getDocFromServer(doc(db, 'test', 'connection'));
  } catch (error) {
    if (error instanceof Error && error.message.includes('the client is offline')) {
      console.error('Please check your Firebase configuration.');
    }
  }
}
testConnection();

const USERNAME_REGEX = /^[a-zA-Z0-9_.\-]+$/;
const SYNTHETIC_DOMAIN = 'users.sciencequest.app';

export function sanitizeUsername(raw) {
  const cleaned = String(raw || '')
    .trim()
    .replace(/[^a-zA-Z0-9_.\-]/g, '_')
    .slice(0, 32);
  if (cleaned.length >= 3) return cleaned;
  return `user_${cleaned}`.slice(0, 32).padEnd(3, '0');
}

export function isValidUsernameInput(raw) {
  const trimmed = String(raw || '').trim();
  return trimmed.length >= 3 && trimmed.length <= 32 && USERNAME_REGEX.test(trimmed);
}

export function usernameToAuthEmail(usernameOrEmail) {
  const trimmed = String(usernameOrEmail || '').trim();
  if (trimmed.includes('@')) {
    return trimmed.toLowerCase();
  }
  return `${trimmed.toLowerCase()}@${SYNTHETIC_DOMAIN}`;
}

function clampString(val, min, max, fallback = '') {
  const s = String(val ?? fallback).trim();
  if (s.length < min) return fallback;
  return s.slice(0, max);
}

function clampStringList(arr, maxLen) {
  if (!Array.isArray(arr)) return [];
  return arr.filter((item) => typeof item === 'string' && item.length > 0).slice(0, maxLen);
}

function clampInt(val, min, max) {
  const n = Math.floor(Number(val) || 0);
  return Math.max(min, Math.min(max, n));
}

export function subscribeAuth(callback) {
  return onAuthStateChanged(auth, callback);
}

export async function loginWithGoogle() {
  const cred = await signInWithPopup(auth, googleProvider);
  const user = cred.user;
  await ensureUserRecords(user, {
    username: sanitizeUsername(user.displayName || user.email?.split('@')[0] || user.uid.slice(0, 8)),
    email: user.email || undefined,
    authProvider: 'google',
    displayName: clampString(user.displayName || 'Pelajar Google', 1, 32, 'Pelajar Google'),
  });
  return user;
}

export async function registerWithUsernamePassword({ username, password, displayName, email }) {
  const cleanUsername = String(username || '').trim();
  if (!isValidUsernameInput(cleanUsername)) {
    throw new Error('Username harus 3–32 karakter (huruf, angka, _, ., -).');
  }
  if (!password || password.length < 6) {
    throw new Error('Password minimal 6 karakter.');
  }

  const authEmail = usernameToAuthEmail(cleanUsername);
  const cred = await createUserWithEmailAndPassword(auth, authEmail, password);
  const user = cred.user;
  const alias = clampString(displayName || cleanUsername, 1, 32, cleanUsername);

  await updateProfile(user, { displayName: alias });

  const optionalEmail = email && /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email.trim())
    ? email.trim().slice(0, 120)
    : undefined;

  await ensureUserRecords(user, {
    username: cleanUsername,
    email: optionalEmail,
    authProvider: 'password',
    displayName: alias,
  });

  return user;
}

export async function loginWithUsernamePassword({ identifier, password }) {
  const cleanId = String(identifier || '').trim();
  if (!cleanId) {
    throw new Error('Masukkan username atau email terlebih dahulu.');
  }
  if (!password) {
    throw new Error('Masukkan password terlebih dahulu.');
  }
  const authEmail = usernameToAuthEmail(cleanId);
  const cred = await signInWithEmailAndPassword(auth, authEmail, password);
  const user = cred.user;

  await ensureUserRecords(user, {
    username: sanitizeUsername(cleanId.includes('@') ? cleanId.split('@')[0] : cleanId),
    email: user.email && !user.email.endsWith(`@${SYNTHETIC_DOMAIN}`) ? user.email : undefined,
    authProvider: 'password',
    displayName: clampString(user.displayName || cleanId.split('@')[0], 1, 32, 'Pelajar'),
  });

  return user;
}

export async function logoutFirebase() {
  await signOut(auth);
}

export async function ensureUserRecords(user, { username, email, authProvider, displayName }) {
  const uid = user.uid;
  const userPath = `users/${uid}`;
  try {
    const userRef = doc(db, 'users', uid);
    const snap = await getDoc(userRef);
    if (!snap.exists()) {
      const profilePayload = {
        uid,
        username: sanitizeUsername(username),
        authProvider: authProvider === 'google' ? 'google' : 'password',
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      };
      if (email && /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
        profilePayload.email = email.slice(0, 120);
      }
      await setDoc(userRef, profilePayload);
    }
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, userPath);
  }

  const progressPath = `userProgress/${uid}`;
  try {
    const progressRef = doc(db, 'userProgress', uid);
    const progressSnap = await getDoc(progressRef);
    const alias = clampString(displayName || username, 1, 32, 'Pelajar');

    if (!progressSnap.exists()) {
      await setDoc(progressRef, {
        uid,
        namaAlias: alias,
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
        updatedAt: serverTimestamp(),
      });

      await syncLeaderboardEntry(uid, {
        namaAlias: alias,
        level: 1,
        totalPoin: 0,
      });
    } else if (!('isPremium' in progressSnap.data())) {
      await updateDoc(progressRef, {
        isPremium: false,
        premiumPlan: '',
        premiumPaymentId: '',
        updatedAt: serverTimestamp(),
      });
    }
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, progressPath);
  }
}

export async function migrateLegacyPremiumFields(uid) {
  const progressPath = `userProgress/${uid}`;
  try {
    await updateDoc(doc(db, 'userProgress', uid), {
      isPremium: false,
      premiumPlan: '',
      premiumPaymentId: '',
      updatedAt: serverTimestamp(),
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, progressPath);
  }
}

export async function fetchUserPrivateProfile(uid) {
  const path = `users/${uid}`;
  try {
    const snap = await getDoc(doc(db, 'users', uid));
    return snap.exists() ? snap.data() : null;
  } catch (error) {
    handleFirestoreError(error, OperationType.GET, path);
    return null;
  }
}

export function subscribeUserProgress(uid, onData) {
  const path = `userProgress/${uid}`;
  const ref = doc(db, 'userProgress', uid);
  return onSnapshot(
    ref,
    (snap) => {
      if (snap.exists()) {
        onData(snap.data());
      }
    },
    (error) => {
      handleFirestoreError(error, OperationType.GET, path);
    },
  );
}

export async function saveUserProgressToFirestore(uid, stateData) {
  const path = `userProgress/${uid}`;
  const cleanAlias = clampString(stateData.namaAlias, 1, 32, 'Pelajar');
  const cleanXp = clampInt(stateData.xp, 0, 1000000);
  const cleanLevel = clampInt(stateData.level, 1, 1000);
  const cleanPoints = clampInt(stateData.totalPoin, 0, 1000000);
  const cleanDaily = /^\d{4}-\d{2}-\d{2}$/.test(stateData.dailyClaimedDate || '')
    ? stateData.dailyClaimedDate
    : '';

  const payload = {
    xp: cleanXp,
    level: cleanLevel,
    totalPoin: cleanPoints,
    materiSelesai: clampStringList(stateData.materiSelesai, 24),
    kuisSelesai: clampStringList(stateData.kuisSelesai, 40),
    badges: clampStringList(stateData.badges, 20),
    dailyClaimedDate: cleanDaily,
    updatedAt: serverTimestamp(),
  };

  try {
    await updateDoc(doc(db, 'userProgress', uid), payload);
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, path);
  }

  await syncLeaderboardEntry(uid, {
    namaAlias: cleanAlias,
    level: cleanLevel,
    totalPoin: cleanPoints,
  });
}

export async function updateAliasInFirestore(uid, newAlias) {
  const path = `userProgress/${uid}`;
  const cleanAlias = clampString(newAlias, 1, 32, 'Pelajar');
  try {
    await updateDoc(doc(db, 'userProgress', uid), {
      namaAlias: cleanAlias,
      updatedAt: serverTimestamp(),
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, path);
  }

  const lbPath = `leaderboard/${uid}`;
  try {
    await updateDoc(doc(db, 'leaderboard', uid), {
      namaAlias: cleanAlias,
      updatedAt: serverTimestamp(),
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, lbPath);
  }
}

export async function syncLeaderboardEntry(uid, { namaAlias, level, totalPoin }) {
  const path = `leaderboard/${uid}`;
  try {
    await setDoc(doc(db, 'leaderboard', uid), {
      uid,
      namaAlias: clampString(namaAlias, 1, 32, 'Pelajar'),
      level: clampInt(level, 1, 1000),
      totalPoin: clampInt(totalPoin, 0, 1000000),
      isPublic: true,
      updatedAt: serverTimestamp(),
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

export async function resetUserProgressInFirestore(uid, alias) {
  const path = `userProgress/${uid}`;
  const cleanAlias = clampString(alias, 1, 32, 'Pelajar');
  try {
    await updateDoc(doc(db, 'userProgress', uid), {
      xp: 0,
      level: 1,
      totalPoin: 0,
      materiSelesai: [],
      kuisSelesai: [],
      badges: [],
      dailyClaimedDate: '',
      updatedAt: serverTimestamp(),
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, path);
  }

  await syncLeaderboardEntry(uid, {
    namaAlias: cleanAlias,
    level: 1,
    totalPoin: 0,
  });
}

export async function fetchPublicLeaderboard() {
  const path = 'leaderboard';
  try {
    const q = query(collection(db, path), where('isPublic', '==', true), limit(50));
    const snap = await getDocs(q);
    return snap.docs.map((d) => d.data());
  } catch (error) {
    handleFirestoreError(error, OperationType.LIST, path);
    return [];
  }
}

export async function deleteLeaderboardEntry(uid) {
  const path = `leaderboard/${uid}`;
  try {
    await deleteDoc(doc(db, 'leaderboard', uid));
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, path);
  }
}

function generatePaymentId() {
  const rand = Math.random().toString(36).slice(2, 8);
  return `sqpay_${Date.now()}_${rand}`;
}

export async function createQrPaymentTransaction(uid) {
  const paymentId = generatePaymentId();
  const path = `payments/${paymentId}`;
  const qrPayload = `00020101021226420018ID.SCIENCEQUEST.QR0214${paymentId.slice(-14)}520482995303360540115802ID5912ScienceQuest6007Jakarta6304TEST`;

  const record = {
    paymentId,
    uid,
    planId: 'premium_achievements',
    amountIdr: 1,
    method: 'qris',
    status: 'pending',
    qrPayload,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  };

  try {
    await setDoc(doc(db, 'payments', paymentId), record);
    return {
      paymentId,
      uid,
      planId: 'premium_achievements',
      amountIdr: 1,
      method: 'qris',
      status: 'pending',
      qrPayload,
      createdAtMs: Date.now(),
    };
  } catch (error) {
    handleFirestoreError(error, OperationType.CREATE, path);
    return null;
  }
}

export async function confirmQrPaymentAndActivatePremium(uid, paymentId) {
  const path = `payments/${paymentId}`;
  try {
    const batch = writeBatch(db);
    batch.update(doc(db, 'payments', paymentId), {
      status: 'paid',
      updatedAt: serverTimestamp(),
    });
    batch.update(doc(db, 'userProgress', uid), {
      isPremium: true,
      premiumPlan: 'premium_achievements',
      premiumPaymentId: paymentId,
      updatedAt: serverTimestamp(),
    });
    await batch.commit();
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

export async function cancelQrPaymentTransaction(paymentId) {
  const path = `payments/${paymentId}`;
  try {
    await updateDoc(doc(db, 'payments', paymentId), {
      status: 'cancelled',
      updatedAt: serverTimestamp(),
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, path);
  }
}

export async function fetchLatestPendingPayment(uid) {
  const path = 'payments';
  try {
    const q = query(collection(db, 'payments'), where('uid', '==', uid), limit(20));
    const snap = await getDocs(q);
    const pending = snap.docs
      .map((d) => d.data())
      .filter((item) => item.status === 'pending')
      .sort((a, b) => {
        const ta = a.createdAt?.toMillis?.() || 0;
        const tb = b.createdAt?.toMillis?.() || 0;
        return tb - ta;
      });
    if (pending.length === 0) return null;
    const latest = pending[0];
    return {
      ...latest,
      createdAtMs: latest.createdAt?.toMillis?.() || Date.now(),
    };
  } catch (error) {
    handleFirestoreError(error, OperationType.LIST, path);
    return null;
  }
}
