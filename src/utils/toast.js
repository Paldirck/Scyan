import { icon } from './icons.js';

export function showToast(message, type = 'info') {
  const container = document.getElementById('toast-container');
  if (!container) return;

  const toast = document.createElement('div');
  const typeClass = type === 'success' ? 'is-success' : type === 'warning' ? 'is-warning' : '';
  toast.className = `toast ${typeClass}`.trim();

  const glyph = type === 'success' ? icon('check') : icon('info');
  const textSpan = document.createElement('span');
  textSpan.textContent = message;

  toast.innerHTML = glyph;
  toast.appendChild(textSpan);
  container.appendChild(toast);

  window.setTimeout(() => {
    toast.classList.add('is-leaving');
    window.setTimeout(() => toast.remove(), 220);
  }, 3200);
}
