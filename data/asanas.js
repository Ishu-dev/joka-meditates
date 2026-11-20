// The 14-pose sequence from the club's Yoga Day session, in order. Names and
// cues are the ones the club wrote for the first guide.
//
// `id` is stable. The stage keys its picture on it today, a hold is logged as
// "asana-<id>", and a 3D figure can key its pose on the same id later.
//
// The drawings are in /public/graphics/yoga-poses/ink/<id>.png. They were
// made from the original yoga-pose-NN.png files (named in `from`) by trimming
// the white margin and turning the white tile transparent, so the ink sits on
// any field. w and h are the pixel size of each trimmed drawing.

export const asanas = [
  { id: "pranamasana", name: "Pranamasana", en: "Prayer Pose", note: "Stand tall, palms together. Arrive, set an intention.", w: 241, h: 669, from: "yoga-pose-02.png" },
  { id: "hasta-uttanasana", name: "Hasta Uttanasana", en: "Raised Arms Pose", note: "Arch back gently from the waist. Opens the chest and lungs.", w: 484, h: 657, from: "yoga-pose-01.png" },
  { id: "padahastasana", name: "Padahastasana", en: "Hand-to-Foot Pose", note: "Fold forward, spine long. Stretches hamstrings, calms the mind.", w: 322, h: 474, from: "yoga-pose-03.png" },
  { id: "bhujangasana", name: "Bhujangasana", en: "Cobra Pose", note: "Chest up, elbows soft. Strengthens the back, lifts energy.", w: 735, h: 495, from: "yoga-pose-06.png" },
  { id: "vajrasana", name: "Vajrasana", en: "Thunderbolt Pose", note: "Kneel, sit on heels. Aids digestion, steadies the breath.", w: 483, h: 714, from: "yoga-pose-08.png" },
  { id: "malasana", name: "Malasana", en: "Garland Pose", note: "Deep squat, palms at heart. Opens hips, grounds the body.", w: 576, h: 760, from: "yoga-pose-13.png" },
  { id: "konasana", name: "Konasana", en: "Side Angle Bend", note: "Wide stance, reach over. Stretches the side waist and spine.", w: 603, h: 687, from: "yoga-pose-11.png" },
  { id: "setu-bandhasana", name: "Setu Bandhasana", en: "Bridge Pose", note: "Lift the hips, press the feet. Strengthens glutes and lower back.", w: 727, h: 335, from: "yoga-pose-09.png" },
  { id: "sarvangasana", name: "Sarvangasana", en: "Shoulder Stand", note: "Legs vertical, supported. Restores circulation, calms the nervous system.", w: 356, h: 790, from: "yoga-pose-04.png" },
  { id: "halasana", name: "Halasana", en: "Plow Pose", note: "Toes to the floor behind. Releases the spine and shoulders.", w: 761, h: 384, from: "yoga-pose-12.png" },
  { id: "matsyasana", name: "Matsyasana", en: "Fish Pose", note: "Arch the chest, crown resting down. Counter-pose to the plow.", w: 819, h: 327, from: "yoga-pose-10.png" },
  { id: "anuvittasana", name: "Anuvittasana", en: "Standing Backbend", note: "Hands to lower back, lean back. Unlocks a desk-bound spine.", w: 499, h: 753, from: "yoga-pose-14.png" },
  // The club's own warning: this one is learned with a teacher. The guided
  // flow never starts it by itself.
  { id: "sirsasana", name: "Sirsasana", en: "Headstand", note: "The king of poses. Learn only with a teacher watching.", w: 209, h: 802, from: "yoga-pose-07.png", withTeacher: true },
  { id: "sukhasana", name: "Sukhasana", en: "Easy Pose", note: "Sit cross-legged, hands on knees. Close every practice here.", w: 465, h: 474, from: "yoga-pose-05.png" },
];

export const artOf = (id) => `/graphics/yoga-poses/ink/${id}.png`;

// "Hold each pose for five easy breaths."
export const HOLD = {
  breaths: 5,
  phases: [
    { word: "Breathe in", seconds: 4, swell: 1, tone: 396 },
    { word: "Breathe out", seconds: 4, swell: 0, tone: 264 },
  ],
};
