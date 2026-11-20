import Link from "next/link";
import ChanchalToggle from "./ChanchalToggle";

const links = [
  { href: "/practice", label: "Practice" },
  { href: "/board", label: "Board" },
  { href: "/events", label: "Sessions" },
  { href: "/campus", label: "Campus" },
  { href: "/support", label: "Support" },
];

export default function NavBar() {
  return (
    <header className="site-nav">
      <nav aria-label="Main" className="wrap site-nav__bar">
        <Link href="/" className="brand" aria-label="Joka Meditates home">
          <img src="/brand/lotus.svg" alt="" width="44" height="28" />
          <span>Joka Meditates</span>
        </Link>
        <ul className="site-nav__links">
          {links.map(({ href, label }) => (
            <li key={href}>
              <Link href={href}>{label}</Link>
            </li>
          ))}
          <li>
            <ChanchalToggle className="site-nav__chanchal" />
          </li>
          <li>
            <Link href="/join" className="btn btn--quiet btn--small">
              Join
            </Link>
          </li>
        </ul>
        <details className="menu">
          <summary>Menu</summary>
          <ul>
            {links.map(({ href, label }) => (
              <li key={href}>
                <Link href={href}>{label}</Link>
              </li>
            ))}
            <li>
              <Link href="/issues">Issues</Link>
            </li>
            <li>
              <Link href="/team">Team</Link>
            </li>
            <li>
              <Link href="/join">Join</Link>
            </li>
            <li>
              <ChanchalToggle className="btn btn--quiet btn--small" />
            </li>
          </ul>
        </details>
      </nav>
    </header>
  );
}
