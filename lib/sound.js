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

export function createDrone(freq) {
  if (typeof window === "undefined") return null;
  const audio = getAudioCtx();
  const analyser = audio.createAnalyser();
  analyser.fftSize = 256;
  analyser.smoothingTimeConstant = 0.82;

  const osc = audio.createOscillator();
  osc.type = "sine";
  osc.frequency.value = freq;
  const gain = audio.createGain();
  gain.gain.setValueAtTime(0, audio.currentTime);
  gain.gain.linearRampToValueAtTime(0.05, audio.currentTime + 1.2);
  osc.connect(gain);
  gain.connect(audio.destination);
  gain.connect(analyser);
  osc.start();

  const harmonic = audio.createOscillator();
  harmonic.type = "sine";
  harmonic.frequency.value = freq * 2;
  const harmonicGain = audio.createGain();
  harmonicGain.gain.setValueAtTime(0, audio.currentTime);
  harmonicGain.gain.linearRampToValueAtTime(0.012, audio.currentTime + 1.8);
  harmonic.connect(harmonicGain);
  harmonicGain.connect(analyser);
  harmonic.start();

  return {
    analyser,
    setFreq(next) {
      osc.frequency.setTargetAtTime(next, audio.currentTime, 0.15);
      harmonic.frequency.setTargetAtTime(next * 2, audio.currentTime, 0.15);
    },
    stop() {
      try {
        gain.gain.setTargetAtTime(0, audio.currentTime, 0.2);
        harmonicGain.gain.setTargetAtTime(0, audio.currentTime, 0.2);
        osc.stop(audio.currentTime + 1);
        harmonic.stop(audio.currentTime + 1);
      } catch {}
    },
  };
}
