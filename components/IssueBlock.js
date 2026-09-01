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
    case "kicker":
      return (
        <p className="text-xs font-bold uppercase tracking-widest text-deep mt-8 mb-1">
          {block.text}
        </p>
      );
    case "prose":
      return (
        <div className="my-4 rounded-card bg-deep-soft/40 p-6 leading-relaxed text-ink space-y-4">
          {block.text.split("\n\n").map((para, i) => (
            <p key={i}>{para}</p>
          ))}
        </div>
      );
    case "card":
      return (
        <div className="my-3 rounded-card bg-accent-soft p-5">
          <h4 className="font-semibold text-ink text-base mb-1">{block.title}</h4>
          <p className="text-sm text-ink-soft m-0">{block.body}</p>
        </div>
      );
    case "intro":
      return (
        <p className="my-3 text-sm text-ink-soft leading-relaxed italic">{block.text}</p>
      );
    case "teacher":
      return (
        <div className="py-4 border-t border-rule first:border-t-0">
          <h4 className="font-display italic font-semibold text-2xl text-accent mb-2">
            {block.name}
          </h4>
          <p className="text-sm text-ink leading-relaxed m-0">{block.body}</p>
        </div>
      );
    case "callout":
      return (
        <div className="my-8 rounded-card bg-accent-soft p-6 text-center text-ink font-medium">
          {block.text}
        </div>
      );
    case "divider":
      return <hr className="my-10 border-0 border-t border-rule" />;
    default:
      return null;
  }
}
