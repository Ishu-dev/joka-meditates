export default function VersePlate({ source, devanagari, transliteration, sense }) {
  return (
    <figure className="my-10 rounded-card border border-rule bg-deep-soft/30 p-6 text-center">
      {devanagari && (
        <p lang="sa" className="font-display text-2xl leading-relaxed text-ink">
          {devanagari}
        </p>
      )}
      {transliteration && (
        <p className="mt-3 italic text-ink-soft">{transliteration}</p>
      )}
      {sense && <figcaption className="mt-3 text-sm text-ink-soft">{sense}</figcaption>}
      {source && (
        <p className="mt-2 text-xs uppercase tracking-widest text-deep">{source}</p>
      )}
    </figure>
  );
}
