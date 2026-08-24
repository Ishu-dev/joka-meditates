import Image from "next/image";
import BreathingWidget from "./BreathingWidget";
import CountdownTimer from "./CountdownTimer";
import PlaylistLink from "./PlaylistLink";
import VersePlate from "./VersePlate";

export default function IssueBlock({ block }) {
  switch (block.type) {
    case "heading":
      return (
        <h2 className="font-display mt-10 mb-3 text-3xl text-ink">
          {block.text}
        </h2>
      );
    case "subheading":
      return (
        <h3 className="font-display mt-8 mb-2 text-xl text-ink">{block.text}</h3>
      );
    case "lede":
      return (
        <p className="font-display text-xl italic leading-relaxed text-ink-soft">
          {block.text}
        </p>
      );
    case "text":
      return <p className="my-4 leading-relaxed text-ink">{block.text}</p>;
    case "quote":
      return (
        <blockquote className="my-8 border-l-4 border-accent pl-4 font-display text-2xl italic leading-snug text-ink">
          {block.text}
        </blockquote>
      );
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
      return (
        <BreathingWidget
          phases={block.phases}
          defaultCycles={block.cycles || 4}
        />
      );
    case "timer":
      return <CountdownTimer seconds={block.seconds || 60} label={block.label} />;
    case "playlist":
      return (
        <PlaylistLink title={block.title} meta={block.meta} href={block.href} />
      );
    case "list":
      return (
        <ol className="my-4 list-decimal space-y-2 pl-6 text-ink">
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
          className="my-6 rounded-card border border-rule"
        />
      );
    case "note":
      return (
        <aside className="my-6 rounded-card bg-accent-soft/50 p-4 text-sm text-ink">
          {block.text}
        </aside>
      );
    case "divider":
      return <hr className="my-10 border-0 border-t border-rule" />;
    default:
      return null;
  }
}
