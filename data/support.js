// Help on campus. Timings are from the Medical Unit's consultant schedule
// dated 29 September 2026 and the Student Council's Amaha mails of 7 October
// and 3 November 2026. Names and phone numbers of individual consultants were
// circulated to batch lists only, so they are NOT in this file: they belong
// in the signed-in IIMC section once sign-in exists.

export const supportUpdated = "29 September 2026";

export const supportRows = [
  {
    who: "Psychologist",
    when: "Monday and Wednesday, 6 to 8 PM",
    where: "Medical Unit, extension 7251",
  },
  {
    who: "Psychiatrist",
    when: "Thursday, and the 1st and 3rd Tuesday, 2:30 to 5:30 PM",
    where: "Medical Unit, extension 7251",
  },
  {
    who: "Amaha counsellor on campus",
    when: "First working Friday of the month, 10:30 AM to 6:30 PM",
    where: "Slots open by mail from the Hostel Affairs Secretary a few days before",
  },
  {
    who: "Amaha online",
    when: "Any day, booked in the Amaha app",
    where: "Sign in once with your IIMC email",
    link: { href: "https://iimc.integrations.amahahealth.com/auth/log-in/", label: "Open the IIMC Amaha page" },
  },
];

export const helpline = {
  name: "Tele MANAS",
  number: "14416",
  note: "The Government of India's mental health line. Free, open 24 hours, in many Indian languages.",
};

export const supportContacts = [
  { label: "Hostel Affairs Secretary, for Amaha slots", href: "mailto:hasecy@email.iimcal.ac.in", text: "hasecy@email.iimcal.ac.in" },
];
