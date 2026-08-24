export const metadata = { title: "Mandala Visualizer" };

export default function MandalaPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12 text-center">
      <h1 className="font-display text-4xl text-ink">Mandala Visualizer</h1>
      <p className="mx-auto mt-3 max-w-lg text-ink-soft">
        A generative mandala that blooms with sound. Choose a drone frequency,
        press begin, and watch the pattern breathe with the waveform.
      </p>
      <p className="mt-8 rounded-card border border-rule bg-deep-soft/30 p-6 text-sm text-ink-soft">
        The interactive visualizer lands in Phase 4 of the build. The design and
        sound engine are already specced in the PRD (§9.8).
      </p>
    </div>
  );
}
