"use client";

import { useEffect, useState } from "react";

// The answer form and the live tally for one poll. A link from the mail can
// carry ?pick=<option id> to tick that option on arrival. The last name, email
// and picks sent from this browser are remembered so a change of plan is two
// clicks. The tally refreshes every 15 seconds while the tab is open.

const REFRESH_MS = 15000;

function Options({ list, picks, toggle, disabled }) {
  return list.map((o) => (
    <div key={o.id}>
      <input
        type="checkbox"
        id={`pick-${o.id}`}
        name="pick"
        value={o.id}
        checked={picks.includes(o.id)}
        onChange={() => toggle(o.id)}
        disabled={disabled}
      />
      <label htmlFor={`pick-${o.id}`}>
        <span>
          {o.label}
          <span className="poll__where">{o.where}</span>
        </span>
        <span aria-hidden="true">{picks.includes(o.id) ? "✓" : "+"}</span>
      </label>
    </div>
  ));
}

function Tally({ poll, result }) {
  if (!result) return <p className="note">Loading the answers so far.</p>;
  const byId = Object.fromEntries(result.options.map((o) => [o.id, o]));
  const max = Math.max(1, ...result.options.map((o) => o.count));
  const rows = (list, tone) =>
    list.map((o) => {
      const r = byId[o.id] || { count: 0, names: [] };
      return (
        <li key={o.id} className="poll__row">
          <div className="poll__head">
            <span className="poll__label">{o.label}</span>
            <span className="poll__count">{r.count}</span>
          </div>
          <div className="poll__bar" aria-hidden="true">
            <span className={`poll__fill poll__fill--${tone}`} style={{ width: `${(r.count / max) * 100}%` }} />
          </div>
          <p className="note">{r.names.length ? r.names.join(", ") : "No one yet"}</p>
        </li>
      );
    });
  return (
    <>
      <p className="note">
        {result.people === 1 ? "1 person has answered." : `${result.people} people have answered.`}
      </p>
      <ul className="poll__tally">
        {rows(poll.sessions, "pond")}
        {rows(poll.extras, "accent")}
      </ul>
    </>
  );
}

export default function PollForm({ id, poll }) {
  const [picks, setPicks] = useState([]);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [result, setResult] = useState(null);
  const [status, setStatus] = useState({ kind: "idle", text: "" });
  const closed = poll.closes && Date.now() > Date.parse(poll.closes);
  const key = `jm-poll-${id}`;

  useEffect(() => {
    const valid = new Set([...poll.sessions, ...poll.extras].map((o) => o.id));
    let saved = {};
    try {
      saved = JSON.parse(localStorage.getItem(key) || "{}");
    } catch {}
    const fromLink = new URLSearchParams(window.location.search).getAll("pick").filter((p) => valid.has(p));
    if (saved.name) setName(saved.name);
    if (saved.email) setEmail(saved.email);
    setPicks([...new Set([...(saved.picks || []).filter((p) => valid.has(p)), ...fromLink])]);

    const load = async () => {
      if (document.hidden) return;
      try {
        const reply = await fetch(`/api/poll/${id}`, { cache: "no-store" });
        if (reply.ok) setResult(await reply.json());
      } catch {}
    };
    load();
    const timer = setInterval(load, REFRESH_MS);
    return () => clearInterval(timer);
  }, [id, key, poll]);

  const toggle = (optionId) =>
    setPicks((now) => (now.includes(optionId) ? now.filter((p) => p !== optionId) : [...now, optionId]));

  const submit = async (event) => {
    event.preventDefault();
    setStatus({ kind: "busy", text: "Saving." });
    try {
      const form = new FormData(event.currentTarget);
      const reply = await fetch(`/api/poll/${id}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, picks, website: form.get("website") || "" }),
      });
      const data = await reply.json();
      if (!reply.ok) {
        setStatus({ kind: "error", text: data.error || "Could not save." });
        return;
      }
      try {
        localStorage.setItem(key, JSON.stringify({ name, email, picks }));
      } catch {}
      setResult({ people: data.people, options: data.options });
      setStatus({
        kind: "done",
        text: picks.length
          ? "Saved. To change it, edit and send again with the same email."
          : "Saved with nothing ticked, so your name is off every list.",
      });
    } catch {
      setStatus({ kind: "error", text: "No connection. Please try again." });
    }
  };

  return (
    <div className="poll">
      <form className="poll__form stack" onSubmit={submit}>
        <fieldset className="choose" disabled={closed}>
          <legend className="head head--sm">Sessions</legend>
          <Options list={poll.sessions} picks={picks} toggle={toggle} disabled={closed} />
          <p className="choose__more head head--sm">Also</p>
          <Options list={poll.extras} picks={picks} toggle={toggle} disabled={closed} />
        </fieldset>
        <div className="poll__fields">
          <label className="poll__field">
            <span>Your name, as it should show</span>
            <input name="name" value={name} onChange={(e) => setName(e.target.value)} maxLength={40} autoComplete="name" required disabled={closed} />
          </label>
          <label className="poll__field">
            <span>IIM Calcutta email (not shown to anyone)</span>
            <input
              type="email"
              name="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@email.iimcal.ac.in"
              autoComplete="email"
              required
              disabled={closed}
            />
          </label>
          <input className="poll__trap" name="website" tabIndex={-1} autoComplete="off" aria-hidden="true" />
        </div>
        <div className="actions">
          <button className="btn" type="submit" disabled={closed || status.kind === "busy"}>
            {closed ? "This poll has closed" : "Send my answer"}
          </button>
        </div>
        <p className={`note poll__status poll__status--${status.kind}`} role="status" aria-live="polite">
          {status.text}
        </p>
      </form>
      <div className="poll__live stack">
        <h2 className="head head--sm">Who is going so far</h2>
        <Tally poll={poll} result={result} />
      </div>
    </div>
  );
}
