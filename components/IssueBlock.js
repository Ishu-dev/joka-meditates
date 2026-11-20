import Image from "next/image";
import BreathingWidget from "./BreathingWidget";
import CountdownTimer from "./CountdownTimer";
import PlaylistLink from "./PlaylistLink";
import VersePlate from "./VersePlate";

// Renders one block of a newsletter issue. The block types and their data
// are unchanged from the shipped issues; only the look moved to the site's
// new system (the classes live under ".issue" in app/globals.css).
export default function IssueBlock({ block }) {
  switch (block.type) {
    case "heading":
      return <h2>{block.text}</h2>;
    case "subheading":
      return <h3>{block.text}</h3>;
    case "lede":
      return <p className="issue__lede">{block.text}</p>;
    case "text":
      return <p>{block.text}</p>;
    case "quote":
      return <blockquote>{block.text}</blockquote>;
    case "verse":
      return (
        <VersePlate
          source={block.source}
          devanagari={block.devanagari}
          transliteration={block.transliteration}
          sense={block.sense}
        />
      );
    case "breathing":
      return <BreathingWidget phases={block.phases} defaultCycles={block.cycles || 4} />;
    case "timer":
      return <CountdownTimer seconds={block.seconds || 60} label={block.label} />;
    case "playlist":
      return <PlaylistLink title={block.title} meta={block.meta} href={block.href} action={block.action} />;
    case "list":
      return (
        <ol>
          {(block.items || []).map((item, i) => (
            <li key={i}>{item}</li>
          ))}
        </ol>
      );
    case "image":
      return (
        <Image
          src={block.src}
          alt={block.alt || ""}
          aria-hidden={block.alt ? undefined : true}
          width={block.width || 800}
          height={block.height || 600}
          loading="lazy"
          className="issue__image"
        />
      );
    case "note":
      return <aside className="issue__note">{block.text}</aside>;
    case "kicker":
      // A one-word category label that sat above a heading ("People",
      // "Body"). The heading already says it, so the label is kept for
      // screen readers and left out of view.
      return <p className="visually-hidden">{block.text}</p>;
    case "prose":
      return (
        <div className="issue__note">
          {block.text.split("\n\n").map((para, i) => (
            <p key={i}>{para}</p>
          ))}
        </div>
      );
    case "card":
      return (
        <div className="issue__card">
          <h3>{block.title}</h3>
          <p>{block.body}</p>
        </div>
      );
    case "intro":
      return <p className="issue__intro">{block.text}</p>;
    case "teacher":
      return (
        <div className="issue__teacher">
          <h3>{block.name}</h3>
          <p>{block.body}</p>
        </div>
      );
    case "callout":
      return <p className="issue__callout">{block.text}</p>;
    case "divider":
      return <hr />;
    default:
      return null;
  }
}
