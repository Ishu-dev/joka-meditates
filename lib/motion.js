// One switch for everything that moves on the site: Chanchal, the breathing
// bloom, the pixel critters and the small transitions.
//
// Motion is on by default. On a device that asks for reduced motion it is off
// by default. Either way the visitor's own choice wins, is remembered on the
// device, and is mirrored as a class on <html> so the stylesheet follows it:
// "motion-ok" when they turned it on, "motion-off" when they turned it off.

const KEY = "jm-motion";

function choice() {
  try {
    return localStorage.getItem(KEY);
  } catch {
    return null;
  }
}

export function prefersReduced() {
  return typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

// True when things may move.
export function motionAllowed() {
  if (typeof window === "undefined") return false;
  const saved = choice();
  if (saved === "on") return true;
  if (saved === "off") return false;
  return !prefersReduced();
}

export function setMotion(on) {
  try {
    localStorage.setItem(KEY, on ? "on" : "off");
  } catch {}
  const root = document.documentElement;
  root.classList.toggle("motion-ok", on);
  root.classList.toggle("motion-off", !on);
  window.dispatchEvent(new CustomEvent("jm:motion", { detail: { on } }));
}

// Calls back with true or false whenever the answer may have changed.
// Returns a function that stops listening.
export function onMotionChange(callback) {
  const media = window.matchMedia("(prefers-reduced-motion: reduce)");
  const run = () => callback(motionAllowed());
  media.addEventListener("change", run);
  window.addEventListener("jm:motion", run);
  return () => {
    media.removeEventListener("change", run);
    window.removeEventListener("jm:motion", run);
  };
}

// Earlier names, still used by a few components.
export const motionOptedIn = () => choice() === "on";
export const allowMotion = () => setMotion(true);
