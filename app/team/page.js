import Image from "next/image";

export const metadata = { title: "Team" };

const members = [
  { img: "/team/ishu.jpeg", name: "Ishu Chaudhary", role: "President" },
  { img: "/team/sai-krishna.jpeg", name: "Sai Krishna", role: "Vice President" },
  { img: "/team/ruchir.jpeg", name: "Ruchir Saini", role: "Logistics Head" },
  { img: "/team/harsha.jpeg", name: "Harshavardhan Devsoth", role: "Marketing Head" },
  { img: "/team/meghana.jpeg", name: "Meghana Vihulekar", role: "Practice & Wellbeing Head" },
  { img: "/team/chandana.jpeg", name: "Chandana Amireddy", role: "Events Head" },
];

export default function TeamPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12">
      <header className="text-center">
        <h1 className="font-display text-4xl text-ink">Team</h1>
        <p className="mx-auto mt-3 max-w-lg text-ink-soft">
          Batch 2026-27.
        </p>
      </header>
      <ul className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-3">
        {members.map(({ img, name, role }) => (
          <li
            key={name}
            className="overflow-hidden rounded-card border border-rule text-center"
          >
            <Image
              src={img}
              alt={`Portrait of ${name}`}
              width={400}
              height={500}
              loading="lazy"
              className="h-48 w-full object-cover object-top"
            />
            <div className="p-3">
              <p className="font-medium text-ink">{name}</p>
              <p className="text-xs text-ink-soft">{role}</p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
