"use client";

import { useEffect, useRef, useState } from "react";
import { playTone } from "@/lib/sound";

export default function BreathingWidget({ phases, defaultCycles = 4 }) {
  const [running, setRunning] = useState(false);
  const [cycles, setCycles] = useState(defaultCycles);
  const [phaseIndex, setPhaseIndex] = useState(0);
  const [cycle, setCycle] = useState(1);
  const [reducedMotion, setReducedMotion] = useState(false);
  const timerRef = useRef(null);

  const phase = phases[phaseIndex];

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReducedMotion(mq.matches);
    const onChange = (e) => setReducedMotion(e.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  useEffect(() => {
    if (!running || !phase) return undefined;
    playTone(phase.tone || 432, Math.min(phase.duration, 2), 0.05);
    timerRef.current = setTimeout(() => {
      const nextIndex = phaseIndex + 1;
      if (nextIndex >= phases.length) {
        if (cycle >= cycles) {
          setRunning(false);
          setPhaseIndex(0);
          setCycle(1);
          playTone(639, 0.6, 0.06);
          return;
        }
        setCycle(cycle + 1);
        setPhaseIndex(0);
      } else {
        setPhaseIndex(nextIndex);
      }
    }, phase.duration * 1000);
    return () => clearTimeout(timerRef.current);
  }, [running, phaseIndex, cycle, cycles, phase, phases]);

  function stop() {
    setRunning(false);
    setPhaseIndex(0);
    setCycle(1);
  }

  if (!phase) return null;

  return (
    <div className="my-10 rounded-card border border-rule bg-deep-soft/40 p-6 text-center">
      <div
        aria-hidden="true"
        className="mx-auto grid h-40 w-40 place-items-center rounded-full bg-accent/90 text-paper transition-transform ease-in-out"
        style={{
          transform: running && !reducedMotion ? `scale(${phase.scale})` : "scale(1)",
          transitionDuration: `${running && !reducedMotion ? phase.duration : 0.6}s`,
        }}
      >
        <span className="text-sm font-medium">{running ? phase.label : "Ready"}</span>
      </div>
      <p className="mt-3 text-sm text-ink-soft" aria-live="polite">
        {running
          ? reducedMotion
            ? `${phase.label} (${phase.duration}s)`
            : phase.cue || `Cycle ${cycle} of ${cycles}`
          : `${cycles} cycles, ${phases.length} phases each`}
      </p>
      <div className="mt-4 flex items-center justify-center gap-3">
        {!running ? (
          <button
            type="button"
            onClick={() => setRunning(true)}
            className="rounded-full bg-accent px-5 py-2 text-sm font-medium text-paper hover:opacity-90 transition-opacity"
          >
            Begin
          </button>
        ) : (
          <button
            type="button"
            onClick={stop}
            className="rounded-full border border-accent px-5 py-2 text-sm font-medium text-accent hover:bg-accent-soft transition-colors"
          >
            Stop
          </button>
        )}
        <label className="text-sm text-ink-soft">
          Cycles{" "}
          <input
            type="number"
            min="1"
            max="20"
            value={cycles}
            onChange={(e) =>
              setCycles(Math.max(1, Math.min(20, Number(e.target.value) || 1)))
            }
            className="ml-1 w-14 rounded-md border border-rule bg-paper px-2 py-1 text-center text-ink"
          />
        </label>
      </div>
    </div>
  );
}
