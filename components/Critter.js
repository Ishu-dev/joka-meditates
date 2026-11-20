"use client";

import { useEffect, useRef } from "react";
import { critters, inks } from "@/data/critters";
import { motionAllowed, onMotionChange } from "@/lib/motion";

// A pixel creature from data/critters.js, painted with the site's own colours
// and scaled up with hard pixels.
//
//   <Critter name="cat" />
//   <Critter name="lizard" run tilt={1.8} />
//
// The frames are painted once, side by side, into one small picture that is
// set as the background of an empty box; showing a frame is a matter of
// sliding that picture along. The creatures are decoration, so they are a
// background and not an image in the page.
//
// With `run`, the creature walks back and forth along its parent, stopping now
// and then. `tilt` is how far the edge it runs on drops from right to left,
// in vw (a negative number drops from left to right), so its feet stay on a
// slanted edge.
//
// Every creature on a page shares one clock. Creatures that are off screen
// are skipped, and with motion off each one holds its first frame.

const live = new Set();
const sheets = new Map();
let timer = 0;
let eye = null;

// All the frames of one creature in a row, as a picture the stylesheet can use.
function sheetOf(name) {
  if (sheets.has(name)) return sheets.get(name);
  const sprite = critters[name];
  const css = getComputedStyle(document.documentElement);
  const canvas = document.createElement("canvas");
  canvas.width = sprite.w * sprite.frames.length;
  canvas.height = sprite.h;
  const ctx = canvas.getContext("2d");
  const ink = {};
  sprite.frames.forEach((rows, f) => {
    for (let y = 0; y < sprite.h; y++) {
      for (let x = 0; x < sprite.w; x++) {
        const letter = rows[y][x];
        if (letter === ".") continue;
        ink[letter] ||= css.getPropertyValue(inks[letter]).trim();
        ctx.fillStyle = ink[letter];
        ctx.fillRect(f * sprite.w + x, y, 1, 1);
      }
    }
  });
  const url = `url(${canvas.toDataURL("image/png")})`;
  sheets.set(name, url);
  return url;
}

function show(c) {
  const last = c.sprite.frames.length - 1;
  c.el.style.backgroundPosition = `${last ? (c.frame * 100) / last : 0}% 0`;
}

// Puts a runner where it has got to, with its feet on the slanted edge.
function place(c) {
  const band = c.track.parentElement;
  const wide = c.el.clientWidth;
  const along = (c.track.offsetLeft + c.x + wide / 2) / (band.clientWidth || 1);
  const drop = (Math.abs(c.tilt) * window.innerWidth) / 100;
  const down = c.tilt >= 0 ? drop * (1 - along) : drop * along;
  // the drawings face right, so one heading left is mirrored
  c.el.style.transform = `translate3d(${Math.round(c.x)}px, ${Math.round(down)}px, 0)${c.flip ? " scaleX(-1)" : ""}`;
}

function advance(c, now) {
  const play = c.running ? c.sprite.run : c.sprite;
  c.step = (c.step + 1) % play.order.length;
  c.frame = play.order[c.step];
  c.due = now + play.beat;
  if (c.track) {
    const px = c.el.clientWidth / c.sprite.w;
    const far = Math.max(0, c.track.clientWidth - c.el.clientWidth);
    if (c.running) {
      c.x += c.dir * 2 * px; // two of its own pixels a step
      const atEnd = c.x <= 0 || c.x >= far;
      if (atEnd || Math.random() < 0.012) {
        c.x = Math.max(0, Math.min(far, c.x));
        c.running = false;
        c.rest = now + 1600 + Math.random() * 2600;
        c.step = -1;
      }
    } else if (now > c.rest) {
      c.running = true;
      c.dir = c.x <= 0 ? 1 : c.x >= far ? -1 : Math.random() < 0.5 ? 1 : -1;
      c.flip = c.dir < 0;
      c.step = -1;
    }
    place(c);
  }
  show(c);
}

function clock() {
  const want = live.size > 0 && motionAllowed();
  if (want && !timer) {
    timer = setInterval(() => {
      const now = performance.now();
      for (const c of live) if (c.seen && now >= c.due) advance(c, now);
    }, 50);
  } else if (!want && timer) {
    clearInterval(timer);
    timer = 0;
  }
}

export default function Critter({ name, run = false, tilt = 0, className = "" }) {
  const ref = useRef(null);
  const sprite = critters[name];

  useEffect(() => {
    const el = ref.current;
    if (!el || !sprite) return undefined;
    el.style.backgroundImage = sheetOf(name);
    el.style.backgroundSize = `${sprite.frames.length * 100}% 100%`;
    const c = {
      el,
      sprite,
      frame: sprite.order[0],
      step: 0,
      due: performance.now() + Math.random() * sprite.beat,
      seen: true,
      flip: false,
      track: run && sprite.run ? el.parentElement : null,
      tilt,
      x: 0,
      dir: 1,
      running: false,
      rest: performance.now() + 900 + Math.random() * 1500,
    };
    if (c.track) {
      // start somewhere along the edge, not always at its end
      c.x = Math.random() * Math.max(0, c.track.clientWidth - el.clientWidth);
      place(c);
    }
    show(c);
    el.__critter = c;
    if (!eye) {
      eye = new IntersectionObserver((entries) => {
        for (const entry of entries) if (entry.target.__critter) entry.target.__critter.seen = entry.isIntersecting;
      });
    }
    eye.observe(el);
    live.add(c);
    clock();
    const stopMotion = onMotionChange(clock);
    const onResize = () => {
      if (!c.track) return;
      c.x = Math.min(c.x, Math.max(0, c.track.clientWidth - el.clientWidth));
      place(c);
    };
    window.addEventListener("resize", onResize, { passive: true });
    return () => {
      live.delete(c);
      eye.unobserve(el);
      stopMotion();
      window.removeEventListener("resize", onResize);
      clock();
    };
  }, [name, sprite, run, tilt]);

  if (!sprite) return null;
  return <span ref={ref} className={className ? `critter ${className}` : "critter"} style={{ "--w": sprite.w, "--h": sprite.h }} aria-hidden="true" />;
}
