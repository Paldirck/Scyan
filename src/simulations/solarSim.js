import { SOLAR_PLANETS } from '../data/scienceData.js';

export function createSolarSimulator(elements) {
  const {
    canvas,
    toggleBtn,
    speedInput,
    speedValEl,
    planetChipsContainer,
    planetInfoEl,
  } = elements;

  const ctx = canvas.getContext('2d');
  let animId = null;
  let isRunning = true;
  let simTime = 0;
  let lastTimestamp = 0;
  let selectedPlanetId = 'bumi';

  function renderPlanetChips() {
    planetChipsContainer.innerHTML = SOLAR_PLANETS.map(
      (p) => `
        <button
          type="button"
          class="planet-chip ${p.id === selectedPlanetId ? 'is-active' : ''}"
          data-planet="${p.id}"
        >${p.name}</button>
      `,
    ).join('');

    planetChipsContainer.querySelectorAll('.planet-chip').forEach((btn) => {
      btn.addEventListener('click', () => {
        selectedPlanetId = btn.dataset.planet;
        renderPlanetChips();
        updatePlanetInfo();
      });
    });
  }

  function updatePlanetInfo() {
    const p = SOLAR_PLANETS.find((item) => item.id === selectedPlanetId);
    if (!p) return;
    planetInfoEl.innerHTML = `
      <div class="sim-readout-row"><span>Planet Terpilih</span><strong class="text-cyan">${p.name}</strong></div>
      <div class="sim-readout-row"><span>Jarak ke Matahari</span><span class="tabular">${p.distanceAu}</span></div>
      <div class="sim-readout-row"><span>Periode Orbit</span><span class="tabular">${p.period}</span></div>
      <div class="sim-readout-row"><span>Gravitasi Permukaan</span><span class="tabular">${p.gravity}</span></div>
    `;
  }

  function resizeCanvas() {
    const parent = canvas.parentElement;
    if (!parent) return;
    const dpr = window.devicePixelRatio || 1;
    const w = parent.clientWidth || 600;
    const h = parent.clientHeight || 360;
    canvas.width = w * dpr;
    canvas.height = h * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    draw(w, h);
  }

  function draw(w, h) {
    ctx.clearRect(0, 0, w, h);
    const cx = w / 2;
    const cy = h / 2;
    const maxRadius = Math.min(w, h) * 0.44;
    const scale = maxRadius / 185;

    // Sun
    const sunGrad = ctx.createRadialGradient(cx, cy, 4, cx, cy, 24);
    sunGrad.addColorStop(0, '#fef08a');
    sunGrad.addColorStop(0.5, '#f59e0b');
    sunGrad.addColorStop(1, 'rgba(245, 158, 11, 0)');
    ctx.fillStyle = sunGrad;
    ctx.beginPath();
    ctx.arc(cx, cy, 24, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = '#fbbf24';
    ctx.beginPath();
    ctx.arc(cx, cy, 14, 0, Math.PI * 2);
    ctx.fill();

    // Planets
    for (const p of SOLAR_PLANETS) {
      const r = p.radiusPx * scale;
      const isSelected = p.id === selectedPlanetId;

      // Orbit ring
      ctx.beginPath();
      ctx.arc(cx, cy, r, 0, Math.PI * 2);
      ctx.strokeStyle = isSelected ? 'rgba(56, 189, 248, 0.55)' : '#1e293b';
      ctx.lineWidth = isSelected ? 1.5 : 1;
      ctx.stroke();

      // Planet position
      const angle = simTime * p.speed;
      const px = cx + r * Math.cos(angle);
      const py = cy + r * Math.sin(angle);

      if (p.hasRing) {
        ctx.save();
        ctx.translate(px, py);
        ctx.rotate(-0.35);
        ctx.beginPath();
        ctx.ellipse(0, 0, p.size * 1.9, p.size * 0.65, 0, 0, Math.PI * 2);
        ctx.strokeStyle = 'rgba(253, 230, 138, 0.65)';
        ctx.lineWidth = 2;
        ctx.stroke();
        ctx.restore();
      }

      if (isSelected) {
        ctx.beginPath();
        ctx.arc(px, py, p.size + 5, 0, Math.PI * 2);
        ctx.strokeStyle = '#38bdf8';
        ctx.lineWidth = 1.5;
        ctx.stroke();
      }

      ctx.beginPath();
      ctx.arc(px, py, p.size, 0, Math.PI * 2);
      ctx.fillStyle = p.color;
      ctx.fill();

      ctx.fillStyle = isSelected ? '#f1f5f9' : '#94a3b8';
      ctx.font = '11px "Plus Jakarta Sans", sans-serif';
      ctx.fillText(p.name, px + p.size + 6, py + 4);
    }
  }

  function loop(timestamp) {
    if (!lastTimestamp) lastTimestamp = timestamp;
    const dt = Math.min(0.05, (timestamp - lastTimestamp) / 1000);
    lastTimestamp = timestamp;

    const multiplier = parseFloat(speedInput.value) || 1;
    if (isRunning) {
      simTime += dt * 0.65 * multiplier;
    }

    const parent = canvas.parentElement;
    draw(parent?.clientWidth || 600, parent?.clientHeight || 360);
    animId = requestAnimationFrame(loop);
  }

  toggleBtn.addEventListener('click', () => {
    isRunning = !isRunning;
    toggleBtn.textContent = isRunning ? 'Jeda Orbit' : 'Lanjutkan Orbit';
  });

  speedInput.addEventListener('input', () => {
    speedValEl.textContent = `${parseFloat(speedInput.value).toFixed(1)}x`;
  });

  renderPlanetChips();
  updatePlanetInfo();
  resizeCanvas();
  animId = requestAnimationFrame(loop);

  return {
    resize: resizeCanvas,
    stop: () => {
      if (animId) cancelAnimationFrame(animId);
    },
  };
}
