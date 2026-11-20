import { supportRows, supportUpdated, helpline } from "@/data/support";
import Critter from "@/components/Critter";

export const metadata = {
  title: "Support",
  description: "Counsellors on the IIM Calcutta campus, their timings, Amaha, and a helpline that answers at any hour.",
};

const out = { target: "_blank", rel: "noopener noreferrer" };

export default function SupportPage() {
  return (
    <>
      <section className="band page-top" data-chanchal-calm>
        <div className="wrap stack">
          <h1 className="head head--wide">Someone to talk to, on campus.</h1>
          <p className="lead">
            Meditation helps with an ordinary restless week. For anything heavier, these people are trained for it,
            and they are here for students, staff and faculty.
          </p>
        </div>
      </section>

      <section className="band field-ink cut-b" aria-labelledby="now-h">
        <div className="wrap split">
          <h2 id="now-h" className="head split__a">
            At any hour, call {helpline.number}.
          </h2>
          <div className="split__b stack">
            <p className="statement">
              {helpline.name} is free and answers day and night.
            </p>
            <p className="lead">{helpline.note} If someone is in danger, go to the Medical Unit or call the campus security desk.</p>
            <a className="btn btn--paper" href={`tel:${helpline.number}`}>
              Call {helpline.number}
            </a>
          </div>
        </div>
      </section>

      <section className="band" aria-labelledby="week-h">
        <div className="critter-edge critter-edge--left">
          <Critter name="cat" />
        </div>
        <div className="wrap split">
          <div className="split__a stack">
            <h2 id="week-h" className="head">
              Through the week.
            </h2>
            <p className="note">
              Timings from the Medical Unit&rsquo;s consultant schedule dated {supportUpdated}. Ring extension 7251 to
              check before you walk over.
            </p>
            <p className="note">
              The consultants&rsquo; names and mobile numbers went to IIMC batches only, so they will sit behind an
              IIMC sign-in here. Until that opens, the Medical Unit desk can connect you.
            </p>
          </div>
          <dl className="rows split__b">
            {supportRows.map((row) => (
              <div key={row.who}>
                <dt>{row.who}</dt>
                <dd className="stack-s">
                  <p>{row.when}</p>
                  <p className="note">
                    {row.where}.
                    {row.link && (
                      <>
                        {" "}
                        <a href={row.link.href} {...out}>
                          {row.link.label}
                        </a>
                      </>
                    )}
                  </p>
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      <section className="band field-pond cut-a" aria-labelledby="amaha-h">
        <div className="wrap split">
          <div className="split__a stack">
            <h2 id="amaha-h" className="head">
              Amaha, in three steps.
            </h2>
            <p className="lead">
              Amaha is the institute&rsquo;s mental health partner. Sessions with its counsellors are open to everyone
              with an IIMC email.
            </p>
          </div>
          <ol className="steps split__b">
            <li>
              <p>
                <b>Open the IIMC Amaha page</b> and sign in with your institute email.{" "}
                <a href="https://iimc.integrations.amahahealth.com/auth/log-in/" {...out}>
                  Go to the page
                </a>
              </p>
            </li>
            <li>
              <p>
                <b>Book online</b> with a counsellor in the Amaha app, any day.
              </p>
            </li>
            <li>
              <p>
                <b>Or meet one on campus</b> on the first working Friday of the month. The booking form comes by mail
                from the Hostel Affairs Secretary, <a href="mailto:hasecy@email.iimcal.ac.in">hasecy@email.iimcal.ac.in</a>.
              </p>
            </li>
          </ol>
        </div>
      </section>

    </>
  );
}
