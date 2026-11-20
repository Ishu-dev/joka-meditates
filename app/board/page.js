import Link from "next/link";
import { getIssues } from "@/lib/issues";
import { today } from "@/lib/today";
import { boardItems, formatBoardDate } from "@/data/board";
import Critter from "@/components/Critter";

export const metadata = {
  title: "Board",
  description: "News from the club and its partners, every newsletter issue, things worth watching and what people here are thinking.",
};

export const revalidate = 1800;

const out = { target: "_blank", rel: "noopener noreferrer" };

function issueDate(iso) {
  if (!iso) return "";
  return new Date(iso).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric", timeZone: "Asia/Kolkata" });
}

export default async function BoardPage() {
  const issues = await getIssues();
  const t = today();
  const news = boardItems.filter((item) => item.kind === "news" || item.kind === "notice");
  const videos = boardItems.filter((item) => item.kind === "video");

  return (
    <>
      <section className="band page-top">
        <div className="wrap stack">
          <h1 className="head head--wide">The board.</h1>
          <p className="lead">
            What is on, what we have written, what is worth twenty minutes of your evening, and what people here are
            thinking.
          </p>
        </div>
      </section>

      <section className="band field-sun cut-b" aria-labelledby="news-h">
        <div className="critter-edge critter-edge--right critter-edge--low">
          <Critter name="nest" />
        </div>
        <div className="wrap split">
          <h2 id="news-h" className="head split__a">
            On now and coming up.
          </h2>
          <ul className="rows split__b">
            {news.map((item) => (
              <li key={item.title}>
                <time className="rows__name" dateTime={item.date}>
                  {formatBoardDate(item)}
                </time>
                <div className="stack-s">
                  <p>
                    <b>{item.title}.</b> {item.body}
                  </p>
                  <p className="note">
                    From {item.from}.
                    {item.link && (
                      <>
                        {" "}
                        <a href={item.link.href} {...out}>
                          {item.link.label}
                        </a>
                      </>
                    )}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="band" aria-labelledby="issues-h">
        <div className="wrap split">
          <div className="split__a stack">
            <h2 id="issues-h" className="head">
              The newsletter, issue by issue.
            </h2>
            <p className="lead">One practice, one verse and one small experiment in stillness each time.</p>
            <Link className="go" href="/issues">
              The full archive
            </Link>
          </div>
          <ul className="index split__b">
            {issues.map((issue) => (
              <li key={issue.slug}>
                <Link href={`/issues/${issue.slug}`}>
                  <span className="index__name">{issue.title}</span>
                  <span className="note">
                    Issue {issue.number}
                    {issue.published_at ? `, ${issueDate(issue.published_at)}` : ""}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="band field-pond cut-a" aria-labelledby="watch-h">
        <div className="wrap split">
          <h2 id="watch-h" className="head split__a">
            Worth twenty minutes.
          </h2>
          <ul className="rows rows--links split__b">
            {videos.map((item) => (
              <li key={item.title}>
                <a href={item.link.href} {...out}>
                  <span className="rows__name">{item.title}</span>
                  <span>
                    {item.body} Sent by {item.from}.
                  </span>
                </a>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="band" aria-labelledby="thoughts-h">
        <div className="wrap split">
          <div className="split__a stack">
            <h2 id="thoughts-h" className="head">
              What people here are thinking.
            </h2>
            <p className="lead">
              This wall is empty for now. It opens with sign-in: post under your name or anonymously, and someone
              from the team reads each note before it goes up.
            </p>
            <a className="go" href="https://chat.whatsapp.com/GlJ7rURYrjT88BT8h5IwYR" {...out}>
              Until then, tell us on WhatsApp
            </a>
          </div>
          <figure className="split__b stack-s">
            <blockquote>
              <p className="statement">{t.thought.text}</p>
            </blockquote>
            <figcaption className="note">
              Today&rsquo;s thought from the club{t.thought.issue ? `, from issue ${t.thought.issue}` : ""}.
            </figcaption>
          </figure>
        </div>
      </section>
    </>
  );
}
