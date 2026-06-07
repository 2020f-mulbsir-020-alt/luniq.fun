/**
 * Luniq Audio Engine — soft synth tones & glitch harmonics
 */
const LuniqAudio = (() => {
  let ctx = null;
  let masterGain = null;
  let initialized = false;

  const TONES = [220, 277.18, 329.63, 392, 493.88, 587.33];
  const GLITCH_FREQS = [110, 165, 330, 440, 550, 880];

  function init() {
    if (initialized) return;
    try {
      ctx = new (window.AudioContext || window.webkitAudioContext)();
      masterGain = ctx.createGain();
      masterGain.gain.value = 0.25;
      masterGain.connect(ctx.destination);
      initialized = true;
    } catch (_) {
      /* audio unavailable */
    }
  }

  function resume() {
    init();
    if (ctx && ctx.state === 'suspended') ctx.resume();
  }

  function playTone(index, duration = 0.3, type = 'sine') {
    resume();
    if (!ctx) return;

    const freq = TONES[index % TONES.length];
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = type;
    osc.frequency.setValueAtTime(freq, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(freq * 1.02, ctx.currentTime + duration * 0.3);

    gain.gain.setValueAtTime(0.4, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);

    osc.connect(gain);
    gain.connect(masterGain);
    osc.start();
    osc.stop(ctx.currentTime + duration);
  }

  function playBlip() {
    resume();
    if (!ctx) return;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    const freq = GLITCH_FREQS[Math.floor(Math.random() * GLITCH_FREQS.length)];

    osc.type = 'square';
    osc.frequency.setValueAtTime(freq, ctx.currentTime);
    gain.gain.setValueAtTime(0.15, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.08);

    osc.connect(gain);
    gain.connect(masterGain);
    osc.start();
    osc.stop(ctx.currentTime + 0.08);
  }

  function playAmbientPulse() {
    resume();
    if (!ctx) return;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    const filter = ctx.createBiquadFilter();

    osc.type = 'sine';
    osc.frequency.value = 80 + Math.random() * 40;
    filter.type = 'lowpass';
    filter.frequency.value = 400;

    gain.gain.setValueAtTime(0.1, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 1.5);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(masterGain);
    osc.start();
    osc.stop(ctx.currentTime + 1.5);
  }

  function playGlitchHarmonic() {
    resume();
    if (!ctx) return;

    const count = 2 + Math.floor(Math.random() * 3);
    for (let i = 0; i < count; i++) {
      setTimeout(() => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = ['sawtooth', 'triangle', 'square'][i % 3];
        osc.frequency.value = 200 + Math.random() * 600;
        gain.gain.setValueAtTime(0.08, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.15);
        osc.connect(gain);
        gain.connect(masterGain);
        osc.start();
        osc.stop(ctx.currentTime + 0.15);
      }, i * 40);
    }
  }

  function playBurst() {
    for (let i = 0; i < 5; i++) {
      setTimeout(() => playBlip(), i * 50);
    }
  }

  return {
    init: resume,
    playTone,
    playBlip,
    playAmbientPulse,
    playGlitchHarmonic,
    playBurst,
    TONES
  };
})();

window.LuniqAudio = LuniqAudio;
