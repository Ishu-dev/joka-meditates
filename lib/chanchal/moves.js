// Chanchal's moves. Each one gives a pose for a moment in time
// (lib/chanchal/body.js explains the pose keys). The component springs his
// joints toward these poses and clamps every joint to its human range, so a
// move can be loose but never broken.
//
// A move that is laid over another (a wave, a fidget) gets two objects:
// `aim`, the pose his joints are heading for, and `jig`, small fast wiggles
// that are added on top without going through the springs.

import { pose, SIT } from "./body";

const { sin, PI } = Math;
const TAU = PI * 2;
const clamp01 = (u) => Math.min(1, Math.max(0, u));
const bell = (u) => sin(PI * clamp01(u)); // 0, up to 1, back to 0
const smooth = (u) => {
  const c = clamp01(u);
  return c * c * (3 - 2 * c);
};

// Falling: arms up, legs pedalling.
export function fall(t) {
  return pose({
    lean: 9 * sin(t * 7),
    head: -12 * sin(t * 7),
    aL: 148 + 22 * sin(t * 13),
    eL: 18 * sin(t * 11),
    aR: 148 + 22 * sin(t * 13 + 2.1),
    eR: 18 * sin(t * 12 + 1),
    lL: 22 + 16 * sin(t * 12),
    kL: 38 + 24 * sin(t * 12 + 1),
    lR: 22 - 16 * sin(t * 12),
    kR: 38 - 24 * sin(t * 12 + 1),
  });
}

// The squash as he lands.
export const CROUCH = pose({ torso: 0.9, aL: 70, eL: -30, aR: 70, eR: -30, lL: 100, kL: 150, lR: 100, kR: 150 });

// Sitting cross-legged, with the small rise and fall of an easy breath.
export function sit(t) {
  const b = sin(t * 1.5);
  return pose({ ...SIT, torso: 1 + 0.022 * b, aL: 30 + 2 * b, aR: 30 + 2 * b });
}

// Sitting and breathing with the page. `full` is how full the lungs are, 0 to
// 1: the chest grows, the head swells like a balloon and the hands float up
// off the knees, then everything sinks back.
export function breatheSit(full) {
  return pose({
    ...SIT,
    torso: 0.97 + 0.17 * full,
    headR: 1 + 0.12 * full,
    aL: 30 + 30 * full,
    eL: 2 - 40 * full,
    aR: 30 + 30 * full,
    eR: 2 - 40 * full,
    lL: 76 - 3 * full,
    lR: 76 - 3 * full,
  });
}

// What a restless mind does while it is meant to be sitting. u runs 0 to 1.
export const FIDGETS = {
  look(u, side, aim) {
    aim.head += 24 * side * bell(u);
    aim.lean += 4 * side * bell(u);
  },
  // a hand up to pat the top of the head
  pat(u, side, aim, jig) {
    const e = bell(u);
    aim.aR = 30 + 120 * e;
    aim.eR = 2 + 78 * e;
    aim.head += 8 * e;
    jig.eR = 9 * sin(u * 44) * e;
  },
  // one leg comes out of the fold and the foot wiggles
  kick(u, side, aim, jig) {
    const e = bell(u);
    const [l, k] = side > 0 ? ["lR", "kR"] : ["lL", "kL"];
    aim[l] = 76 + 10 * e;
    aim[k] = 150 - 132 * e;
    jig[l] = 4 * sin(u * 34) * e;
  },
  stretch(u, side, aim) {
    const e = bell(u);
    aim.aL = 30 + 136 * e;
    aim.aR = 30 + 136 * e;
    aim.eL = 2 + 10 * e;
    aim.eR = 2 + 10 * e;
    aim.torso = 1 + 0.12 * e;
  },
  sway(u, side, aim) {
    aim.lean += 10 * sin(u * TAU * 2) * bell(u);
    aim.head -= 8 * sin(u * TAU * 2) * bell(u);
  },
  // fingers drumming on the knees
  drum(u, side, aim, jig) {
    const e = bell(u);
    aim.eL = 2 - 26 * e;
    aim.eR = 2 - 26 * e;
    jig.eL = 12 * sin(u * 62) * e;
    jig.eR = 12 * sin(u * 62 + 2) * e;
  },
};

// A wave with the right hand. w is seconds since it began, `length` how long it lasts.
export function wave(w, length, aim, jig) {
  aim.aR = 138;
  aim.eR = 30;
  aim.head += 7;
  aim.lean -= 3;
  jig.eR = 32 * sin(w * 11) * clamp01(Math.min(w / 0.3, (length - w) / 0.3));
}

// Both arms up after a practice is finished.
export function cheer(t, aim, jig) {
  aim.aL = 162;
  aim.aR = 162;
  aim.eL = 12;
  aim.eR = 12;
  aim.torso = 1.1;
  jig.aL = 9 * sin(t * 17);
  jig.aR = 9 * sin(t * 17 + 1);
}

// Tickled: he folds his arms in and shakes.
export function giggle(u, aim, jig) {
  const e = bell(u);
  aim.aL = 30 + 24 * e;
  aim.aR = 30 + 24 * e;
  aim.eL = 2 - 80 * e;
  aim.eR = 2 - 80 * e;
  jig.lean = 6 * sin(u * 58) * e;
  jig.head = 9 * sin(u * 58 + 1) * e;
}

// Talking: one hand does the explaining and the head nods along.
export function talk(t, aim, jig) {
  aim.aL = 64;
  aim.eL = 66;
  jig.eL = 16 * sin(t * 13);
  jig.head = 5 * sin(t * 21);
}

// One arm of the paddle. It reaches out in front, pulls all the way back to
// the hip, then folds at the elbow and slides forward again.
function paddle(u) {
  if (u < 0.56) {
    const v = smooth(u / 0.56);
    return [172 - 192 * v, 6 + 18 * bell(v)];
  }
  const v = smooth((u - 0.56) / 0.44);
  return [-20 + 192 * v, 104 * bell(v)];
}

// Swimming, seen from the side. `phase` runs 0 to 2 pi for one full stroke of
// the arms, with two kicks of the legs to each. `facing` is 1 when he heads
// right and -1 when he heads left. The component leans him along his path.
export function swim(phase, facing) {
  const u = phase / TAU;
  const [a1, e1] = paddle(u % 1);
  const [a2, e2] = paddle((u + 0.5) % 1);
  const kick = sin(phase * 2);
  const fold = sin(phase * 2 - 1.1);
  return pose({
    sL: facing,
    sR: facing,
    head: -22 * facing,
    aL: a1,
    eL: e1,
    aR: a2,
    eR: e2,
    lL: 6 + 20 * kick,
    kL: 16 + 12 * fold,
    lR: 6 - 20 * kick,
    kR: 16 - 12 * fold,
    torso: 1 + 0.03 * kick,
  });
}

// Treading water, seen from the front: hands sculling, legs turning over.
export function tread(t) {
  const a = sin(t * 4.2);
  const b = sin(t * 4.2 + 1.3);
  const c = sin(t * 5);
  const d = sin(t * 5 + 1.4);
  return pose({
    lean: 5 * sin(t * 1.3),
    head: -4 * sin(t * 1.3),
    aL: 60 + 13 * a,
    eL: 30 + 22 * b,
    aR: 60 - 13 * a,
    eR: 30 - 22 * b,
    lL: 26 + 15 * c,
    kL: 42 + 26 * d,
    lR: 26 - 15 * c,
    kR: 42 - 26 * d,
  });
}
