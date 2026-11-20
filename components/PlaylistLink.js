export default function PlaylistLink({ title, meta, href }) {
  return (
    <a href={href} target="_blank" rel="noopener noreferrer" className="playlist">
      <span>
        <span className="playlist__title">{title}</span>
        <span className="playlist__meta">{meta}</span>
      </span>
      <span className="playlist__go">Open the playlist</span>
    </a>
  );
}
