/**
 * SPIN Earcon-System
 *
 * Spezifikation:
 * jingle() — einmaliger Startup-Sweep (120→4800 Hz)
 * whoosh() — Drehungsgeräusch bei erfolgreicher Analyse
 * zerbroseln() — Struktur zerfällt bei Regelverletzung / nicht_renderbar
 */

let _ctx = null;
let _jinglePlayed = false;

function ctx() {
  if (!_ctx) _ctx = new (window.AudioContext || window.webkitAudioContext)();
  if (_ctx.state === 'suspended') _ctx.resume();
  return _ctx;
}

function noiseSource(c, durationSec) {
  const len = Math.ceil(c.sampleRate * durationSec);
  const buf = c.createBuffer(1, len, c.sampleRate);
  const d = buf.getChannelData(0);
  for (let i = 0; i < len; i++) d[i] = Math.random() * 2 - 1;
  const src = c.createBufferSource();
  src.buffer = buf;
  return src;
}

export const earcon = {
  whoosh(delay = 0) {
    try {
      const c = ctx();
      const src = noiseSource(c, 0.45);
      const filter = c.createBiquadFilter();
      filter.type = 'bandpass';
      filter.Q.value = 2.8;
      const gain = c.createGain();
      src.connect(filter);
      filter.connect(gain);
      gain.connect(c.destination);
      const t = c.currentTime + delay;
      filter.frequency.setValueAtTime(180, t);
      filter.frequency.exponentialRampToValueAtTime(3200, t + 0.32);
      gain.gain.setValueAtTime(0, t);
      gain.gain.linearRampToValueAtTime(0.38, t + 0.04);
      gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.42);
      src.start(t);
      src.stop(t + 0.46);
    } catch (_e) { /* Audio not available */ }
  },

  zerbroseln() {
    try {
      const c = ctx();
      [0, 0.055, 0.115, 0.175, 0.235, 0.295].forEach((delay, i) => {
        const src = noiseSource(c, 0.06);
        const filter = c.createBiquadFilter();
        filter.type = 'highpass';
        filter.frequency.value = 900 + i * 280;
        const gain = c.createGain();
        src.connect(filter);
        filter.connect(gain);
        gain.connect(c.destination);
        const t = c.currentTime + delay;
        const vol = 0.36 * Math.pow(0.72, i);
        gain.gain.setValueAtTime(vol, t);
        gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.055);
        src.start(t);
        src.stop(t + 0.065);
      });
    } catch (_e) { /* Audio not available */ }
  },

  jingle() {
    if (_jinglePlayed) return;
    _jinglePlayed = true;
    try {
      const c = ctx();
      const src = noiseSource(c, 0.6);
      const filter = c.createBiquadFilter();
      filter.type = 'bandpass';
      filter.Q.value = 3.5;
      const gain = c.createGain();
      src.connect(filter);
      filter.connect(gain);
      gain.connect(c.destination);
      const t = c.currentTime;
      filter.frequency.setValueAtTime(120, t);
      filter.frequency.exponentialRampToValueAtTime(4800, t + 0.5);
      gain.gain.setValueAtTime(0, t);
      gain.gain.linearRampToValueAtTime(0.32, t + 0.03);
      gain.gain.setValueAtTime(0.32, t + 0.35);
      gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.55);
      src.start(t);
      src.stop(t + 0.6);
    } catch (_e) { /* Audio not available */ }
  },
};
