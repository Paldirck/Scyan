import { ACHIEVEMENTS, LESSONS, TOTAL_QUIZ_COUNT } from '../data/scienceData.js';
import { getPlayerTitle, getState, signOutUser } from '../state/store.js';
import { icon } from '../utils/icons.js';
import { openConfirmResetModal, openEditAliasModal, openSpecModal } from './modals.js';

function escapeHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

export function renderSettingsView(container, { onSignedOut, onNavigate }) {
  const state = getState();
  const isSignedIn = Boolean(state.auth?.user);
  const levelXp = state.xp % 100;
  const initial = (state.namaAlias.trim()[0] || 'P').toUpperCase();
  const idLabel = state.auth?.username
    ? `@${state.auth.username}`
    : state.auth?.email || 'Akun Terhubung';

  const upgradeBtnHtml = state.isPremium
    ? ''
    : `
        <button type="button" id="btn-settings-upgrade" class="btn btn-cyan btn-full">
          Upgrade Premium (Rp 1 · QR)
        </button>
      `;

  container.innerHTML = `
    <div class="section-header">
      <div>
        <h1 class="section-title">Pengaturan Akun &amp; Profil</h1>
        <p class="section-subtitle">Kelola identitas pelajar, pantau ringkasan progres Firebase, dan atur preferensi data akun.</p>
      </div>
    </div>

    <div class="settings-grid">
      <div class="panel profile-card">
        <div class="profile-header">
          <div class="avatar-circle" id="user-avatar-initial" aria-hidden="true">${escapeHtml(initial)}</div>
          <div class="profile-identity">
            <div class="profile-name-row">
              <h2 class="profile-name" id="user-profile-alias">${escapeHtml(state.namaAlias)}</h2>
              <button
                type="button"
                id="btn-edit-alias"
                class="icon-btn"
                title="Ubah nama pelajar"
                aria-label="Ubah nama pelajar"
              >
                ${icon('edit')}
              </button>
            </div>
            <p class="profile-role" id="user-profile-title">${escapeHtml(getPlayerTitle(state.level))}</p>
          </div>
        </div>

        <p class="account-status ${isSignedIn ? 'is-synced' : ''}" id="rail-account-status">
          ${isSignedIn ? `Firebase Aktif · ${escapeHtml(idLabel)}` : 'Belum Masuk'}
        </p>

        <div class="xp-block">
          <div class="xp-row">
            <span class="xp-level" id="rail-level-val">Level ${state.level}</span>
            <span class="xp-numbers tabular" id="rail-xp-text">${levelXp} / 100 XP</span>
          </div>
          <div class="progress-track" role="progressbar" aria-valuemin="0" aria-valuemax="100" aria-valuenow="${levelXp}" id="rail-xp-track">
            <div class="progress-fill" id="rail-xp-bar" style="width: ${levelXp}%"></div>
          </div>
        </div>

        <dl class="profile-stats">
          <div class="profile-stat-row">
            <dt>Total Poin</dt>
            <dd class="tabular text-emerald" id="rail-points-val">${state.totalPoin} PTS</dd>
          </div>
          <div class="profile-stat-row">
            <dt>Materi Selesai</dt>
            <dd class="tabular text-cyan" id="rail-lessons-done">${state.materiSelesai.length} / ${LESSONS.length}</dd>
          </div>
          <div class="profile-stat-row">
            <dt>Kuis Lulus</dt>
            <dd class="tabular" id="rail-quizzes-done">${state.kuisSelesai.length} / ${TOTAL_QUIZ_COUNT}</dd>
          </div>
          <div class="profile-stat-row">
            <dt>Lencana</dt>
            <dd class="tabular text-amber" id="rail-badges-count">${state.badges.length} / ${ACHIEVEMENTS.length}</dd>
          </div>
          <div class="profile-stat-row">
            <dt>Status Paket</dt>
            <dd class="${state.isPremium ? 'tabular text-emerald' : 'text-muted'}" id="rail-premium-status">
              ${state.isPremium ? 'Premium Aktif · Rp 1' : 'Gratis'}
            </dd>
          </div>
        </dl>

        <div class="settings-actions">
          ${upgradeBtnHtml}
          <button type="button" id="btn-settings-edit-alias" class="btn btn-secondary btn-full">
            Ubah Nama Tampilan
          </button>
          <button type="button" id="btn-open-spec" class="btn btn-secondary btn-full">
            Dokumentasi SPEC.md
          </button>
          <button type="button" id="btn-reset-progress" class="btn btn-danger-ghost btn-full">
            Reset Progres Belajar
          </button>
          <button type="button" id="btn-settings-logout" class="btn btn-primary btn-full">
            Keluar Akun
          </button>
        </div>
      </div>
    </div>
  `;

  container.querySelector('#btn-edit-alias')?.addEventListener('click', openEditAliasModal);
  container.querySelector('#btn-settings-edit-alias')?.addEventListener('click', openEditAliasModal);
  container.querySelector('#btn-open-spec')?.addEventListener('click', openSpecModal);
  container.querySelector('#btn-reset-progress')?.addEventListener('click', openConfirmResetModal);
  container.querySelector('#btn-settings-upgrade')?.addEventListener('click', () => {
    onNavigate?.('achievements');
  });
  container.querySelector('#btn-settings-logout')?.addEventListener('click', async () => {
    await signOutUser();
    onSignedOut();
  });
}
