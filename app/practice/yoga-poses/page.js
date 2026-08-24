import Image from "next/image";
import Reveal from "@/components/Reveal";

export const metadata = { title: "14-Pose Yoga Guide" };

const poses = [
  {
    img: "/graphics/yoga-poses/yoga-pose-02.png",
    name: "Pranamasana",
    en: "Prayer Pose",
    note: "Stand tall, palms together. Arrive, set an intention.",
  },
  {
    img: "/graphics/yoga-poses/yoga-pose-01.png",
    name: "Hasta Uttanasana",
    en: "Raised Arms Pose",
    note: "Arch back gently from the waist. Opens the chest and lungs.",
  },
  {
    img: "/graphics/yoga-poses/yoga-pose-03.png",
    name: "Padahastasana",
    en: "Hand-to-Foot Pose",
    note: "Fold forward, spine long. Stretches hamstrings, calms the mind.",
  },
  {
    img: "/graphics/yoga-poses/yoga-pose-06.png",
    name: "Bhujangasana",
    en: "Cobra Pose",
    note: "Chest up, elbows soft. Strengthens the back, lifts energy.",
  },
  {
    img: "/graphics/yoga-poses/yoga-pose-08.png",
    name: "Vajrasana",
    en: "Thunderbolt Pose",
    note: "Kneel, sit on heels. Aids digestion, steadies the breath.",
  },
  {
    img: "/graphics/yoga-poses/yoga-pose-13.png",
    name: "Malasana",
    en: "Garland Pose",
    note: "Deep squat, palms at heart. Opens hips, grounds the body.",
  },
  {
    img: "/graphics/yoga-poses/yoga-pose-11.png",
    name: "Konasana",
    en: "Side Angle Bend",
    note: "Wide stance, reach over. Stretches the side waist and spine.",
  },
  {
    img: "/graphics/yoga-poses/yoga-pose-09.png",
    name: "Setu Bandhasana",
    en: "Bridge Pose",
    note: "Lift the hips, press the feet. Strengthens glutes and lower back.",
  },
  {
    img: "/graphics/yoga-poses/yoga-pose-04.png",
    name: "Sarvangasana",
    en: "Shoulder Stand",
    note: "Legs vertical, supported. Restores circulation, calms the nervous system.",
  },
  {
    img: "/graphics/yoga-poses/yoga-pose-12.png",
    name: "Halasana",
    en: "Plow Pose",
    note: "Toes to the floor behind. Releases the spine and shoulders.",
  },
  {
    img: "/graphics/yoga-poses/yoga-pose-10.png",
    name: "Matsyasana",
    en: "Fish Pose",
    note: "Arch the chest, crown resting down. Counter-pose to the plow.",
  },
  {
    img: "/graphics/yoga-poses/yoga-pose-14.png",
    name: "Anuvittasana",
    en: "Standing Backbend",
    note: "Hands to lower back, lean back. Unlocks a desk-bound spine.",
  },
  {
    img: "/graphics/yoga-poses/yoga-pose-07.png",
    name: "Sirsasana",
    en: "Headstand",
    note: "The king of poses. Learn only with a teacher watching.",
  },
  {
    img: "/graphics/yoga-poses/yoga-pose-05.png",
    name: "Sukhasana",
    en: "Easy Pose",
    note: "Sit cross-legged, hands on knees. Close every practice here.",
  },
];

export default function YogaPosesPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12">
      <header className="text-center">
        <h1 className="font-display text-4xl text-ink">14-Pose Yoga Guide</h1>
        <p className="mx-auto mt-3 max-w-lg text-ink-soft">
          The sequence from our Yoga Day session, in order. Hold each pose for
          five easy breaths. Headstands only with a teacher around.
        </p>
      </header>
      <ul className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-3">
        {poses.map(({ img, name, en, note }, i) => (
          <Reveal
            as="li"
            key={name}
            delay={i * 40}
            className="h-full rounded-card border border-rule p-4 text-center transition-colors hover:border-accent"
          >
              <Image
                src={img}
                alt={`${name} (${en}) illustrated`}
                width={300}
                height={300}
                loading="lazy"
                className="mx-auto h-32 w-auto object-contain"
              />
              <p className="font-display mt-2 text-lg leading-tight text-ink">
                {name}
              </p>
              <p className="text-xs uppercase tracking-widest text-deep">{en}</p>
              <p className="mt-2 text-xs leading-relaxed text-ink-soft">{note}</p>
          </Reveal>
        ))}
      </ul>
    </div>
  );
}
