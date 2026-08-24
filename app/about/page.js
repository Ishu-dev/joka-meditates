import Link from "next/link";

export const metadata = { title: "About" };

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-12">
      <h1 className="font-display text-4xl text-ink">About</h1>
      <div className="mt-6 space-y-4 leading-relaxed text-ink">
        <p>
          Joka Meditates is the student-run Heartfulness meditation Student
          Interest Group of IIM Calcutta. We sit together twice a week, run
          guided practices, and send a small newsletter twice a week: one
          practice, one verse, one experiment in stillness.
        </p>
        <p>
          When our Instagram was permanently disabled, this site and the issue
          became the only two doors into the club. Both stay open.
        </p>
        <p>
          Faculty coordinator: Prof. Anupama (Organisational Behaviour).
        </p>
      </div>
      <div className="mt-8 flex gap-3">
        <Link
          href="/team"
          className="rounded-full border border-deep px-5 py-2 text-sm font-medium text-deep hover:bg-deep-soft transition-colors"
        >
          Meet the team
        </Link>
        <Link
          href="/issues"
          className="rounded-full bg-accent px-5 py-2 text-sm font-medium text-paper hover:opacity-90 transition-opacity"
        >
          Read the issues
        </Link>
      </div>
    </div>
  );
}
