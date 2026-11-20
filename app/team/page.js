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

// The first-year members, selected in July 2026 (63rd batch), in the order of the selection list.
const firstYears = [
  "Meetisha Kurade", "Anurag Sarkar", "Savi Modi", "Antara Mandal", "Priyadarshini",
  "Vikram Nagmani", "Anushka Hemrom", "Pragna Katragadda", "Rishi Roy", "Anurag Sai Kothi",
  "Mudita Aggarwal", "Arushi Singh", "Prathamesh Vinayak Killedar", "Abhay Negi", "Mayank Sharma",
  "Priyanshi Dhaneta", "Rachitkumar Chaudhari", "Kaveti Charitha", "Kanupriya Dwivedi", "Titir Mukherjee",
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
      <section className="band field-pond cut-a" aria-labelledby="first-h">
        <div className="wrap split">
          <div className="split__a stack">
            <h2 id="first-h" className="head">
              The first years.
            </h2>
            <p className="lead">Twenty students of the 63rd batch joined in July 2026. They take over next year.</p>
          </div>
          <ul className="split__b names">
            {firstYears.map((name) => (
              <li key={name}>{name}</li>
            ))}
          </ul>
        </div>
      </section>
    </>
  );
}
