import Image from "next/image";

export const metadata = { title: "14-Pose Yoga Guide" };

export default function YogaPosesPage() {
  const poses = Array.from({ length: 14 }, (_, i) => ({
    img: `/graphics/yoga-poses/yoga-pose-${String(i + 1).padStart(2, "0")}.png`,
    name: `Pose ${i + 1}`,
  }));
  return (
    <div className="mx-auto max-w-3xl px-4 py-12">
      <header className="text-center">
        <h1 className="font-display text-4xl text-ink">14-Pose Yoga Guide</h1>
        <p className="mx-auto mt-3 max-w-lg text-ink-soft">
          The sequence from our Yoga Day session, in order. Hold each pose for
          five easy breaths.
        </p>
      </header>
      <ul className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-3">
        {poses.map(({ img, name }) => (
          <li
            key={name}
            className="rounded-card border border-rule p-4 text-center"
          >
            <Image
              src={img}
              alt=""
              aria-hidden="true"
              width={300}
              height={300}
              loading="lazy"
              className="mx-auto h-36 w-auto object-contain"
            />
            <p className="mt-2 text-sm text-ink-soft">{name}</p>
          </li>
        ))}
      </ul>
      <p className="mt-6 text-center text-xs text-ink-soft">
        Pose names are being mapped to each illustration; this note goes away in
        Phase 3.
      </p>
    </div>
  );
}
