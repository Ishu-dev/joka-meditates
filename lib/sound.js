"use client";

let ctx;

function getAudioCtx() {
  if (!ctx) {
    ctx = new (window.AudioContext || window.webkitAudioContext)();
  }
  if (ctx.state === "suspended") {
    ctx.resume();
  }
  return ctx;
}

export function soundEnabled() {
  if (typeof window === "undefined") return false;
  return sessionStorage.getItem("jm-sound") !== "off";
}

export function setSoundEnabled(on) {
  sessionStorage.setItem("jm-sound", on ? "on" : "off");
}

export function playTone(freq, duration, volume) {
  if (!soundEnabled() || typeof window === "undefined") return;
  const audio = getAudioCtx();
  const osc = audio.createOscillator();
  const gain = audio.createGain();
  osc.type = "sine";
  osc.frequency.value = freq;
  gain.gain.setValueAtTime(volume || 0.06, audio.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.0001, audio.currentTime + duration);
  osc.connect(gain);
  gain.connect(audio.destination);
  osc.start();
  osc.stop(audio.currentTime + duration);
}
