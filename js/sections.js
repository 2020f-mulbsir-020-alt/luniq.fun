/**
 * Luniq Sections — toys, clouds, portals, playground, notes, dream loop
 */
const LuniqSections = (() => {
  let universeSeed = 1;
  let glitchInterval = null;
  let dreamInterval = null;

  const TOYS = [
    { icon: '🫧', label: 'bubble', surprise: '💫' },
    { icon: '🔮', label: 'crystal', surprise: '✨' },
    { icon: '🎪', label: 'circus', surprise: '🤹' },
    { icon: '🌀', label: 'vortex', surprise: '🌊' },
    { icon: '🧩', label: 'puzzle', surprise: '🎯' },
    { icon: '🎈', label: 'balloon', surprise: '🎉' },
    { icon: '🪐', label: 'orbit', surprise: '☄️' },
    { icon: '🎭', label: 'mask', surprise: '👻' },
    { icon: '🌈', label: 'prism', surprise: '🔆' },
    { icon: '🎲', label: 'dice', surprise: '🎰' },
    { icon: '🧸', label: 'plush', surprise: '💝' },
    { icon: '⚡', label: 'spark', surprise: '🌟' }
  ];

  const CLOUD_IDEAS = [
    { visual: '🌙', prompt: 'What if shadows had their own dreams?' },
    { visual: '🦋', prompt: 'Design a door that only opens when you laugh' },
    { visual: '🍄', prompt: 'A forest where trees grow upside-down' },
    { visual: '🎠', prompt: 'Music you can taste — what flavor is C major?' },
    { visual: '🫠', prompt: 'Gravity takes Sundays off' },
    { visual: '🔭', prompt: 'Telescope that shows yesterday instead of far away' },
    { visual: '🧃', prompt: 'Bottled thunderstorms for rainy moods' },
    { visual: '🪞', prompt: 'Mirror that reflects who you could become' },
    { visual: '🎐', prompt: 'Wind chimes that play memories, not notes' },
    { visual: '🛸', prompt: 'Aliens who collect lost socks' }
  ];

  const PORTAL_WORLDS = [
    {
      id: 'inverted',
      title: 'Inverted UI World',
      desc: 'Everything flips. Up is down. Clicks feel backwards.',
      class: 'portal-realm__world--inverted'
    },
    {
      id: 'gravity',
      title: 'Gravity Shift Space',
      desc: 'The floor gently tilts. Objects lean into the drift.',
      class: 'portal-realm__world--gravity'
    },
    {
      id: 'mirror',
      title: 'Color-Mirror Dimension',
      desc: 'Hues swap places. Violet becomes cyan. Orange becomes void.',
      class: 'portal-realm__world--mirror'
    },
    {
      id: 'pixel',
      title: 'Pixel Melting Zone',
      desc: 'Reality pixelates and drips. Nothing holds its shape.',
      class: 'portal-realm__world--pixel'
    }
  ];

  const NOTE_THOUGHTS = [
    'What if clouds were just sky thoughts?',
    'Idea: a clock that runs on curiosity',
    'Remember to invent something useless today',
    'The best toys are the ones that surprise themselves',
    'Whisper an idea to your left shoe',
    'Reality is just consensus hallucination with better graphics',
    'Build something that makes you giggle',
    'Every glitch is a portal in disguise',
    'Imagination has no undo button — perfect',
    'Today\'s mood: elastic purple',
    'Collect moments, not metrics',
    'The universe is a toy someone forgot to put away'
  ];

  const SPINNER_RESULTS = ['✦', '∞', '?', '☁', '◎', '✧', '◈', '☽', '✿', '△'];

  const MEMORY_SYMBOLS = ['◆', '◇', '○', '●', '△', '▽', '★', '☆'];

  const DREAM_FRAGMENTS = ['◯', '◎', '✧', '◇', '∿', '◈', '☁', '✦', '○', '△', '∞', '✿'];

  function seededRandom(seed) {
    const x = Math.sin(seed++) * 10000;
    return x - Math.floor(x);
  }

  /* ─── Toy Grid ─── */
  function buildToyGrid() {
    const grid = document.getElementById('toyGrid');
    if (!grid) return;

    grid.innerHTML = '';
    const shuffled = [...TOYS].sort(() => seededRandom(universeSeed + 1) - 0.5);

    shuffled.forEach((toy, i) => {
      const tile = document.createElement('div');
      tile.className = 'toy-tile';
      tile.setAttribute('role', 'listitem');
      tile.setAttribute('tabindex', '0');
      tile.style.setProperty('--delay', `${i * 0.3}s`);
      tile.style.setProperty('--tilt', `${(seededRandom(universeSeed + i) - 0.5) * 8}deg`);
      tile.innerHTML = `
        <span class="toy-tile__icon">${toy.icon}</span>
        <span class="toy-tile__label">${toy.label}</span>
        <span class="toy-tile__surprise">${toy.surprise}</span>
      `;

      const activate = () => {
        tile.classList.add('surprised');
        LuniqAudio.playBlip();
        setTimeout(() => tile.classList.remove('surprised'), 1200);
      };

      tile.addEventListener('click', activate);
      tile.addEventListener('keydown', e => {
        if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); activate(); }
      });

      tile.addEventListener('mousemove', e => {
        const rect = tile.getBoundingClientRect();
        tile.style.setProperty('--mx', `${((e.clientX - rect.left) / rect.width) * 100}%`);
        tile.style.setProperty('--my', `${((e.clientY - rect.top) / rect.height) * 100}%`);
      });

      grid.appendChild(tile);
    });

    startToyGlitch(grid);
  }

  function startToyGlitch(grid) {
    if (glitchInterval) clearInterval(glitchInterval);
    glitchInterval = setInterval(() => {
      const tiles = grid.querySelectorAll('.toy-tile');
      if (!tiles.length) return;
      const a = Math.floor(Math.random() * tiles.length);
      let b = Math.floor(Math.random() * tiles.length);
      while (b === a) b = Math.floor(Math.random() * tiles.length);

      const tileA = tiles[a];
      const tileB = tiles[b];

      tileA.classList.add('glitching');
      tileB.classList.add('glitching');

      const iconA = tileA.querySelector('.toy-tile__icon').textContent;
      const iconB = tileB.querySelector('.toy-tile__icon').textContent;
      tileA.querySelector('.toy-tile__icon').textContent = iconB;
      tileB.querySelector('.toy-tile__icon').textContent = iconA;

      setTimeout(() => {
        tileA.classList.remove('glitching');
        tileB.classList.remove('glitching');
      }, 300);
    }, 4000);
  }

  /* ─── Idea Clouds ─── */
  function buildClouds() {
    const field = document.getElementById('cloudField');
    if (!field) return;

    field.innerHTML = '';
    const shuffled = [...CLOUD_IDEAS].sort(() => seededRandom(universeSeed + 2) - 0.5);

    shuffled.forEach((idea, i) => {
      const cloud = document.createElement('div');
      cloud.className = 'idea-cloud';
      cloud.setAttribute('tabindex', '0');
      cloud.setAttribute('role', 'button');
      cloud.style.left = `${10 + seededRandom(universeSeed + i * 3) * 70}%`;
      cloud.style.top = `${5 + seededRandom(universeSeed + i * 5) * 75}%`;
      cloud.style.setProperty('--drift', `${i * 2}s`);
      cloud.style.setProperty('--drift-delay', `${-i * 1.5}s`);
      cloud.innerHTML = `
        <span class="idea-cloud__visual">${idea.visual}</span>
        <p class="idea-cloud__prompt">${idea.prompt}</p>
      `;

      const burst = () => {
        cloud.classList.add('bursting');
        burstParticles(cloud);
        LuniqAudio.playBurst();
        setTimeout(() => {
          cloud.classList.remove('bursting');
          cloud.style.left = `${10 + Math.random() * 70}%`;
          cloud.style.top = `${5 + Math.random() * 75}%`;
        }, 600);
      };

      cloud.addEventListener('click', burst);
      cloud.addEventListener('keydown', e => {
        if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); burst(); }
      });

      field.appendChild(cloud);
    });
  }

  function burstParticles(cloud) {
    const canvas = document.getElementById('cloudParticles');
    if (!canvas) return;
    const rect = cloud.getBoundingClientRect();
    const section = cloud.closest('.section--clouds');
    if (!section) return;

    const ctx = canvas.getContext('2d');
    const sectionRect = section.getBoundingClientRect();
    const px = rect.left + rect.width / 2 - sectionRect.left;
    const py = rect.top + rect.height / 2 - sectionRect.top;

    const particles = Array.from({ length: 30 }, () => ({
      x: px, y: py,
      vx: (Math.random() - 0.5) * 8,
      vy: (Math.random() - 0.5) * 8,
      life: 1,
      color: ['#7C4DFF', '#00E5FF', '#FFB74D', '#F4F6FF'][Math.floor(Math.random() * 4)]
    }));

    let frame = 0;
    function anim() {
      frame++;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach(p => {
        p.x += p.vx;
        p.y += p.vy;
        p.life -= 0.02;
        if (p.life <= 0) return;
        ctx.globalAlpha = p.life;
        ctx.fillStyle = p.color;
        ctx.beginPath();
        ctx.arc(p.x, p.y, 3 + p.life * 2, 0, Math.PI * 2);
        ctx.fill();
      });
      if (frame < 40) requestAnimationFrame(anim);
      else ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
    resizeCloudCanvas();
    anim();
  }

  function resizeCloudCanvas() {
    const canvas = document.getElementById('cloudParticles');
    const section = canvas?.closest('.section--clouds');
    if (!canvas || !section) return;
    canvas.width = section.offsetWidth;
    canvas.height = section.offsetHeight;
  }

  /* ─── Portals ─── */
  function buildPortals() {
    const space = document.getElementById('portalSpace');
    const realm = document.getElementById('portalRealm');
    if (!space || !realm) return;

    space.querySelectorAll('.portal').forEach(p => p.remove());

    PORTAL_WORLDS.forEach((world, i) => {
      const portal = document.createElement('button');
      portal.className = 'portal';
      portal.setAttribute('aria-label', `Enter ${world.title}`);
      portal.style.left = `${15 + seededRandom(universeSeed + i * 7) * 65}%`;
      portal.style.top = `${10 + seededRandom(universeSeed + i * 11) * 60}%`;
      portal.style.setProperty('--portal-delay', `${i * 0.8}s`);
      portal.style.setProperty('--portal-angle', `${i * 90}deg`);

      portal.addEventListener('click', () => enterPortal(world, realm));
      space.appendChild(portal);
    });

    spawnRandomPortal(space);
  }

  function spawnRandomPortal(space) {
    setInterval(() => {
      if (space.querySelectorAll('.portal').length >= 6) return;
      const portal = document.createElement('button');
      portal.className = 'portal';
      portal.setAttribute('aria-label', 'Random portal');
      portal.style.left = `${Math.random() * 80}%`;
      portal.style.top = `${Math.random() * 70}%`;
      portal.style.opacity = '0';
      portal.style.transition = 'opacity 0.5s';

      const world = PORTAL_WORLDS[Math.floor(Math.random() * PORTAL_WORLDS.length)];
      portal.addEventListener('click', () => {
        const realm = document.getElementById('portalRealm');
        enterPortal(world, realm);
      });

      space.appendChild(portal);
      requestAnimationFrame(() => { portal.style.opacity = '1'; });

      setTimeout(() => {
        portal.style.opacity = '0';
        setTimeout(() => portal.remove(), 500);
      }, 8000);
    }, 6000);
  }

  function enterPortal(world, realm) {
    document.body.classList.add('portal-active');
    LuniqAudio.playGlitchHarmonic();

    realm.innerHTML = `
      <div class="portal-realm__world ${world.class}">
        <h3 class="portal-realm__title">${world.title}</h3>
        <p class="portal-realm__desc">${world.desc}</p>
        <button class="portal-realm__exit">Return to void</button>
      </div>
    `;
    realm.classList.add('active');

    realm.querySelector('.portal-realm__exit').addEventListener('click', () => exitPortal(realm));
    document.addEventListener('keydown', function esc(e) {
      if (e.key === 'Escape') { exitPortal(realm); document.removeEventListener('keydown', esc); }
    });
  }

  function exitPortal(realm) {
    realm.classList.remove('active');
    document.body.classList.remove('portal-active');
    setTimeout(() => {
      realm.innerHTML = '<p class="portal-realm__hint">Step through a portal…</p>';
    }, 500);
    LuniqAudio.playAmbientPulse();
  }

  /* ─── Playground ─── */
  function initPlayground() {
    initRhythm();
    initColorFlip();
    initSpinner();
    initChaos();
    initMemory();
  }

  function initRhythm() {
    const pads = document.querySelectorAll('.rhythm-pad');
    const scoreEl = document.getElementById('rhythmScore');
    let score = 0;
    let sequence = [];
    let step = 0;
    let playerTurn = false;

    function lightPad(idx) {
      pads[idx]?.classList.add('active');
      LuniqAudio.playTone(idx, 0.2);
      setTimeout(() => pads[idx]?.classList.remove('active'), 300);
    }

    function playSequence() {
      playerTurn = false;
      step = 0;
      let i = 0;
      const interval = setInterval(() => {
        if (i >= sequence.length) {
          clearInterval(interval);
          playerTurn = true;
          return;
        }
        lightPad(sequence[i]);
        i++;
      }, 500);
    }

    function addStep() {
      sequence.push(Math.floor(Math.random() * 4));
      setTimeout(playSequence, 600);
    }

    pads.forEach(pad => {
      pad.addEventListener('click', () => {
        const idx = parseInt(pad.dataset.pad, 10);
        lightPad(idx);
        if (!playerTurn) return;

        if (sequence[step] === idx) {
          step++;
          if (step === sequence.length) {
            score++;
            if (scoreEl) scoreEl.textContent = score;
            setTimeout(addStep, 800);
          }
        } else {
          score = 0;
          step = 0;
          if (scoreEl) scoreEl.textContent = '0';
          sequence = [Math.floor(Math.random() * 4)];
          playerTurn = false;
          setTimeout(playSequence, 1000);
        }
      });
    });

    sequence = [Math.floor(Math.random() * 4)];
    setTimeout(playSequence, 1000);
  }

  function initColorFlip() {
    const board = document.getElementById('flipBoard');
    const inner = document.getElementById('flipInner');
    const streakEl = document.getElementById('flipStreak');
    const colors = ['#7C4DFF', '#00E5FF', '#FFB74D', '#FF6B9D', '#64FFC8', '#F4F6FF'];
    let current = 0;
    let target = Math.floor(Math.random() * colors.length);
    let streak = 0;

    if (inner) inner.style.background = colors[current];

    board?.addEventListener('click', () => {
      current = (current + 1) % colors.length;
      if (inner) {
        inner.style.background = colors[current];
        inner.style.transform = `rotateY(${current * 90}deg)`;
      }
      LuniqAudio.playTone(current % 6, 0.15, 'triangle');

      if (current === target) {
        streak++;
        if (streakEl) streakEl.textContent = `streak: ${streak}`;
        target = Math.floor(Math.random() * colors.length);
        LuniqAudio.playBurst();
      } else {
        streak = 0;
        if (streakEl) streakEl.textContent = 'streak: 0';
      }
    });
  }

  function initSpinner() {
    const wheel = document.getElementById('spinnerWheel');
    const label = document.getElementById('spinnerLabel');

    wheel?.addEventListener('click', () => {
      if (wheel.classList.contains('spinning')) return;
      wheel.classList.add('spinning');
      LuniqAudio.playGlitchHarmonic();

      const result = SPINNER_RESULTS[Math.floor(Math.random() * SPINNER_RESULTS.length)];
      setTimeout(() => {
        if (label) label.textContent = result;
        wheel.classList.remove('spinning');
        LuniqAudio.playTone(Math.floor(Math.random() * 6), 0.4);
      }, 2000);
    });
  }

  function initChaos() {
    const btn = document.getElementById('chaosBtn');
    let count = 0;

    btn?.addEventListener('click', () => {
      count += Math.floor(Math.random() * 5) + 1;
      btn.textContent = count;
      btn.classList.add('shake');
      LuniqAudio.playBlip();
      setTimeout(() => btn.classList.remove('shake'), 300);

      if (count % 10 === 0) LuniqAudio.playBurst();
    });
  }

  function initMemory() {
    const grid = document.getElementById('memoryGrid');
    if (!grid) return;

    const pairs = MEMORY_SYMBOLS.slice(0, 6);
    const cards = [...pairs, ...pairs].sort(() => Math.random() - 0.5);
    let flipped = [];
    let matched = 0;

    grid.innerHTML = '';
    cards.forEach((sym, i) => {
      const tile = document.createElement('button');
      tile.className = 'memory-tile';
      tile.setAttribute('aria-label', 'Memory tile');
      tile.dataset.symbol = sym;
      tile.dataset.index = i;
      tile.textContent = '?';

      tile.addEventListener('click', () => {
        if (flipped.length >= 2 || tile.classList.contains('revealed') || tile.classList.contains('matched')) return;

        tile.classList.add('revealed');
        tile.textContent = sym;
        flipped.push(tile);
        LuniqAudio.playTone(flipped.length, 0.15);

        if (flipped.length === 2) {
          const [a, b] = flipped;
          if (a.dataset.symbol === b.dataset.symbol) {
            a.classList.add('matched');
            b.classList.add('matched');
            matched += 2;
            flipped = [];
            LuniqAudio.playBurst();
            if (matched === cards.length) {
              setTimeout(() => initMemory(), 1500);
            }
          } else {
            setTimeout(() => {
              a.classList.remove('revealed');
              b.classList.remove('revealed');
              a.textContent = '?';
              b.textContent = '?';
              a.classList.add('phantom');
              b.classList.add('phantom');
              setTimeout(() => {
                a.classList.remove('phantom');
                b.classList.remove('phantom');
              }, 1000);
              flipped = [];
            }, 800);
          }
        }
      });

      grid.appendChild(tile);
    });
  }

  /* ─── Sticky Notes ─── */
  function buildNotes() {
    const realm = document.getElementById('noteRealm');
    if (!realm) return;

    realm.innerHTML = '';
    const colors = ['violet', 'cyan', 'orange', 'pink', 'mint'];
    const shuffled = [...NOTE_THOUGHTS].sort(() => seededRandom(universeSeed + 3) - 0.5);

    shuffled.forEach((thought, i) => {
      const note = document.createElement('div');
      note.className = `sticky-note sticky-note--${colors[i % colors.length]}`;
      note.setAttribute('tabindex', '0');
      note.textContent = thought;
      note.style.left = `${seededRandom(universeSeed + i * 13) * 65}%`;
      note.style.top = `${seededRandom(universeSeed + i * 17) * 55}%`;
      note.style.setProperty('--note-rot', `${(seededRandom(universeSeed + i) - 0.5) * 12}deg`);
      note.style.setProperty('--note-drift', `${i * 1.5}s`);
      note.style.setProperty('--note-delay', `${-i}s`);
      note.style.zIndex = i;

      makeDraggable(note, realm);
      note.addEventListener('click', () => LuniqAudio.playTone(i % 6, 0.2, 'triangle'));

      realm.appendChild(note);
    });
  }

  function makeDraggable(el, container) {
    let isDragging = false;
    let startX, startY, origLeft, origTop;

    const onStart = (e) => {
      isDragging = true;
      const point = e.touches ? e.touches[0] : e;
      startX = point.clientX;
      startY = point.clientY;
      origLeft = parseFloat(el.style.left) || 0;
      origTop = parseFloat(el.style.top) || 0;
      el.style.animationPlayState = 'paused';
      el.style.zIndex = 100;
    };

    const onMove = (e) => {
      if (!isDragging) return;
      const point = e.touches ? e.touches[0] : e;
      const dx = point.clientX - startX;
      const dy = point.clientY - startY;
      const containerRect = container.getBoundingClientRect();
      const newLeft = origLeft + (dx / containerRect.width) * 100;
      const newTop = origTop + (dy / containerRect.height) * 100;
      el.style.left = `${Math.max(0, Math.min(80, newLeft))}%`;
      el.style.top = `${Math.max(0, Math.min(75, newTop))}%`;
    };

    const onEnd = () => {
      isDragging = false;
      el.style.animationPlayState = '';
      el.style.zIndex = '';
    };

    el.addEventListener('mousedown', onStart);
    el.addEventListener('touchstart', onStart, { passive: true });
    window.addEventListener('mousemove', onMove);
    window.addEventListener('touchmove', onMove, { passive: true });
    window.addEventListener('mouseup', onEnd);
    window.addEventListener('touchend', onEnd);
  }

  /* ─── Dream Loop ─── */
  function buildDreamLoop() {
    const container = document.getElementById('dreamFragments');
    if (!container) return;

    container.innerHTML = '';
    const count = 15 + Math.floor(seededRandom(universeSeed) * 10);

    for (let i = 0; i < count; i++) {
      const frag = document.createElement('span');
      frag.className = 'dream-fragment';
      frag.textContent = DREAM_FRAGMENTS[i % DREAM_FRAGMENTS.length];
      frag.style.left = `${seededRandom(universeSeed + i * 19) * 90}%`;
      frag.style.top = `${seededRandom(universeSeed + i * 23) * 85}%`;
      frag.style.setProperty('--frag-speed', `${i * 0.8}s`);
      frag.style.setProperty('--frag-delay', `${-i * 0.5}s`);
      frag.style.fontSize = `${1 + seededRandom(universeSeed + i) * 2}rem`;
      container.appendChild(frag);
    }

    if (dreamInterval) clearInterval(dreamInterval);
    dreamInterval = setInterval(() => {
      const frags = container.querySelectorAll('.dream-fragment');
      const idx = Math.floor(Math.random() * frags.length);
      if (frags[idx]) {
        frags[idx].textContent = DREAM_FRAGMENTS[Math.floor(Math.random() * DREAM_FRAGMENTS.length)];
        frags[idx].style.opacity = Math.random() * 0.5 + 0.3;
      }
    }, 2000);
  }

  /* ─── Sound Orbs ─── */
  function initSoundOrbs() {
    document.querySelectorAll('.sound-orb').forEach(orb => {
      const play = () => {
        const tone = parseInt(orb.dataset.tone);
        orb.classList.add('playing');
        LuniqAudio.playTone(tone, 0.5, ['sine', 'triangle', 'sawtooth'][tone % 3]);
        setTimeout(() => orb.classList.remove('playing'), 500);
      };
      orb.addEventListener('click', play);
      orb.addEventListener('keydown', e => {
        if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); play(); }
      });
    });
  }

  /* ─── Distortion Field ─── */
  function initDistortion() {
    const content = document.getElementById('distortionContent');
    if (!content) return;

    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        content.classList.add('distorting');
      }
    }, { threshold: 0.3 });

    observer.observe(content);
  }

  /* ─── Init & Reset ─── */
  function init() {
    buildToyGrid();
    buildClouds();
    buildPortals();
    initPlayground();
    buildNotes();
    buildDreamLoop();
    initSoundOrbs();
    initDistortion();
    resizeCloudCanvas();
    window.addEventListener('resize', resizeCloudCanvas);
  }

  function respin() {
    universeSeed = Math.floor(Math.random() * 10000);
    document.documentElement.style.setProperty('--universe-seed', universeSeed);
    buildToyGrid();
    buildClouds();
    buildPortals();
    buildNotes();
    buildDreamLoop();
    initMemory();
  }

  return { init, respin };
})();

window.LuniqSections = LuniqSections;
