import {
  loginWithGoogle,
  loginWithUsernamePassword,
  registerWithUsernamePassword,
} from '../services/firebase.js';
import { showToast } from '../utils/toast.js';

function mapFirebaseAuthError(error) {
  const code = error?.code || '';
  if (code === 'auth/operation-not-allowed') {
    return 'Penyedia login Email/Password belum diaktifkan di Firebase Console (Authentication → Sign-in method → aktifkan Email/Password).';
  }
  if (code === 'auth/email-already-in-use') {
    return 'Username tersebut sudah terdaftar. Silakan masuk atau gunakan username lain.';
  }
  if (code === 'auth/invalid-credential' || code === 'auth/wrong-password' || code === 'auth/user-not-found') {
    return 'Username atau password tidak cocok. Periksa kembali data masuk Anda.';
  }
  if (code === 'auth/weak-password') {
    return 'Password terlalu lemah. Gunakan minimal 6 karakter.';
  }
  if (code === 'auth/popup-closed-by-user') {
    return 'Jendela login Google ditutup sebelum proses selesai.';
  }
  if (code === 'auth/popup-blocked') {
    return 'Popup login diblokir oleh browser. Izinkan popup untuk melanjutkan masuk dengan Google.';
  }
  if (code === 'auth/network-request-failed') {
    return 'Koneksi jaringan bermasalah. Periksa internet Anda dan coba lagi.';
  }
  return error?.message || 'Terjadi kesalahan saat autentikasi.';
}

const GOOGLE_MARK = `
  <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">
    <path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17Z"/>
    <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.11-6.72-4.96H1.29v3.14C3.26 21.3 7.31 24 12 24Z"/>
    <path fill="#FBBC05" d="M5.28 14.24c-.24-.72-.38-1.49-.38-2.24s.14-1.52.38-2.24V6.62H1.29C.47 8.24 0 10.06 0 12s.47 3.76 1.29 5.38l3.99-3.14Z"/>
    <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.31 0 3.26 2.7 1.29 6.62l3.99 3.14c.95-2.85 3.6-4.96 6.72-4.96Z"/>
  </svg>
`;

