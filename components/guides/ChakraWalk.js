"use client";

import { useEffect, useRef, useState } from "react";
import { chakras, glyphOf } from "@/data/chakras";
import { BODY, SIT, drawBody, solve } from "@/lib/chanchal/body";
import { motionAllowed, onMotionChange } from "@/lib/motion";

// "Walk up the spine." A seated figure, drawn with Chanchal's own body, stays
// in view while the seven centres scroll past. The centre being read lights
// up on the figure, and its symbol opens behind that spot. The seven beads
// beside the figure, set out like a spine, jump to a centre.

const token = (name) => getComputedStyle(document.documentElement).getPropertyValue(name).trim();

// Where the figure and its seven points fall inside a box of w by h pixels.
function layout(w, h) {
  const tall = BODY.torso + BODY.head * 2 + BODY.stroke / 2 + 19; // crown to folded feet, in body units
  const wide = 66;
  const k = Math.min((h * 0.92) / tall, (w * 0.92) / wide);
  const hipY = (h - tall * k) / 2 + (tall - 19) * k;
  const pts = solve(SIT, w / 2, hipY, k);
  const hip = [pts[4], pts[5]];
  const neck = [pts[2], pts[3]];
  const head = [pts[0], pts[1]];
  const r = Math.hypot(head[0] - neck[0], head[1] - neck[1]);
  const spots = chakras.map((c) => {
    if (c.at.head === "brow") return head;
    if (c.at.head === "crown") return [head[0], head[1] - r];
    const t = c.at.spine;
    return [hip[0] + (neck[0] - hip[0]) * t, hip[1] + (neck[1] - hip[1]) * t];
  });
  return { k, pts, spots };
}

