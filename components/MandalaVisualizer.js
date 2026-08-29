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
  const h = (hex || "").trim().replace("#", "");
  if (h.length !== 6) return null;
  return [
    parseInt(h.slice(0, 2), 16),
    parseInt(h.slice(2, 4), 16),
    parseInt(h.slice(4, 6), 16),
  ];
}

function makeSprite(rgb, size = 64) {
  const c = document.createElement("canvas");
  c.width = size;
  c.height = size;
  const g = c.getContext("2d");
  const grad = g.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2);
  grad.addColorStop(0, `rgba(${rgb[0]},${rgb[1]},${rgb[2]},1)`);
  grad.addColorStop(0.35, `rgba(${rgb[0]},${rgb[1]},${rgb[2]},0.55)`);
  grad.addColorStop(1, `rgba(${rgb[0]},${rgb[1]},${rgb[2]},0)`);
  g.fillStyle = grad;
  g.fillRect(0, 0, size, size);
  return c;
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
    count: 2400,
    accent: [194, 68, 126],
    deep: [47, 93, 84],
    paper: [244, 242, 234],
    sprites: null,
    reduced: false,
    parts: null,
  });
  const [running, setRunning] = useState(false);
  const [micOn, setMicOn] = useState(false);
  const [petals, setPetals] = useState(8);
  const [freqIdx, setFreqIdx] = useState(3);
  const [micError, setMicError] = useState(null);

  const initParticles = useCallback(() => {
    const s = st.current;
    const n = s.count;
    const parts = new Float32Array(n * 5);
    for (let i = 0; i < n; i++) {
      const ring = i % 3;
      parts[i * 5] = ring;
      parts[i * 5 + 1] = i % s.petals;
      parts[i * 5 + 2] = Math.random();
      parts[i * 5 + 3] = 0.25 + Math.random() * 0.75;
      parts[i * 5 + 4] = Math.random() * Math.PI * 2;
    }
    s.parts = parts;
  }, []);

  const buildSprites = useCallback(() => {
    const s = st.current;
    const mix = s.accent.map((v, i) => Math.round(v * 0.55 + s.paper[i] * 0.45));
    s.sprites = [makeSprite(s.deep), makeSprite(mix), makeSprite(s.accent)];
  }, []);

  const drawFrame = useCallback(
    (time) => {
      const canvas = canvasRef.current;
      const s = st.current;
      if (!canvas || !s.parts || !s.sprites) return;
      const ctx = canvas.getContext("2d");
      const w = canvas.width;
      const h = canvas.height;
      const cx = w / 2;
      const cy = h / 2;
      const R = Math.min(w, h) * 0.4;
      const t = time / 1000;

      let bass = 0.22;
      let mid = 0.28;
      let high = 0.18;
      if (s.analyser && s.data) {
        s.analyser.getByteFrequencyData(s.data);
        const avg = (from, to) => {
          let sum = 0;
          for (let i = from; i < to; i++) sum += s.data[i];
          return sum / (to - from) / 255;
        };
        bass = Math.max(avg(2, 10), 0.05);
        mid = Math.max(avg(11, 42), 0.05);
        high = Math.max(avg(43, 100), 0.05);
      } else {
        bass = 0.18 + 0.1 * Math.sin(t * 0.8);
        mid = 0.24 + 0.1 * Math.sin(t * 0.5 + 1);
        high = 0.14 + 0.08 * Math.sin(t * 1.3 + 2);
      }

      const bands = [bass, mid, high];
      const ringBase = [0.38, 0.66, 0.95];
      const ringSpeed = [0.22, -0.16, 0.1];
      const sector = (2 * Math.PI) / s.petals;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);

      ctx.globalCompositeOperation = "source-over";
      ctx.globalAlpha = 1;
      ctx.fillStyle = `rgba(${s.paper[0]},${s.paper[1]},${s.paper[2]},0.16)`;
      ctx.fillRect(0, 0, w, h);

      ctx.globalCompositeOperation = "lighter";

      const parts = s.parts;
      const n = s.count;
      for (let i = 0; i < n; i++) {
        const ring = parts[i * 5];
        const sec = parts[i * 5 + 1];
        const off = parts[i * 5 + 2];
        const speed = parts[i * 5 + 3];
        const wob = parts[i * 5 + 4];
        const band = bands[ring];
        const dir = ring === 1 ? -1 : 1;
        const r0 = R * ringBase[ring] * (1 + band * 0.5) * (0.86 + 0.14 * Math.sin(wob + t * speed * 2));
        const mirror = i % 2 === 0 ? 1 : -1;
        const a =
          sec * sector +
          mirror * off * sector * 0.9 +
          t * ringSpeed[ring] * speed * 0.6;
        const rr = r0 * (1 + 0.12 * Math.sin(t * 1.4 + wob * 3) * band * 2);
        const x = cx + Math.cos(a) * rr;
        const y = cy + Math.sin(a) * rr;
        const size = (2 + band * 7) * dpr * (0.5 + speed * 0.5);
        ctx.globalAlpha = 0.28 + band * 0.6;
        ctx.drawImage(s.sprites[ring], x - size / 2, y - size / 2, size, size);
      }

      const coreR = R * 0.12 * (1 + bass * 1.1);
      ctx.globalAlpha = 0.85;
      ctx.drawImage(
        s.sprites[2],
        cx - coreR * 2,
        cy - coreR * 2,
        coreR * 4,
        coreR * 4
      );

      ctx.globalCompositeOperation = "source-over";
      ctx.globalAlpha = 0.3 + mid * 0.3;
      ctx.beginPath();
      ctx.arc(cx, cy, R * 1.16, 0, 2 * Math.PI);
      ctx.strokeStyle = `rgba(${s.deep[0]},${s.deep[1]},${s.deep[2]},1)`;
      ctx.lineWidth = Math.max(1, dpr);
      ctx.stroke();
      ctx.globalAlpha = 1;
    },
    []
  );

  useEffect(() => {
    const s = st.current;
    s.reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const readTokens = () => {
      const cs = getComputedStyle(document.documentElement);
      const a = hexToRgb(cs.getPropertyValue("--accent"));
      const d = hexToRgb(cs.getPropertyValue("--deep"));
      const p = hexToRgb(cs.getPropertyValue("--paper"));
      if (a) s.accent = a;
      if (d) s.deep = d;
      if (p) s.paper = p;
      buildSprites();
      if (s.reduced) drawFrame(0);
    };
    readTokens();
    const themeObserver = new MutationObserver(readTokens);
    themeObserver.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["data-theme"],
    });

    const canvas = canvasRef.current;
    s.count = canvas.clientWidth < 480 ? 1200 : 2400;
    initParticles();

    const resize = () => {
      if (!canvas) return;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = canvas.clientWidth * dpr;
      canvas.height = canvas.clientHeight * dpr;
      const ctx = canvas.getContext("2d");
      ctx.fillStyle = `rgba(${s.paper[0]},${s.paper[1]},${s.paper[2]},1)`;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      if (s.reduced) drawFrame(0);
    };
    resize();
    window.addEventListener("resize", resize);

    if (s.reduced) {
      drawFrame(2000);
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
  }, [drawFrame, initParticles, buildSprites]);

  useEffect(() => {
    st.current.petals = petals;
    initParticles();
    if (st.current.reduced) drawFrame(0);
  }, [petals, initParticles, drawFrame]);

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

  useEffect(
    () => () => {
      const s = st.current;
      cancelAnimationFrame(s.raf);
      s.drone?.stop();
      s.micStream?.getTracks().forEach((track) => track.stop());
      try {
        s.micSource?.disconnect();
      } catch {}
    },
    []
  );

  return (
    <div className="rounded-card border border-rule bg-deep-soft/20 p-5 sm:p-8">
      <div className="relative mx-auto aspect-square w-full max-w-md overflow-hidden rounded-full">
        <canvas
          ref={canvasRef}
          className="h-full w-full"
          role="img"
          aria-label="Particle mandala that reacts to sound"
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
          Symmetry: {petals} petals
          <input
            type="range"
            min="5"
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
