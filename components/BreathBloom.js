"use client";

import { useEffect, useRef } from "react";
import { breath, lungs } from "@/lib/breathSignal";
import { motionAllowed, onMotionChange } from "@/lib/motion";

// The breathing bloom. While a practice runs, the sun turns into a flower:
// rays of cut paper shoot out across the band as the lungs fill and pull back
// as they empty, rings of petals open from under the sun one after another
// and fold away again, each ring turning against the one inside it, and
// specks of air spiral in on the breath in and out on the breath out. Every
// round adds a ring, up to six, and starts with a burst of petal chips. The
// last breath leaves the whole flower open for a moment.
//
// Mount it as the first child of a positioned section. It fills that section,
// sits behind the words and centres itself on the first element inside the
// section that matches `anchor` (the sun). It reads the site's breath signal
// by itself, so a page only has to run a practice with lib/useBreath.js.
//
//   <BreathBloom anchor=".sun" tone="paper" />
//
// tone names the field the flower sits on: "paper", "pond", "sun" or "ink".
// spread scales how far the petals reach past the sun. At 1 the widest ring
// ends about two and a half sun radii out, which suits the hero, where the
// words step aside. Where words stay close to the sun, a smaller spread
// keeps the petals off them (0.34 ends them one and a half radii out).
// The canvas is out of the page entirely (display: none) until a breath runs.

const TAU = Math.PI * 2;
const RINGS = 6;
const TONES = {
  paper: { ray: "--color-sun", speck: "--color-accent", petals: ["--color-lotus", "--color-pond", "--color-accent", "--color-sun-2", "--color-pond-2", "--color-lotus"] },
  pond: { ray: "--color-pond-2", speck: "--color-paper", petals: ["--color-lotus", "--color-paper", "--color-accent", "--color-sun-2", "--color-pond-soft", "--color-lotus"] },
  // words on the sun field are ink, so its petals stay light enough to read ink on
  sun: { ray: "--color-sun-2", speck: "--color-ink", petals: ["--color-lotus", "--color-paper", "--color-accent", "--color-paper-2", "--color-lotus", "--color-paper"] },
  ink: { ray: "--color-ink-2", speck: "--color-paper", petals: ["--color-lotus", "--color-sun", "--color-accent", "--color-paper", "--color-pond", "--color-lotus"] },
};

const token = (name) => getComputedStyle(document.documentElement).getPropertyValue(name).trim();
const clamp01 = (u) => Math.min(1, Math.max(0, u));
const ease = (u) => u * u * (3 - 2 * u);

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

