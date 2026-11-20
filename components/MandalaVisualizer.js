"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { audio, createDrone } from "@/lib/sound";
import { motionAllowed, onMotionChange } from "@/lib/motion";

// A mandala of cut-paper petals that moves with sound. The sound is either a
// synth drone (lib/sound.js, no audio files) or the room through the
// microphone. Nothing from the microphone is recorded or sent anywhere: it is
// read live for its loudness in three bands and then dropped.

const PRESETS = [
  { freq: 174, label: "174 Hz", note: "ground" },
  { freq: 285, label: "285 Hz", note: "renew" },
  { freq: 396, label: "396 Hz", note: "release" },
  { freq: 432, label: "432 Hz", note: "natural" },
  { freq: 528, label: "528 Hz", note: "heart" },
  { freq: 639, label: "639 Hz", note: "connect" },
];

const token = (name) => getComputedStyle(document.documentElement).getPropertyValue(name).trim();

// One almond-shaped petal from radius r0 to r0 + len, pointing along `angle`.
function petal(ctx, cx, cy, angle, r0, len, half) {
  const ca = Math.cos(angle);
  const sa = Math.sin(angle);
  const bx = cx + ca * r0;
  const by = cy + sa * r0;
  const tx = cx + ca * (r0 + len);
  const ty = cy + sa * (r0 + len);
  const mx = cx + ca * (r0 + len * 0.44);
  const my = cy + sa * (r0 + len * 0.44);
  const px = -sa * half;
  const py = ca * half;
  ctx.moveTo(bx, by);
  ctx.quadraticCurveTo(mx + px * 2, my + py * 2, tx, ty);
  ctx.quadraticCurveTo(mx - px * 2, my - py * 2, bx, by);
}

