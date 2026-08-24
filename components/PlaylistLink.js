export default function PlaylistLink({ title, meta, href }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="my-6 flex items-center gap-4 rounded-card border border-rule bg-paper p-4 transition-colors hover:border-accent"
    >
      <span
        aria-hidden="true"
        className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-accent-soft text-accent"
      >
        ▶
      </span>
      <span>
        <span className="block font-medium text-ink">{title}</span>
        <span className="block text-sm text-ink-soft">{meta}</span>
      </span>
    </a>
  );
}
