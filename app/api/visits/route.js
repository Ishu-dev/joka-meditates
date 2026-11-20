// The visit counter. A browser calls this when a page opens and once a minute
// after that. It keeps two things in the Redis store connected on Vercel:
// "visits:total", a plain count, and "visits:here", the ids seen in the last
// two minutes. The id is a random string the browser makes for the tab; no
// address, name or cookie is read or stored.
//
// The store's address and token come from the environment variables the
// Upstash Redis integration adds. Without them this answers with nulls and the
// footer shows nothing.

export const dynamic = "force-dynamic";

const url = process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL;
const token = process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN;
const HERE_FOR = 120; // seconds a tab counts as here after its last call

export async function POST(request) {
  if (!url || !token) return Response.json({ total: null, here: null });
  let body = {};
  try {
    body = await request.json();
  } catch {}
  const id = typeof body.id === "string" && /^[a-z0-9]{8,32}$/.test(body.id) ? body.id : null;
  const now = Math.floor(Date.now() / 1000);
  const commands = [body.first === true ? ["INCR", "visits:total"] : ["GET", "visits:total"]];
  if (id) commands.push(["ZADD", "visits:here", now, id]);
  commands.push(["ZREMRANGEBYSCORE", "visits:here", 0, now - HERE_FOR], ["ZCARD", "visits:here"]);
  try {
    const reply = await fetch(`${url}/pipeline`, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
      body: JSON.stringify(commands),
      cache: "no-store",
    });
    const results = await reply.json();
    return Response.json({ total: Number(results[0].result) || 0, here: Number(results[results.length - 1].result) || 0 });
  } catch {
    return Response.json({ total: null, here: null });
  }
}
