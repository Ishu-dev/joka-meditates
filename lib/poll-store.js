// Where poll answers are kept: one Redis hash per poll, "poll:<id>", in the same
// Upstash store as the visit counter. The field is the voter's email, so a
// second answer from the same email replaces the first. The value is
// {name, picks, at}. Emails never leave this file: the tally only carries names.
//
// Without the store's environment variables (a laptop with no .env), answers
// are kept in memory so the page can still be tried out. They vanish on restart.

import { pollOptions } from "@/data/polls";

const url = process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL;
const token = process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN;
const memory = globalThis.__jmPolls || (globalThis.__jmPolls = new Map());

async function redis(command) {
  const reply = await fetch(url, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
    body: JSON.stringify(command),
    cache: "no-store",
  });
  if (!reply.ok) throw new Error(`store answered ${reply.status}`);
  return (await reply.json()).result;
}

async function readAll(pollId) {
  if (!url || !token) return [...(memory.get(pollId) || new Map()).values()];
  const flat = (await redis(["HGETALL", `poll:${pollId}`])) || [];
  const out = [];
  for (let i = 1; i < flat.length; i += 2) {
    try {
      out.push(JSON.parse(flat[i]));
    } catch {}
  }
  return out;
}

export async function saveVote(pollId, email, vote) {
  const value = JSON.stringify(vote);
  if (!url || !token) {
    if (!memory.has(pollId)) memory.set(pollId, new Map());
    memory.get(pollId).set(email, vote);
    return;
  }
  await redis(["HSET", `poll:${pollId}`, email, value]);
}

// Counts and names per option, oldest answer first so names do not jump about.
export async function tally(poll, pollId) {
  const votes = (await readAll(pollId)).sort((a, b) => (a.at || 0) - (b.at || 0));
  const options = pollOptions(poll).map((o) => {
    const names = votes.filter((v) => Array.isArray(v.picks) && v.picks.includes(o.id)).map((v) => v.name);
    return { id: o.id, count: names.length, names };
  });
  return { people: votes.length, options };
}
