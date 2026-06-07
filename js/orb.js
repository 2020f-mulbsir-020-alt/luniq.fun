/**
 * Floating Reality Core — morphing orb canvas
 * Liquid → Cube → Smoke → Pixel dust
 */
const LuniqOrb = (() => {
  let canvas, ctx;
  let width, height, cx, cy;
  let scrollProgress = 0;
  let mouseX = 0.5, mouseY = 0.5;
  let time = 0;
  let particles = [];
  let animId = null;
  let reducedMotion = false;

  const MODES = ['liquid', 'cube', 'smoke', 'pixel'];
  let currentMode = 0;
  let modeBlend = 0;

  function init() {
    canvas = document.getElementById('orbCanvas');
    if (!canvas) return;

    ctx = canvas.getContext('2d');
    reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    resize();
    window.addEventListener('resize', resize);
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('mousemove', onMouse, { passive: true });
    window.addEventListener('touchmove', onTouch, { passive: true });

    if (!reducedMotion) {
      animate();
    } else {
      drawStatic();
    }
  }

  function resize() {
    width = canvas.width = canvas.offsetWidth * devicePixelRatio;
    height = canvas.height = canvas.offsetHeight * devicePixelRatio;
    cx = width / 2;
    cy = height / 2;
    ctx.setTransform(devicePixelRatio, 0, 0, devicePixelRatio, 0, 0);
  }

  function onScroll() {
    const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
    scrollProgress = maxScroll > 0 ? window.scrollY / maxScroll : 0;
    currentMode = Math.min(3, Math.floor(scrollProgress * 4));
    modeBlend = (scrollProgress * 4) % 1;
  }

  function onMouse(e) {
    mouseX = e.clientX / window.innerWidth;
    mouseY = e.clientY / window.innerHeight;
  }

  function onTouch(e) {
    if (e.touches.length) {
      mouseX = e.touches[0].clientX / window.innerWidth;
      mouseY = e.touches[0].clientY / window.innerHeight;
    }
  }

  function getOrbRadius() {
    const base = Math.min(canvas.offsetWidth, canvas.offsetHeight) * 0.18;
    const pulse = Math.sin(time * 0.002) * 8;
    const scrollInfluence = scrollProgress * 20;
    return base + pulse + scrollInfluence;
  }

  function drawLiquid(r, w, h) {
    const points = 64;
    ctx.beginPath();
    for (let i = 0; i <= points; i++) {
      const angle = (i / points) * Math.PI * 2;
      const wobble = Math.sin(angle * 3 + time * 0.003) * 12
        + Math.cos(angle * 5 + time * 0.002) * 8
        + (mouseX - 0.5) * 30 * Math.sin(angle);
      const px = w / 2 + Math.cos(angle) * (r + wobble);
      const py = h / 2 + Math.sin(angle) * (r + wobble * 0.8);
      i === 0 ? ctx.moveTo(px, py) : ctx.lineTo(px, py);
    }
    ctx.closePath();

    const grad = ctx.createRadialGradient(w / 2, h / 2, 0, w / 2, h / 2, r * 1.5);
    grad.addColorStop(0, 'rgba(124, 77, 255, 0.9)');
    grad.addColorStop(0.5, 'rgba(0, 229, 255, 0.5)');
    grad.addColorStop(1, 'rgba(124, 77, 255, 0)');
    ctx.fillStyle = grad;
    ctx.fill();

    ctx.shadowColor = 'rgba(0, 229, 255, 0.6)';
    ctx.shadowBlur = 40;
    ctx.strokeStyle = 'rgba(0, 229, 255, 0.3)';
    ctx.lineWidth = 2;
    ctx.stroke();
    ctx.shadowBlur = 0;
  }

  function drawCube(r, w, h) {
    const size = r * 1.4;
    const rot = time * 0.001 + mouseX * 0.5;
    const tilt = (mouseY - 0.5) * 0.4;

    ctx.save();
    ctx.translate(w / 2, h / 2);
    ctx.rotate(rot);
    ctx.transform(1, tilt * 0.3, tilt * 0.2, 1, 0, 0);

    const faces = [
      { x: -size / 2, y: -size / 2, w: size, h: size, color: 'rgba(124, 77, 255, 0.7)' },
    ];

    ctx.fillStyle = faces[0].color;
    ctx.fillRect(-size / 2, -size / 2, size, size);

    ctx.strokeStyle = 'rgba(0, 229, 255, 0.6)';
    ctx.lineWidth = 2;
    ctx.strokeRect(-size / 2, -size / 2, size, size);

    const offset = size * 0.3;
    ctx.fillStyle = 'rgba(0, 229, 255, 0.3)';
    ctx.beginPath();
    ctx.moveTo(size / 2, -size / 2);
    ctx.lineTo(size / 2 + offset, -size / 2 - offset);
    ctx.lineTo(-size / 2 + offset, -size / 2 - offset);
    ctx.lineTo(-size / 2, -size / 2);
    ctx.fill();

    ctx.fillStyle = 'rgba(255, 183, 77, 0.25)';
    ctx.beginPath();
    ctx.moveTo(size / 2, -size / 2);
    ctx.lineTo(size / 2 + offset, -size / 2 - offset);
    ctx.lineTo(size / 2 + offset, size / 2 - offset);
    ctx.lineTo(size / 2, size / 2);
    ctx.fill();

    ctx.shadowColor = 'rgba(124, 77, 255, 0.5)';
    ctx.shadowBlur = 30;
    ctx.restore();
    ctx.shadowBlur = 0;
  }

  function drawSmoke(r, w, h) {
    if (particles.length < 80) {
      for (let i = 0; i < 5; i++) {
        particles.push({
          x: w / 2 + (Math.random() - 0.5) * r,
          y: h / 2 + (Math.random() - 0.5) * r,
          vx: (Math.random() - 0.5) * 0.5,
          vy: -Math.random() * 1.5 - 0.5,
          life: 1,
          size: Math.random() * 20 + 10
        });
      }
    }

    particles.forEach(p => {
      p.x += p.vx + (mouseX - 0.5) * 0.3;
      p.y += p.vy;
      p.life -= 0.008;
      p.size *= 1.005;

      if (p.life <= 0) return;

      const alpha = p.life * 0.4;
      const grad = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.size);
      grad.addColorStop(0, `rgba(124, 77, 255, ${alpha})`);
      grad.addColorStop(0.5, `rgba(0, 229, 255, ${alpha * 0.5})`);
      grad.addColorStop(1, 'rgba(124, 77, 255, 0)');
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fill();
    });

    particles = particles.filter(p => p.life > 0);
  }

  function drawPixel(r, w, h) {
    const gridSize = 8;
    const cellSize = (r * 2) / gridSize;
    const offsetX = w / 2 - r;
    const offsetY = h / 2 - r;

    for (let row = 0; row < gridSize; row++) {
      for (let col = 0; col < gridSize; col++) {
        const dist = Math.hypot(col - gridSize / 2, row - gridSize / 2);
        if (dist > gridSize / 2) continue;

        const flicker = Math.sin(time * 0.01 + col + row) > 0.3 ? 1 : 0.3;
        const colors = [
          `rgba(124, 77, 255, ${flicker})`,
          `rgba(0, 229, 255, ${flicker})`,
          `rgba(255, 183, 77, ${flicker})`,
          `rgba(244, 246, 255, ${flicker * 0.5})`
        ];
        const ci = (col + row + Math.floor(time * 0.005)) % colors.length;

        const scatter = Math.sin(time * 0.003 + col * row) * 3;
        ctx.fillStyle = colors[ci];
        ctx.fillRect(
          offsetX + col * cellSize + scatter,
          offsetY + row * cellSize + scatter,
          cellSize - 2,
          cellSize - 2
        );
      }
    }
  }

  function drawOrb(w, h) {
    const r = getOrbRadius();
    const mode = scrollProgress;
    const m1 = Math.floor(mode * 4) % 4;
    const m2 = (m1 + 1) % 4;
    const blend = (mode * 4) % 1;

    ctx.globalAlpha = 1 - blend;
    drawByMode(MODES[m1], r, w, h);
    ctx.globalAlpha = blend;
    drawByMode(MODES[m2], r, w, h);
    ctx.globalAlpha = 1;
  }

  function drawByMode(mode, r, w, h) {
    switch (mode) {
      case 'liquid': drawLiquid(r, w, h); break;
      case 'cube': drawCube(r, w, h); break;
      case 'smoke': drawSmoke(r, w, h); break;
      case 'pixel': drawPixel(r, w, h); break;
    }
  }

  function drawAmbient(w, h) {
    const grad = ctx.createRadialGradient(
      mouseX * w, mouseY * h, 0,
      w / 2, h / 2, Math.max(w, h) * 0.6
    );
    grad.addColorStop(0, 'rgba(0, 229, 255, 0.03)');
    grad.addColorStop(1, 'rgba(11, 12, 16, 0)');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, w, h);
  }

  function drawStatic() {
    const w = canvas.offsetWidth;
    const h = canvas.offsetHeight;
    ctx.clearRect(0, 0, w, h);
    drawAmbient(w, h);
    drawLiquid(getOrbRadius(), w, h);
  }

  function animate() {
    time++;
    const w = canvas.offsetWidth;
    const h = canvas.offsetHeight;
    ctx.clearRect(0, 0, w, h);
    drawAmbient(w, h);
    drawOrb(w, h);
    animId = requestAnimationFrame(animate);
  }

  function reset() {
    particles = [];
    scrollProgress = 0;
    currentMode = 0;
    time = 0;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  return { init, reset };
})();

window.LuniqOrb = LuniqOrb;
