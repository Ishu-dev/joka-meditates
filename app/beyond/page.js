import { partners, beyondDoors } from "@/data/doors";
import { kolkataNgos, otherWellbeing } from "@/data/beyond";
import Critter from "@/components/Critter";

export const metadata = {
  title: "Beyond campus",
  description: "The organisations Joka Meditates has worked with, and ways to volunteer in Kolkata, from senior citizens to schools.",
};

const out = { target: "_blank", rel: "noopener noreferrer" };

export default function BeyondPage() {
  const [vayo, ...rest] = beyondDoors;
  return (
    <>
      <section className="band page-top">
        <div className="wrap stack">
          <h1 className="head head--wide">Beyond the gate.</h1>
          <p className="lead">
            Who has taught us, and where a free Saturday can go. This page sits apart from the club&rsquo;s own work on
            purpose.
          </p>
        </div>
      </section>

      <section className="band field-pond cut-a" aria-labelledby="partners-h">
        <div className="critter-edge critter-edge--right">
          <Critter name="egret" />
        </div>
        <div className="wrap split">
          <h2 id="partners-h" className="head split__a">
            Who we have sat with.
          </h2>
          <ul className="index split__b">
            {[...partners, ...otherWellbeing].map((p) => (
              <li key={p.name}>
                <a href={p.href} {...out}>
                  <span className="index__name">{p.name}</span>
                  <span className="note">{p.what}</span>
                </a>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="band" aria-labelledby="vayo-h">
        <div className="wrap split">
          <div className="split__a stack">
            <h2 id="vayo-h" className="head">
              Keep an elder company.
            </h2>
            <p className="lead">{vayo.what}</p>
            <div className="actions">
              <a className="btn btn--quiet" href={vayo.href} {...out}>
                Register for {vayo.name}
              </a>
            </div>
            <p className="note">
              {vayo.from}. The programme launched on 4 November 2026; registration is also on the JEEVAN app.
            </p>
          </div>
          <ul className="index split__b">
            {rest.map((door) => (
              <li key={door.name}>
                <a href={door.href} {...out}>
                  <span className="index__name">{door.name}</span>
                  <span className="note">
                    {door.what} {door.from}.
                  </span>
                </a>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="band field-sun cut-b" aria-labelledby="ngo-h">
        <div className="wrap stack">
          <h2 id="ngo-h" className="head head--wide">
            Nine places in and around Kolkata.
          </h2>
          <p className="note">
            We have no tie-up with these organisations. Each line is how the organisation describes its own work; write
            to them directly to volunteer.
          </p>
          <ul className="grid-3 ngo">
            {kolkataNgos.map((n) => (
              <li key={n.name}>
                <Critter name={n.sprite} />
                <a href={n.href} {...out}>
                  <span className="title">{n.name}</span>
                  <span className="ngo__what">{n.what}</span>
                </a>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </>
  );
}
