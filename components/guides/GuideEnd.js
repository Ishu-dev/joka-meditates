import Link from "next/link";
import { guides } from "@/data/guides";

// How each guide ends: whatever the page wants to say last, then the other two
// guides as lily pads to step on.
//
// With `seat`, the pads sit beside the words and one more pad is left free at
// the foot of the band for Chanchal to sit on. Without it, the way back to the
// practice room is the third pad and the three run across the page.

const room = { href: "/practice", title: "The practice room", meta: "Breathing practices and timed sits." };

const pad = (g) => (
  <li key={g.href}>
    <Link href={g.href}>
      <span className="title">{g.title}</span>
      <span className="note">{g.meta}</span>
    </Link>
  </li>
);

export default function GuideEnd({ current, seat = false, children }) {
  const others = guides.filter((g) => g.href !== current);

  if (!seat) {
    return (
      <section className="band guide-end" aria-label="Where to go next">
        <div className="wrap">
          <div className="stack guide-end__say">{children}</div>
          <ul className="pads pads--wide">
            {others.map(pad)}
            {pad(room)}
          </ul>
        </div>
      </section>
    );
  }

  return (
    <section className="band guide-end" aria-label="Where to go next">
      <div className="guide-stage" aria-hidden="true">
        <div className="guide-stage__inner">
          <div className="guide-seat" data-chanchal-perch />
        </div>
      </div>
      <div className="wrap split">
        <div className="split__a stack">{children}</div>
        <div className="split__b stack">
          <ul className="pads">{others.map(pad)}</ul>
          <Link className="go" href="/practice">
            Back to the practice room
          </Link>
          <div className="guide-seat-room" aria-hidden="true" />
        </div>
      </div>
    </section>
  );
}
