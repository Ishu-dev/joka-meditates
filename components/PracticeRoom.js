"use client";

import { useEffect, useState } from "react";
import { allPractices, practiceById, practices, sits } from "@/lib/practices";
import { useBreath } from "@/lib/useBreath";

// The practice room: choose a breath or a sit on the left, follow the sun on
// the right. /practice#box and friends open with that practice chosen.

const clock = (seconds) => `${Math.floor(seconds / 60)}:${String(seconds % 60).padStart(2, "0")}`;

export default function PracticeRoom() {
  const [id, setId] = useState("box");
  const practice = practiceById(id);
  const { run, done, phase, sound, start, stop, toggleSound } = useBreath(practice);
  const timed = practice.rounds === 1 && practice.phases.length === 1;

  useEffect(() => {
    const fromHash = () => {
      const wanted = window.location.hash.slice(1);
      if (allPractices.some((p) => p.id === wanted)) setId(wanted);
    };
    fromHash();
    window.addEventListener("hashchange", fromHash);
    return () => window.removeEventListener("hashchange", fromHash);
  }, []);

  const choose = (next) => {
    setId(next);
    window.history.replaceState(null, "", `#${next}`);
  };

  const option = (p) => (
    <div key={p.id} id={p.id}>
      <input
        type="radio"
        name="practice"
        id={`pick-${p.id}`}
        value={p.id}
        checked={id === p.id}
        onChange={() => choose(p.id)}
      />
      <label htmlFor={`pick-${p.id}`}>
        <span>{p.name}</span>
        <span className="choose__len">{p.length}</span>
      </label>
    </div>
  );

  const discStyle = run
    ? { "--breath": 1 + 0.16 * phase.swell, "--breath-time": timed ? "3s" : `${phase.seconds}s` }
    : undefined;

  return (
    <div className="room" data-breathing={run ? "true" : "false"}>
      <fieldset className="choose" disabled={Boolean(run)}>
        <legend className="title">Breathe</legend>
        {practices.map(option)}
        <p className="title choose__more">Or sit</p>
        {sits.map(option)}
      </fieldset>

      <div className="room__stage">
        <div className="room__sun">
          <div className="room__disc" style={discStyle} aria-hidden="true" />
          <div className="room__read">
            {run ? (
              <>
                <p className="breath__word" aria-live="polite">
                  {phase.word}
                </p>
                <p className={timed ? "breath__count breath__count--clock" : "breath__count"} aria-hidden="true">
                  {timed ? clock(run.left) : run.left}
                </p>
                {!timed && (
                  <p className="breath__round">
                    Round {run.round} of {practice.rounds}
                  </p>
                )}
              </>
            ) : (
              <>
                <p className="breath__word">{practice.name}</p>
                <p className="room__pattern">{practice.pattern}</p>
              </>
            )}
          </div>
        </div>

        <p className="lead room__use">{practice.use}</p>

        {done && done.id === practice.id && (
          <p className="room__done" role="status">
            Done. {done.streak > 1 ? `That is ${done.streak} days in a row.` : "That is day one of a streak."}
          </p>
        )}

        <div className="actions room__actions">
          {run ? (
            <button type="button" className="btn btn--paper" onClick={() => stop(false)}>
              Stop
            </button>
          ) : (
            <button type="button" className="btn btn--paper" onClick={start}>
              Start {practice.name.toLowerCase().startsWith("sit") ? "the sit" : practice.name}
            </button>
          )}
          <button type="button" className="go" aria-pressed={sound} onClick={toggleSound}>
            {sound ? "Sound is on" : "Sound is off"}
          </button>
        </div>
      </div>
    </div>
  );
}
