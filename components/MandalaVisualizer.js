"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { createDrone } from "@/lib/sound";

const PRESETS = [
  { freq: 174, label: "174 Hz", note: "ground" },
  { freq: 285, label: "285 Hz", note: "renew" },
  { freq: 396, label: "396 Hz", note: "release" },
  { freq: 432, label: "432 Hz", note: "natural" },
  { freq: 528, label: "528 Hz", note: "heart" },
  { freq: 639, label: "639 Hz", note: "connect" },
];

function hexToRgb(hex) {
  const h = hex.trim().replace("#", "");
  if (h.length !== 6) return null;
  return [
    parseInt(h.slice(0, 2), 16),
    parseInt(h.slice(2, 4), 16),
    parseInt(h.slice(4, 6), 16),
  ];
}

const rgba = (c, a) => `rgba(${c[0]},${c[1]},${c[2]},${a})`;

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
    accent: [194, 68, 126],
    deep: [47, 93, 84],
    reduced: false,
  });
  const [running, setRunning] = useState(false);
  const [micOn, setMicOn] = useState(false);
  const [petals, setPetals] = useState(8);
  const [freqIdx, setFreqIdx] = useState(3);
  const [micError, setMicError] = useState(null);

  const drawFrame = useCallback((time) => {
    const canvas = canvasRef.current;
    const s = st.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    const w = canvas.width;
    const h = canvas.height;
    const cx = w / 2;
    const cy = h / 2;
    const R = Math.min(w, h) * 0.36;

    let bass = 0.25;
    let mid = 0.3;
    let high = 0.2;
    if (s.analyser && s.data) {
      s.analyser.getByteFrequencyData(s.data);
      const avg = (from, to) => {
        let sum = 0;
        for (let i = from; i < to; i++) sum += s.data[i];
        return sum / (to - from) / 255;
      };
      bass = Math.max(avg(2, 10), 0.04);
      mid = Math.max(avg(11, 42), 0.04);
      high = Math.max(avg(43, 100), 0.04);
    } else {
      const t = time / 1000;
      bass = 0.2 + 0.12 * Math.sin(t * 0.8);
      mid = 0.25 + 0.1 * Math.sin(t * 0.5 + 1);
      high = 0.15 + 0.08 * Math.sin(t * 1.3 + 2);
    }

    ctx.clearRect(0, 0, w, h);
    const t = time / 1000;

    const rings = [
      { r: R * 0.42, band: bass, color: s.deep, alpha: 0.55, count: s.petals, width: 0.2 },
      { r: R * 0.72, band: mid, color: s.accent, alpha: 0.45, count: s.petals, width: 0.17, dir: -1 },
      { r: R * 1.04, band: high, color: s.accent, alpha: 0.8, count: s.petals * 2, width: 0.12 },
    ];

    rings.forEach((ring, k) => {
      const len = R * (0.28 + ring.band * 0.55);
      const rot = (k % 2 === 0 ? 1 : -1) * t * 0.12 * (ring.dir || 1) + k * 0.35;
      ctx.save();
      ctx.translate(cx, cy);
      for (let i = 0; i < ring.count; i++) {
        const a = rot + (i * 2 * Math.PI) / ring.count;
        ctx.save();
        ctx.rotate(a);
        ctx.beginPath();
        const inner = ring.r * 0.25;
        const tip = inner + len;
        const pw = R * ring.width;
        ctx.moveTo(inner, 0);
        ctx.quadraticCurveTo(inner + len * 0.45, pw * (0.8 + ring.band), tip, 0);
        ctx.quadraticCurveTo(inner + len * 0.45, -pw * (0.8 + ring.band), inner, 0);
        ctx.fillStyle = rgba(ring.color, ring.alpha + ring.band * 0.3);
        if (k === 2) {
          ctx.shadowColor = rgba(s.accent, 0.7);
          ctx.shadowBlur = 10 + bass * 26;
        }
        ctx.fill();
        ctx.restore();
      }
      ctx.restore();
    });

    ctx.beginPath();
    ctx.arc(cx, cy, R * 0.14 * (1 + bass * 0.6), 0, 2 * Math.PI);
    ctx.fillStyle = rgba(s.accent, 0.25 + bass * 0.4);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(cx, cy, R * 1.18, 0, 2 * Math.PI);
    ctx.strokeStyle = rgba(s.deep, 0.35 + mid * 0.3);
    ctx.lineWidth = Math.max(1, w * 0.002);
    ctx.stroke();
  }, []);

  useEffect(() => {
    const s = st.current;
    s.reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const readTokens = () => {
      const cs = getComputedStyle(document.documentElement);
      const a = hexToRgb(cs.getPropertyValue("--accent"));
      const d = hexToRgb(cs.getPropertyValue("--deep"));
      if (a) s.accent = a;
      if (d) s.deep = d;
    };
    readTokens();
    const themeObserver = new MutationObserver(readTokens);
    themeObserver.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["data-theme"],
    });

    const canvas = canvasRef.current;
    const resize = () => {
      if (!canvas) return;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = canvas.clientWidth * dpr;
      canvas.height = canvas.clientHeight * dpr;
      if (s.reduced) drawFrame(0);
    };
    resize();
    window.addEventListener("resize", resize);

    if (s.reduced) {
      drawFrame(0);
      return () => {
        themeObserver.disconnect();
        window.removeEventListener("resize", resize);
      };
    }

    const loop = (time) => {
      if (!document.hidden) drawFrame(time);
      s.raf = requestAnimationFrame(loop);
    };
    s.raf = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(s.raf);
      themeObserver.disconnect();
      window.removeEventListener("resize", resize);
    };
  }, [drawFrame]);

  useEffect(() => {
    st.current.petals = petals;
    if (st.current.reduced) drawFrame(0);
  }, [petals, drawFrame]);

  async function toggleSound() {
    const s = st.current;
    if (running) {
      s.drone?.stop();
      s.drone = null;
      setRunning(false);
      return;
    }
    const drone = createDrone(PRESETS[freqIdx].freq);
    if (!drone) return;
    s.drone = drone;
    s.analyser = drone.analyser;
    s.data = new Uint8Array(drone.analyser.frequencyBinCount);
    setRunning(true);
  }

  useEffect(() => {
    if (running && st.current.drone) {
      st.current.drone.setFreq(PRESETS[freqIdx].freq);
    }
  }, [freqIdx, running]);

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
      const { getAudioCtx } = await import("@/lib/sound");
      const ctxAudio = getAudioCtx();
      if (!s.analyser) {
        s.analyser = ctxAudio.createAnalyser();
        s.analyser.fftSize = 256;
        s.analyser.smoothingTimeConstant = 0.82;
      }
      if (!s.data) s.data = new Uint8Array(s.analyser.frequencyBinCount);
      s.micStream = stream;
      s.micSource = ctxAudio.createMediaStreamSource(stream);
      s.micSource.connect(s.analyser);
      setMicOn(true);
    } catch (e) {
      setMicError(
        e.name === "NotAllowedError"
          ? "Microphone permission declined. The synth drones still work."
          : "Microphone unavailable. The synth drones still work."
      );
    }
  }

  useEffect(() => {
    const s = st.current;
    return () => {
      cancelAnimationFrame(s.raf);
      s.drone?.stop();
      s.micStream?.getTracks().forEach((track) => track.stop());
      try {
        s.micSource?.disconnect();
      } catch {}
    };
  }, []);

  return (
    <div className="rounded-card border border-rule bg-deep-soft/20 p-5 sm:p-8">
      <div className="relative mx-auto aspect-square w-full max-w-md">
        <canvas
          ref={canvasRef}
          className="h-full w-full"
          role="img"
          aria-label="Generative mandala that reacts to sound"
        />
      </div>

      <div className="mx-auto mt-6 max-w-md space-y-4">
        <fieldset>
          <legend className="text-xs uppercase tracking-widest text-ink-soft">
            Drone frequency
          </legend>
          <div className="mt-2 grid grid-cols-3 gap-2">
            {PRESETS.map((p, i) => (
              <button
                key={p.freq}
                type="button"
                onClick={() => setFreqIdx(i)}
                aria-pressed={freqIdx === i}
                className={`rounded-card border px-2 py-2 text-center transition-colors ${
                  freqIdx === i
                    ? "border-accent bg-accent-soft/60 text-ink"
                    : "border-rule text-ink-soft hover:border-accent"
                }`}
              >
                <span className="block text-sm font-medium">{p.label}</span>
                <span className="block text-xs">{p.note}</span>
              </button>
            ))}
          </div>
        </fieldset>

        <div className="flex flex-wrap items-center justify-center gap-3">
          <button
            type="button"
            onClick={toggleSound}
            className="rounded-full bg-accent px-6 py-3 text-sm font-medium text-paper hover:opacity-90 transition-opacity"
          >
            {running ? "Stop sound" : "Begin sound"}
          </button>
          <button
            type="button"
            onClick={toggleMic}
            aria-pressed={micOn}
            className={`rounded-full px-6 py-3 text-sm font-medium transition-colors ${
              micOn
                ? "bg-deep text-paper"
                : "border border-deep text-deep hover:bg-deep-soft"
            }`}
          >
            {micOn ? "Mic live" : "Use microphone"}
          </button>
        </div>

        <label className="block text-center text-sm text-ink-soft">
          Petals: {petals}
          <input
            type="range"
            min="6"
            max="12"
            value={petals}
            onChange={(e) => setPetals(Number(e.target.value))}
            className="mt-1 w-full accent-[var(--accent)]"
          />
        </label>

        {micError && <p className="text-center text-sm text-accent">{micError}</p>}
        <p className="text-center text-xs text-ink-soft">
          Nothing is recorded. The microphone only feeds the visualizer live.
        </p>
      </div>
    </div>
  );
}
