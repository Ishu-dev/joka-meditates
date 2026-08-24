import { Cormorant_Garamond, IBM_Plex_Sans } from "next/font/google";
import NavBar from "@/components/NavBar";
import Footer from "@/components/Footer";
import "./globals.css";

const display = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  style: ["normal", "italic"],
  variable: "--font-display",
  display: "swap",
});

const body = IBM_Plex_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-body",
  display: "swap",
});

export const metadata = {
  title: {
    default: "Joka Meditates",
    template: "%s · Joka Meditates",
  },
  description:
    "Joka Meditates is the student-run Heartfulness meditation Student Interest Group of IIM Calcutta. Practice guides, sessions, and the twice-weekly issue.",
};

export const viewport = {
  width: "device-width",
  initialScale: 1.0,
};

const themeInit = `(function(){try{var t=localStorage.getItem('jm-theme');if(t){document.documentElement.dataset.theme=t;}}catch(e){}})();`;

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${display.variable} ${body.variable} antialiased`}>
        <script dangerouslySetInnerHTML={{ __html: themeInit }} />
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-50 focus:bg-paper focus:px-3 focus:py-2 focus:rounded-card"
        >
          Skip to content
        </a>
        <NavBar />
        <main id="main" className="min-h-[70vh]">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
