"use client";

import Link from "next/link";
import { practiceById } from "@/lib/practices";
import { useBreath } from "@/lib/useBreath";
import BreathBloom from "./BreathBloom";

// The first screen. The headline, one sentence and two actions, over a paper
// sun and a lily pad. Pressing the primary action turns the sun into a
// two-minute box-breathing guide; Chanchal (components/Chanchal.js) hears the
// "jm:breath" events and settles as the rounds go by.

const practice = practiceById("box");

export default function Hero() {
  const { run, done, phase, sound, start, stop, toggleSound } = useBreath(practice);
  const sunStyle = run
    ? { "--breath": phase.swell ? 1.13 : 1, "--breath-time": `${phase.seconds}s` }
    : undefined;

  return (
    <section className="band hero" data-breathing={run ? "true" : "false"}>
      <BreathBloom anchor=".sun" tone="paper" />
      <div className="hero__stage" aria-hidden="true">
        <div className="hero__stage-inner">
          <div className="sun" style={sunStyle} />
          <div className="pad pad--far" />
          <div className="pad" data-chanchal-perch />
        </div>
      </div>
      <div className="wrap hero__grid">
        <h1 className="poster hero__title">
          <span>Nobody here</span>
          <span>can sit still</span>
          <span>either.</span>
        </h1>
        <p className="lead hero__lede">
          IIM Calcutta&rsquo;s meditation circle starts with two minutes of breathing.
        </p>
        <div className="hero__actions">
          {run ? (
            <div className="actions">
              <button type="button" className="btn btn--quiet" onClick={() => stop(false)}>
                Stop
              </button>
              <button type="button" className="go" aria-pressed={sound} onClick={toggleSound}>
                {sound ? "Sound is on" : "Sound is off"}
              </button>
            </div>
          ) : (
            <div className="stack-s">
              {done && (
                <p className="hero__done" role="status">
                  Two minutes done. {done.streak > 1 ? `That is ${done.streak} days in a row.` : "That is day one."}
                </p>
              )}
              <div className="actions">
                <button type="button" className="btn" onClick={start}>
                  {done ? "Breathe again" : "Breathe for two minutes"}
                </button>
                {done ? (
                  <Link href="/practice" className="go">
                    See every practice
                  </Link>
                ) : (
                  <a
                    className="btn btn--quiet"
                    href="https://chat.whatsapp.com/GlJ7rURYrjT88BT8h5IwYR"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Join the WhatsApp circle
                  </a>
                )}
              </div>
            </div>
          )}
        </div>
        <div className="hero__sunbox">
          {run && (
            <>
              <p className="breath__word" aria-live="polite">
                {phase.word}
              </p>
              <p className="breath__count" aria-hidden="true">
                {run.left}
              </p>
              <p className="breath__round">
                Round {run.round} of {practice.rounds}
              </p>
            </>
          )}
        </div>
      </div>
    </section>
  );
}
