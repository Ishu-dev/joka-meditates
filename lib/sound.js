"use client";

// All sound on the site is made in the browser with the Web Audio API. There
// are no audio files. One switch gates everything, and the visitor's choice
// is remembered on the device.

let ctx;
const KEY = "jm-sound";

// Browsers only let a page make sound after a click, a tap or a key press.
// This notes the first one, in the capture phase, so that a sound asked for
// by that same click is already allowed.
let activated = false;
if (typeof window !== "undefined") {
  const mark = () => {
    activated = true;
  };
  for (const type of ["pointerdown", "keydown", "touchend"]) {
    window.addEventListener(type, mark, { capture: true, passive: true });
  }
}

// The AudioContext, or null when the browser has not allowed sound yet.
// Nothing is created before the first click or key press: sound queued on a
// context that is not allowed to run would all play at once later.
export function audio() {
  if (typeof window === "undefined") return null;
  const allowed = activated || Boolean(navigator.userActivation && navigator.userActivation.hasBeenActive);
  if (!allowed) return null;
  if (!ctx) {
    const Ctx = window.AudioContext || window.webkitAudioContext;
    if (!Ctx) return null;
    ctx = new Ctx();
  }
  if (ctx.state === "suspended") ctx.resume();
  return ctx.state === "closed" ? null : ctx;
}

export function soundEnabled() {
  if (typeof window === "undefined") return false;
  try {
    return (localStorage.getItem(KEY) ?? sessionStorage.getItem(KEY)) !== "off";
  } catch {
    return true;
  }
}

export function setSoundEnabled(on) {
  try {
    localStorage.setItem(KEY, on ? "on" : "off");
  } catch {}
  window.dispatchEvent(new CustomEvent("jm:sound", { detail: { on } }));
}

export function playTone(freq, duration, volume) {
  if (!soundEnabled()) return;
  const out = audio();
  if (!out) return;
  const osc = out.createOscillator();
  const gain = out.createGain();
  osc.type = "sine";
  osc.frequency.value = freq;
  gain.gain.setValueAtTime(volume || 0.06, out.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.0001, out.currentTime + duration);
  osc.connect(gain);
  gain.connect(out.destination);
  osc.start();
  osc.stop(out.currentTime + duration);
}

// A held note with one overtone, used by the mandala. Always starts from a
// button press, so the context is allowed to start here.
export function createDrone(freq) {
  if (typeof window === "undefined") return null;
  if (!ctx) {
    const Ctx = window.AudioContext || window.webkitAudioContext;
    if (!Ctx) return null;
    ctx = new Ctx();
  }
  if (ctx.state === "suspended") ctx.resume();
  const out = ctx;
  const analyser = out.createAnalyser();
  analyser.fftSize = 256;
  analyser.smoothingTimeConstant = 0.82;

  const osc = out.createOscillator();
  osc.type = "sine";
  osc.frequency.value = freq;
  const gain = out.createGain();
  gain.gain.setValueAtTime(0, out.currentTime);
  gain.gain.linearRampToValueAtTime(0.05, out.currentTime + 1.2);
  osc.connect(gain);
  gain.connect(out.destination);
  gain.connect(analyser);
  osc.start();

  const harmonic = out.createOscillator();
  harmonic.type = "sine";
  harmonic.frequency.value = freq * 2;
  const harmonicGain = out.createGain();
  harmonicGain.gain.setValueAtTime(0, out.currentTime);
  harmonicGain.gain.linearRampToValueAtTime(0.012, out.currentTime + 1.8);
  harmonic.connect(harmonicGain);
  harmonicGain.connect(analyser);
  harmonic.start();

  return {
    analyser,
    setFreq(next) {
      osc.frequency.setTargetAtTime(next, out.currentTime, 0.15);
      harmonic.frequency.setTargetAtTime(next * 2, out.currentTime, 0.15);
    },
    stop() {
      try {
        gain.gain.setTargetAtTime(0, out.currentTime, 0.2);
        harmonicGain.gain.setTargetAtTime(0, out.currentTime, 0.2);
        osc.stop(out.currentTime + 1);
        harmonic.stop(out.currentTime + 1);
      } catch {}
    },
  };
}
