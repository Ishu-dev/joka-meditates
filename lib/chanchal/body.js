// Chanchal's body: a stick figure with a hollow head, one line weight and no
// neck. A pose is a small set of joint angles in degrees. solve() turns a pose
// into points on the page and drawBody() draws them. Every angle is clamped to
// what a human joint can do, so the figure can bend but never break.
//
// Pose keys
//   lean    torso rotation. 0 is upright, 90 lies flat with the head to the
//           right, -90 with the head to the left (clockwise on screen).
//   head    head tilt, relative to the torso.
//   sL, sR  which way the left and the right limbs open. Front view: -1 and 1
//           (left limbs open to the left). Side view facing right: 1 and 1.
//           Side view facing left: -1 and -1. Values in between turn him.
//   aL, aR  arm raise: 0 hangs along the torso, 90 is level, 180 is overhead.
//   eL, eR  elbow bend. Positive carries on in the direction of the raise.
//   lL, lR  leg raise: 0 stands, 90 is level with the hip.
//   kL, kR  knee bend. Always folds the shin back toward the body.
//   torso, headR  scale factors, used for breathing.

export const J = { HEAD: 0, NECK: 1, HIP: 2, LE: 3, LH: 4, RE: 5, RH: 6, LK: 7, LF: 8, RK: 9, RF: 10 };

// Lengths in body units. The caller's scale turns units into pixels.
export const BODY = { head: 16.5, torso: 42, upperArm: 25, foreArm: 25, thigh: 30, shin: 30, stroke: 6.5 };

export const KEYS = ["lean", "head", "sL", "sR", "aL", "eL", "aR", "eR", "lL", "kL", "lR", "kR", "torso", "headR"];

export const LIMITS = {
  head: [-35, 35],
  sL: [-1, 1],
  sR: [-1, 1],
  aL: [-70, 200],
  aR: [-70, 200],
  eL: [-150, 150],
  eR: [-150, 150],
  lL: [-45, 125],
  lR: [-45, 125],
  kL: [0, 150],
  kR: [0, 150],
  torso: [0.9, 1.16],
  headR: [0.9, 1.3],
};

const REST = { lean: 0, head: 0, sL: -1, sR: 1, aL: 14, eL: 6, aR: 14, eR: 6, lL: 7, kL: 0, lR: 7, kR: 0, torso: 1, headR: 1 };

export function pose(p) {
  return { ...REST, ...p };
}

export function clampPose(p) {
  for (const key in LIMITS) {
    const [lo, hi] = LIMITS[key];
    if (p[key] < lo) p[key] = lo;
    else if (p[key] > hi) p[key] = hi;
  }
  return p;
}

export function mixPose(a, b, t, out = {}) {
  for (const key of KEYS) out[key] = a[key] + (b[key] - a[key]) * t;
  return out;
}

const RAD = Math.PI / 180;

// Fills `out` with x,y pairs in J order, with the hip at (x, y) and one body
// unit drawn as k pixels.
export function solve(p, x, y, k, out = new Float32Array(22)) {
  const lean = p.lean * RAD;
  const torso = BODY.torso * p.torso * k;
  const nx = x + Math.sin(lean) * torso;
  const ny = y - Math.cos(lean) * torso;
  const tilt = (p.lean + p.head) * RAD;
  const r = BODY.head * p.headR * k;
  out[0] = nx + Math.sin(tilt) * r;
  out[1] = ny - Math.cos(tilt) * r;
  out[2] = nx;
  out[3] = ny;
  out[4] = x;
  out[5] = y;
  limb(out, 6, nx, ny, lean, p.sL, p.aL, p.aL + p.eL, BODY.upperArm * k, BODY.foreArm * k);
  limb(out, 10, nx, ny, lean, p.sR, p.aR, p.aR + p.eR, BODY.upperArm * k, BODY.foreArm * k);
  limb(out, 14, x, y, lean, p.sL, p.lL, p.lL - p.kL, BODY.thigh * k, BODY.shin * k);
  limb(out, 18, x, y, lean, p.sR, p.lR, p.lR - p.kR, BODY.thigh * k, BODY.shin * k);
  return out;
}

function limb(out, at, ox, oy, lean, side, first, second, l1, l2) {
  const g1 = lean - side * first * RAD;
  const jx = ox - Math.sin(g1) * l1;
  const jy = oy + Math.cos(g1) * l1;
  const g2 = lean - side * second * RAD;
  out[at] = jx;
  out[at + 1] = jy;
  out[at + 2] = jx - Math.sin(g2) * l2;
  out[at + 3] = jy + Math.cos(g2) * l2;
}

// Draws the figure. `color` is the line, `halo` an optional paper edge drawn
// under it so he reads on any field, like a figure cut from card. The head is
// hollow: whatever was drawn inside the ring before this call is cleared, so
// an arm raised past the head passes behind it. Draw anything that belongs
// inside the head (or on top of the body) after calling this.
export function drawBody(ctx, pts, k, { color, halo = null, haloWidth = 2.4, lineWidth = BODY.stroke } = {}) {
  const r = Math.hypot(pts[0] - pts[2], pts[1] - pts[3]);
  const limbs = (stroke, width) => {
    ctx.strokeStyle = stroke;
    ctx.lineWidth = width;
    ctx.beginPath();
    bend(ctx, pts, 4, 14, 16);
    bend(ctx, pts, 4, 18, 20);
    bend(ctx, pts, 2, 6, 8);
    bend(ctx, pts, 2, 10, 12);
    ctx.moveTo(pts[2], pts[3]);
    ctx.lineTo(pts[4], pts[5]);
    ctx.stroke();
  };
  const ring = (stroke, width) => {
    ctx.strokeStyle = stroke;
    ctx.lineWidth = width;
    ctx.beginPath();
    ctx.arc(pts[0], pts[1], r, 0, Math.PI * 2);
    ctx.stroke();
  };
  const thin = lineWidth * k;
  const wide = (lineWidth + haloWidth * 2) * k;
  ctx.lineCap = "round";
  ctx.lineJoin = "round";
  if (halo) limbs(halo, wide);
  limbs(color, thin);
  ctx.save();
  ctx.globalCompositeOperation = "destination-out";
  ctx.beginPath();
  ctx.arc(pts[0], pts[1], r, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
  if (halo) ring(halo, wide);
  ring(color, thin);
}

// A limb is one smooth curve from its root, through the joint, to its tip.
function bend(ctx, pts, root, joint, tip) {
  const cx = 2 * pts[joint] - (pts[root] + pts[tip]) / 2;
  const cy = 2 * pts[joint + 1] - (pts[root + 1] + pts[tip + 1]) / 2;
  ctx.moveTo(pts[root], pts[root + 1]);
  ctx.quadraticCurveTo(cx, cy, pts[tip], pts[tip + 1]);
}

// Two poses other pages can draw without the rest of Chanchal.
export const STAND = pose({});
export const SIT = pose({ aL: 30, eL: 2, aR: 30, eR: 2, lL: 76, kL: 150, lR: 76, kR: 150 });
