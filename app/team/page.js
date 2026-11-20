import Image from "next/image";

export const metadata = { title: "Team" };

const members = [
  { img: "/team/ishu.jpeg", name: "Ishu Chaudhary", role: "President" },
  { img: "/team/sai-krishna.jpeg", name: "Sai Krishna", role: "Vice President" },
  { img: "/team/ruchir.jpeg", name: "Ruchir Sahni", role: "Logistics Head" },
  { img: "/team/harsha.jpeg", name: "Harshawardhan Devsoth", role: "Marketing Head" },
  { img: "/team/meghana.jpeg", name: "Meghana Vihulekar", role: "Practice & Wellbeing Head" },
  { img: "/team/chandana.jpeg", name: "Chandana Amireddy", role: "Events Head" },
];

export default function TeamPage() {
  return (
    <>
      <section className="band page-top">
        <div className="wrap stack">
          <h1 className="head head--wide">The team, 2026-27.</h1>
          <p className="lead">Six students who run the sittings, the newsletter and this site.</p>
        </div>
      </section>
      <section className="band" aria-label="Team members">
        <div className="wrap">
          <ul className="people">
            {members.map(({ img, name, role }) => (
              <li key={name}>
                <figure className="photo">
                  <div className="photo__frame">
                    <Image src={img} alt={`Portrait of ${name}`} width={400} height={500} sizes="(min-width: 60rem) 30vw, 46vw" />
                  </div>
                  <figcaption>
                    <span className="title people__name">{name}</span>
                    {role}
                  </figcaption>
                </figure>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </>
  );
}
