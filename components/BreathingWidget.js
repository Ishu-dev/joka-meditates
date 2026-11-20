"use client";

import { useEffect, useRef, useState } from "react";
import { playTone } from "@/lib/sound";
import { motionAllowed, onMotionChange } from "@/lib/motion";

export default function BreathingWidget({ phases, defaultCycles = 4 }) {
  const [running, setRunning] = useState(false);
  const [cycles, setCycles] = useState(defaultCycles);
  const [phaseIndex, setPhaseIndex] = useState(0);
  const [cycle, setCycle] = useState(1);
  const [reducedMotion, setReducedMotion] = useState(false);
  const timerRef = useRef(null);

  const phase = phases[phaseIndex];

  useEffect(() => {
    setReducedMotion(!motionAllowed());
    return onMotionChange((on) => setReducedMotion(!on));
  }, []);

  // Tell the rest of the site about each phase (lib/breathSignal.js), so
  // Chanchal breathes along. The biggest scale among the phases is full lungs.
  const said = useRef(false);
  const announce = (detail) => window.dispatchEvent(new CustomEvent("jm:breath", { detail }));
  useEffect(
    () => () => {
      if (said.current) announce({ running: false, done: false });
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  );

  useEffect(() => {
    if (!running || !phase) return undefined;
    playTone(phase.tone || 432, Math.min(phase.duration, 2), 0.05);
    const scales = phases.map((p) => p.scale || 1);
    const low = Math.min(...scales);
    const high = Math.max(...scales);
    said.current = true;
    announce({
      running: true,
      swell: high > low ? ((phase.scale || 1) - low) / (high - low) : 0,
      seconds: phase.duration,
      progress: (cycle - 1 + phaseIndex / phases.length) / cycles,
    });
    timerRef.current = setTimeout(() => {
      const nextIndex = phaseIndex + 1;
      if (nextIndex >= phases.length) {
        if (cycle >= cycles) {
          setRunning(false);
          setPhaseIndex(0);
          setCycle(1);
          playTone(639, 0.6, 0.06);
          said.current = false;
          announce({ running: false, done: true });
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
    said.current = false;
    announce({ running: false, done: false });
  }

  if (!phase) return null;

  return (
    <div className="widget">
      <div
        aria-hidden="true"
        className="widget__disc"
        style={{
          transform: running && !reducedMotion ? `scale(${phase.scale})` : "scale(1)",
          transitionDuration: `${running && !reducedMotion ? phase.duration : 0.6}s`,
        }}
      >
        <span>{running ? phase.label : "Ready"}</span>
      </div>
      <p className="note" aria-live="polite">
        {running
          ? reducedMotion
            ? `${phase.label} (${phase.duration}s)`
            : phase.cue || `Cycle ${cycle} of ${cycles}`
          : `${cycles} cycles, ${phases.length} phases each`}
      </p>
      <div className="actions widget__actions">
        {!running ? (
          <button type="button" onClick={() => setRunning(true)} className="btn btn--paper">
            Begin
          </button>
        ) : (
          <button type="button" onClick={stop} className="btn btn--quiet">
            Stop
          </button>
        )}
        <label className="widget__field">
          Cycles
          <input
            type="number"
            name="cycles"
            inputMode="numeric"
            min="1"
            max="20"
            value={cycles}
            onChange={(e) => setCycles(Math.max(1, Math.min(20, Number(e.target.value) || 1)))}
          />
        </label>
      </div>
    </div>
  );
}
