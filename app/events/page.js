import Image from "next/image";
import { sessions, formatSessionDate } from "@/data/sessions";
import Critter from "@/components/Critter";

export const metadata = {
  title: "Sessions",
  description: "Every sitting, workshop and outing Joka Meditates has a record of, from World Meditation Day 2024 to this term.",
};

const yogaDay = Array.from({ length: 17 }, (_, i) => `/events/yoga-day-${String(i + 1).padStart(2, "0")}.jpg`);

export default function EventsPage() {
  // a year with one or two rows shares a section with the year before it
  const groups = [];
  for (const year of [...new Set(sessions.map((s) => s.date.slice(0, 4)))]) {
    const rows = sessions.filter((s) => s.date.startsWith(year));
    const last = groups[groups.length - 1];
    if (last && rows.length < 3) {
      last.label = `${last.label} and ${year}`;
      last.rows.push(...rows);
    } else {
      groups.push({ label: year, rows });
    }
  }
  const shown = sessions.filter((s) => s.photo && s.date !== "2026-06-21").slice(0, 3);

  return (
    <>
      <section className="band page-top">
        <div className="wrap stack">
          <h1 className="head head--wide">Every session since 2024.</h1>
          <p className="lead">
            Sittings, workshops and outings, newest first. The next one:{" "}
            <span className="fill" data-fill="next-session">
              date and room to be announced
            </span>
            , in the WhatsApp circle first.
          </p>
        </div>
      </section>

      <section className="band field-sun cut-a" aria-labelledby="yd-h">
        <div className="wrap stack">
          <h2 id="yd-h" className="head head--wide">
            Yoga Day, 21 June 2026.
          </h2>
          <p className="lead">
            A 6:30 AM session at the Lake View Hostel mess with Anandam Foundation. The Director, faculty, staff and
            students shared the floor.
          </p>
        </div>
        <ul className="rail" tabIndex={0} aria-label="Photographs from International Yoga Day 2026">
          {yogaDay.map((src, i) => (
            <li key={src}>
              <Image
                src={src}
                alt={`International Yoga Day 2026 at IIM Calcutta, photograph ${i + 1} of 17`}
                width={800}
                height={533}
                sizes="(min-width: 60rem) 34vw, 80vw"
              />
            </li>
          ))}
        </ul>
      </section>

      {groups.map((group, n) => (
        <section className="band" key={group.label} aria-labelledby={`y-${group.label.slice(0, 4)}`}>
          {n === 0 && (
            <div className="critter-edge critter-edge--right">
              <Critter name="dog" />
            </div>
          )}
          <div className="wrap split">
            <h2 id={`y-${group.label.slice(0, 4)}`} className="head split__a">
              {group.label}
            </h2>
            <ul className="rows split__b">
              {group.rows.map((s) => (
                <li key={s.date + s.title}>
                  <time className="rows__name" dateTime={s.date}>
                    {formatSessionDate(s)}
                  </time>
                  <div className="stack-s">
                    <p>
                      <b>{s.title}.</b> {s.note}
                    </p>
                    <p className="note">
                      {s.place}
                      {s.with ? `, with ${s.with}` : ""}.
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </section>
      ))}

      <section className="band field-pond cut-b" aria-labelledby="seen-h">
        <div className="wrap stack">
          <h2 id="seen-h" className="head head--wide">
            Three evenings this September.
          </h2>
          <ul className="grid-3">
            {shown.map((s) => (
              <li key={s.date}>
                <figure className="photo photo--land">
                  <div className="photo__frame">
                    <Image src={s.photo.src} alt={s.photo.alt} width={s.photo.w} height={s.photo.h} sizes="(min-width: 60rem) 30vw, 92vw" />
                  </div>
                  <figcaption>
                    {s.title}, {formatSessionDate(s)}.
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
