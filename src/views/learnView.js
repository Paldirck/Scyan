import { CATEGORIES, LESSONS } from '../data/scienceData.js';
import { getLessonQuizStats, getState } from '../state/store.js';
import { icon } from '../utils/icons.js';

export function renderLearnView(container, filterState, { onFilterChange, onSearchChange, onOpenLesson }) {
  const state = getState();
  const { category, query } = filterState;
  const normalizedQuery = query.trim().toLowerCase();

  const filters = [{ id: 'all', name: 'Semua' }, ...CATEGORIES];

  const filtered = LESSONS.filter((lesson) => {
    const matchesCategory = category === 'all' || lesson.kategori === category;
    const matchesSearch =
      !normalizedQuery ||
      lesson.judul.toLowerCase().includes(normalizedQuery) ||
      lesson.deskripsi.toLowerCase().includes(normalizedQuery) ||
      lesson.kategori.toLowerCase().includes(normalizedQuery);
    return matchesCategory && matchesSearch;
  });

  const filterButtonsHtml = filters
    .map(
      (f) => `
      <button
        type="button"
        class="segment-btn ${category === f.id ? 'is-active' : ''}"
        data-filter="${f.id}"
      >${f.name}</button>
    `,
    )
    .join('');

  const cardsHtml =
    filtered.length > 0
      ? filtered
          .map((lesson) => {
            const cat = CATEGORIES.find((c) => c.id === lesson.kategori);
            const quizStats = getLessonQuizStats(lesson);
            const isCompleted = state.materiSelesai.includes(lesson.id);

            return `
              <article class="card-interactive lesson-card">
                <div>
                  <div class="meta-line">
                    <span>${cat?.name || lesson.kategori}</span>
                    <span aria-hidden="true">·</span>
                    <span>${lesson.tingkatKesulitan}</span>
                    <span aria-hidden="true">·</span>
                    <span class="tabular">${quizStats.done}/${quizStats.total} Kuis</span>
                  </div>
                  <h3 class="lesson-title">${lesson.judul}</h3>
                  <p class="lesson-desc">${lesson.deskripsi}</p>
                </div>

                <div class="lesson-footer">
                  <span class="status-label ${isCompleted ? 'text-emerald' : 'text-amber'}">
                    ${isCompleted ? icon('check') : icon('circle')}
                    <span>${isCompleted ? 'Selesai' : 'Belum Selesai'}</span>
                  </span>
                  <button
                    type="button"
                    class="btn ${isCompleted ? 'btn-secondary' : 'btn-primary'} btn-sm"
                    data-lesson-id="${lesson.id}"
                  >
                    <span>${isCompleted ? 'Pelajari Ulang' : 'Buka Modul'}</span>
                    ${icon('arrowRight')}
                  </button>
                </div>
              </article>
            `;
          })
          .join('')
      : `
        <div class="panel" style="grid-column: 1 / -1;">
          <p class="text-muted">Tidak ada modul sains yang cocok dengan pencarian Anda.</p>
        </div>
      `;

  container.innerHTML = `
    <div class="section-header">
      <div>
        <h1 class="section-title">Modul Belajar &amp; Kuis Interaktif</h1>
        <p class="section-subtitle">Pelajari ringkasan konsep dan selesaikan seluruh soal kuis untuk menuntaskan modul.</p>
      </div>
    </div>

    <div class="learn-toolbar">
      <div class="segmented-control" role="tablist" aria-label="Filter Kategori Sains">
        ${filterButtonsHtml}
      </div>

      <div class="search-input-wrap">
        <span class="search-icon">${icon('search')}</span>
        <input
          type="search"
          id="learn-search-input"
          class="search-input"
          placeholder="Cari topik sains..."
          value="${query.replace(/"/g, '&quot;')}"
          aria-label="Cari modul pembelajaran"
        />
      </div>
    </div>

    <div class="grid-2">
      ${cardsHtml}
    </div>
  `;

  container.querySelectorAll('.segment-btn').forEach((btn) => {
    btn.addEventListener('click', () => {
      onFilterChange(btn.dataset.filter || 'all');
    });
  });

  const searchInput = container.querySelector('#learn-search-input');
  searchInput?.addEventListener('input', (e) => {
    onSearchChange(e.target.value);
  });

  container.querySelectorAll('[data-lesson-id]').forEach((btn) => {
    btn.addEventListener('click', () => {
      const id = btn.dataset.lessonId;
      if (id) onOpenLesson(id);
    });
  });
}
