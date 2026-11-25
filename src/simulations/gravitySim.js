export function createGravitySimulator(elements) {
  const {
    canvas,
    heightInput,
    gravitySelect,
    massInput,
    heightValEl,
    gravityValEl,
    massValEl,
    outTimeEl,
    outVelEl,
    outEkEl,
    startBtn,
    resetBtn,
  } = elements;

  const ctx = canvas.getContext('2d');
  let animId = null;
  let isFalling = false;
  let hasLanded = false;
  let elapsed = 0;
  let currentDropMeters = 0;
  let lastTimestamp = 0;

  function getParams() {
    return {
      heightM: parseFloat(heightInput.value) || 50,
      gravity: parseFloat(gravitySelect.value) || 9.8,
      mass: parseFloat(massInput.value) || 5,
    };
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

  function syncLabels() {
    const { heightM, mass } = getParams();
    heightValEl.textContent = `${heightM} m`;
    massValEl.textContent = `${mass} kg`;
    const opt = gravitySelect.options[gravitySelect.selectedIndex];
    if (opt) gravityValEl.textContent = opt.textContent;
  }

  function draw(w, h) {
    const { heightM, gravity, mass } = getParams();
    ctx.clearRect(0, 0, w, h);

    const topMargin = 28;
    const groundHeight = 36;
    const groundY = h - groundHeight;
    const maxScaleM = 100;
    const usableHeight = Math.max(120, groundY - topMargin);
    const pxPerMeter = usableHeight / maxScaleM;

    // Grid & Calibrated Meter Ruler
    ctx.strokeStyle = '#172238';
    ctx.lineWidth = 1;
    for (let x = 0; x < w; x += 48) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, groundY);
      ctx.stroke();
    }

    ctx.font = '11px "IBM Plex Mono", monospace';
    for (let m = 0; m <= maxScaleM; m += 20) {
      const y = groundY - m * pxPerMeter;
      ctx.strokeStyle = m === heightM ? '#38bdf8' : '#1e293b';
      ctx.beginPath();
      ctx.moveTo(46, y);
      ctx.lineTo(w - 16, y);
      ctx.stroke();

      ctx.fillStyle = '#94a3b8';
      ctx.fillText(`${m}m`, 8, y + 4);
    }

    // Drop Height Guide Line
    const startY = groundY - heightM * pxPerMeter;
    ctx.save();
    ctx.setLineDash([5, 5]);
    ctx.strokeStyle = 'rgba(56, 189, 248, 0.5)';
    ctx.beginPath();
    ctx.moveTo(46, startY);
    ctx.lineTo(w - 16, startY);
    ctx.stroke();
    ctx.restore();

    ctx.fillStyle = '#38bdf8';
    ctx.fillText(`h₀ = ${heightM} m`, w - 96, startY - 6);

    // Ground Surface
    ctx.fillStyle = '#064e3b';
    ctx.fillRect(0, groundY, w, groundHeight);
    ctx.strokeStyle = '#10b981';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(0, groundY);
    ctx.lineTo(w, groundY);
    ctx.stroke();

    // Ball position
    const radius = 10 + Math.min(mass, 50) * 0.28;
    const remainingM = Math.max(0, heightM - currentDropMeters);
    const ballCenterY = Math.min(groundY - radius, groundY - remainingM * pxPerMeter);
    const ballX = w * 0.52;

    // Shadow on ground
    const heightRatio = Math.max(0.2, 1 - remainingM / maxScaleM);
    ctx.fillStyle = 'rgba(0, 0, 0, 0.35)';
    ctx.beginPath();
    ctx.ellipse(ballX, groundY + 6, radius * heightRatio, 4, 0, 0, Math.PI * 2);
    ctx.fill();

    // Ball body
    ctx.beginPath();
    ctx.arc(ballX, ballCenterY, radius, 0, Math.PI * 2);
    ctx.fillStyle = hasLanded ? '#10b981' : '#6366f1';
    ctx.fill();
    ctx.strokeStyle = '#e2e8f0';
    ctx.lineWidth = 1.5;
    ctx.stroke();

    // Velocity vector & readout beside ball
    const vNow = hasLanded ? gravity * Math.sqrt((2 * heightM) / gravity) : gravity * elapsed;
    ctx.fillStyle = '#f1f5f9';
    ctx.fillText(`${mass} kg · v=${vNow.toFixed(1)} m/s`, ballX + radius + 12, ballCenterY + 4);
  }

  function updateTelemetry(t, v, ek) {
    outTimeEl.textContent = `${t.toFixed(2)} s`;
    outVelEl.textContent = `${v.toFixed(2)} m/s`;
    outEkEl.textContent = `${ek.toFixed(1)} J`;
  }

  function step(timestamp) {
    if (!isFalling) return;
    if (!lastTimestamp) lastTimestamp = timestamp;
    const dt = Math.min(0.05, (timestamp - lastTimestamp) / 1000);
    lastTimestamp = timestamp;

    const { heightM, gravity, mass } = getParams();
    elapsed += dt;
    currentDropMeters = 0.5 * gravity * elapsed * elapsed;

    const totalFallTime = Math.sqrt((2 * heightM) / gravity);
    if (elapsed >= totalFallTime || currentDropMeters >= heightM) {
      elapsed = totalFallTime;
      currentDropMeters = heightM;
      isFalling = false;
      hasLanded = true;
      startBtn.disabled = false;

      const finalVel = gravity * totalFallTime;
      const finalEk = 0.5 * mass * finalVel * finalVel;
      updateTelemetry(totalFallTime, finalVel, finalEk);
    } else {
      const currentVel = gravity * elapsed;
      const currentEk = 0.5 * mass * currentVel * currentVel;
      updateTelemetry(elapsed, currentVel, currentEk);
      animId = requestAnimationFrame(step);
    }

    const parent = canvas.parentElement;
    draw(parent?.clientWidth || 600, parent?.clientHeight || 360);
  }

  function start() {
    if (isFalling) return;
    elapsed = 0;
    currentDropMeters = 0;
    hasLanded = false;
    isFalling = true;
    lastTimestamp = 0;
    startBtn.disabled = true;
    animId = requestAnimationFrame(step);
  }

  function reset() {
    isFalling = false;
    hasLanded = false;
    elapsed = 0;
    currentDropMeters = 0;
    lastTimestamp = 0;
    startBtn.disabled = false;
    if (animId) cancelAnimationFrame(animId);
    updateTelemetry(0, 0, 0);
    resizeCanvas();
  }

  function onParamChange() {
    syncLabels();
    if (!isFalling) {
      hasLanded = false;
      currentDropMeters = 0;
      elapsed = 0;
      updateTelemetry(0, 0, 0);
      resizeCanvas();
    }
  }

  heightInput.addEventListener('input', onParamChange);
  massInput.addEventListener('input', onParamChange);
  gravitySelect.addEventListener('change', onParamChange);
  startBtn.addEventListener('click', start);
  resetBtn.addEventListener('click', reset);

  syncLabels();
  resizeCanvas();

  return {
    resize: resizeCanvas,
    stop: () => {
      isFalling = false;
      if (animId) cancelAnimationFrame(animId);
    },
  };
}
