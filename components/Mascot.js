"use client";

import dynamic from "next/dynamic";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";

const Mascot3D = dynamic(() => import("@/components/Mascot3D"), { ssr: false });

const TIPS = [
  "Twice a week a new issue lands in the archive. That is the heartbeat of this place.",
  "Pace picking up? The 4-6 breath in Issue 02 takes ninety seconds.",
  "The mandala in Practice dances to sound. Even a hum will do.",
  "Sessions are free and beginner-proof. Bring yourself, that is the whole checklist.",
];

export default function Mascot() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [tip, setTip] = useState(0);
  const [visible, setVisible] = useState(false);
  const [webgl, setWebgl] = useState(null);
  const [reduced, setReduced] = useState(false);
  const bubbleRef = useRef(null);

  useEffect(() => {
    setReduced(window.matchMedia("(prefers-reduced-motion: reduce)").matches);
    try {
      const c = document.createElement("canvas");
      setWebgl(Boolean(c.getContext("webgl2") || c.getContext("webgl")));
    } catch {
      setWebgl(false);
    }
    if (sessionStorage.getItem("jm-mascot-done")) return undefined;
    const t = setTimeout(() => setVisible(true), 2200);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    function onKey(e) {
      if (e.key === "Escape") {
        setOpen(false);
        setVisible(false);
        sessionStorage.setItem("jm-mascot-done", "1");
      }
    }
    function onClick(e) {
      if (open && bubbleRef.current && !bubbleRef.current.contains(e.target)) {
        setOpen(false);
      }
    }
    window.addEventListener("keydown", onKey);
    window.addEventListener("mousedown", onClick);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("mousedown", onClick);
    };
  }, [open]);

  if (
    !visible ||
    !pathname ||
    pathname.startsWith("/issues/") ||
    pathname.startsWith("/admin")
  ) {
    return null;
  }

  function dismiss() {
    setVisible(false);
    sessionStorage.setItem("jm-mascot-done", "1");
  }

  return (
    <div
      ref={bubbleRef}
      className="fixed bottom-4 right-4 z-50 flex flex-col items-end gap-3"
    >
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 14, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ type: "spring", stiffness: 380, damping: 26 }}
            className="w-64 rounded-card border border-rule bg-paper p-4 shadow-lg"
          >
            <p className="text-sm leading-relaxed text-ink">{TIPS[tip]}</p>
            <div className="mt-3 flex items-center justify-between text-xs">
              <button
                type="button"
                onClick={() => setTip((tip + 1) % TIPS.length)}
                className="font-medium text-link hover:text-accent"
              >
                Another one
              </button>
              <button
                type="button"
                onClick={dismiss}
                className="text-ink-soft hover:text-accent"
              >
                Not now
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        type="button"
        onClick={() => setOpen(!open)}
        aria-expanded={open}
        aria-label={open ? "Hide tips from the lotus buddy" : "Show tips from the lotus buddy"}
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.94 }}
        className="h-24 w-24 rounded-full border border-rule bg-paper/90 shadow-md backdrop-blur"
      >
        {webgl && !reduced ? (
          <Mascot3D excited={open} />
        ) : (
          <svg viewBox="0 0 64 64" width="72" height="72" aria-hidden="true" className="mx-auto">
            <path d="M32 8 C26 16 24 22 32 28 C40 22 38 16 32 8 Z" fill="var(--accent)" opacity="0.85" />
            <path d="M18 16 C18 26 24 30 32 28 C30 20 26 16 18 16 Z" fill="var(--accent)" opacity="0.55" />
            <path d="M46 16 C46 26 40 30 32 28 C34 20 38 16 46 16 Z" fill="var(--accent)" opacity="0.55" />
            <ellipse cx="32" cy="42" rx="17" ry="14" fill="var(--accent-soft)" stroke="var(--accent)" strokeWidth="1.5" />
            {open ? (
              <>
                <path d="M25 40 q3 -3 6 0" stroke="var(--ink)" strokeWidth="1.6" fill="none" strokeLinecap="round" />
                <path d="M35 40 q3 -3 6 0" stroke="var(--ink)" strokeWidth="1.6" fill="none" strokeLinecap="round" />
              </>
            ) : (
              <>
                <circle cx="27" cy="40" r="1.8" fill="var(--ink)" />
                <circle cx="39" cy="40" r="1.8" fill="var(--ink)" />
              </>
            )}
            <path d="M28 46 q4 3.5 8 0" stroke="var(--ink)" strokeWidth="1.6" fill="none" strokeLinecap="round" />
          </svg>
        )}
      </motion.button>
    </div>
  );
}
