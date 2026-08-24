import Image from "next/image";
import Reveal from "@/components/Reveal";

export const metadata = { title: "Events" };

const photos = Array.from({ length: 17 }, (_, i) =>
  `/events/yoga-day-${String(i + 1).padStart(2, "0")}.jpg`
);

export default function EventsPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12">
      <header className="text-center">
        <h1 className="font-display text-4xl text-ink">Events</h1>
        <p className="mx-auto mt-3 max-w-lg text-ink-soft">
          International Yoga Day, 21 June 2024. The IIM Calcutta community on
          the mat, guided by the Joka Meditates team.
        </p>
      </header>
      <ul className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2">
        {photos.map((src, i) => (
          <Reveal as="li" key={src} delay={(i % 2) * 60}>
            <Image
              src={src}
              alt={`International Yoga Day session photo ${i + 1}, IIM Calcutta`}
              width={800}
              height={533}
              loading="lazy"
              className="rounded-card border border-rule object-cover"
            />
          </Reveal>
        ))}
      </ul>
    </div>
  );
}
