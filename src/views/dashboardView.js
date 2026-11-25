import {
  ACHIEVEMENTS,
  CATEGORIES,
  DAILY_CHALLENGES,
  LESSONS,
  TOTAL_QUIZ_COUNT,
} from '../data/scienceData.js';
import {
  claimDailyChallenge,
  getAccuracyPercentage,
  getState,
  getTodayDateString,
} from '../state/store.js';
import { icon } from '../utils/icons.js';

function escapeHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function getDailyChallengeText() {
  const now = new Date();
  const dayIndex = Math.floor(now.getTime() / 86400000) % DAILY_CHALLENGES.length;
  return DAILY_CHALLENGES[dayIndex];
}

export function renderDashboardView(container, { onNavigate, onSelectCategory }) {
  const state = getState();
  const today = getTodayDateString();
  const isClaimed = state.dailyClaimedDate === today;
  const accuracy = getAccuracyPercentage();

  const categoriesHtml = CATEGORIES.map((cat) => {
    const lessonsInCat = LESSONS.filter((l) => l.kategori === cat.id);
    const completedInCat = lessonsInCat.filter((l) => state.materiSelesai.includes(l.id)).length;
    const pct = Math.round((completedInCat / lessonsInCat.length) * 100);

    return `
      <button type="button" class="card-interactive category-card" data-category="${cat.id}">
        <div>
          <div class="category-top">
            <div class="category-icon cat-${cat.id}">${icon(cat.icon)}</div>
            <span class="category-count tabular">${completedInCat} / ${lessonsInCat.length} Modul</span>
          </div>
          <h3 class="category-title">${cat.name}</h3>
          <p class="category-desc">${cat.desc}</p>
        </div>
        <div>
          <div class="category-progress-row">
            <span class="text-muted">Progres Kategori</span>
            <span class="tabular text-cyan">${pct}%</span>
          </div>
          <div class="progress-track">
            <div class="progress-fill" style="width: ${pct}%"></div>
          </div>
        </div>
      </button>
    `;
  }).join('');

  container.innerHTML = `
    <div class="hero-card">
      <p class="hero-kicker">Platform Edukasi Sains Interaktif · SMP &amp; SMA</p>
      <h1 class="hero-title">Selamat Datang, <span class="text-cyan">${escapeHtml(state.namaAlias)}</span></h1>
      <p class="hero-subtitle">
        Jelajahi konsep Fisika, Kimia, Biologi, dan Astronomi melalui modul bergambar, kuis bertahap, serta laboratorium simulasi interaktif.
      </p>
      <div class="hero-actions">
        <button type="button" class="btn btn-primary" id="hero-start-learn">
          ${icon('play')}
          <span>Mulai Belajar</span>
        </button>
        <button type="button" class="btn btn-secondary" id="hero-open-sim">
          ${icon('atom')}
          <span>Buka Lab Simulasi</span>
        </button>
      </div>
    </div>

    <div class="daily-card">
      <div class="daily-info">
        <div class="daily-icon-box">${icon('calendar')}</div>
        <div>
          <div class="daily-meta">
            <h2 class="daily-title">Tantangan Harian</h2>
            <span aria-hidden="true">·</span>
            <span class="tabular">${today}</span>
          </div>
          <p class="daily-desc">${
            isClaimed
              ? 'Tantangan harian hari ini telah selesai diklaim. Kembali lagi besok untuk misi baru.'
              : getDailyChallengeText()
          }</p>
          <p class="daily-reward">Hadiah Harian: +50 XP &amp; +30 PTS</p>
        </div>
      </div>
      <button
        type="button"
        id="btn-claim-daily"
        class="btn ${isClaimed ? 'btn-secondary' : 'btn-cyan'}"
        ${isClaimed ? 'disabled' : ''}
      >
        ${icon('check')}
        <span>${isClaimed ? 'Telah Diklaim' : 'Klaim Hadiah Harian'}</span>
      </button>
    </div>

    <div class="section-header">
      <div>
        <h2 class="section-title">Kategori Pembelajaran Sains</h2>
        <p class="section-subtitle">Pilih bidang studi untuk membuka modul materi dan soal latihan.</p>
      </div>
    </div>

    <div class="grid-2">
      ${categoriesHtml}
    </div>

    <div class="grid-4" aria-label="Ringkasan Statistik Belajar">
      <div class="kpi-card">
        <span class="kpi-label">Materi Selesai</span>
        <span class="kpi-value tabular text-indigo">${state.materiSelesai.length} / ${LESSONS.length}</span>
      </div>
      <div class="kpi-card">
        <span class="kpi-label">Kuis Lulus</span>
        <span class="kpi-value tabular text-cyan">${state.kuisSelesai.length} / ${TOTAL_QUIZ_COUNT}</span>
      </div>
      <div class="kpi-card">
        <span class="kpi-label">Lencana Terbuka</span>
        <span class="kpi-value tabular text-amber">${state.badges.length} / ${ACHIEVEMENTS.length}</span>
      </div>
      <div class="kpi-card">
        <span class="kpi-label">Ketuntasan Kuis</span>
        <span class="kpi-value tabular text-emerald">${accuracy}%</span>
      </div>
    </div>
  `;

  container.querySelector('#hero-start-learn')?.addEventListener('click', () => onNavigate('learn'));
  container.querySelector('#hero-open-sim')?.addEventListener('click', () => onNavigate('simulations'));
  container.querySelector('#btn-claim-daily')?.addEventListener('click', () => claimDailyChallenge());

  container.querySelectorAll('.category-card').forEach((card) => {
    card.addEventListener('click', () => {
      const catId = card.dataset.category;
      if (catId) onSelectCategory(catId);
    });
  });
}
