// Every sitting the club has a record of, newest first. Dates, rooms and
// guests come from the club's own Instagram posts and posters. `photo` is a
// file in /public/photos. Nothing here is estimated: if a detail was not on
// the poster, it is left out.

export const sessions = [
  {
    date: "2026-09-19",
    title: "An evening with Minal Shanghavi",
    place: "NAB N22",
    with: "CEMS Club Calcutta",
    note: "Ashtanga Yoga and where meditation sits in it, then a 25-minute Heartfulness meditation and his own story of keeping the practice through corporate life.",
    photo: { src: "/photos/minal-shanghavi-2026-n22.jpg", w: 2400, h: 1800, alt: "A full classroom in NAB N22 listening to Minal Shanghavi, slides on two screens behind him" },
  },
  {
    date: "2026-09-12",
    title: "An evening of breathing and meditation",
    place: "IIM Calcutta",
    with: "Heartfulness trainers",
    note: "Forty minutes with eyes closed. Our post that evening began: “Normally we have so much to do. Today, doing nothing felt like everything.”",
    photo: { src: "/photos/sept-2026-evening-group.jpg", w: 2400, h: 1800, alt: "Students and two Heartfulness trainers standing together at the front of a classroom after the session" },
  },
  {
    date: "2026-09-05",
    title: "Chair yoga and meditation",
    place: "NAB N22",
    with: "Vidya Subramaniam, Heartfulness",
    note: "Yoga you can do in a classroom chair, then a guided sitting.",
    photo: { src: "/photos/chair-yoga-2026-group.jpg", w: 2400, h: 1800, alt: "Students standing with instructor Vidya Subramaniam in front of the classroom screens" },
  },
  {
    date: "2026-07-03",
    title: "An evening with Jesal Mehta",
    place: "NAB N21",
    with: "Heartfulness",
    note: "Heartfulness, mindfulness and the corporate world. He joined by video for a meditation and questions.",
  },
  {
    date: "2026-06-21",
    title: "International Yoga Day",
    place: "Lake View Hostel mess, first floor",
    with: "Anandam Foundation",
    note: "A 6:30 AM session for the campus: the Director, faculty, staff and students on the mat together.",
    photo: { src: "/photos/yoga-day-2026-hall.jpg", w: 2400, h: 1600, alt: "A hall full of people in white IIM Calcutta T-shirts sitting cross-legged on yoga mats" },
  },
  {
    date: "2026-02-15",
    title: "Maha Shivratri sitting",
    place: "Open Air Theatre, Lake View Hostel",
    note: "An evening meditation, 6 PM.",
  },
  {
    date: "2026-01-09",
    until: "2026-01-11",
    title: "YES!+ workshop",
    place: "IIM Calcutta",
    with: "The Art of Living",
    note: "Three evenings of breathwork, including Sudarshan Kriya.",
  },
  {
    date: "2025-12-27",
    until: "2025-12-28",
    title: "Heartfulness youth retreat",
    place: "Heartfulness centre, Kolkata",
    with: "Heartfulness",
    note: "Two days off campus: a bonfire, a treasure hunt, morning yoga on the lawn.",
  },
  {
    date: "2025-11-09",
    title: "Sunday visit to the Heartfulness centre",
    place: "Heartfulness centre, Kolkata",
    with: "Heartfulness",
    note: "Left campus at 7:30 AM for a morning of meditation.",
  },
  {
    date: "2025-09-18",
    title: "Sthira Sukham",
    place: "Lake View Hostel mess, first floor",
    note: "Yoga, pranayama and meditation with a certified trainer, 6 to 7:30 PM.",
  },
  {
    date: "2025-08-09",
    title: "Saturday yoga",
    place: "Lake View Hostel mess, first floor",
    note: "The first yoga session of the term, 8 to 9 AM.",
  },
  {
    date: "2025-06-14",
    until: "2025-06-16",
    title: "Learn to Meditate, a 3-day workshop",
    place: "NAB L-51",
    with: "Heartfulness",
    note: "An hour each evening with certified trainers, 4:30 to 5:30 PM.",
    photo: { src: "/photos/workshop-2025-sitting.jpg", w: 1440, h: 1440, alt: "Students sitting with eyes closed at their desks during the 2025 meditation workshop" },
  },
  {
    date: "2024-12-21",
    title: "World Meditation Day",
    place: "TATA Hall",
    note: "An hour of meditation and mindfulness, 4:30 to 5:30 PM, then high tea.",
  },
];

export function formatSessionDate(session) {
  const opts = { day: "numeric", month: "long", year: "numeric", timeZone: "UTC" };
  const start = new Date(`${session.date}T00:00:00Z`);
  if (!session.until) return new Intl.DateTimeFormat("en-GB", opts).format(start);
  const end = new Date(`${session.until}T00:00:00Z`);
  const month = new Intl.DateTimeFormat("en-GB", { month: "long", year: "numeric", timeZone: "UTC" }).format(end);
  return `${start.getUTCDate()} to ${end.getUTCDate()} ${month}`;
}
