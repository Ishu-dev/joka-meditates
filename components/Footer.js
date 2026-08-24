import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t border-rule mt-16">
      <div className="mx-auto max-w-3xl px-4 py-8 text-sm text-ink-soft">
        <p className="font-display text-lg text-ink">Joka Meditates</p>
        <p className="mt-1">
          Heartfulness meditation Student Interest Group, IIM Calcutta
        </p>
        <p className="mt-2">
          <a href="mailto:joka-meditates@email.iimcal.ac.in">
            joka-meditates@email.iimcal.ac.in
          </a>
        </p>
        <p className="mt-1">
          <a
            href="https://www.instagram.com/joka_meditates/"
            target="_blank"
            rel="noopener noreferrer"
          >
            Instagram · @joka_meditates
          </a>
        </p>
        <p className="mt-4 text-xs">
          © {new Date().getFullYear()} Joka Meditates.{" "}
          <Link href="/issues" className="hover:text-accent">
            Read the issues
          </Link>
          .
        </p>
      </div>
    </footer>
  );
}
