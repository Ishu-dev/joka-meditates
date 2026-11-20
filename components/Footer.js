import Link from "next/link";
import SiteSwitches from "./SiteSwitches";

export default function Footer() {
  return (
    <footer className="site-footer cut-c">
      <div className="wrap site-footer__grid">
        <p className="site-footer__motto">
          Joka has the trees. We have the stillness.
        </p>
        <div className="site-footer__lists">
          <ul aria-label="The club">
            <li>
              <Link href="/about">About</Link>
            </li>
            <li>
              <Link href="/team">Team</Link>
            </li>
            <li>
              <Link href="/issues">Read the issues</Link>
            </li>
            <li>
              <Link href="/beyond">Beyond campus</Link>
            </li>
          </ul>
          <ul aria-label="Elsewhere">
            <li>
              <a
                href="https://www.instagram.com/joka_meditates/"
                target="_blank"
                rel="noopener noreferrer"
              >
                Instagram
              </a>
            </li>
            <li>
              <a
                href="https://chat.whatsapp.com/GlJ7rURYrjT88BT8h5IwYR"
                target="_blank"
                rel="noopener noreferrer"
              >
                WhatsApp circle
              </a>
            </li>
            <li>
              <a href="mailto:joka-meditates@email.iimcal.ac.in">Email the team</a>
            </li>
          </ul>
        </div>
        <div className="site-footer__foot">
          <img
            src="/brand/logo-ink.svg"
            alt="Joka Meditates"
            width="132"
            height="130"
            loading="lazy"
          />
          <p className="note" data-credits>
            A student interest group of IIM Calcutta, sitting since 2024. Write to
            joka-meditates@email.iimcal.ac.in. Photographs by Joka Meditates.
          </p>
          <SiteSwitches />
        </div>
      </div>
    </footer>
  );
}