export default function ChakraWalk() {
  const [active, setActive] = useState(0);
  const [mark, setMark] = useState(null); // where the lit centre is, in px inside the diagram
  const canvasRef = useRef(null);
  const state = useRef({ active: 0, from: null, since: 0, raf: 0, moving: false, seen: true });

  // the centre crossing the middle of the window is the one being read
  useEffect(() => {
    const items = [...document.querySelectorAll("[data-chakra]")];
    const watch = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) setActive(Number(entry.target.dataset.chakra));
        }
      },
      { rootMargin: "-46% 0px -46% 0px", threshold: 0 },
    );
    items.forEach((item) => watch.observe(item));
    return () => watch.disconnect();
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    const s = state.current;
    const colors = { body: token("--color-paper"), edge: token("--color-ink"), dots: chakras.map((c) => token(c.token)) };
    let geo = null;
    let w = 0;
    let h = 0;

    const size = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = canvas.clientWidth;
      h = canvas.clientHeight;
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      geo = layout(w, h);
      const [x, y] = geo.spots[s.active];
      setMark({ x, y });
      draw(performance.now());
    };

    const draw = (now) => {
      if (!geo) return;
      const { k, pts, spots } = geo;
      ctx.clearRect(0, 0, w, h);
      // a slimmer line than Chanchal's own, so the arms read apart from the spine
      drawBody(ctx, pts, k, { color: colors.body, lineWidth: 4 });
      // the lit bead travels from the last centre to this one
      const to = spots[s.active];
      const from = s.from || to;
      const u = s.moving ? Math.min(1, (now - s.since) / 460) : 1;
      const ease = 1 - Math.pow(1 - u, 3);
      const bx = from[0] + (to[0] - from[0]) * ease;
      const by = from[1] + (to[1] - from[1]) * ease;
      const beat = s.moving ? 1 + 0.07 * Math.sin(now / 640) : 1;
      spots.forEach(([x, y], i) => {
        if (i === s.active) return;
        ctx.beginPath();
        ctx.arc(x, y, 1.5 * k, 0, Math.PI * 2);
        ctx.fillStyle = colors.dots[i];
        ctx.fill();
        ctx.lineWidth = 0.42 * k;
        ctx.strokeStyle = colors.edge;
        ctx.stroke();
      });
      ctx.beginPath();
      ctx.arc(bx, by, 3.3 * k * beat, 0, Math.PI * 2);
      ctx.fillStyle = colors.dots[s.active];
      ctx.fill();
      ctx.lineWidth = 0.6 * k;
      ctx.strokeStyle = colors.edge;
      ctx.stroke();
      return u < 1;
    };

    const loop = (now) => {
      draw(now);
      s.raf = s.moving && s.seen && !document.hidden ? requestAnimationFrame(loop) : 0;
    };
    const wake = () => {
      s.moving = motionAllowed();
      if (s.moving && !s.raf) s.raf = requestAnimationFrame(loop);
      if (!s.moving) draw(performance.now());
    };
    s.redraw = () => {
      if (geo) {
        const [x, y] = geo.spots[s.active];
        setMark({ x, y });
      }
      wake();
    };

    const resize = new ResizeObserver(size);
    resize.observe(canvas);
    const seen = new IntersectionObserver(([entry]) => {
      s.seen = entry.isIntersecting;
      wake();
    });
    seen.observe(canvas);
    const stopMotion = onMotionChange(wake);
    document.addEventListener("visibilitychange", wake);
    size();
    wake();

    return () => {
      cancelAnimationFrame(s.raf);
      s.raf = 0;
      resize.disconnect();
      seen.disconnect();
      stopMotion();
      document.removeEventListener("visibilitychange", wake);
    };
  }, []);

  // a new centre: start the bead from where it was
  useEffect(() => {
    const s = state.current;
    if (s.active === active) return;
    s.fromIndex = s.active;
    s.active = active;
    s.since = performance.now();
    s.from = null;
    const canvas = canvasRef.current;
    if (canvas && canvas.clientWidth) s.from = layout(canvas.clientWidth, canvas.clientHeight).spots[s.fromIndex];
    if (s.redraw) s.redraw();
  }, [active]);

  const jump = (n) => {
    setActive(n);
    document.getElementById(chakras[n].id)?.scrollIntoView({ block: "start" });
  };

  const lit = chakras[active];

  return (
    <section className="band field-ink cut-a" aria-label="The seven centres">
      <div className="wrap chakra">
        <div className="chakra__figure">
          <div
            className="chakra__diagram"
            style={{ "--c": `var(${lit.token})`, "--glyph": `url(${glyphOf(lit.id)})`, "--x": `${mark ? mark.x : 0}px`, "--y": `${mark ? mark.y : 0}px` }}
          >
            {mark && <span key={lit.id} className="chakra__bloom" aria-hidden="true" />}
            <canvas
              ref={canvasRef}
              role="img"
              aria-label={`A seated figure with seven centres marked, from the base of the spine to the crown of the head. Lit now: ${lit.name}, ${lit.en}. ${lit.where}.`}
            />
          </div>
          <ul className="chakra__nav" aria-label="Jump to a centre">
            {chakras.map((c, n) => (
              <li key={c.id}>
                <button
                  type="button"
                  aria-label={`${c.name}, ${c.en}`}
                  aria-current={n === active ? "true" : undefined}
                  style={{ "--c": `var(${c.token})`, "--glyph": `url(${glyphOf(c.id)})` }}
                  onClick={() => jump(n)}
                >
                  <span aria-hidden="true" />
                </button>
              </li>
            ))}
          </ul>
        </div>

        <ol className="chakra__list">
          {chakras.map((c, n) => (
            <li
              key={c.id}
              id={c.id}
              className="chakra__item"
              data-chakra={n}
              style={{ "--c": `var(${c.token})`, "--glyph": `url(${glyphOf(c.id)})` }}
            >
              <span className="chakra__mark" role="img" aria-label={`${c.name} chakra symbol`} />
              <div className="chakra__text">
                <div className="stack-s">
                  <h2 className="head">{c.name}</h2>
                  <p className="title chakra__en">{c.en}</p>
                </div>
                <p className="lead">{c.note}</p>
                <dl className="rows">
                  <div>
                    <dt>Where</dt>
                    <dd>{c.where}</dd>
                  </div>
                  <div>
                    <dt>Colour</dt>
                    <dd>{c.colour}</dd>
                  </div>
                  <div>
                    <dt>Element</dt>
                    <dd>{c.element}</dd>
                  </div>
                  <div>
                    <dt>Seed sound</dt>
                    <dd>{c.seed}</dd>
                  </div>
                  <div>
                    <dt>Governs</dt>
                    <dd>{c.governs}</dd>
                  </div>
                </dl>
                <p>{c.detail}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
