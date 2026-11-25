import QRCode from 'qrcode';
import { ACHIEVEMENTS, PREMIUM_PLAN } from '../data/scienceData.js';
import {
  cancelQrPayment,
  completeQrPayment,
  getPendingQrPayment,
  getState,
  startQrPayment,
} from '../state/store.js';
import { icon } from '../utils/icons.js';
import { showToast } from '../utils/toast.js';

let activePayment = null;
let isBusy = false;
let errorText = '';
let pendingCheckedUid = null;
let countdownTimerId = null;

function clearCountdownTimer() {
  if (countdownTimerId !== null) {
    window.clearInterval(countdownTimerId);
    countdownTimerId = null;
  }
}

function escapeHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function formatCountdown(createdAtMs) {
  const durationMs = 15 * 60 * 1000;
  const elapsed = Math.max(0, Date.now() - (createdAtMs || Date.now()));
  const remainingSec = Math.max(0, Math.floor((durationMs - elapsed) / 1000));
  const mins = String(Math.floor(remainingSec / 60)).padStart(2, '0');
  const secs = String(remainingSec % 60).padStart(2, '0');
  return `${mins}:${secs}`;
}

function renderQrCanvas(canvas, payload) {
  if (!canvas || !payload) return;
  QRCode.toCanvas(
    canvas,
    payload,
    {
      width: 220,
      margin: 2,
      color: {
        dark: '#0f172a',
        light: '#ffffff',
      },
    },
    (err) => {
      if (err) {
        console.error('Gagal membuat kode QR:', err);
      }
    },
  );
}

function renderUnlockedAchievements(container, state) {
  clearCountdownTimer();
  activePayment = null;
  errorText = '';

  const cardsHtml = ACHIEVEMENTS.map((badge) => {
    const unlocked = state.badges.includes(badge.id);
    return `
      <article class="badge-card ${unlocked ? 'is-unlocked' : 'is-locked'}">
        <div class="badge-icon">
          ${unlocked ? icon(badge.icon) : icon('lock')}
        </div>
        <div class="badge-content">
          <div class="badge-title-row">
            <h2 class="badge-title ${unlocked ? 'text-amber' : ''}">${badge.nama}</h2>
            <span class="status-label ${unlocked ? 'text-emerald' : 'text-muted'}" style="font-size: 0.75rem;">
              ${unlocked ? 'Terbuka' : 'Terkunci'}
            </span>
          </div>
          <p style="font-size: 0.875rem; color: var(--text-secondary);">${badge.deskripsi}</p>
          <p class="tabular text-muted" style="font-size: 0.75rem; margin-top: 0.25rem;">Syarat: ${badge.syarat}</p>
        </div>
      </article>
    `;
  }).join('');

  const paymentRef = state.premiumPaymentId
    ? ` · ID Transaksi: <span class="tabular">${escapeHtml(state.premiumPaymentId)}</span>`
    : '';

  container.innerHTML = `
    <div class="section-header">
      <div>
        <h1 class="section-title">Lencana Pencapaian (Achievements)</h1>
        <p class="section-subtitle">Buka lencana dengan menuntaskan modul per kategori dan mengumpulkan poin kuis.</p>
      </div>
      <span class="tabular text-amber" style="font-weight: 600;">${state.badges.length} / ${ACHIEVEMENTS.length} Terbuka</span>
    </div>

    <div class="panel premium-active-bar">
      <div class="premium-active-info">
        <span class="premium-active-icon">${icon('sparkles')}</span>
        <div>
          <p class="premium-active-title">ScienceQuest Premium Aktif · Paket ${PREMIUM_PLAN.priceLabel}</p>
          <p class="premium-active-meta">Akses penuh Tab Pencapaian terbuka${paymentRef}</p>
        </div>
      </div>
    </div>

    <div class="grid-3">
      ${cardsHtml}
    </div>
  `;
}

