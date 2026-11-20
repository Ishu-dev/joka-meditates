// `action` names what the link opens; a single video says so instead of "playlist".
export default function PlaylistLink({ title, meta, href, action = "Open the playlist" }) {
  return (
    <a href={href} target="_blank" rel="noopener noreferrer" className="playlist">
      <span>
        <span className="playlist__title">{title}</span>
        <span className="playlist__meta">{meta}</span>
      </span>
      <span className="playlist__go">{action}</span>
    </a>
  );
}
