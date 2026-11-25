export function createCircuitSimulator(elements) {
  const {
    canvas,
    voltageInput,
    resistorInput,
    voltageValEl,
    resistorValEl,
    switchBtn,
    outCurrentEl,
    outPowerEl,
    outStatusEl,
  } = elements;

  const ctx = canvas.getContext('2d');
  let isSwitchOn = true;
  let animId = null;
  let flowOffset = 0;
  let lastTimestamp = 0;

  function getCircuitMetrics() {
    const V = parseFloat(voltageInput.value) || 9;
    const R = parseFloat(resistorInput.value) || 10;
    const I = isSwitchOn ? V / R : 0;
    const P = isSwitchOn ? V * I : 0;
    return { V, R, I, P };
  }

  function syncOutputs() {
    const { V, R, I, P } = getCircuitMetrics();
    voltageValEl.textContent = `${V.toFixed(1)} V`;
    resistorValEl.textContent = `${R.toFixed(1)} Ω`;
    outCurrentEl.textContent = `${I.toFixed(2)} A`;
    outPowerEl.textContent = `${P.toFixed(2)} W`;

    if (!isSwitchOn) {
      outStatusEl.textContent = 'Terputus (Off)';
    } else if (I < 0.35) {
      outStatusEl.textContent = 'Redup';
    } else if (I < 1.4) {
      outStatusEl.textContent = 'Terang Normal';
    } else {
      outStatusEl.textContent = 'Sangat Terang';
    }
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
  }

  function pointOnRect(x, y, w, h, t) {
    const perimeter = 2 * (w + h);
    let dist = ((t % 1) + 1) % 1 * perimeter;
    if (dist <= w) return { x: x + dist, y };
    dist -= w;
    if (dist <= h) return { x: x + w, y: y + dist };
    dist -= h;
    if (dist <= w) return { x: x + w - dist, y: y + h };
    dist -= w;
    return { x, y: y + h - dist };
  }

  function draw(w, h) {
    const { V, R, I } = getCircuitMetrics();
    ctx.clearRect(0, 0, w, h);

    const boxW = Math.min(w - 110, 380);
    const boxH = Math.min(h - 100, 190);
    const left = (w - boxW) / 2;
    const top = (h - boxH) / 2;
    const right = left + boxW;
    const bottom = top + boxH;
    const cx = w / 2;
    const cy = h / 2;

    // Main loop wire
    ctx.strokeStyle = isSwitchOn ? '#0ea5e9' : '#475569';
    ctx.lineWidth = 3.5;
    ctx.beginPath();
    // Top left to resistor, resistor to top right, down right, bottom right to switch
    ctx.moveTo(left, top);
    ctx.lineTo(right, top);
    ctx.lineTo(right, bottom);
    ctx.lineTo(cx + 28, bottom);
    ctx.moveTo(cx - 28, bottom);
    ctx.lineTo(left, bottom);
    ctx.lineTo(left, top);
    ctx.stroke();

    // Animated current charge particles
    if (isSwitchOn && I > 0) {
      const particleCount = 14;
      ctx.fillStyle = '#38bdf8';
      for (let i = 0; i < particleCount; i++) {
        const pt = pointOnRect(left, top, boxW, boxH, (i / particleCount + flowOffset) % 1);
        ctx.beginPath();
        ctx.arc(pt.x, pt.y, 3.2, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    // Battery (Left side)
    ctx.fillStyle = '#080d1a';
    ctx.fillRect(left - 14, cy - 26, 28, 52);
    ctx.strokeStyle = '#fbbf24';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(left - 12, cy - 10);
    ctx.lineTo(left + 12, cy - 10);
    ctx.stroke();
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(left - 6, cy + 10);
    ctx.lineTo(left + 6, cy + 10);
    ctx.stroke();

    ctx.fillStyle = '#fbbf24';
    ctx.font = '600 12px "IBM Plex Mono", monospace';
    ctx.fillText(`+${V.toFixed(1)}V`, left - 58, cy + 4);

    // Resistor (Top side)
    ctx.fillStyle = '#11192c';
    ctx.fillRect(cx - 38, top - 14, 76, 28);
    ctx.strokeStyle = '#818cf8';
    ctx.lineWidth = 2;
    ctx.strokeRect(cx - 38, top - 14, 76, 28);
    ctx.fillStyle = '#c7d2fe';
    ctx.fillText(`${R} Ω`, cx - 16, top + 4);

    // Switch (Bottom side)
    ctx.fillStyle = '#94a3b8';
    ctx.beginPath();
    ctx.arc(cx - 28, bottom, 4, 0, Math.PI * 2);
    ctx.arc(cx + 28, bottom, 4, 0, Math.PI * 2);
    ctx.fill();

    ctx.strokeStyle = isSwitchOn ? '#10b981' : '#fb7185';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(cx - 28, bottom);
    if (isSwitchOn) {
      ctx.lineTo(cx + 28, bottom);
    } else {
      ctx.lineTo(cx + 20, bottom - 22);
    }
    ctx.stroke();

    ctx.fillStyle = '#cbd5e1';
    ctx.font = '11px "Plus Jakarta Sans", sans-serif';
    ctx.fillText(isSwitchOn ? 'Sakelar Tertutup' : 'Sakelar Terbuka', cx - 42, bottom + 24);

    // Bulb (Right side)
    if (isSwitchOn && I > 0) {
      const glowRadius = 22 + Math.min(I * 18, 42);
      const bulbGlow = ctx.createRadialGradient(right, cy, 4, right, cy, glowRadius);
      bulbGlow.addColorStop(0, `rgba(251, 191, 36, ${Math.min(0.85, 0.25 + I * 0.35)})`);
      bulbGlow.addColorStop(1, 'rgba(251, 191, 36, 0)');
      ctx.fillStyle = bulbGlow;
      ctx.beginPath();
      ctx.arc(right, cy, glowRadius, 0, Math.PI * 2);
      ctx.fill();
    }

    ctx.beginPath();
    ctx.arc(right, cy, 16, 0, Math.PI * 2);
    ctx.fillStyle = isSwitchOn && I > 0 ? '#fbbf24' : '#1e293b';
    ctx.fill();
    ctx.strokeStyle = '#f59e0b';
    ctx.lineWidth = 2;
    ctx.stroke();

    ctx.fillStyle = '#f1f5f9';
    ctx.font = '600 12px "IBM Plex Mono", monospace';
    ctx.fillText(`I=${I.toFixed(2)}A`, right + 24, cy + 4);
  }

  function loop(timestamp) {
    if (!lastTimestamp) lastTimestamp = timestamp;
    const dt = Math.min(0.05, (timestamp - lastTimestamp) / 1000);
    lastTimestamp = timestamp;

    const { I } = getCircuitMetrics();
    if (isSwitchOn && I > 0) {
      flowOffset = (flowOffset + dt * Math.min(1.5, 0.12 + I * 0.16)) % 1;
    }

    const parent = canvas.parentElement;
    draw(parent?.clientWidth || 600, parent?.clientHeight || 360);
    animId = requestAnimationFrame(loop);
  }

  switchBtn.addEventListener('click', () => {
    isSwitchOn = !isSwitchOn;
    switchBtn.textContent = isSwitchOn ? 'Terhubung (ON)' : 'Terputus (OFF)';
    switchBtn.className = isSwitchOn ? 'btn btn-cyan btn-sm' : 'btn btn-danger-ghost btn-sm';
    syncOutputs();
  });

  voltageInput.addEventListener('input', syncOutputs);
  resistorInput.addEventListener('input', syncOutputs);

  syncOutputs();
  resizeCanvas();
  animId = requestAnimationFrame(loop);

  return {
    resize: resizeCanvas,
    stop: () => {
      if (animId) cancelAnimationFrame(animId);
    },
  };
}
