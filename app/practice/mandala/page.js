import dynamic from "next/dynamic";
import GuideEnd from "@/components/guides/GuideEnd";

export const metadata = {
  title: "Mandala Visualizer",
  description:
    "A generative mandala that blooms with sound. Synth drone presets or your own microphone, nothing recorded.",
};

const MandalaVisualizer = dynamic(() => import("@/components/MandalaVisualizer"), {
  ssr: false,
  loading: () => <p className="lead mandala__wait">Waking up the mandala…</p>,
});

export default function MandalaPage() {
  return (
    <>
      <section className="band page-top">
        <div className="wrap stack">
          <h1 className="head head--wide">A mandala that blooms with sound.</h1>
          <p className="lead">
            Pick a drone frequency and begin, or let the microphone listen to the room. The pattern breathes with
            whatever it hears.
          </p>
        </div>
      </section>

      <section className="band field-ink cut-b" aria-label="The mandala and its controls">
        <div className="guide-stage" aria-hidden="true">
          <div className="guide-stage__inner">
            <div className="guide-seat" data-chanchal-perch />
          </div>
        </div>
        <div className="wrap">
          <MandalaVisualizer />
        </div>
      </section>

      <GuideEnd current="/practice/mandala">
        <h2 className="head">Two more guides.</h2>
        <p className="lead">Guides from our sessions, free to use anywhere.</p>
      </GuideEnd>
    </>
  );
}
