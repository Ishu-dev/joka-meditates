import Link from "next/link";
import Image from "next/image";
import ThemeToggle from "./ThemeToggle";
import SoundToggle from "./SoundToggle";

const links = [
  { href: "/issues", label: "Issues" },
  { href: "/practice", label: "Practice" },
  { href: "/events", label: "Events" },
  { href: "/team", label: "Team" },
  { href: "/join", label: "Join" },
];

export default function NavBar() {
  return (
    <header className="border-b border-rule bg-paper/90 backdrop-blur sticky top-0 z-40">
      <nav
        aria-label="Main"
        className="mx-auto flex max-w-3xl items-center gap-4 px-4 py-3"
      >
        <Link href="/" className="shrink-0" aria-label="Joka Meditates home">
          <Image
            src="/brand/logo-black-text.png"
            alt=""
            aria-hidden="true"
            width={44}
            height={44}
            priority
            className="logo-for-light rounded-card"
          />
          <Image
            src="/brand/logo-white-text.png"
            alt=""
            aria-hidden="true"
            width={44}
            height={44}
            priority
            className="logo-for-dark rounded-card"
          />
          <span className="sr-only">Joka Meditates</span>
        </Link>
        <ul className="flex flex-1 flex-wrap items-center gap-x-4 gap-y-1 text-sm">
          {links.map(({ href, label }) => (
            <li key={href}>
              <Link
                href={href}
                className="text-ink-soft hover:text-accent transition-colors"
              >
                {label}
              </Link>
            </li>
          ))}
        </ul>
        <div className="flex items-center gap-1">
          <SoundToggle />
          <ThemeToggle />
        </div>
      </nav>
    </header>
  );
}
