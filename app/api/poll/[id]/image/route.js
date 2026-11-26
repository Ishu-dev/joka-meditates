// The tally as a PNG, for the mail. A mail cannot run code, but it can show a
// picture, and this picture is drawn fresh each time it is fetched, so opening
// the mail again shows the latest counts and names. Gmail fetches images
// through its own proxy, which can hold a copy for a few minutes.

import { ImageResponse } from "next/og";
import { getPoll } from "@/data/polls";
import { tally } from "@/lib/poll-store";

export const dynamic = "force-dynamic";

const C = {
  paper: "#feeff0",
  rule: "#dec3c4",
  ink: "#12210f",
  muted: "#525f4f",
  accent: "#c80865",
  pond: "#00563c",
  sun: "#fdc43f",
};
const W = 1200;
const ROW_H = 152; // label, bar and one line of names
const LINE_CHARS = 64; // names that fit on one line at 26px before "and N more"

function nameLine(names) {
  if (names.length === 0) return "No one yet";
  let line = "";
  let shown = 0;
  for (const n of names) {
    const next = line ? `${line}, ${n}` : n;
    if (next.length > LINE_CHARS && shown > 0) break;
    line = next.length > LINE_CHARS ? `${next.slice(0, LINE_CHARS - 1)}…` : next;
    shown += 1;
  }
  return shown < names.length ? `${line} and ${names.length - shown} more` : line;
}

function Row({ option, result, max, tone }) {
  const share = max > 0 ? Math.max(result.count / max, result.count > 0 ? 0.04 : 0) : 0;
  return (
    <div style={{ display: "flex", flexDirection: "column", height: ROW_H, paddingTop: 16, borderTop: `2px solid ${C.rule}` }}>
      <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between" }}>
        <div style={{ display: "flex", fontSize: 30, color: C.ink }}>{option.label}</div>
        <div style={{ display: "flex", fontSize: 38, color: tone }}>{result.count}</div>
      </div>
      <div style={{ display: "flex", marginTop: 8, height: 14, width: "100%", background: "#f6dfe0", borderRadius: 9 }}>
        <div style={{ display: "flex", height: 14, width: `${share * 100}%`, background: tone, borderRadius: 8 }} />
      </div>
      <div style={{ display: "flex", marginTop: 10, fontSize: 26, color: C.muted, lineHeight: 1.3 }}>{nameLine(result.names)}</div>
    </div>
  );
}

export async function GET(_request, { params }) {
  const poll = getPoll(params.id);
  if (!poll) return new Response("No such poll.", { status: 404 });

  let result;
  try {
    result = await tally(poll, params.id);
  } catch {
    result = { people: 0, options: [] };
  }
  const byId = Object.fromEntries(result.options.map((o) => [o.id, o]));
  const get = (id) => byId[id] || { id, count: 0, names: [] };
  const max = Math.max(1, ...result.options.map((o) => o.count));
  const rows = poll.sessions.length + poll.extras.length;
  const height = 48 + 150 + 28 + rows * ROW_H + 90 + 48;

  return new ImageResponse(
    (
      <div style={{ display: "flex", flexDirection: "column", width: W, height, padding: "48px 56px", background: C.paper, fontFamily: "sans-serif" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <div style={{ display: "flex", fontSize: 26, fontWeight: 700, letterSpacing: 3, color: C.accent }}>WHO IS GOING, LIVE</div>
            <div style={{ display: "flex", fontSize: 48, fontWeight: 700, color: C.ink, marginTop: 8 }}>{poll.short}</div>
          </div>
          <div style={{ display: "flex", fontSize: 28, color: C.muted }}>
            {result.people === 1 ? "1 person has answered" : `${result.people} people have answered`}
          </div>
        </div>
        <div style={{ display: "flex", flexDirection: "column", marginTop: 28 }}>
          {poll.sessions.map((o) => (
            <Row key={o.id} option={o} result={get(o.id)} max={max} tone={C.pond} />
          ))}
          {poll.extras.map((o) => (
            <Row key={o.id} option={o} result={get(o.id)} max={max} tone={C.accent} />
          ))}
        </div>
        <div style={{ display: "flex", marginTop: "auto", paddingTop: 24, borderTop: `2px solid ${C.rule}`, fontSize: 24, color: C.muted }}>
          {`Answer or change yours at jokameditates.org/poll/${params.id}`}
        </div>
      </div>
    ),
    {
      width: W,
      height,
      // Lower case on purpose: ImageResponse sets "cache-control" to a year,
      // immutable, and spreads these headers over its own. A "Cache-Control"
      // key would be added beside it instead of replacing it.
      headers: { "cache-control": "no-store, no-cache, must-revalidate, max-age=0" },
    }
  );
}
