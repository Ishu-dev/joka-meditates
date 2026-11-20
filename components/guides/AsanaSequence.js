"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import BreathBloom from "@/components/BreathBloom";
import { asanas, artOf, HOLD } from "@/data/asanas";
import { useBreath } from "@/lib/useBreath";

// The 14 poses as a sequence you can follow. One pose stands on the stage at
// a time. "Hold for five breaths" counts the breaths (lib/useBreath.js, which
// also logs the hold to the streak and lets Chanchal breathe along), then the
// next pose comes up. With "carry on" ticked the next hold starts by itself
// after a few seconds to move, so the phone can stay on the floor.
//
// The picture sits in .asana__art, a slot keyed on the pose id. A 3D figure
// that takes the selected pose can replace the <img> inside that slot without
// touching anything around it.

const GET_READY = 6; // seconds to move into the next pose

export default function AsanaSequence() {
  const [at, setAt] = useState(0);
  const [carryOn, setCarryOn] = useState(false);
  const [ready, setReady] = useState(null); // seconds left before a hold starts by itself
  const [closed, setClosed] = useState(false); // every pose has been held
  const pose = asanas[at];
  const practice = useMemo(
    () => ({ id: `asana-${pose.id}`, name: pose.name, rounds: HOLD.breaths, phases: HOLD.phases }),
    [pose.id, pose.name],
  );
  const { run, done, phase, sound, start, stop, toggleSound } = useBreath(practice);

  const stage = useRef(null);
  const advance = useRef(null);
  const startNow = useRef(start);
  startNow.current = start;
  const carry = useRef(carryOn);
  carry.current = carryOn;

  const show = (n) => {
    setAt(n);
    window.history.replaceState(null, "", `#${asanas[n].id}`);
  };

  const go = (n) => {
    if (n < 0 || n >= asanas.length) return;
    clearTimeout(advance.current);
    if (run) stop(false);
    setReady(null);
    setClosed(false);
    show(n);
  };

  const halt = () => {
    clearTimeout(advance.current);
    setReady(null);
    if (run) stop(false);
  };

  // /practice/yoga-poses#halasana opens on that pose
  useEffect(() => {
    const fromHash = () => {
      const n = asanas.findIndex((a) => a.id === window.location.hash.slice(1));
      if (n >= 0) setAt(n);
    };
    fromHash();
    window.addEventListener("hashchange", fromHash);
    return () => {
      window.removeEventListener("hashchange", fromHash);
      clearTimeout(advance.current);
    };
  }, []);

  // a hold has just finished: bring up the next pose
  useEffect(() => {
    if (!done || done.id !== practice.id) return;
    if (at >= asanas.length - 1) {
      setClosed(true);
      return;
    }
    advance.current = setTimeout(() => {
      const next = at + 1;
      show(next);
      if (carry.current && !asanas[next].withTeacher) setReady(GET_READY);
    }, 1600);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [done]);

  // the few seconds before a hold that starts by itself
  useEffect(() => {
    if (ready === null) return undefined;
    if (ready <= 0) {
      setReady(null);
      startNow.current();
      return undefined;
    }
    const tick = setTimeout(() => setReady((left) => (left === null ? null : left - 1)), 1000);
    return () => clearTimeout(tick);
  }, [ready]);

  // have the neighbouring drawings ready so a step never shows an empty stage
  useEffect(() => {
    [at - 1, at + 1].forEach((n) => {
      if (asanas[n]) new window.Image().src = artOf(asanas[n].id);
    });
  }, [at]);

  const held = Boolean(done && done.id === practice.id);
  const busy = Boolean(run) || ready !== null;
  const discStyle = run ? { "--breath": phase.swell ? 1.045 : 1, "--breath-time": `${phase.seconds}s` } : undefined;

  let status = "";
  if (closed) status = "That was all fourteen.";
  else if (held) status = "Held. The next pose is coming up.";
  else if (carryOn && pose.withTeacher && !busy) status = "Carry on stops here. Start this one yourself.";

  const pick = (n) => {
    go(n);
    stage.current?.scrollIntoView({ block: "start" });
  };

  return (
    <>
      <section className="band field-sun cut-a asana" aria-label="Follow the sequence" ref={stage}>
        <BreathBloom anchor=".asana__disc" tone="sun" spread={0.34} />
        <div className="guide-stage" aria-hidden="true">
          <div className="guide-stage__inner">
            <div className="guide-seat" data-chanchal-perch />
          </div>
        </div>
        <div className="wrap asana__grid">
          <figure className="asana__stage">
            <div className="asana__disc" style={discStyle} />
            <div className="asana__art" data-pose={pose.id}>
              <img
                key={pose.id}
                src={artOf(pose.id)}
                alt={`${pose.name}, ${pose.en}, illustrated`}
                width={pose.w}
                height={pose.h}
                fetchPriority="high"
              />
            </div>
          </figure>

          <div className="asana__body">
            <div className="stack-s">
              <h2 className="head">{pose.name}</h2>
              <p className="title">{pose.en}</p>
            </div>

            <div className="asana__say">
              {run ? (
                <div className="asana__breath">
                  <p className="asana__count" aria-hidden="true">
                    {run.left}
                  </p>
                  <div>
                    <p className="asana__word" aria-live="polite">
                      {phase.word}
                    </p>
                    <p>
                      Breath {run.round} of {HOLD.breaths}
                    </p>
                  </div>
                </div>
              ) : ready !== null ? (
                <div className="asana__breath">
                  <p className="asana__count" aria-hidden="true">
                    {ready}
                  </p>
                  <div>
                    <p className="asana__word">Move into it</p>
                    <p>{pose.note}</p>
                  </div>
                </div>
              ) : (
                <p className="lead">{pose.note}</p>
              )}
            </div>

            <p className="asana__status" role="status">
              {status}
            </p>

            <div className="actions">
              {busy ? (
                <>
                  <button type="button" className="btn" onClick={halt}>
                    Stop
                  </button>
                  <button type="button" className="go" aria-pressed={sound} onClick={toggleSound}>
                    {sound ? "Sound is on" : "Sound is off"}
                  </button>
                </>
              ) : (
                <button type="button" className="btn" onClick={start} disabled={held && !closed}>
                  Hold for five breaths
                </button>
              )}
            </div>

            <label className="check">
              <input
                type="checkbox"
                name="carry-on"
                checked={carryOn}
                onChange={(e) => setCarryOn(e.target.checked)}
              />
              Carry on to the next hold by itself
            </label>

            <div className="asana__pager">
              <button type="button" className="btn btn--quiet btn--small" onClick={() => go(at - 1)} disabled={at === 0}>
                Previous
              </button>
              <p className="asana__at" aria-live="polite">
                {at + 1} of {asanas.length}
              </p>
              <button
                type="button"
                className="btn btn--quiet btn--small"
                onClick={() => go(at + 1)}
                disabled={at === asanas.length - 1}
              >
                Next
              </button>
            </div>

            <div className="guide-seat-room" aria-hidden="true" />
          </div>
        </div>
      </section>

      <section className="band" aria-labelledby="all-h">
        <div className="wrap stack">
          <h2 id="all-h" className="head head--wide">
            All fourteen, start to finish.
          </h2>
          <ol className="asana-index">
            {asanas.map((a, n) => (
              <li key={a.id}>
                <a
                  href={`#${a.id}`}
                  aria-current={n === at ? "true" : undefined}
                  onClick={(e) => {
                    e.preventDefault();
                    pick(n);
                  }}
                >
                  <img src={artOf(a.id)} alt="" width={a.w} height={a.h} loading="lazy" />
                  <span>
                    <span className="asana-index__name">{a.name}</span>
                    <span className="asana-index__en">{a.en}</span>
                    <span className="note">{a.note}</span>
                  </span>
                </a>
              </li>
            ))}
          </ol>
        </div>
      </section>
    </>
  );
}
