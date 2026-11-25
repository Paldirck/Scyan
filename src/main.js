import './styles/tokens.css';
import './styles/main.css';

import { getState, initAuthSync, subscribe } from './state/store.js';
import { showToast } from './utils/toast.js';
import { renderAchievementsView } from './views/achievementsView.js';
import { renderAuthView } from './views/authView.js';
import { renderDashboardView } from './views/dashboardView.js';
import { renderLeaderboardView } from './views/leaderboardView.js';
import { renderLearnView } from './views/learnView.js';
import { openLessonModal } from './views/lessonModal.js';
import { renderSettingsView } from './views/settingsView.js';
import { createSimulationsController } from './views/simulationsView.js';

const VIEWS = ['auth', 'dashboard', 'learn', 'simulations', 'leaderboard', 'achievements', 'settings'];

let currentView = 'auth';
let authMode = 'login';
const learnFilter = {
  category: 'all',
  query: '',
};

let simulationsController = null;

function isAuthenticated() {
  return Boolean(getState().auth?.user);
}

function syncAuthGateLayout() {
  const signedIn = isAuthenticated();
  document.body.classList.toggle('is-unauthenticated', !signedIn);
}

function renderActiveView() {
  if (!isAuthenticated() && currentView !== 'auth') {
    navigateTo('auth');
    return;
  }

  if (currentView === 'auth') {
    const el = document.getElementById('view-auth');
    if (el) {
      renderAuthView(el, authMode, {
        onModeChange: (nextMode) => {
          authMode = nextMode;
          renderActiveView();
        },
        onSuccess: () => {
          navigateTo('dashboard');
        },
      });
    }
  } else if (currentView === 'dashboard') {
    const el = document.getElementById('view-dashboard');
    if (el) {
      renderDashboardView(el, {
        onNavigate: navigateTo,
        onSelectCategory: (catId) => {
          learnFilter.category = catId;
          navigateTo('learn');
        },
      });
    }
  } else if (currentView === 'learn') {
    const el = document.getElementById('view-learn');
    if (el) {
      renderLearnView(el, learnFilter, {
        onFilterChange: (catId) => {
          learnFilter.category = catId;
          renderActiveView();
        },
        onSearchChange: (q) => {
          learnFilter.query = q;
          renderActiveView();
          const input = document.getElementById('learn-search-input');
          if (input) {
            input.focus();
            input.setSelectionRange(q.length, q.length);
          }
        },
        onOpenLesson: (lessonId) => openLessonModal(lessonId),
      });
    }
  } else if (currentView === 'simulations') {
    simulationsController?.mount();
  } else if (currentView === 'leaderboard') {
    const el = document.getElementById('view-leaderboard');
    if (el) renderLeaderboardView(el);
  } else if (currentView === 'achievements') {
    const el = document.getElementById('view-achievements');
    if (el) renderAchievementsView(el);
  } else if (currentView === 'settings') {
    const el = document.getElementById('view-settings');
    if (el) {
      renderSettingsView(el, {
        onNavigate: navigateTo,
        onSignedOut: () => {
          authMode = 'login';
          navigateTo('auth');
        },
      });
    }
  }
}

function navigateTo(viewId) {
  if (!VIEWS.includes(viewId)) return;

  if (!isAuthenticated() && viewId !== 'auth') {
    if (currentView !== 'auth') {
      showToast('Silakan masuk atau daftar akun terlebih dahulu.', 'warning');
    }
    viewId = 'auth';
  }

  if (currentView === 'simulations' && viewId !== 'simulations') {
    simulationsController?.unmount();
  }

  currentView = viewId;

  VIEWS.forEach((id) => {
    const section = document.getElementById(`view-${id}`);
    section?.classList.toggle('is-hidden', id !== viewId);
  });

  document.querySelectorAll('[data-nav]').forEach((el) => {
    if (el.tagName === 'BUTTON') {
      el.classList.toggle('is-active', el.dataset.nav === viewId);
    }
  });

  syncAuthGateLayout();
  renderActiveView();
}

function bootstrap() {
  const simEl = document.getElementById('view-simulations');
  if (simEl) {
    simulationsController = createSimulationsController(simEl);
  }

  document.querySelectorAll('[data-nav]').forEach((el) => {
    el.addEventListener('click', (e) => {
      if (el.tagName === 'A') e.preventDefault();
      const target = el.dataset.nav;
      if (target) navigateTo(target);
    });
  });

  subscribe(() => {
    syncAuthGateLayout();
    if (currentView !== 'simulations' && currentView !== 'auth') {
      renderActiveView();
    }
  });

  initAuthSync((isSignedIn) => {
    if (isSignedIn) {
      if (currentView === 'auth') {
        navigateTo('dashboard');
      } else {
        renderActiveView();
      }
    } else {
      navigateTo('auth');
    }
  });

  window.addEventListener('resize', () => {
    if (currentView === 'simulations') {
      simulationsController?.resize();
    }
  });

  syncAuthGateLayout();
  navigateTo('auth');
}

document.addEventListener('DOMContentLoaded', bootstrap);
