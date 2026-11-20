"use client";

// The site's shared breath. Anything that guides a breath (lib/useBreath.js,
// the newsletter's breathing widget) announces each phase with a "jm:breath"
// event. This module turns those announcements into one smooth number, the
// lungs: 0 is empty, 1 is full. Chanchal and the bloom both read it every
// frame, so they always breathe together.
//
// Event detail while a practice runs:
//   { running: true, swell, seconds, progress, gentle }
//     swell     how full the lungs are at the END of this phase (0 to 1)
//     seconds   how long the phase lasts
//     progress  how far through the whole practice we are (0 to 1)
//     gentle    true for the slow pacer during a timed sit
// and when it stops: { running: false, done }  (done is true if it finished).

const blank = () => ({
  running: false,
  kind: "rest", // "in", "out", "hold" or "rest"
  from: 0,
  to: 0,
  t0: 0,
  dur: 1,
  progress: 0,
  gentle: false,
  done: false,
  startedAt: -1e9,
  endedAt: -1e9,
  changedAt: -1e9,
  listening: false,
});

const state = typeof window === "undefined" ? blank() : (window.__jmBreath ||= blank());

const ease = (u) => 0.5 - 0.5 * Math.cos(Math.PI * Math.min(1, Math.max(0, u)));

// How full the lungs are right now, 0 to 1.
export function lungs(now = performance.now()) {
  return state.from + (state.to - state.from) * ease((now - state.t0) / state.dur);
}

// How far through the current phase we are, 0 to 1.
export function phaseU(now = performance.now()) {
  return Math.min(1, Math.max(0, (now - state.t0) / state.dur));
}

export function breath() {
  return state;
}

if (typeof window !== "undefined" && !state.listening) {
  state.listening = true;
  window.addEventListener("jm:breath", (event) => {
    const d = event.detail || {};
    const now = performance.now();
    const current = lungs(now);
    state.from = current;
    state.t0 = now;
    state.changedAt = now;
    if (d.running) {
      if (!state.running) {
        state.startedAt = now;
        state.done = false;
      }
      const to = typeof d.swell === "number" ? d.swell : current;
      state.kind = to > current + 0.05 ? "in" : to < current - 0.05 ? "out" : "hold";
      state.to = to;
      state.dur = Math.max(300, (d.seconds || 4) * 1000);
      state.progress = d.progress || 0;
      state.gentle = Boolean(d.gentle);
      state.running = true;
    } else {
      state.running = false;
      state.kind = "rest";
      state.to = 0;
      state.dur = 1400;
      state.gentle = false;
      state.endedAt = now;
      state.done = Boolean(d.done);
      if (d.done) state.progress = 1;
    }
  });
}
