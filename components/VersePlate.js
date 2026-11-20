export default function VersePlate({ source, devanagari, transliteration, sense }) {
  return (
    <figure className="verse">
      <blockquote>
        {devanagari && (
          <p lang="sa" className="verse__deva">
            {devanagari}
          </p>
        )}
        {transliteration && (
          <p lang="sa-Latn" className="verse__roman">
            {transliteration}
          </p>
        )}
      </blockquote>
      {sense && <p className="verse__sense">{sense}</p>}
      {source && <figcaption>{source}</figcaption>}
    </figure>
  );
}