export default function MandalaVisualizer() {
  const canvasRef = useRef(null);
  const st = useRef({
    raf: 0,
    drone: null,
    micStream: null,
    micSource: null,
    analyser: null,
    data: null,
    petals: 8,
    freq: 432,
    sounding: false,
    level: [0.2, 0.24, 0.14],
    colors: null,
    seen: true,
    clock: 0,
    last: 0,
  });
  const [running, setRunning] = useState(false);
  const [micOn, setMicOn] = useState(false);
  const [petals, setPetals] = useState(8);
  const [freqIdx, setFreqIdx] = useState(3);
  const [micError, setMicError] = useState(null);
  const [still, setStill] = useState(false);

  const draw = useCallback((now) => {
    const canvas = canvasRef.current;
    const s = st.current;
    if (!canvas || !s.colors) return;
    const ctx = canvas.getContext("2d");
    const w = canvas.width;
    const h = canvas.height;
    const cx = w / 2;
    const cy = h / 2;
    const R = Math.min(w, h) * 0.48;
    const c = s.colors;

    // the mandala's own clock only runs while things may move
    const dt = s.last ? Math.min(0.05, (now - s.last) / 1000) : 0;
    s.last = now;
    s.clock += dt;
    const t = s.clock;

    // loudness in three bands, 0 to 1, eased so the petals do not flicker
    let want;
    if (s.analyser && s.data && (s.sounding || s.micSource)) {
      s.analyser.getByteFrequencyData(s.data);
      const peak = (from, to) => {
        let top = 0;
        for (let i = from; i < to; i++) if (s.data[i] > top) top = s.data[i];
        return top / 255;
      };
      want = [peak(0, 4), peak(4, 16), peak(16, 60)];
    } else {
      want = [0.2 + 0.1 * Math.sin(t * 0.8), 0.24 + 0.1 * Math.sin(t * 0.5 + 1), 0.14 + 0.08 * Math.sin(t * 1.3 + 2)];
    }
    for (let i = 0; i < 3; i++) s.level[i] += (want[i] - s.level[i]) * 0.14;
    const [bass, mid, high] = s.level;

    const n = s.petals;
    const sector = (Math.PI * 2) / n;
    // a wave that runs round the rings; a higher drone runs it faster
    const speed = s.sounding ? 0.5 + s.freq / 260 : 0.7;
    const ripple = (i, lag) => 1 + (0.1 + 0.3 * mid) * Math.sin(i * sector * 2 + t * speed + lag);
    const ring = (count, turn, r0, len, width, color, lag) => {
      ctx.beginPath();
      for (let i = 0; i < count; i++) {
        const l = len * ripple(i, lag);
        const half = Math.tan(sector / 2) * (r0 + l * 0.44) * width;
        petal(ctx, cx, cy, i * ((Math.PI * 2) / count) + turn, r0, l, half);
      }
      ctx.fillStyle = color;
      ctx.fill();
    };

    ctx.clearRect(0, 0, w, h);
    ring(n, t * 0.04, R * 0.5, R * (0.34 + 0.12 * bass), 0.5, c.pond, 0);
    ring(n, t * 0.04 + sector / 2, R * 0.5, R * (0.22 + 0.2 * mid), 0.3, c.accent, 1.2);

    ctx.beginPath();
    ctx.arc(cx, cy, R * 0.5, 0, Math.PI * 2);
    ctx.fillStyle = c.pond2;
    ctx.fill();

    ring(n, -t * 0.07, R * 0.2, R * (0.24 + 0.1 * mid), 0.5, c.lotus, 2.1);
    ring(n, -t * 0.07 + sector / 2, R * 0.2, R * (0.15 + 0.14 * high), 0.3, c.paper, 0.6);

    ctx.beginPath();
    for (let i = 0; i < n * 2; i++) {
      const a = i * (sector / 2) - t * 0.03;
      const r = R * (0.94 + 0.03 * Math.sin(i * sector + t * speed));
      const dot = R * (0.011 + 0.03 * high);
      ctx.moveTo(cx + Math.cos(a) * r + dot, cy + Math.sin(a) * r);
      ctx.arc(cx + Math.cos(a) * r, cy + Math.sin(a) * r, dot, 0, Math.PI * 2);
    }
    ctx.fillStyle = c.paper;
    ctx.fill();

    ring(n, t * 0.11, R * 0.05, R * (0.13 + 0.09 * bass), 0.55, c.sun, 3);
    ctx.beginPath();
    ctx.arc(cx, cy, R * (0.062 + 0.034 * bass), 0, Math.PI * 2);
    ctx.fillStyle = c.sun2;
    ctx.fill();
    ctx.beginPath();
    ctx.arc(cx, cy, R * 0.022, 0, Math.PI * 2);
    ctx.fillStyle = c.ink;
    ctx.fill();
  }, []);

  useEffect(() => {
    const s = st.current;
    const canvas = canvasRef.current;
    s.colors = {
      sun: token("--color-sun"),
      sun2: token("--color-sun-2"),
      lotus: token("--color-lotus"),
      accent: token("--color-accent"),
      pond: token("--color-pond"),
      pond2: token("--color-pond-2"),
      paper: token("--color-paper"),
      ink: token("--color-ink"),
    };

    const loop = (now) => {
      draw(now);
      s.raf = motionAllowed() && s.seen && !document.hidden ? requestAnimationFrame(loop) : 0;
    };
    const wake = () => {
      const moving = motionAllowed();
      setStill(!moving);
      s.last = 0;
      if (moving && !s.raf) s.raf = requestAnimationFrame(loop);
      // held still: one frame, a little way into the pattern
      if (!moving) {
        if (s.clock === 0) s.clock = 2;
        draw(performance.now());
      }
    };
    s.wake = wake;

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.round(canvas.clientWidth * dpr);
      canvas.height = Math.round(canvas.clientHeight * dpr);
      if (!s.raf) {
        s.last = 0;
        draw(performance.now());
      }
    };
    const watchSize = new ResizeObserver(resize);
    watchSize.observe(canvas);
    const watchSeen = new IntersectionObserver(([entry]) => {
      s.seen = entry.isIntersecting;
      wake();
    });
    watchSeen.observe(canvas);
    const stopMotion = onMotionChange(wake);
    document.addEventListener("visibilitychange", wake);
    resize();
    wake();

    return () => {
      cancelAnimationFrame(s.raf);
      s.raf = 0;
      watchSize.disconnect();
      watchSeen.disconnect();
      stopMotion();
      document.removeEventListener("visibilitychange", wake);
      s.drone?.stop();
      s.micStream?.getTracks().forEach((track) => track.stop());
      try {
        s.micSource?.disconnect();
      } catch {}
    };
  }, [draw]);

  useEffect(() => {
    st.current.petals = petals;
    if (!st.current.raf && st.current.wake) st.current.wake();
  }, [petals]);

  useEffect(() => {
    const s = st.current;
    s.freq = PRESETS[freqIdx].freq;
    if (running && s.drone) s.drone.setFreq(s.freq);
  }, [freqIdx, running]);

  // One analyser of our own on the shared audio context. The drone and the
  // microphone both feed it, so either can be switched without losing the other.
  function listenOn(context) {
    const s = st.current;
    if (!s.analyser || s.analyser.context !== context) {
      s.analyser = context.createAnalyser();
      s.analyser.fftSize = 256;
      s.analyser.smoothingTimeConstant = 0.82;
      s.data = new Uint8Array(s.analyser.frequencyBinCount);
    }
    return s.analyser;
  }

  function toggleSound() {
    const s = st.current;
    if (running) {
      s.drone?.stop();
      s.drone = null;
      s.sounding = false;
      setRunning(false);
      return;
    }
    const drone = createDrone(PRESETS[freqIdx].freq);
    if (!drone) return;
    s.drone = drone;
    drone.analyser.connect(listenOn(drone.analyser.context));
    s.sounding = true;
    setRunning(true);
  }

  async function toggleMic() {
    const s = st.current;
    setMicError(null);
    if (micOn) {
      s.micStream?.getTracks().forEach((track) => track.stop());
      try {
        s.micSource?.disconnect();
      } catch {}
      s.micStream = null;
      s.micSource = null;
      setMicOn(false);
      return;
    }
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      // the shared context may need a moment to wake after its first use
      let context = s.analyser ? s.analyser.context : audio();
      for (let tries = 0; !context && tries < 10; tries++) {
        await new Promise((done) => setTimeout(done, 60));
        context = audio();
      }
      if (!context) throw new Error("no audio context");
      s.micStream = stream;
      s.micSource = context.createMediaStreamSource(stream);
      s.micSource.connect(listenOn(context));
      setMicOn(true);
    } catch (e) {
      st.current.micStream?.getTracks().forEach((track) => track.stop());
      st.current.micStream = null;
      setMicError(
        e.name === "NotAllowedError"
          ? "Microphone permission declined. The synth drones still work."
          : "Microphone unavailable. The synth drones still work.",
      );
    }
  }

  return (
    <div className="mandala">
      <div className="mandala__stage">
        <canvas ref={canvasRef} role="img" aria-label="A mandala of paper petals that moves with sound" />
      </div>

      <div className="mandala__controls">
        <fieldset className="choose mandala__drones">
          <legend className="title">Drone frequency</legend>
          {PRESETS.map((p, i) => (
            <div key={p.freq}>
              <input
                type="radio"
                name="drone"
                id={`drone-${p.freq}`}
                value={p.freq}
                checked={freqIdx === i}
                onChange={() => setFreqIdx(i)}
              />
              <label htmlFor={`drone-${p.freq}`}>
                <span>{p.label}</span>
                <span className="choose__len">{p.note}</span>
              </label>
            </div>
          ))}
        </fieldset>

        <div className="actions">
          <button type="button" className="btn btn--paper" onClick={toggleSound}>
            {running ? "Stop sound" : "Begin sound"}
          </button>
          <button type="button" className="btn btn--quiet" aria-pressed={micOn} onClick={toggleMic}>
            {micOn ? "Mic live" : "Use microphone"}
          </button>
        </div>

        <label className="range">
          Symmetry: {petals} petals
          <input
            type="range"
            name="symmetry"
            min="5"
            max="12"
            value={petals}
            onChange={(e) => setPetals(Number(e.target.value))}
          />
        </label>

        <div className="stack-s">
          {micError && (
            <p className="mandala__error" role="alert">
              {micError}
            </p>
          )}
          {still && <p className="note">Motion is switched off for this site, so the pattern holds still.</p>}
          <p className="note">Nothing is recorded. The microphone only feeds the visualizer live.</p>
        </div>

        <div className="guide-seat-room" aria-hidden="true" />
      </div>
    </div>
  );
}
