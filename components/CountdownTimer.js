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
    <div className="widget">
      <p className="title">{label}</p>
      <p className="widget__clock" role="timer" aria-live="off">
        {format(remaining)}
      </p>
      <div className="actions widget__actions">
        <button
          type="button"
          onClick={() => setRunning(!running)}
          disabled={remaining === 0}
          className="btn btn--paper"
        >
          {running ? "Pause" : "Start"}
        </button>
        <button type="button" onClick={reset} className="btn btn--quiet">
          Reset
        </button>
      </div>
    </div>
  );
}
