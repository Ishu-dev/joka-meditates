"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { motionAllowed } from "@/lib/motion";
import { breath, lungs } from "@/lib/breathSignal";
import { BODY, KEYS, LIMITS, SIT, STAND, clampPose, drawBody, mixPose, pose, solve } from "@/lib/chanchal/body";
import { CROUCH, FIDGETS, breatheSit, cheer, fall, giggle, sit, swim, talk, tread, wave } from "@/lib/chanchal/moves";
import { voice } from "@/lib/chanchal/voice";

// Chanchal: the restless mind of Gita 6.34, drawn as a loose stick figure on
// a 420px canvas that follows him around the window.
//
// He is moved by poses, not by falling points. Every frame a move from
// lib/chanchal/moves.js says where each joint should be, a spring carries the
// joint there, and the joint is clamped to what a human one can do. So he
// wobbles and overshoots but never lands in a shape a body could not make.
//
// He drops onto a lily pad when a page has one, waves and says hi, and
// fidgets there. With no pad in view he swims through the open parts of the
// page, paddling when he travels and treading water when he stops. When a
// breathing practice runs he sits and breathes along. He settles as the
// visitor does: every fidget and every wander is scaled by how restless he is.
//
// He also talks. When the visitor moves to a different picture, by pointing
// at it or by scrolling it into view, a small box by his head types out what
// the picture shows and he babbles along, one syllable to a letter or two.
// The words are the picture's own description (its alt text), or the
// data-chanchal-say of the picture or of anything around it.

const BOX = 420;
const TAU = Math.PI * 2;
const RAD = Math.PI / 180;
const WAVE = 2.2; // seconds a wave lasts
const TYPING = 34; // letters a second in his speech box
// What counts as open water under him: boxes that only hold other things.
const OPEN = new Set(["HTML", "BODY", "MAIN", "SECTION", "DIV", "UL", "OL", "DL", "FIGURE", "FIELDSET", "FOOTER", "ARTICLE", "ASIDE", "FORM"]);

const token = (name) => getComputedStyle(document.documentElement).getPropertyValue(name).trim();
const zero = () => Object.fromEntries(KEYS.map((key) => [key, 0]));
const openAt = (x, y) => {
  const el = document.elementFromPoint(x, y);
  return !el || OPEN.has(el.tagName);
};

