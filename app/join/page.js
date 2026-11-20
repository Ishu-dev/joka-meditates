import Image from "next/image";
import Critter from "@/components/Critter";

export const metadata = { title: "Join" };

const out = { target: "_blank", rel: "noopener noreferrer" };

export default function JoinPage() {
  return (
    <>
      <section className="band page-top">
        <div className="wrap stack">
          <h1 className="head head--wide">Join a session</h1>
          <p className="lead">
            No experience needed, no flexibility required. Show up as you are, sit with us, and see what a shared half
            hour of stillness does to a week.
          </p>
        </div>
      </section>
      <section className="band field-pond cut-a" aria-labelledby="when-h">
        <div className="critter-edge critter-edge--right">
          <Critter name="fish" />
        </div>
        <div className="wrap split">
          <div className="split__a stack">
            <h2 id="when-h" className="head">
              Sessions are announced on WhatsApp.
            </h2>
            <p className="lead">
              The next sitting:{" "}
              <span className="fill" data-fill="next-session">
                date and room to be announced
              </span>
              . The circle hears first, then the newsletter.
            </p>
          </div>
          <div className="split__b stack">
            <div className="actions">
              <a className="btn btn--paper" href="https://chat.whatsapp.com/GlJ7rURYrjT88BT8h5IwYR" {...out}>
                Join the WhatsApp community
              </a>
              <a className="btn btn--quiet" href="mailto:joka-meditates@email.iimcal.ac.in">
                Write to us
              </a>
            </div>
            <figure className="photo photo--land">
              <div className="photo__frame">
                <Image
                  src="/photos/sept-2026-evening-group.jpg"
                  alt="Students and two Heartfulness trainers standing together at the front of a classroom after a session"
                  width={2400}
                  height={1800}
                  sizes="(min-width: 60rem) 46vw, 92vw"
                />
              </div>
              <figcaption>After a sitting with Heartfulness trainers, 12 September 2026.</figcaption>
            </figure>
            <p className="note">
              Also on{" "}
              <a href="https://www.instagram.com/joka_meditates/" {...out}>
                Instagram @joka_meditates
              </a>
              .
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
