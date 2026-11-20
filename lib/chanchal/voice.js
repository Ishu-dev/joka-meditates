"use client";

import { audio, soundEnabled } from "@/lib/sound";

// Chanchal's voice. Everything is synthesised: a small buzzy source shaped by
// three moving band-pass filters (formants), which is how a mouth turns a
// buzz into vowels. Short breath noise makes the "h" and the breathing.
// No audio files. Each line takes the audio context and a start time, so the
// same code can be rendered offline to check what it sounds like.

// Formant frequencies in Hz for a small, high voice.
const VOWEL = {
  a: [1080, 1700, 3300],
  e: [680, 2550, 3400],
  i: [390, 3000, 3850],
  o: [620, 1120, 3100],
  u: [430, 1020, 2950],
};

const perContext = new WeakMap();

function kit(ac) {
  let k = perContext.get(ac);
  if (k) return k;
  // the source: every harmonic present, falling away gently, so it is
  // brighter than a sine and softer than a sawtooth
  const n = 28;
  const real = new Float32Array(n);
  const imag = new Float32Array(n);
  for (let h = 1; h < n; h++) imag[h] = 1 / Math.pow(h, 1.25);
  const wave = ac.createPeriodicWave(real, imag);
  const noise = ac.createBuffer(1, ac.sampleRate, ac.sampleRate);
  const data = noise.getChannelData(0);
  for (let i = 0; i < data.length; i++) data[i] = Math.random() * 2 - 1;
  const soften = ac.createBiquadFilter();
  soften.type = "lowpass";
  soften.frequency.value = 5600;
  const master = ac.createGain();
  // quiet on purpose: the same loudness as the breathing tones
  master.gain.value = 0.3;
  soften.connect(master);
  master.connect(ac.destination);
  k = { wave, noise, out: soften };
  perContext.set(ac, k);
  return k;
}

function envelope(ac, t, dur, peak, attack = 0.014, release = 0.05) {
  const g = ac.createGain();
  // a straight rise: an exponential one stays silent and then jumps, and a
  // sudden start is exactly what makes a voice sound like "b" instead of "h"
  g.gain.setValueAtTime(0, t);
  g.gain.linearRampToValueAtTime(peak, t + attack);
  g.gain.setValueAtTime(peak, Math.max(t + attack, t + dur - release));
  g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
  return g;
}

// One voiced sound. `from` and `to` are vowels (the mouth glides between
// them), `pitch` is a list of [fraction of the duration, Hz] points.
export function voiced(ac, t, { from, to = from, pitch, dur, gain = 0.5, attack, release }) {
  const { wave, out } = kit(ac);
  const osc = ac.createOscillator();
  osc.setPeriodicWave(wave);
  osc.frequency.setValueAtTime(pitch[0][1], t);
  for (let i = 1; i < pitch.length; i++) osc.frequency.linearRampToValueAtTime(pitch[i][1], t + pitch[i][0] * dur);
  const env = envelope(ac, t, dur, gain, attack, release);
  const a = VOWEL[from];
  const b = VOWEL[to];
  const q = [5, 9, 9];
  const level = [1, 0.62, 0.22];
  for (let i = 0; i < 3; i++) {
    const band = ac.createBiquadFilter();
    band.type = "bandpass";
    band.Q.value = q[i];
    band.frequency.setValueAtTime(a[i], t);
    band.frequency.setValueAtTime(a[i], t + dur * 0.22);
    band.frequency.linearRampToValueAtTime(b[i], t + dur * 0.8);
    const g = ac.createGain();
    g.gain.value = level[i];
    osc.connect(band);
    band.connect(g);
    g.connect(env);
  }
  env.connect(out);
  osc.start(t);
  osc.stop(t + dur + 0.03);
}

// Breath noise through one moving band: an "h", a puff, a long breath.
export function hiss(ac, t, { dur, from, to = from, q = 0.9, gain = 0.2, attack = 0.02, release = 0.06 }) {
  const { noise, out } = kit(ac);
  const src = ac.createBufferSource();
  src.buffer = noise;
  src.loop = true;
  const band = ac.createBiquadFilter();
  band.type = "bandpass";
  band.Q.value = q;
  band.frequency.setValueAtTime(from, t);
  band.frequency.exponentialRampToValueAtTime(to, t + dur);
  const env = envelope(ac, t, dur, gain, attack, release);
  src.connect(band);
  band.connect(env);
  env.connect(out);
  src.start(t, Math.random() * 0.5);
  src.stop(t + dur + 0.03);
}

// A whispered vowel: breath noise shaped by the same three formants. An "h"
// is exactly this, the vowel that follows it said without the voice.
export function aspirate(ac, t, { vowel, dur, gain = 0.3, attack = 0.03, release = 0.05 }) {
  const { noise, out } = kit(ac);
  const src = ac.createBufferSource();
  src.buffer = noise;
  src.loop = true;
  const env = envelope(ac, t, dur, gain, attack, release);
  const f = VOWEL[vowel];
  const level = [1, 0.9, 0.5];
  for (let i = 0; i < 3; i++) {
    const band = ac.createBiquadFilter();
    band.type = "bandpass";
    band.Q.value = 3.5;
    band.frequency.value = f[i];
    const g = ac.createGain();
    g.gain.value = level[i];
    src.connect(band);
    band.connect(g);
    g.connect(env);
  }
  env.connect(out);
  src.start(t, Math.random() * 0.5);
  src.stop(t + dur + 0.03);
}

