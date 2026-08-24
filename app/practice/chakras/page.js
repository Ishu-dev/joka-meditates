import Image from "next/image";
import Reveal from "@/components/Reveal";

export const metadata = { title: "7-Chakra Alignment Guide" };

const chakras = [
  {
    img: "/graphics/chakras/01_muladhara.png",
    name: "Muladhara",
    en: "Root",
    color: "Red",
    where: "Base of the spine",
    sense: "Grounding, safety, stability",
    element: "Earth",
    note: "Grounding. Sit tall, feel the seat, let the weight drop.",
    detail:
      "The root is where the practice starts: contact with the floor, weight settling, the simple fact of being supported. When it is balanced you feel steady rather than scattered. In practice, spend a minute feeling the sit bones press down and the spine grow out of that foundation. Imbalance often shows as anxiety about basics: money, housing, safety.",
    seed: "LAM",
  },
  {
    img: "/graphics/chakras/02_svadhisthana.png",
    name: "Svadhisthana",
    en: "Sacral",
    color: "Orange",
    where: "Lower abdomen, below the navel",
    sense: "Creativity, pleasure, flow",
    element: "Water",
    note: "Ease. Soften the belly, let breath move low and slow.",
    detail:
      "The center of feeling and creative energy. Breath moving low into the belly here softens the constant bracing that studying and screen time build. Let the breath be unhurried, the belly round on every inhale. Imbalance can show as emotional flatness or, on the other end, being overwhelmed by feeling.",
    seed: "VAM",
  },
  {
    img: "/graphics/chakras/03_manipura.png",
    name: "Manipura",
    en: "Solar Plexus",
    color: "Yellow",
    where: "Navel center",
    sense: "Confidence, will, digestion",
    element: "Fire",
    note: "Energy. Draw the breath in at the navel, hold gently.",
    detail:
      "Your fire center: digestion, drive, the ability to commit and follow through. A gentle breath-hold at the navel after the inhale builds quiet heat and focus without tension. This is the center that gets depleted by deadline panic and restored by purposeful effort. If your will feels unreliable, work here.",
    seed: "RAM",
  },
  {
    img: "/graphics/chakras/04_anahata.png",
    name: "Anahata",
    en: "Heart",
    color: "Green",
    where: "Center of the chest",
    sense: "Love, compassion, connection",
    element: "Air",
    note: "Openness. Broaden the chest, offer the breath out.",
    detail:
      "The bridge between the lower three centers (body) and the upper three (mind). Broaden the chest on the inhale, offer the breath generously on the exhale. The Heartfulness tradition this club follows centers here: rest attention in the heart and let it be simple. Imbalance shows as guardedness, resentment, or losing yourself in other people's needs.",
    seed: "YAM",
  },
  {
    img: "/graphics/chakras/05_vishuddha.png",
    name: "Vishuddha",
    en: "Throat",
    color: "Blue",
    where: "Throat",
    sense: "Expression, truth, listening",
    element: "Space",
    note: "Expression. Hum softly on the exhale, feel the vibration.",
    detail:
      "The gate between what you feel and what you say. A soft hum on the exhale (the seed sound made audible) clears and settles this center. Useful before speaking in class, in conflict, or in any conversation where you usually swallow your words. Imbalance shows as over-talking, or as things left unsaid that turn into weight.",
    seed: "HAM",
  },
  {
    img: "/graphics/chakras/06_ajna.png",
    name: "Ajna",
    en: "Third Eye",
    color: "Indigo",
    where: "Between the eyebrows",
    sense: "Insight, intuition, focus",
    element: "Light",
    note: "Attention. Rest the gaze inward, between the brows.",
    detail:
      "The center of seeing clearly without looking. Rest attention lightly at the point between the brows; not staring, not straining, just resting. This is where concentration practice lives, and where the constant comment stream of the mind gets quiet enough to hear yourself think. Imbalance shows as fog, indecision, or a mind that argues with everything.",
    seed: "OM",
  },
  {
    img: "/graphics/chakras/07_sahasrara.png",
    name: "Sahasrara",
    en: "Crown",
    color: "Violet or white",
    where: "Top of the head",
    sense: "Absorption, stillness, connection to something larger",
    element: "Thought",
    note: "Stillness. Stop doing. Sit with what remains.",
    detail:
      "The centerless center: not an effort but a stopping. After moving attention up through the other six, simply sit with whatever remains. Nothing to visualize, nothing to fix. In the Heartfulness method this is where meditation naturally settles: absorbed, quiet, undecorated. If the practice ends here, it has gone well.",
    seed: "Silence",
  },
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
          enough. Open each card for the deeper reading.
        </p>
      </header>
      <ul className="mt-10 space-y-4">
        {chakras.map((c, i) => (
          <Reveal
            as="li"
            key={c.name}
            delay={i * 40}
            className="rounded-card border border-rule transition-colors hover:border-accent"
          >
              <details className="group">
                <summary className="flex cursor-pointer list-none items-center gap-5 p-5 [&::-webkit-details-marker]:hidden">
                  <Image
                    src={c.img}
                    alt={`${c.name} chakra symbol`}
                    width={96}
                    height={96}
                    loading="lazy"
                    className="h-20 w-20 shrink-0 object-contain"
                  />
                  <span className="flex-1">
                    <span className="block text-xs uppercase tracking-widest text-deep">
                      {String(i + 1).padStart(2, "0")} · {c.en} · {c.seed}
                    </span>
                    <span className="font-display block text-2xl text-ink">
                      {c.name}
                    </span>
                    <span className="block text-sm text-ink-soft">{c.note}</span>
                  </span>
                  <span
                    aria-hidden="true"
                    className="shrink-0 text-xl text-ink-soft transition-transform group-open:rotate-45"
                  >
                    +
                  </span>
                </summary>
                <div className="border-t border-rule px-5 pb-5 pt-4 text-sm leading-relaxed text-ink-soft">
                  <dl className="mb-3 grid grid-cols-2 gap-x-4 gap-y-1 sm:grid-cols-4">
                    <div>
                      <dt className="text-xs uppercase tracking-widest text-deep">
                        Where
                      </dt>
                      <dd className="text-ink">{c.where}</dd>
                    </div>
                    <div>
                      <dt className="text-xs uppercase tracking-widest text-deep">
                        Color
                      </dt>
                      <dd className="text-ink">{c.color}</dd>
                    </div>
                    <div>
                      <dt className="text-xs uppercase tracking-widest text-deep">
                        Element
                      </dt>
                      <dd className="text-ink">{c.element}</dd>
                    </div>
                    <div>
                      <dt className="text-xs uppercase tracking-widest text-deep">
                        Seed sound
                      </dt>
                      <dd className="text-ink">{c.seed}</dd>
                    </div>
                  </dl>
                  <p className="text-ink">{c.detail}</p>
                </div>
              </details>
          </Reveal>
        ))}
      </ul>
    </div>
  );
}
