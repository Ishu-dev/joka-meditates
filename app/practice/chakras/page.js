import Image from "next/image";

export const metadata = { title: "7-Chakra Alignment Guide" };

const chakras = [
  { img: "/graphics/chakras/01_muladhara.png", name: "Muladhara", en: "Root", note: "Grounding. Sit tall, feel the seat, let the weight drop." },
  { img: "/graphics/chakras/02_svadhisthana.png", name: "Svadhisthana", en: "Sacral", note: "Ease. Soften the belly, let breath move low and slow." },
  { img: "/graphics/chakras/03_manipura.png", name: "Manipura", en: "Solar Plexus", note: "Energy. Draw the breath in at the navel, hold gently." },
  { img: "/graphics/chakras/04_anahata.png", name: "Anahata", en: "Heart", note: "Openness. Broaden the chest, offer the breath out." },
  { img: "/graphics/chakras/05_vishuddha.png", name: "Vishuddha", en: "Throat", note: "Expression. Hum softly on the exhale, feel the vibration." },
  { img: "/graphics/chakras/06_ajna.png", name: "Ajna", en: "Third Eye", note: "Attention. Rest the gaze inward, between the brows." },
  { img: "/graphics/chakras/07_sahasrara.png", name: "Sahasrara", en: "Crown", note: "Stillness. Stop doing. Sit with what remains." },
];

export default function ChakrasPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12">
      <header className="text-center">
        <h1 className="font-display text-4xl text-ink">
          7-Chakra Alignment Guide
        </h1>
        <p className="mx-auto mt-3 max-w-lg text-ink-soft">
          Move attention up the spine, one center at a time. A minute each is
          enough.
        </p>
      </header>
      <ul className="mt-10 space-y-6">
        {chakras.map(({ img, name, en, note }, i) => (
          <li
            key={name}
            className="flex flex-col items-center gap-5 rounded-card border border-rule p-6 sm:flex-row"
          >
            <Image
              src={img}
              alt={`${name} chakra symbol`}
              width={140}
              height={140}
              loading="lazy"
              className="h-32 w-32 object-contain"
            />
            <div className="text-center sm:text-left">
              <p className="text-xs uppercase tracking-widest text-deep">
                {String(i + 1).padStart(2, "0")} · {en}
              </p>
              <h2 className="font-display text-2xl text-ink">{name}</h2>
              <p className="mt-1 text-ink-soft">{note}</p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
