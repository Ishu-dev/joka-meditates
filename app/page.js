import Link from "next/link";
import Image from "next/image";
import Hero from "@/components/Hero";
import StreakBadge from "@/components/StreakBadge";
import { getIssues } from "@/lib/issues";
import { today } from "@/lib/today";
import { practices } from "@/lib/practices";
import { boardItems, formatBoardDate } from "@/data/board";
import { supportRows, supportUpdated, helpline } from "@/data/support";
import { campusDoors, partners, beyondDoors } from "@/data/doors";
import Critter from "@/components/Critter";

// The thought and the verse change at midnight in Kolkata; rebuild the page
// every half hour so the board is never more than that far behind.
export const revalidate = 1800;

const out = { target: "_blank", rel: "noopener noreferrer" };

export default async function HomePage() {
  const t = today();
  const issues = await getIssues();
  const latest = issues[0];
  const news = boardItems.filter((item) => item.kind === "news").slice(0, 3);

  return (
    <>
      <Hero />

      <section className="band field-pond cut-a" aria-labelledby="today-h">
        <div className="critter-edge critter-edge--right">
          <Critter name="frog" />
        </div>
        <div className="wrap today__grid">
          <h2 id="today-h" className="head today__date">
            {t.label}
          </h2>
          <div className="today__thought stack-s">
            <p className="statement">{t.thought.text}</p>
            {t.thought.issue && <p className="note">From issue {t.thought.issue} of the newsletter.</p>}
          </div>
          <figure className="shloka">
            <blockquote>
              <p className="shloka__deva" lang="sa">
                {t.shloka.deva.map((line) => (
                  <span key={line}>{line}</span>
                ))}
              </p>
              <p className="shloka__roman" lang="sa-Latn">
                {t.shloka.roman.map((line) => (
                  <span key={line}>{line}</span>
                ))}
              </p>
            </blockquote>
            <p className="shloka__plain">
              <b>In plain words.</b> {t.shloka.plain}
            </p>
            <p className="shloka__try">
              <b>Try it today.</b> {t.shloka.try}
            </p>
            <figcaption>Bhagavad Gita {t.shloka.ref}. A new verse and a new thought every morning.</figcaption>
          </figure>
        </div>
      </section>

      <section className="band" aria-labelledby="practice-h">
        <div className="critter-edge critter-edge--right">
          <Critter name="egret" />
        </div>
        <div className="wrap split">
          <div className="split__a stack">
            <h2 id="practice-h" className="head">
              Two minutes counts as practice.
            </h2>
            <figure className="photo photo--blob photo--tilt-l">
              <div className="photo__frame">
                <Image
                  src="/photos/yoga-day-2026-nadi-shodhana.jpg"
                  alt="Rows of people on yoga mats, each closing one nostril with a thumb, practising alternate nostril breathing"
                  width={2000}
                  height={1333}
                  sizes="(min-width: 60rem) 36vw, 92vw"
                />
              </div>
              <figcaption>Nadi Shodhana on International Yoga Day, 21 June 2026.</figcaption>
            </figure>
          </div>
          <div className="split__b stack">
            <p className="lead">
              Chanchal is the Gita&rsquo;s word for a restless mind, and the name of the figure wandering this page.
              Each practice runs in your browser. Finish one and he settles.
            </p>
            <ul className="pads">
              {practices.slice(0, 4).map((p) => (
                <li key={p.id}>
                  <Link href={`/practice#${p.id}`}>
                    <span className="title">{p.name}</span>
                    <span className="note">{p.length}</span>
                  </Link>
                </li>
              ))}
            </ul>
            <StreakBadge />
            <Link className="go" href="/practice">
              Open the practice room
            </Link>
          </div>
        </div>
      </section>

      {latest && (
        <section className="band field-accent cut-b" aria-labelledby="board-h">
          <div className="critter-edge critter-edge--left">
            <Critter name="snail" />
          </div>
          <div className="wrap split">
            <div className="split__a stack">
              <h2 id="board-h" className="head">
                {latest.title}
              </h2>
              <p className="lead">
                Issue {latest.number} of the newsletter. {latest.subtitle}
              </p>
              <div className="actions">
                <Link className="btn btn--quiet" href={`/issues/${latest.slug}`}>
                  Read issue {latest.number}
                </Link>
                <Link className="go" href="/issues">
                  Every issue
                </Link>
              </div>
            </div>
            <div className="split__b stack">
              <ul className="rows">
                {news.map((item) => (
                  <li key={item.title}>
                    <time className="rows__name" dateTime={item.date}>
                      {formatBoardDate(item)}
                    </time>
                    <span>{item.title}</span>
                  </li>
                ))}
              </ul>
              <Link className="go" href="/board">
                Open the board
              </Link>
            </div>
          </div>
        </section>
      )}

      <section className="band" aria-labelledby="sit-h">
        <div className="critter-edge critter-edge--left">
          <Critter name="dog" />
        </div>
        <div className="wrap stack">
          <h2 id="sit-h" className="head head--wide">
            Where we sat this year.
          </h2>
          <div className="sittings">
            <div className="sittings__main">
              <figure className="photo photo--wide">
                <div className="photo__frame">
                  <Image
                    src="/photos/yoga-day-2026-hall.jpg"
                    alt="A hall full of people in white IIM Calcutta T-shirts sitting cross-legged on yoga mats"
                    width={2400}
                    height={1600}
                    sizes="(min-width: 60rem) 60vw, 92vw"
                  />
                </div>
                <figcaption>International Yoga Day, 21 June 2026. Lake View Hostel mess, 6:30 AM.</figcaption>
              </figure>
              <p className="lead">
                Trainers, guests and our own team lead the sittings. The next one:{" "}
                <span className="fill" data-fill="next-session">
                  date and room to be announced
                </span>
                , in the WhatsApp circle first.
              </p>
              <Link className="go" href="/events">
                Every session since 2024
              </Link>
            </div>
            <div className="sittings__side">
              <figure className="photo photo--square photo--tilt-r">
                <div className="photo__frame">
                  <Image
                    src="/photos/workshop-2025-sitting.jpg"
                    alt="Students sitting with eyes closed at their desks during a meditation workshop"
                    width={1440}
                    height={1440}
                    sizes="(min-width: 60rem) 30vw, 92vw"
                  />
                </div>
                <figcaption>Learn to Meditate, three evenings with Heartfulness. June 2025, NAB L-51.</figcaption>
              </figure>
              <figure className="photo photo--land photo--tilt-l">
                <div className="photo__frame">
                  <Image
                    src="/photos/minal-shanghavi-2026-n22.jpg"
                    alt="A full classroom listening to Minal Shanghavi, his slides on two screens"
                    width={2400}
                    height={1800}
                    sizes="(min-width: 60rem) 30vw, 92vw"
                  />
                </div>
                <figcaption>An evening with Minal Shanghavi, 19 September 2026, NAB N22.</figcaption>
              </figure>
            </div>
          </div>
        </div>
      </section>

      <section className="band field-ink cut-a" aria-labelledby="help-h">
        <div className="critter-edge critter-edge--right">
          <Critter name="owl" />
        </div>
        <div className="wrap split">
          <div className="split__a stack">
            <h2 id="help-h" className="head">
              When the mind won&rsquo;t settle alone.
            </h2>
            <p className="lead">
              Counsellors are on campus every week, and Amaha is open online to everyone at IIMC.
            </p>
            <Link className="go" href="/support">
              All support details
            </Link>
          </div>
          <div className="split__b stack">
            <dl className="rows">
              {supportRows.map((row) => (
                <div key={row.who}>
                  <dt>{row.who}</dt>
                  <dd>{row.when}</dd>
                </div>
              ))}
              <div>
                <dt>Any hour</dt>
                <dd>
                  {helpline.name}: call {helpline.number}, free.
                </dd>
              </div>
            </dl>
            <p className="note">Timings from the Medical Unit schedule dated {supportUpdated}.</p>
          </div>
        </div>
      </section>

      <section className="band" aria-labelledby="doors-h">
        <div className="critter-edge critter-edge--right">
          <Critter name="cat" />
        </div>
        <div className="wrap stack">
          <h2 id="doors-h" className="head head--wide">
            More doors, on campus and off.
          </h2>
          <div className="split">
            <ul className="index split__a" aria-label="On campus">
              {campusDoors.slice(0, 2).map((door) => (
                <li key={door.name}>
                  <a href={door.href} {...out}>
                    <span className="index__name">{door.name}</span>
                    <span className="note">{door.what}</span>
                  </a>
                </li>
              ))}
              <li>
                <Link href="/campus">
                  <span className="index__name">Clubs and the prep shelf</span>
                  <span className="note">Every IIMC club we could find, and placement prep for IIMC sign-ins.</span>
                </Link>
              </li>
            </ul>
            <ul className="index split__b" aria-label="Beyond the gate">
              {partners.map((door) => (
                <li key={door.name}>
                  <a href={door.href} {...out}>
                    <span className="index__name">{door.name}</span>
                    <span className="note">{door.what}</span>
                  </a>
                </li>
              ))}
              <li>
                <Link href="/beyond">
                  <span className="index__name">{beyondDoors[0].name}</span>
                  <span className="note">Volunteer with senior citizens, and other ways to help in Kolkata.</span>
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </section>
    </>
  );
}
