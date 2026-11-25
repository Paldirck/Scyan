import { SPEC_SECTIONS } from '../data/scienceData.js';
import { getState, resetProgress, updateAlias } from '../state/store.js';
import { icon } from '../utils/icons.js';

function createModalShell({ id, title, bodyHtml, footerHtml, small = false }) {
  const modalRoot = document.getElementById('modal-root');
  if (!modalRoot) return null;

  function close() {
    modalRoot.innerHTML = '';
    document.removeEventListener('keydown', onKeyDown);
  }

  function onKeyDown(e) {
    if (e.key === 'Escape') close();
  }

  modalRoot.innerHTML = `
    <div class="modal-backdrop" id="${id}" role="dialog" aria-modal="true" aria-labelledby="${id}-title">
      <div class="modal-dialog ${small ? 'modal-dialog-sm' : ''}">
        <div class="modal-header">
          <h2 id="${id}-title" class="modal-title">${title}</h2>
          <button type="button" class="icon-btn" data-modal-close aria-label="Tutup dialog">
            ${icon('close')}
          </button>
        </div>
        <div class="modal-body">${bodyHtml}</div>
        <div class="modal-footer">${footerHtml}</div>
      </div>
    </div>
  `;

  modalRoot.querySelectorAll('[data-modal-close]').forEach((btn) => {
    btn.addEventListener('click', close);
  });

  modalRoot.querySelector(`#${id}`)?.addEventListener('click', (e) => {
    if (e.target.id === id) close();
  });

  document.addEventListener('keydown', onKeyDown);
  return { modalRoot, close };
}

export function openSpecModal() {
  const sectionsHtml = SPEC_SECTIONS.map(
    (sec) => `
      <div class="spec-block">
        <h3>${sec.title}</h3>
        ${sec.body}
      </div>
    `,
  ).join('');

  createModalShell({
    id: 'spec-modal-backdrop',
    title: 'Dokumentasi Teknis (SPEC.md)',
    bodyHtml: `<div class="spec-doc">${sectionsHtml}</div>`,
    footerHtml: `<button type="button" class="btn btn-primary" data-modal-close>Tutup Dokumentasi</button>`,
  });
}

export function openConfirmResetModal() {
  const modal = createModalShell({
    id: 'reset-modal-backdrop',
    title: 'Reset Progres Belajar',
    small: true,
    bodyHtml: `
      <p style="color: var(--text-secondary);">
        Apakah Anda yakin ingin menghapus seluruh data progres, XP, level, kuis selesai, dan lencana? Tindakan ini tidak dapat dibatalkan.
      </p>
    `,
    footerHtml: `
      <button type="button" class="btn btn-secondary" data-modal-close>Batal</button>
      <button type="button" class="btn btn-danger-ghost" id="btn-confirm-reset">Ya, Reset Semua</button>
    `,
  });

  if (!modal) return;
  modal.modalRoot.querySelector('#btn-confirm-reset')?.addEventListener('click', () => {
    resetProgress();
    modal.close();
  });
}

export function openEditAliasModal() {
  const state = getState();
  const safeAlias = state.namaAlias.replace(/"/g, '&quot;');

  const modal = createModalShell({
    id: 'alias-modal-backdrop',
    title: 'Ubah Nama Pelajar',
    small: true,
    bodyHtml: `
      <form id="alias-form" class="control-group">
        <label for="alias-input" style="font-size: 0.875rem; color: var(--text-secondary);">
          Nama Tampilan di Dashboard &amp; Leaderboard
        </label>
        <input
          type="text"
          id="alias-input"
          class="text-field"
          maxlength="32"
          required
          value="${safeAlias}"
          placeholder="Masukkan nama pelajar..."
        />
      </form>
    `,
    footerHtml: `
      <button type="button" class="btn btn-secondary" data-modal-close>Batal</button>
      <button type="submit" form="alias-form" class="btn btn-primary">Simpan Nama</button>
    `,
  });

  if (!modal) return;
  const input = modal.modalRoot.querySelector('#alias-input');
  input?.focus();
  input?.select();

  modal.modalRoot.querySelector('#alias-form')?.addEventListener('submit', (e) => {
    e.preventDefault();
    if (input && updateAlias(input.value)) {
      modal.close();
    }
  });
}
