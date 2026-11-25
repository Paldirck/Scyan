import { DEMO_LEADERBOARD } from '../data/scienceData.js';
import { fetchPublicLeaderboard } from '../services/firebase.js';
import { getPlayerTitle, getState } from '../state/store.js';

function escapeHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

export async function renderLeaderboardView(container) {
  const state = getState();
  const isSignedIn = Boolean(state.auth?.user);
  const currentUid = state.auth?.user?.uid || null;

  let cloudEntries = [];
  if (isSignedIn) {
    try {
      cloudEntries = await fetchPublicLeaderboard();
    } catch {
      cloudEntries = [];
    }
  }

  const mappedCloud = cloudEntries.map((item) => ({
    uid: item.uid,
    name: item.uid === currentUid ? `${item.namaAlias} (Anda)` : item.namaAlias,
    level: item.level || 1,
    totalPoin: item.totalPoin || 0,
    title: getPlayerTitle(item.level || 1),
    isUser: item.uid === currentUid,
  }));

  const hasCurrentUserInCloud = currentUid && mappedCloud.some((entry) => entry.uid === currentUid);

  const localUserEntry = {
    uid: currentUid || 'guest',
    name: `${state.namaAlias} (Anda)`,
    level: state.level,
    totalPoin: state.totalPoin,
    title: getPlayerTitle(state.level),
    isUser: true,
  };

  const entries = [
    ...DEMO_LEADERBOARD.map((item) => ({ ...item, isUser: false })),
    ...mappedCloud,
    ...(hasCurrentUserInCloud ? [] : [localUserEntry]),
  ].sort((a, b) => b.totalPoin - a.totalPoin || b.level - a.level);

  const rowsHtml = entries
    .map((entry, idx) => {
      const rank = idx + 1;
      const rankClass = rank <= 3 ? 'text-amber' : 'text-muted';
      return `
        <tr class="${entry.isUser ? 'is-current-user' : ''}">
          <td class="tabular text-center ${rankClass}">#${rank}</td>
          <td>
            <strong class="${entry.isUser ? 'text-cyan' : ''}">${escapeHtml(entry.name)}</strong>
            <div class="text-muted" style="font-size: 0.75rem;">${escapeHtml(entry.title)}</div>
          </td>
          <td class="tabular text-center text-amber">Lv. ${entry.level}</td>
          <td class="tabular text-right text-emerald">${entry.totalPoin} PTS</td>
        </tr>
      `;
    })
    .join('');

  container.innerHTML = `
    <div class="section-header">
      <div>
        <h1 class="section-title">Papan Peringkat (Leaderboard)</h1>
        <p class="section-subtitle">${
          isSignedIn
            ? 'Menampilkan peringkat pengguna terdaftar di Firebase Firestore bersama profil demo.'
            : 'Masuk dengan akun Google atau Username untuk menyimpan skor Anda ke papan peringkat Firebase.'
        }</p>
      </div>
      <span class="text-muted" style="font-size: 0.8125rem;">${
        isSignedIn ? 'Sinkronisasi Firebase · Aktif' : 'Mode Tamu · Lokal'
      }</span>
    </div>

    <div class="table-wrap">
      <table class="data-table">
        <thead>
          <tr>
            <th class="text-center" style="width: 80px;">Peringkat</th>
            <th>Pelajar</th>
            <th class="text-center" style="width: 110px;">Level</th>
            <th class="text-right" style="width: 130px;">Total Poin</th>
          </tr>
        </thead>
        <tbody>
          ${rowsHtml}
        </tbody>
      </table>
    </div>
  `;
}
