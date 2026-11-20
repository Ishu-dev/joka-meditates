"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { practiceSeconds } from "@/lib/practices";
import { markPractice, streakOf } from "@/lib/streak";
import { playTone, setSoundEnabled, soundEnabled } from "@/lib/sound";

// Runs one practice: counts the seconds, moves through the phases and
// rounds, plays a soft tone on each change and logs the practice when it
// finishes. Every phase is also announced as a "jm:breath" event (see
// lib/breathSignal.js), which is what Chanchal and the bloom follow.
export function useBreath(practice) {
  const [run, setRun] = useState(null); // { round, phase, left, elapsed }
  const [done, setDone] = useState(null); // { streak, id }
  const [sound, setSound] = useState(true);
  const tick = useRef(null);
  const live = useRef(null);
  const total = practiceSeconds(practice);
  // A timed sit has one long phase. There is nothing to count, so a slow
  // pacer breathes for it: five seconds in, five seconds out.
  const timed = practice.rounds === 1 && practice.phases.length === 1;

  const tell = (detail) => window.dispatchEvent(new CustomEvent("jm:breath", { detail }));

  const stop = useCallback(
    (finished) => {
      clearInterval(tick.current);
      tick.current = null;
      live.current = null;
      setRun(null);
      if (finished) {
        const log = markPractice(practice.id, total);
        setDone({ streak: streakOf(log), id: practice.id });
        playTone(528, 1.4, 0.05);
        tell({ running: false, done: true });
      } else {
        tell({ running: false });
      }
    },
    [practice.id, total],
  );

  const start = useCallback(() => {
    setDone(null);
    const opening = practice.phases[0];
    const first = { round: 1, phase: 0, left: opening.seconds, elapsed: 0 };
    live.current = first;
    setRun(first);
    if (opening.tone) playTone(opening.tone, 1.2, 0.05);
    tell(
      timed
        ? { running: true, progress: 0, swell: 0.85, seconds: 5, gentle: true }
        : { running: true, progress: 0, swell: opening.swell, seconds: opening.seconds },
    );
    clearInterval(tick.current);
    tick.current = setInterval(() => {
      const now = live.current;
      if (!now) return;
      const elapsed = now.elapsed + 1;
      let next;
      if (now.left > 1) {
        next = { ...now, left: now.left - 1, elapsed };
        if (timed && elapsed % 5 === 0) {
          const out = (elapsed / 5) % 2 === 1;
          tell({ running: true, progress: elapsed / total, swell: out ? 0.15 : 0.85, seconds: 5, gentle: true });
        }
      } else {
        let phase = now.phase + 1;
        let round = now.round;
        if (phase >= practice.phases.length) {
          phase = 0;
          round += 1;
        }
        if (round > practice.rounds) {
          stop(true);
          return;
        }
        const to = practice.phases[phase];
        if (to.tone) playTone(to.tone, 1.2, 0.05);
        tell({ running: true, progress: elapsed / total, swell: to.swell, seconds: to.seconds });
        next = { round, phase, left: to.seconds, elapsed };
      }
      live.current = next;
      setRun(next);
    }, 1000);
  }, [practice, stop, timed, total]);

  // a different practice was chosen, or the page was left, mid-run
  useEffect(() => {
    setSound(soundEnabled());
    const heard = (event) => setSound(Boolean(event.detail && event.detail.on));
    window.addEventListener("jm:sound", heard);
    return () => {
      window.removeEventListener("jm:sound", heard);
      if (tick.current) {
        clearInterval(tick.current);
        tick.current = null;
        live.current = null;
        tell({ running: false });
      }
    };
  }, [practice.id]);

  useEffect(() => {
    if (!run) return undefined;
    const onKey = (e) => {
      if (e.key === "Escape") stop(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [run, stop]);

  const toggleSound = () => {
    const next = !sound;
    setSound(next);
    setSoundEnabled(next);
    if (next) playTone(528, 0.25, 0.05);
  };

  const phase = run ? practice.phases[run.phase] : null;
  return { run, done, phase, total, sound, start, stop, toggleSound };
}