export function renderAuthView(container, authMode, { onModeChange, onSuccess }) {
  const isRegister = authMode === 'register';
  let isBusy = false;
  let errorMessage = '';

  function render() {
    container.innerHTML = `
      <div class="auth-shell">
        <div class="panel auth-card">
          <div class="auth-header">
            <p class="hero-kicker">Akun Pelajar ScienceQuest · Firebase Auth</p>
            <h1 class="auth-title">${isRegister ? 'Buat Akun Baru' : 'Masuk ke ScienceQuest'}</h1>
            <p class="auth-subtitle">
              ${
                isRegister
                  ? 'Simpan progres materi, skor kuis, dan lencana pencapaian Anda di cloud Firebase.'
                  : 'Lanjutkan petualangan sains dan sinkronkan progres belajar Anda lintas perangkat.'
              }
            </p>
          </div>

          <div class="segmented-control auth-tabs" role="tablist" aria-label="Pilih mode autentikasi">
            <button type="button" class="segment-btn ${!isRegister ? 'is-active' : ''}" data-auth-mode="login" style="flex: 1;">
              Masuk (Login)
            </button>
            <button type="button" class="segment-btn ${isRegister ? 'is-active' : ''}" data-auth-mode="register" style="flex: 1;">
              Daftar (Register)
            </button>
          </div>

          <div id="auth-error-box" class="auth-alert ${errorMessage ? '' : 'is-hidden'}" role="alert">
            ${errorMessage}
          </div>

          <button type="button" id="btn-google-auth" class="btn btn-google btn-full" ${isBusy ? 'disabled' : ''}>
            ${GOOGLE_MARK}
            <span>${isRegister ? 'Daftar dengan Google' : 'Masuk dengan Google'}</span>
          </button>

          <div class="divider-or" aria-hidden="true">
            <span>atau gunakan username &amp; password</span>
          </div>

          ${
            isRegister
              ? `
                <form id="form-auth-register" class="auth-form" novalidate>
                  <div class="control-group">
                    <label for="reg-username">Username</label>
                    <input
                      type="text"
                      id="reg-username"
                      class="text-field"
                      placeholder="contoh: budi_sains"
                      minlength="3"
                      maxlength="32"
                      autocomplete="username"
                      required
                    />
                  </div>

                  <div class="control-group">
                    <label for="reg-alias">Nama Tampilan (Opsional)</label>
                    <input
                      type="text"
                      id="reg-alias"
                      class="text-field"
                      placeholder="contoh: Budi Santoso"
                      maxlength="32"
                    />
                  </div>

                  <div class="control-group">
                    <label for="reg-email">Email Pemulihan (Opsional)</label>
                    <input
                      type="email"
                      id="reg-email"
                      class="text-field"
                      placeholder="budi@email.com"
                      maxlength="120"
                      autocomplete="email"
                    />
                  </div>

                  <div class="control-group">
                    <label for="reg-password">Password (minimal 6 karakter)</label>
                    <div class="password-wrap">
                      <input
                        type="password"
                        id="reg-password"
                        class="text-field"
                        placeholder="Buat password aman"
                        minlength="6"
                        autocomplete="new-password"
                        required
                      />
                      <button type="button" class="btn-toggle-pw" data-toggle-pw="reg-password">Tampilkan</button>
                    </div>
                  </div>

                  <div class="control-group">
                    <label for="reg-password-confirm">Konfirmasi Password</label>
                    <input
                      type="password"
                      id="reg-password-confirm"
                      class="text-field"
                      placeholder="Ulangi password"
                      minlength="6"
                      autocomplete="new-password"
                      required
                    />
                  </div>

                  <button type="submit" class="btn btn-primary btn-full" ${isBusy ? 'disabled' : ''}>
                    ${isBusy ? 'Mendaftarkan Akun...' : 'Daftar & Simpan ke Firebase'}
                  </button>
                </form>
              `
              : `
                <form id="form-auth-login" class="auth-form" novalidate>
                  <div class="control-group">
                    <label for="login-identifier">Username</label>
                    <input
                      type="text"
                      id="login-identifier"
                      class="text-field"
                      placeholder="Masukkan username Anda"
                      autocomplete="username"
                      required
                    />
                  </div>

                  <div class="control-group">
                    <label for="login-password">Password</label>
                    <div class="password-wrap">
                      <input
                        type="password"
                        id="login-password"
                        class="text-field"
                        placeholder="Masukkan password"
                        autocomplete="current-password"
                        required
                      />
                      <button type="button" class="btn-toggle-pw" data-toggle-pw="login-password">Tampilkan</button>
                    </div>
                  </div>

                  <button type="submit" class="btn btn-primary btn-full" ${isBusy ? 'disabled' : ''}>
                    ${isBusy ? 'Memverifikasi...' : 'Masuk dengan Username'}
                  </button>
                </form>
              `
          }
        </div>
      </div>
    `;

    bindEvents();
  }

  function setError(msg) {
    errorMessage = msg;
    const box = container.querySelector('#auth-error-box');
    if (box) {
      box.textContent = msg;
      box.classList.toggle('is-hidden', !msg);
    }
  }

  function bindEvents() {
    container.querySelectorAll('[data-auth-mode]').forEach((btn) => {
      btn.addEventListener('click', () => {
        const nextMode = btn.dataset.authMode;
        if (nextMode && nextMode !== authMode) {
          onModeChange(nextMode);
        }
      });
    });

    container.querySelectorAll('[data-toggle-pw]').forEach((btn) => {
      btn.addEventListener('click', () => {
        const targetId = btn.dataset.togglePw;
        const input = container.querySelector(`#${targetId}`);
        if (!input) return;
        const show = input.type === 'password';
        input.type = show ? 'text' : 'password';
        btn.textContent = show ? 'Sembunyikan' : 'Tampilkan';
      });
    });

    container.querySelector('#btn-google-auth')?.addEventListener('click', async () => {
      if (isBusy) return;
      isBusy = true;
      setError('');
      render();
      try {
        await loginWithGoogle();
        showToast('Berhasil masuk dengan akun Google.', 'success');
        onSuccess();
      } catch (err) {
        isBusy = false;
        errorMessage = mapFirebaseAuthError(err);
        render();
      }
    });

    container.querySelector('#form-auth-login')?.addEventListener('submit', async (e) => {
      e.preventDefault();
      if (isBusy) return;
      const identifier = container.querySelector('#login-identifier')?.value || '';
      const password = container.querySelector('#login-password')?.value || '';
      isBusy = true;
      errorMessage = '';
      render();
      try {
        await loginWithUsernamePassword({ identifier, password });
        showToast('Berhasil masuk ke ScienceQuest.', 'success');
        onSuccess();
      } catch (err) {
        isBusy = false;
        errorMessage = mapFirebaseAuthError(err);
        render();
      }
    });

    container.querySelector('#form-auth-register')?.addEventListener('submit', async (e) => {
      e.preventDefault();
      if (isBusy) return;
      const username = container.querySelector('#reg-username')?.value || '';
      const displayName = container.querySelector('#reg-alias')?.value || '';
      const email = container.querySelector('#reg-email')?.value || '';
      const password = container.querySelector('#reg-password')?.value || '';
      const confirmPw = container.querySelector('#reg-password-confirm')?.value || '';

      if (password !== confirmPw) {
        setError('Konfirmasi password tidak sama dengan password.');
        return;
      }

      isBusy = true;
      errorMessage = '';
      render();
      try {
        await registerWithUsernamePassword({ username, password, displayName, email });
        showToast('Akun berhasil dibuat dan disimpan ke Firebase.', 'success');
        onSuccess();
      } catch (err) {
        isBusy = false;
        errorMessage = mapFirebaseAuthError(err);
        render();
      }
    });
  }

  render();
}
