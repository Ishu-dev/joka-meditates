import Link from "next/link";
import PracticeRoom from "@/components/PracticeRoom";
import StreakBadge from "@/components/StreakBadge";
import BreathBloom from "@/components/BreathBloom";
import Critter from "@/components/Critter";

export const metadata = {
  title: "Practice",
  description: "Five guided breaths and three timed sits that run in your browser, with a streak that counts your days.",
};

const guides = [
  {
    href: "/practice/chakras",
    title: "7-Chakra Alignment Guide",
    meta: "Walk each energy centre, root to crown.",
  },
  {
    href: "/practice/yoga-poses",
    title: "14-Pose Yoga Guide",
    meta: "A gentle sequence, pose by pose.",
  },
  {
    href: "/practice/mandala",
    title: "Mandala Visualizer",
    meta: "A mandala that moves with sound.",
  },
];

export default function PracticePage() {
  return (
    <>
      <section className="band page-top">
        <div className="wrap stack">
          <h1 className="head head--wide">The practice room.</h1>
          <p className="lead">
            Five breaths and three sits, guided here in your browser. Pick one, press start, and follow the sun.
          </p>
        </div>
      </section>

      <section className="band field-pond cut-a" aria-label="Guided practice">
        <BreathBloom anchor=".room__disc" tone="pond" spread={0.34} />
        <div className="critter-edge critter-edge--right">
          <Critter name="frog" />
        </div>
        {/* Chanchal's pad. On a wide screen it sits between the list and the sun, so he breathes beside it. */}
        <div className="guide-stage room-seat" aria-hidden="true">
          <div className="guide-stage__inner">
            <div className="guide-seat" data-chanchal-perch />
          </div>
        </div>
        <div className="wrap stack">
          <PracticeRoom />
          <p className="note">
            If a hold feels like strain, skip it and breathe normally. Stop if you feel dizzy.
          </p>
          <div className="guide-seat-room room-seat-room" aria-hidden="true" />
        </div>
      </section>

      <section className="band" aria-labelledby="streak-h">
        <div className="wrap split">
          <div className="split__a stack">
            <h2 id="streak-h" className="head">
              Abhyasa means showing up again.
            </h2>
            <p className="lead">
              The Gita&rsquo;s answer to a restless mind is practice, repeated (6.35). So the site counts your days.
            </p>
            <StreakBadge showPoints />
            <p className="note">
              Each practice earns 5 points a minute, 10 at least. The leaderboard opens with sign-in, and you choose
              whether your name shows on it.
            </p>
          </div>
          <div className="split__b stack">
            <h2 className="title">Guides from our sessions</h2>
            <ul className="index">
              {guides.map(({ href, title, meta }) => (
                <li key={href}>
                  <Link href={href}>
                    <span className="index__name">{title}</span>
                    <span className="note">{meta}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>
    </>
  );
}
