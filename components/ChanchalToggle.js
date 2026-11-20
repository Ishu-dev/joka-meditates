"use client";

import { useEffect, useState } from "react";
import { allowMotion, motionAllowed, onMotionChange } from "@/lib/motion";

// The one control for the ragdoll. It pauses him ("Sit, Chanchal"), lets him
// go again, and, on a device that asks for reduced motion, is the way to
// switch movement on for this site.
export default function ChanchalToggle({ className = "chanchal-toggle" }) {
  const [state, setState] = useState(null); // { moving, sitting }

  useEffect(() => {
    let sitting = false;
    try {
      sitting = localStorage.getItem("jm-chanchal") === "sit";
    } catch {}
    setState({ moving: motionAllowed(), sitting });
    const sync = (e) => {
      if (e.detail) setState((s) => ({ ...s, ...e.detail }));
    };
    window.addEventListener("jm:chanchal-state", sync);
    // the footer's motion switch changes what this button offers
    const stopMotion = onMotionChange((moving) => setState((s) => (s ? { ...s, moving } : s)));
    return () => {
      window.removeEventListener("jm:chanchal-state", sync);
      stopMotion();
    };
  }, []);

  if (!state) return null;

  const press = () => {
    let next;
    if (!state.moving) {
      allowMotion();
      next = { moving: true, sitting: false };
    } else {
      next = { moving: true, sitting: !state.sitting };
    }
    try {
      localStorage.setItem("jm-chanchal", next.sitting ? "sit" : "roam");
    } catch {}
    setState(next);
    window.dispatchEvent(new CustomEvent("jm:chanchal-state", { detail: next }));
    window.dispatchEvent(new CustomEvent("jm:chanchal", { detail: next }));
  };

  const label = !state.moving ? "Let Chanchal move" : state.sitting ? "Let Chanchal wander" : "Sit, Chanchal";

  return (
    <button type="button" className={className} aria-pressed={state.moving && !state.sitting} onClick={press}>
      {label}
    </button>
  );
}
