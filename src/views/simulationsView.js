import { createCircuitSimulator } from '../simulations/circuitSim.js';
import { createGravitySimulator } from '../simulations/gravitySim.js';
import { createSolarSimulator } from '../simulations/solarSim.js';
import { icon } from '../utils/icons.js';

export function createSimulationsController(container) {
  let activeTab = 'gravity';
  let activeSimInstance = null;
  let rendered = false;

  function renderShell() {
    container.innerHTML = `
      <div class="section-header">
        <div>
          <h1 class="section-title">Laboratorium Simulasi Sains</h1>
          <p class="section-subtitle">Eksperimen interaktif konsep Fisika, Elektronika, dan Astronomi secara real-time.</p>
        </div>
      </div>

      <div class="sim-tabs" role="tablist" aria-label="Pilih Simulasi Laboratorium">
        <button type="button" class="sim-tab-btn is-active" data-sim-tab="gravity">1. Gravitasi &amp; Jatuh Bebas</button>
        <button type="button" class="sim-tab-btn" data-sim-tab="solar">2. Orbit Tata Surya</button>
        <button type="button" class="sim-tab-btn" data-sim-tab="circuit">3. Rangkaian Listrik Seri</button>
      </div>

      <div id="sim-host" class="panel"></div>
    `;

    container.querySelectorAll('.sim-tab-btn').forEach((btn) => {
      btn.addEventListener('click', () => {
        switchTab(btn.dataset.simTab || 'gravity');
      });
    });

    rendered = true;
  }

  function mountGravity(host) {
    host.innerHTML = `
      <div class="sim-sandbox">
        <div class="sim-stage">
          <canvas id="gravityCanvas" aria-label="Kanvas simulasi jatuh bebas"></canvas>
        </div>

        <div class="sim-controls">
          <h3>Parameter Jatuh Bebas</h3>

          <div class="control-group">
            <div class="control-label-row">
              <label for="sim-height-input">Tinggi Jatuh (h₀)</label>
              <span id="sim-height-val" class="control-value">50 m</span>
            </div>
            <input type="range" id="sim-height-input" class="range-slider" min="10" max="100" value="50" />
          </div>

          <div class="control-group">
            <div class="control-label-row">
              <label for="sim-gravity-select">Gravitasi Benda Langit (g)</label>
              <span id="sim-gravity-val" class="control-value">Bumi (9.8 m/s²)</span>
            </div>
            <select id="sim-gravity-select" class="select-field">
              <option value="9.8">Bumi (9.8 m/s²)</option>
              <option value="1.62">Bulan (1.62 m/s²)</option>
              <option value="3.7">Mars (3.7 m/s²)</option>
              <option value="24.79">Yupiter (24.79 m/s²)</option>
            </select>
          </div>

          <div class="control-group">
            <div class="control-label-row">
              <label for="sim-mass-input">Massa Benda (m)</label>
              <span id="sim-mass-val" class="control-value">5 kg</span>
            </div>
            <input type="range" id="sim-mass-input" class="range-slider" min="1" max="50" value="5" />
          </div>

          <div class="sim-actions-row">
            <button type="button" id="btn-grav-start" class="btn btn-primary" style="flex: 1;">
              ${icon('play')}
              <span>Jatuhkan Benda</span>
            </button>
            <button type="button" id="btn-grav-reset" class="btn btn-secondary">
              ${icon('reset')}
              <span>Reset</span>
            </button>
          </div>

          <div class="sim-readout">
            <div class="sim-readout-row"><span>Waktu Jatuh (t)</span><span id="out-sim-time" class="tabular text-emerald">0.00 s</span></div>
            <div class="sim-readout-row"><span>Kecepatan (v)</span><span id="out-sim-velocity" class="tabular text-cyan">0.00 m/s</span></div>
            <div class="sim-readout-row"><span>Energi Kinetik (Ek)</span><span id="out-sim-ek" class="tabular text-amber">0.0 J</span></div>
          </div>
        </div>
      </div>
    `;

    activeSimInstance = createGravitySimulator({
      canvas: host.querySelector('#gravityCanvas'),
      heightInput: host.querySelector('#sim-height-input'),
      gravitySelect: host.querySelector('#sim-gravity-select'),
      massInput: host.querySelector('#sim-mass-input'),
      heightValEl: host.querySelector('#sim-height-val'),
      gravityValEl: host.querySelector('#sim-gravity-val'),
      massValEl: host.querySelector('#sim-mass-val'),
      outTimeEl: host.querySelector('#out-sim-time'),
      outVelEl: host.querySelector('#out-sim-velocity'),
      outEkEl: host.querySelector('#out-sim-ek'),
      startBtn: host.querySelector('#btn-grav-start'),
      resetBtn: host.querySelector('#btn-grav-reset'),
    });
  }

  function mountSolar(host) {
    host.innerHTML = `
      <div class="sim-sandbox">
        <div class="sim-stage">
          <canvas id="solarCanvas" aria-label="Kanvas simulasi orbit tata surya"></canvas>
        </div>

        <div class="sim-controls">
          <h3>Kontrol Orbit Kepler</h3>

          <div class="control-group">
            <div class="control-label-row">
              <label for="solar-speed-input">Kecepatan Simulasi</label>
              <span id="solar-speed-val" class="control-value">1.0x</span>
            </div>
            <input type="range" id="solar-speed-input" class="range-slider" min="0.2" max="4" step="0.2" value="1" />
          </div>

          <button type="button" id="btn-solar-toggle" class="btn btn-cyan">Jeda Orbit</button>

          <div class="control-group">
            <span class="control-label-row">Inspeksi Planet</span>
            <div id="solar-planet-chips" class="planet-chips"></div>
          </div>

          <div id="solar-planet-info" class="sim-readout"></div>
        </div>
      </div>
    `;

    activeSimInstance = createSolarSimulator({
      canvas: host.querySelector('#solarCanvas'),
      toggleBtn: host.querySelector('#btn-solar-toggle'),
      speedInput: host.querySelector('#solar-speed-input'),
      speedValEl: host.querySelector('#solar-speed-val'),
      planetChipsContainer: host.querySelector('#solar-planet-chips'),
      planetInfoEl: host.querySelector('#solar-planet-info'),
    });
  }

  function mountCircuit(host) {
    host.innerHTML = `
      <div class="sim-sandbox">
        <div class="sim-stage">
          <canvas id="circuitCanvas" aria-label="Kanvas simulasi rangkaian listrik seri"></canvas>
        </div>

        <div class="sim-controls">
          <h3>Hukum Ohm (V = I × R)</h3>

          <div class="control-group">
            <div class="control-label-row">
              <label for="circuit-voltage-input">Tegangan Baterai (V)</label>
              <span id="circuit-voltage-val" class="control-value">9.0 V</span>
            </div>
            <input type="range" id="circuit-voltage-input" class="range-slider" min="1" max="24" step="0.5" value="9" />
          </div>

          <div class="control-group">
            <div class="control-label-row">
              <label for="circuit-resistor-input">Hambatan Resistor (R)</label>
              <span id="circuit-resistor-val" class="control-value">10.0 Ω</span>
            </div>
            <input type="range" id="circuit-resistor-input" class="range-slider" min="1" max="50" step="1" value="10" />
          </div>

          <div class="sim-readout-row">
            <span>Sakelar Utama</span>
            <button type="button" id="circuit-switch-btn" class="btn btn-cyan btn-sm">Terhubung (ON)</button>
          </div>

          <div class="sim-readout">
            <div class="sim-readout-row"><span>Kuat Arus (I)</span><span id="out-circuit-current" class="tabular text-emerald">0.90 A</span></div>
            <div class="sim-readout-row"><span>Daya Lampu (P)</span><span id="out-circuit-power" class="tabular text-amber">8.10 W</span></div>
            <div class="sim-readout-row"><span>Intensitas Cahaya</span><span id="out-circuit-status" class="text-cyan">Terang Normal</span></div>
          </div>
        </div>
      </div>
    `;

    activeSimInstance = createCircuitSimulator({
      canvas: host.querySelector('#circuitCanvas'),
      voltageInput: host.querySelector('#circuit-voltage-input'),
      resistorInput: host.querySelector('#circuit-resistor-input'),
      voltageValEl: host.querySelector('#circuit-voltage-val'),
      resistorValEl: host.querySelector('#circuit-resistor-val'),
      switchBtn: host.querySelector('#circuit-switch-btn'),
      outCurrentEl: host.querySelector('#out-circuit-current'),
      outPowerEl: host.querySelector('#out-circuit-power'),
      outStatusEl: host.querySelector('#out-circuit-status'),
    });
  }

  function switchTab(tabId) {
    activeTab = tabId;
    if (activeSimInstance) {
      activeSimInstance.stop();
      activeSimInstance = null;
    }

    container.querySelectorAll('.sim-tab-btn').forEach((btn) => {
      btn.classList.toggle('is-active', btn.dataset.simTab === tabId);
    });

    const host = container.querySelector('#sim-host');
    if (!host) return;

    if (tabId === 'gravity') mountGravity(host);
    else if (tabId === 'solar') mountSolar(host);
    else if (tabId === 'circuit') mountCircuit(host);
  }

  return {
    mount() {
      if (!rendered) {
        renderShell();
      }
      switchTab(activeTab);
    },
    unmount() {
      if (activeSimInstance) {
        activeSimInstance.stop();
        activeSimInstance = null;
      }
    },
    resize() {
      activeSimInstance?.resize();
    },
  };
}
