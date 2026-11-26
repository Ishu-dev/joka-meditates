// Polls the club sends out by mail. Each one has a page at /poll/<id> where
// people answer, and a picture at /api/poll/<id>/image that the mail shows, so
// the counts and names are visible inside the mail itself and stay current
// each time it is opened.
//
// An option in "sessions" is something to attend; one in "extras" is a yes/no
// that helps with planning. People can pick as many as they like.

export const polls = {
  "daaji-kolkata": {
    title: "Daaji in Kolkata, 5 to 7 December",
    short: "Daaji in Kolkata",
    intro:
      "Daaji, the guide of Heartfulness, is in Kolkata from Saturday 5 to Monday 7 December. Pick everything you might come to. Your name shows next to what you pick; your email does not.",
    closes: "2026-12-07T20:00:00+05:30",
    places: {
      centre: "Heartfulness Meditation Centre, 993 Madurdaha, Chowbaga Road, next to Heritage School, Kolkata 700107",
      auditorium: "Dhono Dhanyo Auditorium, Alipore",
    },
    sessions: [
      { id: "sat-eve", label: "Sat 5 Dec, 6:00 PM", where: "Meditation at the centre, Madurdaha" },
      { id: "sun-aud", label: "Sun 6 Dec, 10:00 AM", where: "Kolkata Meditates with Daaji, Dhono Dhanyo Auditorium, Alipore (be seated by 9:45)" },
      { id: "sun-eve", label: "Sun 6 Dec, 6:00 PM", where: "Meditation at the centre, Madurdaha" },
      { id: "mon-am", label: "Mon 7 Dec, 9:00 AM", where: "Meditation at the centre, Madurdaha" },
      { id: "mon-eve", label: "Mon 7 Dec, 6:00 PM", where: "Meditation at the centre, Madurdaha" },
    ],
    extras: [
      { id: "cab", label: "I need a seat in a shared cab from campus", where: "So we know how many cabs to book" },
      { id: "sitting", label: "I would like a sitting before the weekend", where: "A Heartfulness trainer can take it online; we will fix a time" },
      { id: "stay", label: "I would stay at the ashram for the weekend", where: "If enough of us want to, we will ask the centre" },
      { id: "vayo", label: "I have registered as a Vayo SAATHI", where: "Heartfulness asked us for the count" },
    ],
  },
};

export function getPoll(id) {
  return Object.prototype.hasOwnProperty.call(polls, id) ? polls[id] : null;
}

export function pollOptions(poll) {
  return [...poll.sessions, ...poll.extras];
}
