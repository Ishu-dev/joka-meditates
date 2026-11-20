import Link from "next/link";

export const metadata = { title: "About" };

export default function AboutPage() {
  return (
    <>
      <section className="band page-top">
        <div className="wrap split">
          <div className="about__text stack">
            <h1 className="head head--wide">About Joka Meditates.</h1>
            <p className="lead">
              Joka Meditates is the student-run meditation Student Interest Group of IIM Calcutta, started in 2024.
              We sit together on campus with Heartfulness trainers and guests, run guided practices on this site, and
              send a newsletter: one practice, one verse, one experiment in stillness.
            </p>
            <p className="lead">
              The figure wandering these pages is Chanchal. In the Gita, Arjuna calls the mind chanchal, restless and
              as hard to hold as the wind (6.34). Krishna agrees, and says it can be held with practice and letting go (6.35). The
              whole site is built on that exchange: breathe for two minutes and he sits.
            </p>
            <div className="actions">
              <Link className="btn btn--quiet" href="/team">
                Meet the team
              </Link>
              <Link className="go" href="/issues">
                Read the issues
              </Link>
            </div>
          </div>
          <img
            className="lockup about__logo"
            src="/brand/logo-ink.svg"
            alt="Joka Meditates"
            width="320"
            height="314"
          />
        </div>
      </section>
    </>
  );
}
