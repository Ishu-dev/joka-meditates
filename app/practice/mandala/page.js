import dynamic from "next/dynamic";
import Image from "next/image";

export const metadata = {
  title: "Mandala Visualizer",
  description:
    "A generative mandala that blooms with sound. Synth drone presets or your own microphone, nothing recorded.",
};

const MandalaVisualizer = dynamic(
  () => import("@/components/MandalaVisualizer"),
  {
    ssr: false,
    loading: () => (
      <div className="rounded-card border border-rule bg-deep-soft/20 p-8 text-center">
        <Image
          src="/graphics/mandalas/mandala-01.png"
          alt=""
          aria-hidden="true"
          width={420}
          height={420}
          className="mx-auto h-64 w-auto object-contain opacity-60"
        />
        <p className="mt-4 text-sm text-ink-soft">Waking up the mandala...</p>
      </div>
    ),
  }
);

export default function MandalaPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12">
      <header className="text-center">
        <h1 className="font-display text-4xl text-ink">Mandala Visualizer</h1>
        <p className="mx-auto mt-3 max-w-lg text-ink-soft">
          A generative mandala that blooms with sound. Pick a drone frequency
          and begin, or let the microphone listen to the room. The pattern
          breathes with whatever it hears.
        </p>
      </header>
      <div className="mt-8">
        <MandalaVisualizer />
      </div>
    </div>
  );
}
