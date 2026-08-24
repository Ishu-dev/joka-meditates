"use client";

import { useEffect, useRef, useState } from "react";
import { playTone } from "@/lib/sound";

function format(total) {
  const m = Math.floor(total / 60);
  const s = total % 60;
  return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}

export default function CountdownTimer({ seconds = 60, label = "Timer" }) {
  const [remaining, setRemaining] = useState(seconds);
  const [running, setRunning] = useState(false);
  const intervalRef = useRef(null);

  useEffect(() => {
    if (!running) return undefined;
    intervalRef.current = setInterval(() => {
      setRemaining((prev) => {
        if (prev <= 1) {
          clearInterval(intervalRef.current);
          setRunning(false);
          playTone(784, 0.5, 0.06);
          setTimeout(() => playTone(588, 0.7, 0.06), 250);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(intervalRef.current);
  }, [running]);

  function reset() {
    setRunning(false);
    setRemaining(seconds);
  }

  return (
    <div className="my-10 rounded-card border border-rule bg-accent-soft/40 p-6 text-center">
      <p className="text-sm uppercase tracking-widest text-ink-soft">{label}</p>
      <p
        className="font-display my-3 text-5xl tabular-nums"
        role="timer"
        aria-live="off"
      >
        {format(remaining)}
      </p>
      <div className="flex items-center justify-center gap-3">
        <button
          type="button"
          onClick={() => setRunning(!running)}
          disabled={remaining === 0}
          className="rounded-full bg-deep px-5 py-2 text-sm font-medium text-paper disabled:opacity-40 hover:opacity-90 transition-opacity"
        >
          {running ? "Pause" : "Start"}
        </button>
        <button
          type="button"
          onClick={reset}
          className="rounded-full border border-deep px-5 py-2 text-sm font-medium text-deep hover:bg-deep-soft transition-colors"
        >
          Reset
        </button>
      </div>
    </div>
  );
}
