import { Anek_Latin, Anek_Devanagari } from "next/font/google";
import NavBar from "@/components/NavBar";
import Footer from "@/components/Footer";
import ChanchalGate from "@/components/ChanchalGate";
import { SITE_URL, INSTAGRAM_URL } from "@/lib/site";
import "./globals.css";

const anek = Anek_Latin({
  subsets: ["latin"],
  axes: ["wdth"],
  variable: "--font-anek",
  display: "swap",
});

const anekDeva = Anek_Devanagari({
  subsets: ["devanagari"],
  variable: "--font-anek-deva",
  display: "swap",
  preload: false,
});

export const metadata = {
  title: {
    default: "Joka Meditates, IIM Calcutta",
    template: "%s, Joka Meditates",
  },
  description:
    "Joka Meditates is the student meditation circle of IIM Calcutta. Two-minute breathing practices, a thought and a Gita verse for the day, sessions on campus and the newsletter.",
  metadataBase: new URL(SITE_URL),
  applicationName: "Joka Meditates",
  openGraph: {
    type: "website",
    siteName: "Joka Meditates",
    locale: "en_IN",
  },
  twitter: { card: "summary_large_image" },
};

// What Google reads about the club: its name, address, logo and Instagram,
// and that it belongs to IIM Calcutta. Shown in search results as the site name.
const orgData = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebSite",
      "@id": `${SITE_URL}/#website`,
      name: "Joka Meditates",
      alternateName: ["Joka Meditates IIM Calcutta", "Joka Meditates IIMC"],
      url: SITE_URL,
    },
    {
      "@type": "Organization",
      "@id": `${SITE_URL}/#club`,
      name: "Joka Meditates",
      alternateName: ["Joka Meditates IIM Calcutta", "Joka Meditates IIMC"],
      description: "The student meditation circle of IIM Calcutta.",
      url: SITE_URL,
      logo: `${SITE_URL}/brand/lotus.svg`,
      sameAs: [INSTAGRAM_URL],
      address: { "@type": "PostalAddress", addressLocality: "Kolkata", addressRegion: "West Bengal", postalCode: "700104", addressCountry: "IN" },
      parentOrganization: { "@type": "CollegeOrUniversity", name: "Indian Institute of Management Calcutta", url: "https://www.iimcal.ac.in" },
    },
  ],
};

export const viewport = {
  width: "device-width",
  initialScale: 1.0,
};

// Runs before paint: marks that scripts work, and restores the visitor's own
// choice to let things move on a device that asks for reduced motion.
const jsFlag = `(function(){var d=document.documentElement;d.classList.add('js');try{var m=localStorage.getItem('jm-motion');if(m==='on')d.classList.add('motion-ok');if(m==='off')d.classList.add('motion-off');}catch(e){}})();`;

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${anek.variable} ${anekDeva.variable}`} suppressHydrationWarning>
      <body>
        <script dangerouslySetInnerHTML={{ __html: jsFlag }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(orgData) }} />
        <a className="skip" href="#main">
          Skip to content
        </a>
        <NavBar />
        <main id="main">{children}</main>
        <Footer />
        <ChanchalGate />
      </body>
    </html>
  );
}