export default function BreathBloom({ anchor, tone = "paper", spread = 1 }) {
  const ref = useRef(null);

  useEffect(() => {
    const canvas = ref.current;
    const host = canvas.parentElement;
    const ctx = canvas.getContext("2d");
    const names = TONES[tone] || TONES.paper;
    const colors = { ray: token(names.ray), speck: token(names.speck), petals: names.petals.map(token) };
    const s = {
      raf: 0,
      w: 0,
      h: 0,
      dpr: 1,
      cx: 0, // the middle of the sun, in canvas pixels
      cy: 0,
      R: 100, // the sun's radius
      amp: 0, // 0 when the flower is away, 1 when it is out
      held: 0, // rises during a hold, so the petals can shiver
      rounds: 0,
      born: [], // when each ring first appeared
      chips: [],
      t: 0,
      last: 0,
      placedAt: 0,
      stamp: breath().changedAt,
      wasRunning: false,
      finished: false,
    };
    const specks = Array.from({ length: 46 }, (_, j) => ({
      a: (j / 46) * TAU + Math.random() * 0.4,
      v: Math.random(), // 0 far out, 1 at the sun
      speed: 0.7 + Math.random() * 0.6,
      size: 0.6 + Math.random() * 0.8,
    }));

    const place = () => {
      const target = host.querySelector(anchor);
      const box = canvas.getBoundingClientRect();
      if (!target || !box.width) return;
      const r = target.getBoundingClientRect();
      s.cx = r.left + r.width / 2 - box.left;
      s.cy = r.top + r.height / 2 - box.top;
      s.R = target.offsetWidth / 2;
    };
    const size = () => {
      const w = canvas.clientWidth;
      const h = canvas.clientHeight;
      if (!w || !h) return;
      let dpr = Math.min(window.devicePixelRatio || 1, 2);
      if (w * h * dpr * dpr > 4.2e6) dpr = 1; // a tall band on a dense screen: draw at one to one
      s.w = w;
      s.h = h;
      s.dpr = dpr;
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      place();
    };

    const burst = (count) => {
      for (let j = 0; j < count; j++) {
        const a = Math.random() * TAU;
        s.chips.push({ a, r: s.R * 1.02, v: (0.9 + Math.random() * 1.2) * s.R, rot: a, spin: (Math.random() - 0.5) * 6, age: 0, life: 0.9 + Math.random() * 0.6, c: j % colors.petals.length });
      }
    };

    const draw = (b, full, dt) => {
      const { cx, cy, R, amp } = s;
      ctx.setTransform(s.dpr, 0, 0, s.dpr, 0, 0);
      ctx.clearRect(0, 0, s.w, s.h);
      const rings = Math.min(RINGS, 1 + s.rounds);
      while (s.born.length < rings) s.born.push(s.t);

      // rays: a sunburst that reaches out as the lungs fill
      const rays = 14;
      const reach = R * (0.86 + 2.05 * full) * amp;
      const turn = s.t * 0.05 + full * 0.18;
      const half = (TAU / rays) * 0.2;
      if (reach > R * 0.9) {
        ctx.fillStyle = colors.ray;
        ctx.beginPath();
        for (let j = 0; j < rays; j++) {
          const a = turn + (j / rays) * TAU;
          ctx.moveTo(cx + Math.cos(a - half) * R * 0.8, cy + Math.sin(a - half) * R * 0.8);
          const far = j % 2 ? reach * 0.72 : reach; // long, short, long, short
          ctx.lineTo(cx + Math.cos(a - half) * far, cy + Math.sin(a - half) * far);
          ctx.lineTo(cx + Math.cos(a + half) * far, cy + Math.sin(a + half) * far);
          ctx.lineTo(cx + Math.cos(a + half) * R * 0.8, cy + Math.sin(a + half) * R * 0.8);
          ctx.closePath();
        }
        ctx.fill();
      }

      // rings of petals, the outer ones first so the inner ones lie on top. The
      // inner rings open first and each ring turns against its neighbour.
      for (let i = rings - 1; i >= 0; i--) {
        const count = 10 + 4 * i;
        const open = ease(clamp01((full - 0.09 * i) / (1 - 0.09 * (rings - 1)))) * amp * ease(clamp01((s.t - s.born[i]) / 0.8));
        if (open < 0.004) continue;
        const dir = i % 2 ? -1 : 1;
        const spin = dir * ((1 - open) * 0.55 + s.t * 0.035) + i * 0.37;
        const length = R * (0.42 + 0.2 * i) * spread * open;
        ctx.fillStyle = colors.petals[i % colors.petals.length];
        ctx.beginPath();
        for (let j = 0; j < count; j++) {
          const l = length * (1 + 0.04 * s.held * Math.sin(j * 1.7 + s.t * 6 + i));
          petal(ctx, cx, cy, spin + (j / count) * TAU, R * 1.02, l, Math.tan(Math.PI / count) * (R * 1.02 + l * 0.44) * 0.5);
        }
        ctx.fill();
      }

      // air: specks that spiral in on the breath in, out on the breath out, and hang still on a hold
      if (b.running) {
        const flow = b.kind === "in" ? 1 : b.kind === "out" ? -1 : 0;
        ctx.fillStyle = colors.speck;
        ctx.beginPath();
        for (const q of specks) {
          q.v = (((q.v + dt * q.speed * 0.45 * flow) % 1) + 1) % 1;
          const r = R * (2.5 - 1.55 * q.v);
          const a = q.a + q.v * 1.1 + s.t * 0.02;
          const dot = (1.2 + 2.6 * Math.sin(Math.PI * q.v)) * q.size * amp;
          const x = cx + Math.cos(a) * r;
          const y = cy + Math.sin(a) * r;
          ctx.moveTo(x + dot, y);
          ctx.arc(x, y, dot, 0, TAU);
        }
        ctx.fill();
      }

      // chips thrown out at the start of each round and at the end
      for (const c of s.chips) {
        c.age += dt;
        c.r += c.v * dt;
        c.v *= 0.965;
        c.rot += c.spin * dt;
        const small = (1 - c.age / c.life) * R * 0.11;
        if (small <= 0) continue;
        ctx.fillStyle = colors.petals[c.c];
        ctx.beginPath();
        petal(ctx, cx + Math.cos(c.a) * c.r, cy + Math.sin(c.a) * c.r, c.rot, 0, small * 2.2, small * 0.45);
        ctx.fill();
      }
      s.chips = s.chips.filter((c) => c.age < c.life);
    };

    const rest = () => {
      cancelAnimationFrame(s.raf);
      s.raf = 0;
      s.amp = 0;
      s.chips.length = 0;
      canvas.classList.remove("is-on");
    };

    const frame = (now) => {
      const dt = Math.min(0.05, Math.max(0, (now - s.last) / 1000));
      s.last = now;
      s.t += dt;
      const b = breath();
      if (b.changedAt !== s.stamp) {
        s.stamp = b.changedAt;
        if (b.running && !s.wasRunning) {
          s.rounds = 0;
          s.born.length = 0;
          s.finished = false;
        }
        if (b.running && b.kind === "in") {
          s.rounds += 1;
          if (s.rounds > 1) burst(14);
        }
        if (!b.running && s.wasRunning) {
          s.finished = b.done;
          if (b.done) burst(30);
        }
        s.wasRunning = b.running;
      }
      // after the last breath the whole flower stays open for a moment, then leaves
      const lingering = s.finished && !b.running && now - b.endedAt < 1500;
      const out = b.running || lingering;
      s.amp += ((out ? 1 : 0) - s.amp) * Math.min(1, dt * (out ? 2.2 : 1.8));
      s.held += ((b.running && b.kind === "hold" ? 1 : 0) - s.held) * Math.min(1, dt * 4);
      if (now > s.placedAt) {
        s.placedAt = now + 400;
        place();
      }
      draw(b, lingering ? 1 : lungs(now), dt);
      if ((out || s.amp > 0.01 || s.chips.length) && motionAllowed() && !document.hidden) s.raf = requestAnimationFrame(frame);
      else rest();
    };

    const wake = () => {
      if (s.raf || !motionAllowed() || !breath().running) return;
      canvas.classList.add("is-on");
      size();
      s.last = performance.now();
      s.placedAt = 0;
      s.raf = requestAnimationFrame(frame);
    };

    const onResize = () => {
      if (s.raf) size();
    };
    const stopMotion = onMotionChange((on) => (on ? wake() : rest()));
    window.addEventListener("jm:breath", wake);
    window.addEventListener("resize", onResize, { passive: true });
    document.addEventListener("visibilitychange", wake);
    wake();

    return () => {
      rest();
      stopMotion();
      window.removeEventListener("jm:breath", wake);
      window.removeEventListener("resize", onResize);
      document.removeEventListener("visibilitychange", wake);
    };
  }, [anchor, tone, spread]);

  return <canvas ref={ref} className="bloom" data-tone={tone} aria-hidden="true" />;
}
