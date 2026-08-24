import Link from "next/link";
import Reveal from "@/components/Reveal";

export const metadata = { title: "Practice" };

const guides = [
  {
    href: "/practice/chakras",
    title: "7-Chakra Alignment Guide",
    meta: "Walk each energy center, root to crown",
  },
  {
    href: "/practice/yoga-poses",
    title: "14-Pose Yoga Guide",
    meta: "A gentle sequence, illustrated pose by pose",
  },
  {
    href: "/practice/mandala",
    title: "Mandala Visualizer",
    meta: "A generative mandala that breathes with sound",
  },
];

export default function PracticePage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12">
      <h1 className="font-display text-4xl text-ink">Practice</h1>
      <p className="mt-3 max-w-lg text-ink-soft">
        Guides from our sessions, free to use anywhere. More arriving with each
        issue.
      </p>
      <ul className="mt-8 grid gap-4 sm:grid-cols-2">
        {guides.map(({ href, title, meta }, i) => (
          <Reveal as="li" key={href} delay={i * 60}>
            <Link
              href={href}
              className="block h-full rounded-card border border-rule p-6 transition-colors hover:border-accent"
            >
              <span className="font-display text-xl text-ink">{title}</span>
              <span className="mt-2 block text-sm text-ink-soft">{meta}</span>
            </Link>
          </Reveal>
        ))}
      </ul>
    </div>
  );
}
