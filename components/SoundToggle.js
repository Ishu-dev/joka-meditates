"use client";

import { useEffect, useState } from "react";
import { playTone, setSoundEnabled, soundEnabled } from "@/lib/sound";

export default function SoundToggle() {
  const [on, setOn] = useState(true);

  useEffect(() => {
    setOn(soundEnabled());
  }, []);

  function toggle() {
    const next = !on;
    setOn(next);
    setSoundEnabled(next);
    if (next) {
      playTone(528, 0.25, 0.05);
    }
  }

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={on ? "Mute interface sounds" : "Unmute interface sounds"}
      aria-pressed={on}
      className="grid h-9 w-9 place-items-center rounded-full border border-rule text-ink-soft hover:text-accent hover:border-accent transition-colors"
    >
      <span aria-hidden="true">{on ? "♪" : "♪̸"}</span>
    </button>
  );
}
