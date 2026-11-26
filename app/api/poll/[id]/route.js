// GET: the current tally (counts and names, never emails).
// POST {name, email, picks}: save or replace one person's answer. Only IIM
// Calcutta addresses are taken, which keeps the names on the page to people
// from campus. Nothing checks that the address is really theirs; the poll is
// for planning cabs and seats, not for anything that needs proof.

import { getPoll, pollOptions } from "@/data/polls";
import { saveVote, tally } from "@/lib/poll-store";

export const dynamic = "force-dynamic";

const IIMC_EMAIL = /^[a-z0-9._%+-]+@(email\.)?iimcal\.ac\.in$/;
const noStore = { "Cache-Control": "no-store" };

export async function GET(_request, { params }) {
  const poll = getPoll(params.id);
  if (!poll) return Response.json({ error: "No such poll." }, { status: 404 });
  try {
    return Response.json(await tally(poll, params.id), { headers: noStore });
  } catch {
    return Response.json({ error: "Could not read the answers just now." }, { status: 503 });
  }
}

export async function POST(request, { params }) {
  const poll = getPoll(params.id);
  if (!poll) return Response.json({ error: "No such poll." }, { status: 404 });
  if (poll.closes && Date.now() > Date.parse(poll.closes)) {
    return Response.json({ error: "This poll has closed." }, { status: 410 });
  }
  let body = {};
  try {
    body = await request.json();
  } catch {}
  if (body.website) return Response.json({ ok: true }); // the hidden field only bots fill

  const name = String(body.name || "")
    .replace(/[\u0000-\u001f\u007f<>]/g, "")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, 40);
  const email = String(body.email || "").trim().toLowerCase();
  const allowed = new Set(pollOptions(poll).map((o) => o.id));
  const picks = Array.isArray(body.picks) ? [...new Set(body.picks.filter((p) => allowed.has(p)))] : [];

  if (name.length < 2) return Response.json({ error: "Please add your name." }, { status: 400 });
  if (!IIMC_EMAIL.test(email)) {
    return Response.json({ error: "Please use your IIM Calcutta email (@email.iimcal.ac.in)." }, { status: 400 });
  }

  try {
    await saveVote(params.id, email, { name, picks, at: Date.now() });
    return Response.json({ ok: true, ...(await tally(poll, params.id)) }, { headers: noStore });
  } catch {
    return Response.json({ error: "Could not save just now. Please try again in a minute." }, { status: 503 });
  }
}