export default function Chanchal() {
  const canvasRef = useRef(null);
  const sayRef = useRef(null);
  const state = useRef(null);
  const pathname = usePathname();

  // A new page may or may not have a pad to land on.
  useEffect(() => {
    const s = state.current;
    if (!s) return;
    s.perch = document.querySelector("[data-chanchal-perch]");
    // some pages ask him to keep still: the support page is one
    s.hush = Boolean(document.querySelector("[data-chanchal-calm]"));
    s.wander = null;
    // the new page's pictures, once they are in
    const later = setTimeout(() => s.scan && s.scan(), 400);
    return () => clearTimeout(later);
  }, [pathname]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const say = sayRef.current;
    const words = say.firstElementChild;
    const ctx = canvas.getContext("2d");
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = BOX * dpr;
    canvas.height = BOX * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)");
    const fine = window.matchMedia("(pointer: fine)").matches;
    const colors = { lotus: token("--color-lotus"), paper: token("--color-paper") };
    const navHeight = parseFloat(token("--nav-height")) || 72;
    const k = window.innerWidth < 640 ? 1.15 : 1.7; // pixels to one body unit

    let practisedToday = false;
    try {
      const log = JSON.parse(localStorage.getItem("jm-practice-log") || "{}");
      const today = new Intl.DateTimeFormat("en-CA", { timeZone: "Asia/Kolkata" }).format(new Date());
      practisedToday = Array.isArray(log[today]) && log[today].length > 0;
    } catch {}

    const s = {
      x: 0, // the hip, in window pixels
      y: 0,
      vx: 0,
      vy: 0,
      ox: 0, // where the canvas sits
      oy: 0,
      cur: pose(STAND), // the pose he is in
      vel: zero(), // how fast each joint is turning
      jig: zero(), // fast wiggles added on top
      mode: "swim", // "drop" until he lands
      seated: false,
      landT: 9, // seconds since he last sat down
      facing: -1,
      phase: 0, // where he is in a swimming stroke
      tone: 0.22, // how solid he is drawn
      open: true, // is there open water under him
      lookAt: 0,
      calm: practisedToday ? 0.75 : 0,
      calmFloor: practisedToday ? 0.75 : 0,
      t: 0,
      wave: -1,
      cheer: 9,
      tickle: 9,
      fidget: null,
      fidgetAt: 1.4,
      lastFidget: "",
      wander: null,
      puffs: [],
      puffAt: 0,
      puffEnd: 0,
      line: null, // what he is saying
      lastImg: null,
      lastImgAt: 0,
      pendingImg: null,
      inView: new Set(),
      viewTimer: 0,
      breathStamp: breath().changedAt,
      pointer: { x: 0, y: 0, t: -1e9 },
      scrollY: window.scrollY,
      perch: document.querySelector("[data-chanchal-perch]"),
      hush: Boolean(document.querySelector("[data-chanchal-calm]")),
      sitAsked: false,
      settled: 0,
      raf: 0,
    };
    try {
      s.sitAsked = localStorage.getItem("jm-chanchal") === "sit";
    } catch {}
    state.current = s;

    const flat = new Float32Array(22);
    const shown = pose(STAND); // the pose as drawn: the sprung pose plus the wiggles

    const perchPoint = () => {
      if (!s.perch || !s.perch.isConnected) return null;
      const r = s.perch.getBoundingClientRect();
      if (r.bottom < 60 || r.top > window.innerHeight - 10) return null;
      return { x: r.left + r.width * 0.5, y: r.top + r.height * 0.42 };
    };

    const dropFrom = (at) => {
      s.x = at.x + 26;
      s.y = -150;
      s.vx = 0;
      s.vy = 0;
      s.mode = "drop";
      s.seated = false;
      s.tone = 1;
    };

    const start = perchPoint();
    if (start) dropFrom(start);
    else {
      s.x = window.innerWidth - 110;
      s.y = -120;
      s.wave = -0.9;
    }

    const draw = () => {
      for (const key of KEYS) shown[key] = s.cur[key] + s.jig[key];
      clampPose(shown);
      // a small bounce on landing, a bigger one for a cheer
      const hop =
        (s.landT < 0.7 ? 7 * k * Math.exp(-6 * s.landT) * Math.abs(Math.sin(s.landT * 14)) : 0) +
        (s.cheer < 1.3 ? 10 * k * Math.abs(Math.sin(s.cheer * 9)) * (1 - s.cheer / 1.3) : 0);
      const lean = shown.lean * RAD;
      const half = BODY.torso * shown.torso * k * 0.5;
      // the canvas is centred on the middle of his torso
      const ox = s.x + Math.sin(lean) * half - BOX / 2;
      const oy = s.y - hop - Math.cos(lean) * half - BOX / 2;
      s.ox = ox;
      s.oy = oy;
      canvas.style.transform = `translate3d(${ox.toFixed(1)}px, ${oy.toFixed(1)}px, 0)`;
      ctx.clearRect(0, 0, BOX, BOX);
      solve(shown, s.x - ox, s.y - hop - oy, k, flat);
      // lib/chanchal/body.js draws him in the logo's pink with a paper edge,
      // so he reads on every colour field
      drawBody(ctx, flat, k, { color: colors.lotus, halo: colors.paper });
      // breath you can see: small rings that drift off as he breathes out
      if (s.puffs.length) {
        ctx.strokeStyle = colors.lotus;
        ctx.lineWidth = 1.3 * k;
        for (const q of s.puffs) {
          const u = q.age / q.life;
          ctx.globalAlpha = 1 - u;
          ctx.beginPath();
          ctx.arc(q.x - ox, q.y - oy, (2 + 5 * u) * k, 0, TAU);
          ctx.stroke();
        }
        ctx.globalAlpha = 1;
      }
      // solid on a pad and in open water, a faint shape behind words
      canvas.style.opacity = s.tone.toFixed(2);
      // his speech box sits by his head, on whichever side has room
      if (s.line) {
        const hx = flat[0] + ox;
        const top = flat[1] + oy - BODY.head * shown.headR * k - 12;
        const left = hx + 14 * k + s.line.width > window.innerWidth - 8;
        const x = left ? hx - 14 * k : hx + 14 * k;
        const y = Math.max(top, navHeight + s.line.height + 6);
        say.dataset.side = left ? "left" : "right";
        say.style.transform = `translate3d(${x.toFixed(1)}px, ${y.toFixed(1)}px, 0) translate(${left ? "-100%" : "0"}, -100%)`;
      }
    };

    const speak = (text, { about = null, quiet = false } = {}) => {
      const clean = text.replace(/\s+/g, " ").trim();
      if (!clean) return;
      const short = clean.length > 120 ? `${clean.slice(0, clean.lastIndexOf(" ", 116))}...` : clean;
      s.line = { text: short, shown: 0, clock: 0, until: 0, width: 0, height: 0, about, spot: null, spotAt: 0, quiet };
      words.textContent = "";
      delete say.dataset.done;
      say.classList.add("is-on");
      if (!quiet) voice.blup();
    };

    // A place in open water beside a picture, so he is seen next to what he is talking about.
    const spotBeside = (img) => {
      const r = img.getBoundingClientRect();
      const side = 46 * k;
      const top = navHeight + 84 * k;
      const y = Math.min(window.innerHeight - 50 * k, Math.max(top, r.top + Math.min(r.height * 0.6, 110 * k)));
      const tries = [[r.right + side, y], [r.left - side, y], [r.left + r.width / 2, r.bottom + 70 * k], [r.left + r.width / 2, r.top - 30 * k]];
      for (const [x, at] of tries) {
        if (x < side || x > window.innerWidth - side || at < top || at > window.innerHeight - 40 * k) continue;
        if (openAt(x, at) && openAt(x, at - 50 * k)) return { x, y: at };
      }
      return null;
    };

    // The visitor has moved to this picture: say what it shows.
    const tell = (img) => {
      // not while someone is breathing with the page, and not once he has been asked to sit
      if (!motionAllowed() || !img.isConnected || breath().running || s.sitAsked || s.hush) return;
      const now = performance.now();
      if (img === s.lastImg && now - s.lastImgAt < 30000) return;
      const holder = img.closest("[data-chanchal-say]");
      const text = (holder && holder.dataset.chanchalSay) || img.alt || "";
      if (!text.trim()) return;
      // let him finish saying hi first
      if (s.wave > -1 && s.wave < WAVE + 0.4) {
        s.pendingImg = img;
        return;
      }
      s.lastImg = img;
      s.lastImgAt = now;
      speak(text, { about: img });
      wake();
    };

    // Somewhere to swim to when nothing asks him to sit: near the visitor's
    // pointer, or a spot of his own choosing, in open water when there is any.
    const roam = (now) => {
      const left = 46 * k;
      const right = window.innerWidth - 46 * k;
      const top = navHeight + 84 * k;
      const bottom = window.innerHeight - 50 * k;
      const inside = (x, y) => ({ x: Math.min(right, Math.max(left, x)), y: Math.min(bottom, Math.max(top, y)) });
      const w = s.wander;
      if (fine && now - s.pointer.t < 2600) {
        if (!w || w.kind !== "near" || now > w.checkAt) {
          const { x, y } = s.pointer;
          const spots = [[80, 60], [-80, 60], [80, -80], [-80, -80]].map(([dx, dy]) => inside(x + dx, y + dy));
          const spot = spots.find((p) => openAt(p.x, p.y)) || spots[0];
          s.wander = { kind: "near", x: spot.x, y: spot.y, checkAt: now + 500 };
        }
        return s.wander;
      }
      if (!w || w.kind !== "far" || s.t > w.leaveAt) {
        let spot = inside(s.x, s.y);
        for (let n = 0; n < 8; n++) {
          spot = { x: left + Math.random() * (right - left), y: top + Math.random() * (bottom - top) };
          if (openAt(spot.x, spot.y) && openAt(spot.x, spot.y - 46 * k)) break;
        }
        // nine seconds to get there, then the stay is counted from his arrival
        s.wander = { kind: "far", x: spot.x, y: spot.y, leaveAt: s.t + 9, arrived: false };
      } else if (!w.arrived && Math.hypot(w.x - s.x, w.y - s.y) < 26 * k) {
        w.arrived = true;
        w.leaveAt = s.t + 2.2 + Math.random() * 3 + s.calm * 6;
      }
      return s.wander;
    };

    // One fidget at a time, laid over the sitting pose. They come less often
    // as he calms down, and stop when he is calm.
    const fidgetOver = (aim, dt, restless) => {
      if (!s.fidget) {
        if (restless < 0.06 || s.t < s.fidgetAt) return;
        const names = Object.keys(FIDGETS).filter((name) => name !== s.lastFidget);
        const name = names[Math.floor(Math.random() * names.length)];
        s.fidget = { name, u: 0, length: 0.8 + Math.random() * 0.9, side: Math.random() < 0.5 ? -1 : 1 };
        s.lastFidget = name;
      }
      const f = s.fidget;
      f.u += dt / f.length;
      if (f.u >= 1) {
        s.fidget = null;
        s.fidgetAt = s.t + (0.5 + Math.random() * 1.6) / (restless + 0.12);
        return;
      }
      FIDGETS[f.name](f.u, f.side, aim, s.jig);
    };

    const step = (dt, now) => {
      s.t += dt;
      s.landT += dt;
      s.cheer += dt;
      s.tickle += dt;
      const perch = perchPoint();
      const b = breath();
      const still = s.sitAsked || s.hush; // asked to keep still
      const calmGoal = still ? 1 : s.calmFloor;
      if (s.calm < calmGoal) s.calm += (calmGoal - s.calm) * 0.04;
      const restless = 1 - s.calm;

      // a new breath phase: breathe with it, out loud unless it is a silent sit
      if (b.changedAt !== s.breathStamp) {
        s.breathStamp = b.changedAt;
        const seconds = b.dur / 1000;
        if (b.running && b.kind === "in" && !b.gentle) voice.breathIn(seconds);
        if (b.running && b.kind === "out") {
          if (!b.gentle) voice.breathOut(seconds);
          s.puffAt = s.t;
          s.puffEnd = s.t + seconds * 0.7;
        }
        if (!b.running && b.done) {
          s.cheer = 0;
          s.calmFloor = 1;
          s.calm = 1;
          voice.yay();
        }
      }
      if (b.running) s.calm = Math.max(s.calm, b.progress || 0);

      // ---- where he is going ----
      let dest;
      let toSeat = false;
      if (perch) {
        dest = { x: perch.x, y: perch.y - 5 * k };
        toSeat = true;
      } else if (still || b.running) {
        // no pad in view: he sits in the corner of the window
        dest = { x: window.innerWidth - 74 * k, y: window.innerHeight - 14 - 21 * k };
        toSeat = true;
      } else if (s.line && s.line.about && s.line.about.isConnected) {
        // beside the picture he is talking about, if there is open water there
        if (now > s.line.spotAt) {
          s.line.spotAt = now + 300;
          s.line.spot = spotBeside(s.line.about);
        }
        dest = s.line.spot || roam(now);
      } else {
        dest = roam(now);
      }

      if (s.mode === "drop") {
        if (!perch) s.mode = "swim";
        else {
          s.vy += 2200 * dt;
          s.y += s.vy * dt;
          s.x += (dest.x - s.x) * Math.min(1, dt * 3.2);
          if (s.y >= dest.y) {
            s.mode = "swim";
            s.seated = true;
            s.landT = 0;
            s.x = dest.x;
            s.y = dest.y;
            s.vx = 0;
            s.vy = 0;
            s.wave = -0.35;
            voice.plop();
          }
        }
      }
      if (s.mode !== "drop") {
        const dx = dest.x - s.x;
        const dy = dest.y - s.y;
        const dist = Math.hypot(dx, dy) || 0.001;
        if (toSeat && (dist < 14 * k || (s.seated && dist < 300))) {
          // sitting: he rides the pad as the page scrolls
          if (!s.seated) {
            s.seated = true;
            s.landT = 0.2;
            s.vx = 0;
            s.vy = 0;
          }
          s.x += dx * 0.5;
          s.y += dy * 0.5;
        } else {
          // swimming there: he eases off as he arrives, and every pull is followed by a glide
          s.seated = false;
          const near = Math.min(1, dist / (80 * k));
          const top = (toSeat ? 250 : 150 - 60 * s.calm) * k;
          const turn = Math.min(1, dt * 2.6);
          s.vx += ((dx / dist) * top * near - s.vx) * turn;
          s.vy += ((dy / dist) * top * near - s.vy) * turn;
          const surge = 0.7 + 0.3 * (0.5 + 0.5 * Math.sin(s.phase * 2 + 0.6));
          s.x += s.vx * surge * dt;
          s.y += s.vy * surge * dt;
          s.phase = (s.phase + dt * TAU * (0.55 + 0.85 * near)) % TAU;
        }
      }

      // ---- what his body does ----
      for (const key of KEYS) s.jig[key] = 0;
      let aim;
      let stiff = 360;
      let damp = 26;
      if (s.mode === "drop") {
        aim = fall(s.t);
        stiff = 300;
        damp = 22;
      } else if (s.seated) {
        stiff = 110;
        damp = 11;
        if (s.landT < 0.16) aim = pose(CROUCH);
        else if (b.running) aim = breatheSit(lungs(now));
        else {
          aim = sit(still ? 0 : s.t);
          fidgetOver(aim, dt, restless);
        }
      } else {
        const speed = Math.hypot(s.vx, s.vy);
        if (Math.abs(s.vx) > 12 * k) s.facing = s.vx > 0 ? 1 : -1;
        // how far he commits to the stroke: treading when slow, flat out when fast
        const go = Math.min(1, speed / (64 * k));
        aim = mixPose(tread(s.t), swim(s.phase, s.facing), go);
        // his body points along his path: 0 is up, 90 is to the right
        aim.lean += Math.atan2(s.vx, -s.vy) / RAD * go * 0.86;
      }
      if (s.wave > 0 && s.wave < WAVE) wave(s.wave, WAVE, aim, s.jig);
      if (s.cheer < 1.3) cheer(s.t, aim, s.jig);
      if (s.tickle < 0.9) giggle(s.tickle / 0.9, aim, s.jig);

      // ---- what he says ----
      const line = s.line;
      if (line) {
        if (line.shown < line.text.length) {
          line.clock += dt * TYPING;
          const upto = Math.min(line.text.length, Math.floor(line.clock));
          if (upto !== line.shown) {
            // one syllable to every second letter, so it chatters and does not buzz
            if (!line.quiet) {
              for (let i = line.shown; i < upto; i++) {
                if (i % 2 === 0 && /[a-z0-9]/i.test(line.text[i])) voice.babble(line.text[i], i);
              }
            }
            line.shown = upto;
            words.textContent = line.text.slice(0, upto);
            line.width = say.offsetWidth;
            line.height = say.offsetHeight;
            if (upto === line.text.length) {
              line.until = s.t + 1.3 + Math.min(3.6, line.text.length * 0.045);
              say.dataset.done = "";
            }
          }
          if (!line.quiet) talk(s.t, aim, s.jig);
        } else if (s.t > line.until) {
          s.line = null;
          say.classList.remove("is-on");
        }
      }

      // spring every joint toward its aim, then hold it inside its human range
      const hold = Math.exp(-damp * dt);
      for (const key of KEYS) {
        let gap = aim[key] - s.cur[key];
        if (key === "lean") gap = ((((gap + 180) % 360) + 360) % 360) - 180; // the short way round
        s.vel[key] = (s.vel[key] + gap * stiff * dt) * hold;
        s.cur[key] += s.vel[key] * dt;
        const limit = LIMITS[key];
        if (limit) {
          if (s.cur[key] < limit[0]) {
            s.cur[key] = limit[0];
            if (s.vel[key] < 0) s.vel[key] = 0;
          } else if (s.cur[key] > limit[1]) {
            s.cur[key] = limit[1];
            if (s.vel[key] > 0) s.vel[key] = 0;
          }
        }
      }
      s.cur.lean = ((((s.cur.lean + 180) % 360) + 360) % 360) - 180;

      // breath rings leave from his head while he breathes out
      if (s.seated && s.t < s.puffEnd && s.t >= s.puffAt) {
        s.puffAt = s.t + 0.42;
        s.puffs.push({
          x: flat[0] + s.ox - 5 * k,
          y: flat[1] + s.oy + 4 * k,
          vx: -(26 + Math.random() * 12) * k,
          vy: -(4 + Math.random() * 9) * k,
          age: 0,
          life: 1.5,
        });
      }
      for (const q of s.puffs) {
        q.age += dt;
        q.x += q.vx * dt;
        q.y += q.vy * dt;
        q.vx *= 0.985;
      }
      s.puffs = s.puffs.filter((q) => q.age < q.life);

      // solid on his pad and in open water, faint when he is behind words
      if (now > s.lookAt) {
        s.lookAt = now + 160;
        const hx = flat[0] + s.ox;
        const hy = flat[1] + s.oy;
        s.open = openAt(hx, hy) && openAt((s.x + hx) / 2, (s.y + hy) / 2);
      }
      const onStage = s.mode === "drop" || (s.seated && perch);
      s.tone += ((onStage ? 1 : s.open ? 0.9 : 0.22) - s.tone) * 0.07;

      if (s.wave > -1 && s.wave < WAVE + 0.4) {
        s.wave += dt;
        if (s.wave > 0.2 && !s.saidHi) {
          s.saidHi = true;
          // Browsers stay silent until the first click or key press, so a hi
          // that could not be heard is owed for the next minute.
          if (!voice.hi()) s.oweHi = performance.now();
          speak("hi.", { quiet: true });
        }
      } else if (s.pendingImg) {
        const img = s.pendingImg;
        s.pendingImg = null;
        tell(img);
      }
    };

    let last = performance.now();
    const frame = (now) => {
      const dt = Math.min(0.033, (now - last) / 1000);
      last = now;
      step(dt, now);
      draw();
      // once he has been asked to sit and has stopped moving, the loop rests
      let turning = 0;
      for (const key of KEYS) turning += Math.abs(s.vel[key]);
      const busy = breath().running || s.line || s.puffs.length || s.cheer < 1.3 || s.tickle < 0.9 || (s.wave > -1 && s.wave < WAVE + 0.4);
      s.settled = (s.sitAsked || s.hush) && s.seated && !busy && turning < 2 ? s.settled + 1 : 0;
      if (s.settled > 90 || document.hidden) {
        s.raf = 0;
        return;
      }
      s.raf = requestAnimationFrame(frame);
    };
    const wake = () => {
      if (!motionAllowed() || s.raf) return;
      s.settled = 0;
      last = performance.now();
      s.raf = requestAnimationFrame(frame);
    };

    // Reduced motion: no swimming, no fidgets. He simply sits on the pad.
    const sitStill = () => {
      const perch = perchPoint();
      canvas.style.visibility = perch ? "visible" : "hidden";
      if (!perch) return;
      s.x = perch.x;
      s.y = perch.y - 5 * k;
      s.cur = pose(SIT);
      for (const key of KEYS) {
        s.vel[key] = 0;
        s.jig[key] = 0;
      }
      s.puffs.length = 0;
      s.line = null;
      say.classList.remove("is-on");
      s.landT = 9;
      s.cheer = 9;
      s.tone = 1;
      s.wave = -1;
      draw();
    };

    const onPointer = (e) => {
      s.pointer.x = e.clientX;
      s.pointer.y = e.clientY;
      s.pointer.t = performance.now();
    };
    const onScroll = () => {
      const dy = window.scrollY - s.scrollY;
      s.scrollY = window.scrollY;
      if (!motionAllowed()) {
        sitStill();
        return;
      }
      // the water moves under him: he is carried a little and his arms fly up
      const push = Math.max(-240, Math.min(240, dy * 4));
      if (!s.seated) s.vy -= push * 0.5;
      s.vel.aL += push * 0.9;
      s.vel.aR += push * 0.9;
      s.vel.head -= push * 0.25;
      wake();
    };
    const onBreath = () => wake();
    const onVisible = () => {
      if (!document.hidden) wake();
    };
    const onMotionPref = () => {
      if (!motionAllowed()) {
        cancelAnimationFrame(s.raf);
        s.raf = 0;
        sitStill();
      } else {
        canvas.style.visibility = "visible";
        wake();
      }
    };
    // the toggle in the nav: sit, wander, or (under reduced motion) start moving
    const onToggle = (e) => {
      const d = e.detail || {};
      if (typeof d.sitting === "boolean") s.sitAsked = d.sitting;
      if (d.moving && !s.raf) {
        canvas.style.visibility = "visible";
        const at = perchPoint();
        if (at) {
          dropFrom(at);
          voice.whee();
        }
        s.wave = at ? -1 : -0.9;
      }
      wake();
    };

    const onPress = (e) => {
      if (s.oweHi && performance.now() - s.oweHi < 60000 && motionAllowed()) {
        s.oweHi = 0;
        s.wave = 0.01;
        setTimeout(() => voice.hi(), 140);
      }
      // a click on him, when he is plain to see and nothing else is under the click, tickles
      if (e.type !== "pointerdown" || s.tone < 0.6 || !motionAllowed()) return;
      if (e.target instanceof Element && e.target.closest("a, button, input, select, textarea, label, summary")) return;
      const hx = flat[0] + s.ox;
      const hy = flat[1] + s.oy;
      const reach = 30 * k;
      if (Math.hypot(e.clientX - hx, e.clientY - hy) < reach || Math.hypot(e.clientX - s.x, e.clientY - s.y) < reach) {
        s.tickle = 0;
        voice.giggle();
        wake();
      }
    };
    // Pictures he can talk about: pointed at with a mouse, or scrolled into view.
    const onOver = (e) => {
      if (e.pointerType === "mouse" && e.target instanceof HTMLImageElement && e.target.closest("main")) tell(e.target);
    };
    const watch = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) s.inView.add(entry.target);
          else s.inView.delete(entry.target);
        }
        clearTimeout(s.viewTimer);
        // when the page comes to rest, the picture nearest the middle is the one in front of the visitor
        s.viewTimer = setTimeout(() => {
          if (s.line) return;
          let best = null;
          let least = Infinity;
          for (const img of s.inView) {
            const r = img.getBoundingClientRect();
            const off = Math.abs(r.top + r.height / 2 - window.innerHeight / 2) + 0.3 * Math.abs(r.left + r.width / 2 - window.innerWidth / 2);
            if (off < least) {
              best = img;
              least = off;
            }
          }
          if (best) tell(best);
        }, 420);
      },
      { threshold: 0.7 },
    );
    s.scan = () => {
      watch.disconnect();
      s.inView.clear();
      document.querySelectorAll('main img[alt]:not([alt=""])').forEach((img) => watch.observe(img));
    };
    s.scan();
    document.addEventListener("pointerover", onOver, { passive: true });
    window.addEventListener("pointerdown", onPress, { passive: true });
    window.addEventListener("keydown", onPress);
    window.addEventListener("pointermove", onPointer, { passive: true });
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    window.addEventListener("jm:breath", onBreath);
    window.addEventListener("jm:chanchal", onToggle);
    window.addEventListener("jm:motion", onMotionPref);
    document.addEventListener("visibilitychange", onVisible);
    reduce.addEventListener("change", onMotionPref);
    onMotionPref();

    return () => {
      cancelAnimationFrame(s.raf);
      clearTimeout(s.viewTimer);
      watch.disconnect();
      document.removeEventListener("pointerover", onOver);
      window.removeEventListener("pointerdown", onPress);
      window.removeEventListener("keydown", onPress);
      window.removeEventListener("pointermove", onPointer);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      window.removeEventListener("jm:breath", onBreath);
      window.removeEventListener("jm:chanchal", onToggle);
      window.removeEventListener("jm:motion", onMotionPref);
      document.removeEventListener("visibilitychange", onVisible);
      reduce.removeEventListener("change", onMotionPref);
      state.current = null;
    };
  }, []);

  return (
    <>
      <canvas ref={canvasRef} className="chanchal" aria-hidden="true" />
      <span ref={sayRef} className="chanchal-say" aria-hidden="true">
        <span />
        <span className="chanchal-say__caret" />
      </span>
    </>
  );
}
