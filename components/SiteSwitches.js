"use client";

import { useEffect, useState } from "react";
import { motionAllowed, onMotionChange, setMotion } from "@/lib/motion";
import { setSoundEnabled, soundEnabled } from "@/lib/sound";

// Two switches for the whole site, in the footer. Sound covers every tone,
// bell and voice the site makes, Chanchal's included. Motion covers Chanchal,
// the breathing bloom, the pixel creatures and the small transitions. Both
// choices are remembered on the device.
export default function SiteSwitches() {
  const [state, setState] = useState(null);

  useEffect(() => {
    const read = () => setState({ sound: soundEnabled(), motion: motionAllowed() });
    read();
    const stopMotion = onMotionChange(read);
    window.addEventListener("jm:sound", read);
    return () => {
      stopMotion();
      window.removeEventListener("jm:sound", read);
    };
  }, []);

  if (!state) return null;

  return (
    <div className="switches">
      <button type="button" className="go" aria-pressed={state.sound} onClick={() => setSoundEnabled(!state.sound)}>
        {state.sound ? "Sound is on" : "Sound is off"}
      </button>
      <button type="button" className="go" aria-pressed={state.motion} onClick={() => setMotion(!state.motion)}>
        {state.motion ? "Motion is on" : "Motion is off"}
      </button>
    </div>
  );
}