// A plain sine that slides: plops and bubbles.
export function chirp(ac, t, { from, to, dur, gain = 0.3 }) {
  const { out } = kit(ac);
  const osc = ac.createOscillator();
  osc.type = "sine";
  osc.frequency.setValueAtTime(from, t);
  osc.frequency.exponentialRampToValueAtTime(to, t + dur);
  const env = envelope(ac, t, dur, gain, 0.006, dur * 0.7);
  osc.connect(env);
  env.connect(out);
  osc.start(t);
  osc.stop(t + dur + 0.03);
}

const VOWELS = "aeiou";
const PLOSIVE = "bdgkpt";
const AIRY = "cfhsxz";
// a five-note scale, so the babble sounds like a tune and not an alarm
const STEPS = [0, 2, 4, 7, 9, 12, 14];

export const LINES = {
  // "hi!": a breath of h (the "ah" whispered), then the voice comes in softly
  // and the mouth glides from "ah" to "ee" while the pitch jumps and settles.
  hi(ac, t) {
    aspirate(ac, t, { vowel: "a", dur: 0.15, gain: 0.35, attack: 0.03, release: 0.07 });
    voiced(ac, t + 0.07, { from: "a", to: "i", dur: 0.36, gain: 0.5, pitch: [[0, 520], [0.3, 700], [1, 570]], attack: 0.09, release: 0.1 });
  },
  // "ha ha ha"
  giggle(ac, t) {
    [680, 620, 560].forEach((hz, i) => {
      const at = t + i * 0.19;
      aspirate(ac, at, { vowel: "a", dur: 0.09, gain: 0.3, attack: 0.02, release: 0.04 });
      voiced(ac, at + 0.04, { from: "a", dur: 0.12, gain: 0.42, pitch: [[0, hz * 1.05], [1, hz * 0.88]], attack: 0.045, release: 0.05 });
    });
  },
  // a falling "wheee" for the drop
  whee(ac, t) {
    voiced(ac, t, { from: "u", to: "i", dur: 0.62, gain: 0.38, pitch: [[0, 620], [0.16, 930], [1, 400]], release: 0.16 });
  },
  // "yay!"
  yay(ac, t) {
    voiced(ac, t, { from: "i", to: "a", dur: 0.12, gain: 0.45, pitch: [[0, 520], [1, 600]], release: 0.02 });
    voiced(ac, t + 0.11, { from: "a", to: "i", dur: 0.3, gain: 0.5, pitch: [[0, 600], [0.5, 790], [1, 700]], release: 0.1 });
  },
  // "hm?"
  hm(ac, t) {
    voiced(ac, t, { from: "u", to: "o", dur: 0.24, gain: 0.34, pitch: [[0, 430], [0.5, 470], [1, 640]], attack: 0.05, release: 0.07 });
  },
  // landing on the pad
  plop(ac, t) {
    chirp(ac, t, { from: 210, to: 62, dur: 0.13, gain: 0.5 });
    hiss(ac, t, { dur: 0.05, from: 900, to: 500, q: 0.7, gain: 0.07, attack: 0.004, release: 0.03 });
  },
  // a bubble
  blup(ac, t) {
    chirp(ac, t, { from: 330, to: 880, dur: 0.075, gain: 0.12 });
  },
  // one syllable of chatter for one typed character
  babble(ac, t, ch, index = 0) {
    const c = ch.toLowerCase();
    const code = c.charCodeAt(0);
    const vowel = VOWELS.includes(c) ? c : VOWELS[(code + index) % 5];
    const hz = 470 * Math.pow(2, STEPS[(code * 7 + index * 3) % STEPS.length] / 12);
    if (PLOSIVE.includes(c)) chirp(ac, t, { from: 240, to: 150, dur: 0.018, gain: 0.1 });
    if (AIRY.includes(c)) hiss(ac, t, { dur: 0.03, from: 2600, to: 3200, q: 1, gain: 0.05, attack: 0.005, release: 0.015 });
    voiced(ac, t + 0.008, { from: vowel, dur: 0.07, gain: 0.3, pitch: [[0, hz * 1.03], [1, hz * 0.95]], attack: 0.007, release: 0.03 });
  },
  // a breath in: air rushing toward the mouth, rising
  breathIn(ac, t, seconds = 4) {
    const dur = Math.min(seconds, 6) * 0.92;
    hiss(ac, t, { dur, from: 520, to: 1700, q: 1.1, gain: 0.05, attack: dur * 0.45, release: dur * 0.3 });
  },
  // a breath out: a soft "hoo", falling
  breathOut(ac, t, seconds = 4) {
    const dur = Math.min(seconds, 7) * 0.9;
    hiss(ac, t, { dur, from: 1500, to: 480, q: 1.1, gain: 0.06, attack: dur * 0.12, release: dur * 0.6 });
  },
};

function play(name, ...args) {
  if (!soundEnabled()) return false;
  const ac = audio();
  if (!ac) return false;
  LINES[name](ac, ac.currentTime + 0.012, ...args);
  return true;
}

// Each returns true if the sound was actually made.
export const voice = {
  hi: () => play("hi"),
  giggle: () => play("giggle"),
  whee: () => play("whee"),
  yay: () => play("yay"),
  hm: () => play("hm"),
  plop: () => play("plop"),
  blup: () => play("blup"),
  babble: (ch, index) => play("babble", ch, index),
  breathIn: (seconds) => play("breathIn", seconds),
  breathOut: (seconds) => play("breathOut", seconds),
};
