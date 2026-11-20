// The seven centres, from the base of the spine to the crown. The words are
// the club's own, from the first guide. `at` places each centre on the seated
// figure: a share of the way up the spine (0 is the hip, 1 the base of the
// head), or a spot on the head.
//
// The symbols are in /public/graphics/chakras/line/<id>.png. They were made
// from the original NN_name.png files by keeping the drawn line and dropping
// the wash and the white tile. They are used as masks, so each one takes its
// colour from its token in app/tokens.css.

export const chakras = [
  {
    id: "muladhara",
    name: "Muladhara",
    en: "Root",
    colour: "Red",
    token: "--color-chakra-1",
    at: { spine: 0 },
    where: "Base of the spine",
    governs: "Grounding, safety, stability",
    element: "Earth",
    seed: "LAM",
    note: "Grounding. Sit tall, feel the seat, let the weight drop.",
    detail:
      "The root is where the practice starts: contact with the floor, weight settling, the simple fact of being supported. When it is balanced you feel steady rather than scattered. In practice, spend a minute feeling the sit bones press down and the spine grow out of that foundation. Imbalance often shows as anxiety about basics: money, housing, safety.",
  },
  {
    id: "svadhisthana",
    name: "Svadhisthana",
    en: "Sacral",
    colour: "Orange",
    token: "--color-chakra-2",
    at: { spine: 0.2 },
    where: "Lower abdomen, below the navel",
    governs: "Creativity, pleasure, flow",
    element: "Water",
    seed: "VAM",
    note: "Ease. Soften the belly, let breath move low and slow.",
    detail:
      "The centre of feeling and creative energy. Breath moving low into the belly here softens the constant bracing that studying and screen time build. Let the breath be unhurried, the belly round on every inhale. Imbalance can show as emotional flatness or, on the other end, being overwhelmed by feeling.",
  },
  {
    id: "manipura",
    name: "Manipura",
    en: "Solar Plexus",
    colour: "Yellow",
    token: "--color-chakra-3",
    at: { spine: 0.42 },
    where: "Navel centre",
    governs: "Confidence, will, digestion",
    element: "Fire",
    seed: "RAM",
    note: "Energy. Draw the breath in at the navel, hold gently.",
    detail:
      "Your fire centre: digestion, drive, the ability to commit and follow through. A gentle breath-hold at the navel after the inhale builds quiet heat and focus without tension. This is the centre that gets depleted by deadline panic and restored by purposeful effort. If your will feels unreliable, work here.",
  },
  {
    id: "anahata",
    name: "Anahata",
    en: "Heart",
    colour: "Green",
    token: "--color-chakra-4",
    at: { spine: 0.7 },
    where: "Centre of the chest",
    governs: "Love, compassion, connection",
    element: "Air",
    seed: "YAM",
    note: "Openness. Broaden the chest, offer the breath out.",
    detail:
      "The bridge between the lower three centres (body) and the upper three (mind). Broaden the chest on the inhale, offer the breath generously on the exhale. The Heartfulness tradition this club follows centres here: rest attention in the heart and let it be simple. Imbalance shows as guardedness, resentment, or losing yourself in other people's needs.",
  },
  {
    id: "vishuddha",
    name: "Vishuddha",
    en: "Throat",
    colour: "Blue",
    token: "--color-chakra-5",
    at: { spine: 1 },
    where: "Throat",
    governs: "Expression, truth, listening",
    element: "Space",
    seed: "HAM",
    note: "Expression. Hum softly on the exhale, feel the vibration.",
    detail:
      "The gate between what you feel and what you say. A soft hum on the exhale (the seed sound made audible) clears and settles this centre. Useful before speaking in class, in conflict, or in any conversation where you usually swallow your words. Imbalance shows as over-talking, or as things left unsaid that turn into weight.",
  },
  {
    id: "ajna",
    name: "Ajna",
    en: "Third Eye",
    colour: "Indigo",
    token: "--color-chakra-6",
    at: { head: "brow" },
    where: "Between the eyebrows",
    governs: "Insight, intuition, focus",
    element: "Light",
    seed: "OM",
    note: "Attention. Rest the gaze inward, between the brows.",
    detail:
      "The centre of seeing clearly without looking. Rest attention lightly at the point between the brows; not staring, not straining, just resting. This is where concentration practice lives, and where the constant comment stream of the mind gets quiet enough to hear yourself think. Imbalance shows as fog, indecision, or a mind that argues with everything.",
  },
  {
    id: "sahasrara",
    name: "Sahasrara",
    en: "Crown",
    colour: "Violet or white",
    token: "--color-chakra-7",
    at: { head: "crown" },
    where: "Top of the head",
    governs: "Absorption, stillness, connection to something larger",
    element: "Thought",
    seed: "Silence",
    note: "Stillness. Stop doing. Sit with what remains.",
    detail:
      "The centreless centre: not an effort but a stopping. After moving attention up through the other six, simply sit with whatever remains. Nothing to visualize, nothing to fix. In the Heartfulness method this is where meditation naturally settles: absorbed, quiet, undecorated. If the practice ends here, it has gone well.",
  },
];

export const glyphOf = (id) => `/graphics/chakras/line/${id}.png`;
