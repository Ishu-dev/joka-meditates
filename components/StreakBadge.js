"use client";

import { useEffect, useState } from "react";
import { doneToday, loadLog, pointsOf, streakOf } from "@/lib/streak";

// Shows the visitor's own streak, read from this device. Renders nothing
// until it has looked, so the server and the browser never disagree.
export default function StreakBadge({ showPoints = false }) {
  const [state, setState] = useState(null);

  useEffect(() => {
    const read = () => {
      const log = loadLog();
      setState({ streak: streakOf(log), today: doneToday(log), points: pointsOf(log) });
    };
    read();
    window.addEventListener("jm:log", read);
    window.addEventListener("storage", read);
    return () => {
      window.removeEventListener("jm:log", read);
      window.removeEventListener("storage", read);
    };
  }, []);

  if (!state) return <p className="note">Your streak is kept on this device.</p>;

  if (state.streak === 0) {
    return <p className="note">No streak yet. One two-minute practice starts it, and it is kept on this device.</p>;
  }

  return (
    <div className="stack-s">
      <p className="streak">
        <b>{state.streak}</b>
        <span>{state.streak === 1 ? "day in a row" : "days in a row"}</span>
      </p>
      <p className="note">
        {state.today ? "Today is done." : "Today is still open."}
        {showPoints ? ` ${state.points} points so far, kept on this device.` : ""}
      </p>
    </div>
  );
}
