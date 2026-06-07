/**
 * Luniq Main — navigation, ambient canvas, spin reset, global interactions
 */
(function () {
  'use strict';

  const NAV_POSITIONS = [
    { top: '18%', left: '12%' },
    { top: '25%', right: '15%' },
    { top: '45%', left: '8%' },
    { top: '55%', right: '10%' },
    { top: '72%', left: '20%' },
    { top: '80%', right: '18%' }
  ];

  let ambientCanvas, ambientCtx;
  let ambientParticles = [];
  let ambientAnimId = null;

  function init() {
    initCubeNav();
    initAmbientCanvas();
    initGlobalSound();
    initSpinCore();

    LuniqOrb.init();
    LuniqSections.init();

    document.addEventListener('click', onFirstInteraction, { once: true });
    document.addEventListener('touchstart', onFirstInteraction, { once: true });
  }

  function onFirstInteraction() {
    LuniqAudio.init();
  }

  /* ─── Cube Navigation ─── */
  function initCubeNav() {
    const trigger = document.getElementById('cubeTrigger');
    const labels = document.getElementById('cubeNavLabels');
    const shardsContainer = trigger?.querySelector('.cube-nav__shards');

    if (!trigger || !labels) return;

    const shardOffsets = [
      { top: '0', left: '0' }, { top: '0', right: '0' },
      { bottom: '0', left: '0' }, { bottom: '0', right: '0' },
      { top: '50%', left: '-20px' }, { bottom: '50%', right: '-20px' }
    ];

    shardOffsets.forEach((pos, i) => {
      const shard = document.createElement('span');
      shard.className = 'cube-nav__shard';
      Object.assign(shard.style, pos);
      shard.style.transitionDelay = `${i * 0.05}s`;
      if (pos.top === '50%') shard.style.marginTop = '-5px';
      if (pos.bottom === '50%') shard.style.marginBottom = '-5px';
      shardsContainer?.appendChild(shard);
    });

    trigger.addEventListener('click', () => {
      const expanded = trigger.getAttribute('aria-expanded') === 'true';
      trigger.setAttribute('aria-expanded', !expanded);

      if (!expanded) {
        labels.hidden = false;
        positionNavLabels(labels);
        LuniqAudio.playGlitchHarmonic();
      } else {
        closeNav(trigger, labels);
      }
    });

    labels.querySelectorAll('.cube-nav__label').forEach(link => {
      link.addEventListener('click', () => {
        setTimeout(() => closeNav(trigger, labels), 300);
        LuniqAudio.playBlip();
      });
    });

    document.addEventListener('click', e => {
      if (!trigger.contains(e.target) && !labels.contains(e.target)) {
        closeNav(trigger, labels);
      }
    });

    document.addEventListener('keydown', e => {
      if (e.key === 'Escape') closeNav(trigger, labels);
    });
  }

  function positionNavLabels(labels) {
    const links = labels.querySelectorAll('.cube-nav__label');
    links.forEach((link, i) => {
      const pos = NAV_POSITIONS[i % NAV_POSITIONS.length];
      Object.keys(pos).forEach(key => {
        link.style[key] = pos[key];
        if (key === 'left' || key === 'right') {
          link.style.top = pos.top || 'auto';
          link.style.bottom = pos.bottom || 'auto';
        }
      });
      link.style.transitionDelay = `${i * 0.08}s`;
    });
  }

  function closeNav(trigger, labels) {
    trigger.setAttribute('aria-expanded', 'false');
    labels.hidden = true;
  }

  /* ─── Ambient Background Canvas ─── */
  function initAmbientCanvas() {
    ambientCanvas = document.getElementById('ambientCanvas');
    if (!ambientCanvas) return;

    ambientCtx = ambientCanvas.getContext('2d');
    resizeAmbient();
    window.addEventListener('resize', resizeAmbient);

    for (let i = 0; i < 40; i++) {
      ambientParticles.push({
        x: Math.random(),
        y: Math.random(),
        size: Math.random() * 2 + 0.5,
        speed: Math.random() * 0.0003 + 0.0001,
        alpha: Math.random() * 0.3 + 0.1
      });
    }

    if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      animateAmbient();
    }
  }

  function resizeAmbient() {
    if (!ambientCanvas) return;
    ambientCanvas.width = window.innerWidth;
    ambientCanvas.height = window.innerHeight;
  }

  function animateAmbient() {
    const w = ambientCanvas.width;
    const h = ambientCanvas.height;
    ambientCtx.clearRect(0, 0, w, h);

    ambientParticles.forEach(p => {
      p.y -= p.speed;
      if (p.y < 0) p.y = 1;

      ambientCtx.globalAlpha = p.alpha;
      ambientCtx.fillStyle = Math.random() > 0.5 ? '#7C4DFF' : '#00E5FF';
      ambientCtx.beginPath();
      ambientCtx.arc(p.x * w, p.y * h, p.size, 0, Math.PI * 2);
      ambientCtx.fill();
    });

    ambientAnimId = requestAnimationFrame(animateAmbient);
  }

  /* ─── Global Touch Sounds ─── */
  function initGlobalSound() {
    const interactiveSelectors = [
      '.toy-tile', '.idea-cloud', '.portal', '.playground-toy',
      '.sticky-note', '.spin-core__btn', '.cube-nav__trigger'
    ];

    document.addEventListener('click', e => {
      const isSoundOrb = e.target.closest('.sound-orb');
      if (isSoundOrb) return;

      const isInteractive = interactiveSelectors.some(sel => e.target.closest(sel));
      if (isInteractive) return;

      if (Math.random() > 0.7) {
        LuniqAudio.playAmbientPulse();
      }
    });
  }

  /* ─── Spin Core Reset ─── */
  function initSpinCore() {
    const btn = document.getElementById('spinBtn');
    const universe = document.getElementById('luniqUniverse');

    btn?.addEventListener('click', () => {
      if (universe.classList.contains('respinning')) return;

      btn.classList.add('spinning');
      universe.classList.add('respinning');
      LuniqAudio.playGlitchHarmonic();

      setTimeout(() => LuniqAudio.playBurst(), 400);

      LuniqSections.respin();
      LuniqOrb.reset();

      const hues = [
        { violet: '#7C4DFF', cyan: '#00E5FF', orange: '#FFB74D' },
        { violet: '#9C27B0', cyan: '#18FFFF', orange: '#FFAB40' },
        { violet: '#651FFF', cyan: '#40C4FF', orange: '#FFD54F' },
        { violet: '#AA00FF', cyan: '#00B8D4', orange: '#FF8A65' }
      ];
      const palette = hues[Math.floor(Math.random() * hues.length)];
      document.documentElement.style.setProperty('--dream-violet', palette.violet);
      document.documentElement.style.setProperty('--liquid-cyan', palette.cyan);
      document.documentElement.style.setProperty('--soft-flame', palette.orange);

      setTimeout(() => {
        universe.classList.remove('respinning');
        btn.classList.remove('spinning');
        LuniqAudio.playTone(Math.floor(Math.random() * 6), 0.6);
      }, 1200);
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
