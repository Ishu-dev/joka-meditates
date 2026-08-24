export const metadata = { title: "Join" };

export default function JoinPage() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-12 text-center">
      <h1 className="font-display text-4xl text-ink">Join a session</h1>
      <p className="mx-auto mt-4 max-w-lg leading-relaxed text-ink-soft">
        No experience needed, no flexibility required. Show up as you are, sit
        with us, and see what a shared half hour of stillness does to a week.
      </p>
      <div className="mt-8 rounded-card border border-rule bg-deep-soft/30 p-6">
        <p className="text-xs uppercase tracking-widest text-deep">Sessions</p>
        <p className="mt-2 text-ink">
          Schedule being finalized for the new term. Watch this space or the
          latest issue.
        </p>
      </div>
      <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
        <a
          href="https://chat.whatsapp.com/GlJ7rURYrjT88BT8h5IwYR"
          target="_blank"
          rel="noopener noreferrer"
          className="rounded-full bg-deep px-6 py-3 text-sm font-medium text-paper hover:opacity-90 transition-opacity"
        >
          Join the WhatsApp community
        </a>
        <a
          href="mailto:joka-meditates@email.iimcal.ac.in"
          className="rounded-full border border-deep px-6 py-3 text-sm font-medium text-deep hover:bg-deep-soft transition-colors"
        >
          Write to us
        </a>
      </div>
      <p className="mt-6 text-sm text-ink-soft">
        Also on{" "}
        <a
          href="https://www.instagram.com/joka_meditates/"
          target="_blank"
          rel="noopener noreferrer"
          className="text-link hover:text-accent"
        >
          Instagram @joka_meditates
        </a>
      </p>
    </div>
  );
}
