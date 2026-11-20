// Every practice the site can guide. A breath is a list of phases; `swell`
// is how full the lungs are at the end of the phase (0 empty, 1 full) and
// drives the sun, the pad and Chanchal's heart. Tones are soft sine waves.

export const practices = [
  {
    id: "box",
    name: "Box breathing",
    pattern: "In 4, hold 4, out 4, hold 4",
    length: "2 minutes",
    use: "Before a quiz, an interview or a hard conversation.",
    rounds: 8,
    phases: [
      { word: "Breathe in", seconds: 4, swell: 1, tone: 396 },
      { word: "Hold", seconds: 4, swell: 1, tone: 0 },
      { word: "Breathe out", seconds: 4, swell: 0, tone: 264 },
      { word: "Hold", seconds: 4, swell: 0, tone: 0 },
    ],
  },
  {
    id: "long-exhale",
    name: "4-7-8",
    pattern: "In 4, hold 7, out 8",
    length: "About 3 minutes",
    use: "In bed, when the day will not switch off.",
    rounds: 8,
    phases: [
      { word: "Breathe in", seconds: 4, swell: 1, tone: 396 },
      { word: "Hold", seconds: 7, swell: 1, tone: 0 },
      { word: "Breathe out", seconds: 8, swell: 0, tone: 264 },
    ],
  },
  {
    id: "nadi-shodhana",
    name: "Nadi Shodhana",
    pattern: "In through the left, out through the right, then swap",
    length: "About 4 minutes",
    use: "Between classes, to even things out.",
    rounds: 6,
    phases: [
      { word: "In, left nostril", seconds: 5, swell: 1, tone: 396 },
      { word: "Out, right nostril", seconds: 5, swell: 0, tone: 264 },
      { word: "In, right nostril", seconds: 5, swell: 1, tone: 396 },
      { word: "Out, left nostril", seconds: 5, swell: 0, tone: 264 },
    ],
  },
  {
    id: "bhramari",
    name: "Bhramari",
    pattern: "Breathe in, then hum all the way out",
    length: "About 3 minutes",
    use: "When the head is loud. The hum gives it one sound to follow.",
    rounds: 12,
    phases: [
      { word: "Breathe in", seconds: 4, swell: 1, tone: 396 },
      { word: "Hum out", seconds: 10, swell: 0, tone: 198 },
    ],
  },
  {
    id: "even",
    name: "Even breath",
    pattern: "In 5, out 5",
    length: "5 minutes",
    use: "A steady base for a longer sit.",
    rounds: 30,
    phases: [
      { word: "Breathe in", seconds: 5, swell: 1, tone: 396 },
      { word: "Breathe out", seconds: 5, swell: 0, tone: 264 },
    ],
  },
];

const sit = (minutes) => ({
  id: `sit-${minutes}`,
  name: `Sit for ${minutes} minutes`,
  pattern: "A bell to start and a bell to end",
  length: `${minutes} minutes`,
  use: "Eyes closed, attention resting on the heart or on the breath.",
  rounds: 1,
  phases: [{ word: "Sit", seconds: minutes * 60, swell: 0.5, tone: 528 }],
});

export const sits = [sit(5), sit(10), sit(20)];

export const allPractices = [...practices, ...sits];

export function practiceById(id) {
  return allPractices.find((p) => p.id === id) || practices[0];
}

export function practiceSeconds(practice) {
  return practice.rounds * practice.phases.reduce((sum, p) => sum + p.seconds, 0);
}
