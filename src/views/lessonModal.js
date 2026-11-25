import { renderIllustration } from '../components/illustrations.js';
import { CATEGORIES, LESSONS } from '../data/scienceData.js';
import { getState, recordQuizSuccess } from '../state/store.js';
import { icon } from '../utils/icons.js';
import { showToast } from '../utils/toast.js';

export function openLessonModal(lessonId) {
  const lesson = LESSONS.find((l) => l.id === lessonId);
  const modalRoot = document.getElementById('modal-root');
  if (!lesson || !modalRoot) return;

  const cat = CATEGORIES.find((c) => c.id === lesson.kategori);
  let activeQuizIndex = 0;
  let selectedOption = null;
  let submittedState = null; // null | { isCorrect: boolean }

  function closeModal() {
    modalRoot.innerHTML = '';
    document.removeEventListener('keydown', onKeyDown);
  }

  function onKeyDown(e) {
    if (e.key === 'Escape') closeModal();
  }

  function renderQuizSection() {
    const state = getState();
    const quiz = lesson.quizzes[activeQuizIndex];
    const totalQuizzes = lesson.quizzes.length;
    const isAlreadyDone = state.kuisSelesai.includes(quiz.id);

    const optionsHtml = quiz.pilihan
      .map((opt, idx) => {
        let stateClass = '';
        if (submittedState) {
          if (idx === quiz.jawabanBenar) stateClass = 'is-correct';
          else if (idx === selectedOption) stateClass = 'is-wrong';
        } else if (idx === selectedOption) {
          stateClass = 'is-selected';
        }

        const letter = String.fromCharCode(65 + idx);
        return `
          <button
            type="button"
            class="quiz-option-btn ${stateClass}"
            data-opt-idx="${idx}"
            ${submittedState ? 'disabled' : ''}
          >
            <span>${letter}. ${opt}</span>
            ${
              submittedState && idx === quiz.jawabanBenar
                ? icon('check')
                : submittedState && idx === selectedOption
                ? icon('xCircle')
                : icon('circle')
            }
          </button>
        `;
      })
      .join('');

    const feedbackHtml = submittedState
      ? `
        <div class="quiz-feedback ${submittedState.isCorrect ? 'is-success' : 'is-error'}">
          <strong>${submittedState.isCorrect ? 'Jawaban Tepat!' : 'Jawaban Kurang Tepat'}</strong>
          <p style="margin-top: 0.25rem;">${quiz.penjelasan}</p>
        </div>
      `
      : '';

    const quizNavButtons = `
      <div class="quiz-actions">
        <div style="display: flex; gap: 0.5rem;">
          ${
            totalQuizzes > 1
              ? `
                <button type="button" class="btn btn-secondary btn-sm" id="btn-quiz-prev" ${activeQuizIndex === 0 ? 'disabled' : ''}>
                  Soal Sebelumnya
                </button>
                <button type="button" class="btn btn-secondary btn-sm" id="btn-quiz-next" ${activeQuizIndex >= totalQuizzes - 1 ? 'disabled' : ''}>
                  Soal Berikutnya
                </button>
              `
              : ''
          }
        </div>
        ${
          submittedState
            ? `<button type="button" class="btn btn-secondary btn-sm" id="btn-quiz-retry">Ulangi Soal Ini</button>`
            : `<button type="button" class="btn btn-primary" id="btn-quiz-submit">Periksa Jawaban</button>`
        }
      </div>
    `;

    const quizHost = modalRoot.querySelector('#lesson-quiz-host');
    if (!quizHost) return;

    quizHost.innerHTML = `
      <div class="quiz-header">
        <h3 class="section-title" style="font-size: 1rem;">
          Uji Pemahaman · Soal ${activeQuizIndex + 1} dari ${totalQuizzes}
        </h3>
        <span class="tabular ${isAlreadyDone ? 'text-emerald' : 'text-cyan'}" style="font-size: 0.8125rem; font-weight: 600;">
          ${isAlreadyDone ? 'Sudah Tuntas (0 PTS)' : `+${quiz.poin} PTS`}
        </span>
      </div>

      <div class="quiz-card">
        <p class="quiz-question">${quiz.pertanyaan}</p>
        <div class="quiz-options">${optionsHtml}</div>
        ${feedbackHtml}
        ${quizNavButtons}
      </div>
    `;

    quizHost.querySelectorAll('[data-opt-idx]').forEach((btn) => {
      btn.addEventListener('click', () => {
        selectedOption = parseInt(btn.dataset.optIdx, 10);
        renderQuizSection();
      });
    });

    quizHost.querySelector('#btn-quiz-submit')?.addEventListener('click', () => {
      if (selectedOption === null) {
        showToast('Pilih salah satu jawaban terlebih dahulu.', 'warning');
        return;
      }
      const isCorrect = selectedOption === quiz.jawabanBenar;
      submittedState = { isCorrect };
      if (isCorrect) {
        recordQuizSuccess(lesson.id, quiz.id, quiz.poin);
      }
      renderQuizSection();
    });

    quizHost.querySelector('#btn-quiz-retry')?.addEventListener('click', () => {
      selectedOption = null;
      submittedState = null;
      renderQuizSection();
    });

    quizHost.querySelector('#btn-quiz-prev')?.addEventListener('click', () => {
      if (activeQuizIndex > 0) {
        activeQuizIndex--;
        selectedOption = null;
        submittedState = null;
        renderQuizSection();
      }
    });

    quizHost.querySelector('#btn-quiz-next')?.addEventListener('click', () => {
      if (activeQuizIndex < totalQuizzes - 1) {
        activeQuizIndex++;
        selectedOption = null;
        submittedState = null;
        renderQuizSection();
      }
    });
  }

  modalRoot.innerHTML = `
    <div class="modal-backdrop" id="lesson-modal-backdrop" role="dialog" aria-modal="true" aria-labelledby="lesson-modal-title">
      <div class="modal-dialog">
        <div class="modal-header">
          <div>
            <div class="meta-line">
              <span>${cat?.name || lesson.kategori}</span>
              <span aria-hidden="true">·</span>
              <span>${lesson.tingkatKesulitan}</span>
            </div>
            <h2 id="lesson-modal-title" class="modal-title">${lesson.judul}</h2>
          </div>
          <button type="button" class="icon-btn" id="btn-close-lesson" aria-label="Tutup modul">
            ${icon('close')}
          </button>
        </div>

        <div class="modal-body">
          <div class="illustration-stage">
            ${renderIllustration(lesson.svgType)}
          </div>

          <div class="lesson-prose">
            ${lesson.konten}
          </div>

          <div id="lesson-quiz-host" class="quiz-container"></div>
        </div>

        <div class="modal-footer">
          <button type="button" class="btn btn-secondary" id="btn-footer-close-lesson">Tutup Modul</button>
        </div>
      </div>
    </div>
  `;

  renderQuizSection();

  modalRoot.querySelector('#btn-close-lesson')?.addEventListener('click', closeModal);
  modalRoot.querySelector('#btn-footer-close-lesson')?.addEventListener('click', closeModal);
  modalRoot.querySelector('#lesson-modal-backdrop')?.addEventListener('click', (e) => {
    if (e.target.id === 'lesson-modal-backdrop') closeModal();
  });
  document.addEventListener('keydown', onKeyDown);
}