function renderPremiumGate(container, state) {
  clearCountdownTimer();
  const uid = state.auth?.user?.uid || '';

  if (uid && pendingCheckedUid !== uid && !activePayment) {
    pendingCheckedUid = uid;
    getPendingQrPayment()
      .then((pending) => {
        if (pending && !getState().isPremium) {
          activePayment = pending;
          renderAchievementsView(container);
        }
      })
      .catch(() => {
        // Silent fallback if no pending payment found
      });
  }

  const featuresHtml = PREMIUM_PLAN.features
    .map(
      (feat) => `
      <li class="plan-feature-item">
        <span class="text-emerald">${icon('check')}</span>
        <span>${escapeHtml(feat)}</span>
      </li>
    `,
    )
    .join('');

  const errorHtml = errorText
    ? `<div class="auth-alert" role="alert">${escapeHtml(errorText)}</div>`
    : '';

  const checkoutSectionHtml = activePayment
    ? `
      <div class="panel qr-checkout-panel">
        <div class="qr-checkout-header">
          <div>
            <p class="hero-kicker">Simulasi QRIS Uji Coba · Mode Testing</p>
            <h2 class="section-title">Selesaikan Pembayaran QR</h2>
          </div>
          <span class="tabular text-amber" id="qr-countdown-label" style="font-weight: 700;">
            Berlaku ${formatCountdown(activePayment.createdAtMs)}
          </span>
        </div>

        ${errorHtml}

        <div class="qr-checkout-grid">
          <div class="qr-stage">
            <div class="qr-canvas-frame">
              <canvas id="qris-canvas" aria-label="Kode QR Pembayaran QRIS ScienceQuest Rp 1"></canvas>
            </div>
            <p class="qr-caption">QRIS · ScienceQuest Merchant</p>
          </div>

          <div class="qr-details-col">
            <dl class="qr-meta-list">
              <div class="profile-stat-row">
                <dt>Paket</dt>
                <dd>${escapeHtml(PREMIUM_PLAN.name)}</dd>
              </div>
              <div class="profile-stat-row">
                <dt>Nominal Bayar</dt>
                <dd class="tabular text-emerald">${PREMIUM_PLAN.priceLabel}</dd>
              </div>
              <div class="profile-stat-row">
                <dt>Metode</dt>
                <dd>QRIS (Uji Coba)</dd>
              </div>
              <div class="profile-stat-row">
                <dt>ID Transaksi</dt>
                <dd class="tabular qr-tx-id">${escapeHtml(activePayment.paymentId)}</dd>
              </div>
              <div class="profile-stat-row">
                <dt>Status</dt>
                <dd class="text-amber">Menunggu Pembayaran</dd>
              </div>
            </dl>

            <p class="qr-helper-text">
              Pindai kode QR di samping atau klik tombol konfirmasi di bawah untuk menyelesaikan uji coba pembayaran <strong>Rp 1</strong> dan langsung membuka tab Pencapaian.
            </p>

            <div class="qr-actions">
              <button
                type="button"
                id="btn-confirm-qr-payment"
                class="btn btn-cyan btn-full"
                ${isBusy ? 'disabled' : ''}
              >
                ${isBusy ? 'Memverifikasi Pembayaran...' : 'Konfirmasi Pembayaran Selesai'}
              </button>
              <button
                type="button"
                id="btn-cancel-qr-payment"
                class="btn btn-danger-ghost btn-full"
                ${isBusy ? 'disabled' : ''}
              >
                Batalkan Pembayaran
              </button>
            </div>
          </div>
        </div>
      </div>
    `
    : `
      <div class="panel plan-card">
        <div class="plan-card-header">
          <div>
            <p class="hero-kicker">Paket Uji Coba</p>
            <h2 class="plan-name">${escapeHtml(PREMIUM_PLAN.name)}</h2>
            <p class="section-subtitle">${escapeHtml(PREMIUM_PLAN.subtitle)}</p>
          </div>
          <div class="plan-price-box">
            <span class="plan-price tabular">${PREMIUM_PLAN.priceLabel}</span>
            <span class="plan-price-note">sekali bayar · tes QR</span>
          </div>
        </div>

        ${errorHtml}

        <ul class="plan-feature-list">
          ${featuresHtml}
        </ul>

        <div class="plan-card-footer">
          <button
            type="button"
            id="btn-start-qr-payment"
            class="btn btn-cyan btn-full"
            ${isBusy ? 'disabled' : ''}
          >
            ${icon('qrCode')}
            <span>${isBusy ? 'Membuat Kode QR...' : `Bayar dengan QR (${PREMIUM_PLAN.priceLabel})`}</span>
          </button>
        </div>
      </div>
    `;

  container.innerHTML = `
    <div class="section-header">
      <div>
        <h1 class="section-title">Lencana Pencapaian (Premium)</h1>
        <p class="section-subtitle">Tab Pencapaian membutuhkan aktivasi paket ScienceQuest Premium seharga Rp 1.</p>
      </div>
      <span class="status-label text-amber">${icon('lock')} Terkunci · Khusus Premium</span>
    </div>

    <div class="premium-gate-grid">
      ${checkoutSectionHtml}
    </div>
  `;

  if (activePayment) {
    const canvas = container.querySelector('#qris-canvas');
    renderQrCanvas(canvas, activePayment.qrPayload);

    const countdownEl = container.querySelector('#qr-countdown-label');
    if (countdownEl) {
      countdownTimerId = window.setInterval(() => {
        countdownEl.textContent = `Berlaku ${formatCountdown(activePayment.createdAtMs)}`;
      }, 1000);
    }

    container.querySelector('#btn-confirm-qr-payment')?.addEventListener('click', async () => {
      if (isBusy || !activePayment) return;
      isBusy = true;
      errorText = '';
      renderAchievementsView(container);

      try {
        await completeQrPayment(activePayment.paymentId);
        activePayment = null;
      } catch (err) {
        errorText = err instanceof Error ? err.message : 'Gagal memverifikasi pembayaran QR.';
        showToast('Gagal mengonfirmasi pembayaran.', 'warning');
      } finally {
        isBusy = false;
        renderAchievementsView(container);
      }
    });

    container.querySelector('#btn-cancel-qr-payment')?.addEventListener('click', async () => {
      if (isBusy || !activePayment) return;
      isBusy = true;
      errorText = '';
      renderAchievementsView(container);

      try {
        await cancelQrPayment(activePayment.paymentId);
        activePayment = null;
      } catch (err) {
        errorText = err instanceof Error ? err.message : 'Gagal membatalkan transaksi.';
      } finally {
        isBusy = false;
        renderAchievementsView(container);
      }
    });
  } else {
    container.querySelector('#btn-start-qr-payment')?.addEventListener('click', async () => {
      if (isBusy) return;
      isBusy = true;
      errorText = '';
      renderAchievementsView(container);

      try {
        const tx = await startQrPayment();
        activePayment = tx;
      } catch (err) {
        errorText = err instanceof Error ? err.message : 'Gagal membuat transaksi QR.';
        showToast('Gagal membuat transaksi QR.', 'warning');
      } finally {
        isBusy = false;
        renderAchievementsView(container);
      }
    });
  }
}

export function renderAchievementsView(container) {
  const state = getState();
  if (state.isPremium) {
    renderUnlockedAchievements(container, state);
  } else {
    renderPremiumGate(container, state);
  }
}
