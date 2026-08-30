import Link from "next/link";
import Reveal from "@/components/Reveal";
import Lotus3DGate from "@/components/Lotus3DGate";
import HeroOrnament from "@/components/HeroOrnament";
import { getIssues } from "@/lib/issues";

export default function HomePage() {
  return (
    <div className="mx-auto max-w-3xl px-4">
      <Reveal>
        <section className="relative py-16 text-center overflow-hidden">
          <HeroOrnament />
          <p className="text-sm uppercase tracking-[0.3em] text-deep">
            IIM Calcutta · Heartfulness SIG
          </p>
          <h1 className="font-display mt-4 text-5xl leading-tight text-ink sm:text-6xl">
            Pause. Breathe.
            <span className="block italic text-accent">Return to yourself.</span>
          </h1>
          <p className="mx-auto mt-6 max-w-xl leading-relaxed text-ink-soft">
            We are the student-run meditation circle of IIM Calcutta. Twice a
            week we send an issue: one practice, one verse, one small experiment
            in stillness.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3 relative z-10">
            <Link
              href="/issues"
              className="rounded-full bg-accent px-6 py-3 text-sm font-medium text-paper hover:opacity-90 transition-all duration-300 hover:scale-105 hover:shadow-lg active:scale-95 animate-pulse-subtle"
            >
              Read the issues
            </Link>
            <Link
              href="/join"
              className="rounded-full border border-deep px-6 py-3 text-sm font-medium text-deep hover:bg-deep-soft transition-all duration-300 hover:scale-105 active:scale-95"
            >
              Join a session
            </Link>
          </div>
        </section>
      </Reveal>

      <div className="mx-auto -mt-4 max-w-md relative z-10 animate-float">
        <Lotus3DGate />
      </div>

      <LatestIssueStrip />
    </div>
  );
}

async function LatestIssueStrip() {
  const issues = await getIssues();
  const latest = issues[0];
  if (!latest) return null;
  return (
    <Reveal>
      <section className="relative overflow-hidden rounded-card border border-rule bg-deep-soft/30 p-8 text-center transition-all duration-300 hover:border-accent/50 hover:shadow-md animate-breathe-glow">
        <div className="absolute inset-0 pointer-events-none animate-shimmer" />
        <p className="text-xs uppercase tracking-widest text-ink-soft relative z-10">
          Latest issue
        </p>
        <h2 className="font-display mt-2 text-2xl text-ink relative z-10">{latest.title}</h2>
        {latest.subtitle && (
          <p className="mt-1 text-ink-soft relative z-10">{latest.subtitle}</p>
        )}
        <Link
          href={`/issues/${latest.slug}`}
          className="mt-4 inline-block text-sm font-medium text-link hover:text-accent transition-transform duration-200 hover:translate-x-1 relative z-10"
        >
          Read issue {latest.number || ""} →
        </Link>
      </section>
    </Reveal>
  );
}
