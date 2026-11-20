import { campusDoors, iimcOnly } from "@/data/doors";
import { clubs, clubKinds, clubsChecked } from "@/data/clubs";
import Critter from "@/components/Critter";

export const metadata = {
  title: "Campus",
  description: "Libraries, the institute's own pages, every IIM Calcutta club we could find on Instagram, and a prep shelf for IIMC students.",
};

const out = { target: "_blank", rel: "noopener noreferrer" };

export default function CampusPage() {
  return (
    <>
      <section className="band page-top">
        <div className="wrap stack">
          <h1 className="head head--wide">Around campus.</h1>
          <p className="lead">
            The quiet rooms, the clubs next door, and the shelf of prep material other clubs have made for the batch.
          </p>
        </div>
      </section>

      <section className="band field-sun cut-a" aria-labelledby="read-h">
        <div className="critter-edge critter-edge--run">
          <Critter name="lizard" run tilt={1.8} />
        </div>
        <div className="wrap split">
          <h2 id="read-h" className="head split__a">
            Places to read and sit.
          </h2>
          <ul className="index split__b">
            {campusDoors.map((door) => (
              <li key={door.name}>
                <a href={door.href} {...out}>
                  <span className="index__name">{door.name}</span>
                  <span className="note">{door.what}</span>
                </a>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="band" aria-labelledby="clubs-h">
        <div className="wrap stack">
          <h2 id="clubs-h" className="head head--wide">
            The clubs next door.
          </h2>
          <p className="note">
            Instagram pages of IIM Calcutta&rsquo;s clubs, cells and fests, from the accounts we follow, checked on{" "}
            {clubsChecked}. Tell us if yours is missing.
          </p>
          <div className="directory">
            {clubKinds.map((kind) => (
              <section key={kind} aria-labelledby={`k-${kind}`}>
                <h3 id={`k-${kind}`} className="title">
                  {kind}
                </h3>
                <ul>
                  {clubs
                    .filter((c) => c.kind === kind)
                    .map((c) => (
                      <li key={c.handle}>
                        <a href={`https://www.instagram.com/${c.handle}/`} {...out}>
                          {c.name}
                        </a>
                      </li>
                    ))}
                </ul>
              </section>
            ))}
          </div>
        </div>
      </section>

      <section className="band field-ink cut-b" aria-labelledby="shelf-h">
        <div className="wrap split">
          <div className="split__a stack">
            <h2 id="shelf-h" className="head">
              The prep shelf, for IIMC accounts.
            </h2>
            <p className="lead">
              These were made by other clubs and sent to IIMC batches, so they open only for an IIMC Google account.
              A personal Gmail can sign in to the site, and will not see this shelf.
            </p>
            <p className="note">Sign-in is being built. The list below shows what will be on the shelf and who made it.</p>
          </div>
          <dl className="rows split__b">
            {iimcOnly.map((item) => (
              <div key={item.name}>
                <dt>{item.name}</dt>
                <dd>Prepared by {item.by}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>
    </>
  );
}
