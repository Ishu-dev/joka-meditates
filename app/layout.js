import { Anek_Latin, Anek_Devanagari } from "next/font/google";
import NavBar from "@/components/NavBar";
import Footer from "@/components/Footer";
import ChanchalGate from "@/components/ChanchalGate";
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
