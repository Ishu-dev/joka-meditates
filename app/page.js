import Link from "next/link";
import Reveal from "@/components/Reveal";
import { getIssues } from "@/lib/issues";

export default function HomePage() {
  return (
    <div className="mx-auto max-w-3xl px-4">
      <Reveal>
        <section className="py-16 text-center">
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
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <Link
              href="/issues"
              className="rounded-full bg-accent px-6 py-3 text-sm font-medium text-paper hover:opacity-90 transition-opacity"
            >
              Read the issues
            </Link>
            <Link
              href="/join"
              className="rounded-full border border-deep px-6 py-3 text-sm font-medium text-deep hover:bg-deep-soft transition-colors"
            >
              Join a session
            </Link>
          </div>
        </section>
      </Reveal>

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
      <section className="rounded-card border border-rule bg-deep-soft/30 p-8 text-center">
        <p className="text-xs uppercase tracking-widest text-ink-soft">
          Latest issue
        </p>
        <h2 className="font-display mt-2 text-2xl text-ink">{latest.title}</h2>
        {latest.subtitle && (
          <p className="mt-1 text-ink-soft">{latest.subtitle}</p>
        )}
        <Link
          href={`/issues/${latest.slug}`}
          className="mt-4 inline-block text-sm font-medium text-link hover:text-accent"
        >
          Read issue {latest.number || ""} →
        </Link>
      </section>
    </Reveal>
  );
}
