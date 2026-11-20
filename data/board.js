// The board: what is new. Newsletter issues are added to this list by the
// board page from lib/issues.js; everything else is entered here by hand
// until the organiser dashboard can post it.
//
// kind: "news" (something happening), "notice" (from the club),
//       "video" (a link worth watching). `from` says who told us.

export const boardItems = [
  {
    kind: "news",
    date: "2026-12-05",
    title: "Daaji is in Kolkata on 5 December",
    body: "The Heartfulness guide visits the Kolkata centre, and students are welcome. Ask in the WhatsApp circle if you want to go together.",
    from: "Vidya Subramaniam, Heartfulness",
  },
  {
    kind: "news",
    date: "2026-11-17",
    until: "2026-11-20",
    title: "YES!+ certification is on campus this week",
    body: "The Art of Living runs its YES!+ programme at IIM Calcutta from 17 to 20 November: stress management, emotional intelligence and leadership.",
    from: "The Art of Living",
  },
  {
    kind: "news",
    date: "2026-11-04",
    title: "Vayo SAATHI: spend time with a senior citizen",
    body: "A volunteer programme from the Ministry of Social Justice and Empowerment for anyone over 18. Volunteers keep an elder company and help with phones and welfare schemes, and get a certificate.",
    link: { href: "https://seniorcitizen.dosje.gov.in/vayo-sathi", label: "Register as a volunteer" },
    from: "Suparna Sinha, Heartfulness",
  },
  {
    kind: "video",
    title: "Heartfulness masterclass, three sessions",
    body: "Relaxation, rejuvenation and connection. Do them on three consecutive days.",
    link: { href: "https://heartfulness.org/in-en/masterclass/", label: "Watch on heartfulness.org" },
    from: "Minal Shanghavi, Heartfulness",
  },
  {
    kind: "video",
    title: "Reset your nervous system in 20 minutes",
    body: "Twenty minutes of guided breathwork by Shivarasa.",
    link: { href: "https://www.youtube.com/watch?v=v15B2FxaIvY", label: "Watch on YouTube" },
    from: "Joka Meditates",
  },
  {
    kind: "video",
    title: "Deep conscious breathwork for beginners",
    body: "Six rounds in 20 minutes, guided by Nastasia Marquez.",
    link: { href: "https://www.youtube.com/watch?v=zFeTfG1vfGE", label: "Watch on YouTube" },
    from: "Joka Meditates",
  },
  {
    kind: "video",
    title: "Heartfulness cleaning, in English",
    body: "The Heartfulness evening practice for letting go of the day.",
    link: { href: "https://youtu.be/Pa-cngOay5w", label: "Watch on YouTube" },
    from: "Vidya Subramaniam, Heartfulness",
  },
];

export const kinds = {
  issue: "Issue",
  news: "News",
  notice: "From the club",
  video: "Watch",
  thought: "Thought",
};

export function formatBoardDate(item) {
  const fmt = (iso, opts) =>
    new Intl.DateTimeFormat("en-GB", { timeZone: "UTC", ...opts }).format(new Date(`${iso.slice(0, 10)}T00:00:00Z`));
  if (!item.date) return "";
  if (item.until) {
    return `${fmt(item.date, { day: "numeric" })} to ${fmt(item.until, { day: "numeric", month: "short" })}`;
  }
  return fmt(item.date, { day: "numeric", month: "short", year: "numeric" });
}
