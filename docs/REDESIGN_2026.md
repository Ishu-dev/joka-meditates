# Joka Meditates site: the 2026 redesign

Started 18 November 2026 on branch `redesign-2026`. The owner (Ishu) retired the newsletter-derived design system and asked for a new design, new sections and a ragdoll character. This file is the working record: what was decided, where things live, and what is still open. `AGENTS.md` points here.

## The idea

Chanchal. In the Gita, Arjuna calls the mind chanchal, restless and as hard to hold as the wind (6.34), and Krishna answers that it can be held with practice and letting go (6.35). The site has a floppy paper figure called Chanchal who cannot sit still. Breathe with the page for two minutes and he sits. The streak counts practice days because abhyasa means showing up again.

Everything else follows from that: the hero is a breathing exercise, the daily verse and thought sit right under it, and the practice room, streak and (later) leaderboard are the reason to come back.

## Look

- Colour: the logo's own blush as paper, its green-black as ink, its lotus pink as the signal, plus a sun yellow and a pond green from the campus. Tokens are in `app/tokens.css`. Nothing else in the code may hold a colour literal.
- Type: Anek Latin (variable weight and width) for everything, Anek Devanagari for verses. Both are from Ek Type, loaded with `next/font`.
- Shape: cut paper. Colour bands with slightly slanted edges, circles that are not quite round, photographs tilted a degree. No gradients, shadows, grain or clip art.
- Motion: Chanchal (a verlet ragdoll on a small canvas), the breathing sun, and one sun-rise on load. Everything else is still.
- The stylesheet is `app/globals.css`. Its first lines are the Hallmark stamp and the record of what was dropped or reworded; keep them when editing.

## Pages

| Route | What it is |
|---|---|
| `/` | Hero with the two-minute breath, today's thought and verse, practice pads, latest issue and news, sessions, support, doors |
| `/practice` | The practice room: five breaths, three timed sits, streak and points. Old guides (`/practice/chakras`, `/yoga-poses`, `/mandala`) are linked from here and still in the old layout |
| `/board` | News, every issue, things to watch, and the (not yet open) wall of thoughts |
| `/events` | Shown as "Sessions": every sitting on record, Yoga Day 2026 photographs |
| `/support` | Tele MANAS, Medical Unit counsellor timings, Amaha in three steps |
| `/campus` | Libraries, the club directory, the IIMC-only prep shelf |
| `/beyond` | Partners, Vayo SAATHI, ConnectFor, nine NGOs in and around Kolkata |
| `/issues`, `/issues/[slug]` | The newsletter archive and reader |
| `/about`, `/team`, `/join` | As before, restyled |
| `/admin` | Organiser dashboard, untouched |

## Where the content lives

All of it is plain data, so the team can edit without touching layout.

| File | Holds |
|---|---|
| `data/thoughts.js` | Thought of the day, one per IST calendar day, 31 in rotation |
| `data/shlokas.js` | 17 Gita verses: Devanagari, transliteration, plain meaning, a prompt |
| `data/board.js` | News and video links for the board |
| `data/sessions.js` | Every sitting, with date, room, guest and photo |
| `data/support.js` | Counsellor timings and the helpline |
| `data/doors.js` | Campus links, partners, volunteering, the IIMC-only shelf list |
| `data/clubs.js` | IIMC clubs on Instagram |
| `data/beyond.js` | NGOs in and around Kolkata |
| `data/seed-issues.json` | The five issues (send dates corrected from the sent mails) |
| `lib/practices.js` | Breath patterns and sits |
| `public/photos/` | Site photographs, exported from the camera originals and the Instagram export |

Sources for each fact are in the comment at the top of each data file. Rule: if a detail was not on a poster, in a mail or in a message, it is not on the site.

## How Chanchal works

- `components/Chanchal.js`: the physics and drawing. He looks for an element with `data-chanchal-perch` (the lily pad in the hero) and lands on it; on pages without one he drifts. An element with `data-chanchal-calm` (the support page) keeps him from fidgeting.
- `components/ChanchalToggle.js`: the control in the nav. "Sit, Chanchal" pauses him. On a device that asks for reduced motion he sits still by default and the control reads "Let Chanchal move".
- `lib/useBreath.js` sends `jm:breath` events while a practice runs. Chanchal's calm rises with the rounds and his heart follows the breath.
- Layering: his canvas is at z-index 1. Colour fields are painted by `.band::before` at z-index -1 and all content sits in `.wrap` at z-index 2, so he passes over the fields and behind the words. Do not put a `transform`, `opacity` below 1 or a `z-index` on `<main>` or on a `.band`, or he ends up trapped behind the page.

## What is kept on the device for now

The streak and points (`lib/streak.js`, localStorage key `jm-practice-log`), the sound switch, Chanchal's sit or wander choice, and the motion opt-in. Nothing is sent anywhere yet.

## Phase 2: accounts (not built)

Decided with the owner on 18 November 2026:

1. The database lives in a Supabase account owned by the club email, so it survives handover. The owner creates the account and project; the URL and anon key go in `.env.local` (see `.env.example`).
2. Sign-in is Google, open to anyone. An address ending in `@email.iimcal.ac.in` or `@iimcal.ac.in` also unlocks the IIMC-only material; a personal Gmail does not.
3. IIMC-only material (prep files made by other clubs, consultant names and direct numbers) must be read from a table protected by row-level security on the email domain. It must never be placed in a data file or a client bundle.
4. Then: streak sync, points and an opt-in leaderboard, the wall of thoughts (named or anonymous, read by the team before it shows), a visitor counter and a live "here now" count with Supabase Realtime.

## Phase 3: the 3D yoga guide (not built)

A rigged male figure that moves into each of the 14 poses. Plan: generate a CC0 human with a clean game rig (MPFB in Blender), store each asana as bone rotations and blend between them in three.js, loaded only on that page. A female figure can follow.

## Open, for the owner

- The session schedule (day, time, room). Three places show "date and room to be announced".
- Confirm: Yoga Day 2026 was run with Anandam Foundation; the spelling "Jesal Mehta"; the 23 February yoga morning at MCHV (year unclear, left out); whether the 21 days of Instagram posts started (left off the board).
- Team spellings follow the owner's message of 18 November: Ruchir Sahni, Harshawardhan Devsoth. The Instagram team graphic says Ruchir Saini and Harsha Vardhan.
- Old components no longer used: `Mascot`, `Mascot3D`, `Lotus3D`, `Lotus3DGate`, `HeroOrnament`, `ThemeToggle`, `SoundToggle`, `Reveal`. They are still in the repo; delete only with the owner's say.
- Dark mode was dropped with the old system. A night palette can be added to `tokens.css` later.
- The three older practice guides still use the old centred layout and clip art.

## Round 2, 18 and 20 November 2026

The owner liked the look and asked for a second round, then asked to pause part way to save their usage limit. Work resumed on 20 November in small steps, one at a time, with no parallel helpers, and everything asked for in the round is now built. Nothing here is committed.

### What the owner asked for
1. Redo `/practice/chakras`, `/practice/yoga-poses` and `/practice/mandala` in the new design.
2. Breathing motion graphics that are "more crazy and unique and eye catching".
3. Chanchal: joint limits so he never lands in a pose that looks dead; a bigger, hollow head; no neck; a stick figure like the one in Alan Becker's animations; says hi in a cute voice at the start and makes more sounds; a text box that types fast when the visitor moves to a different image, with him babbling along; swimming strokes when he is in open space; sits and breathes along during a breathing exercise; no red dot on the chest.
4. Small animated pixel creatures, big head and small body, in different styles: one beside each of the nine organisations on `/beyond`, and one for every main topic (a dog playing, a cat sleeping, a monitor lizard running, a bird in a nest).
5. Later message: a bendable 3D model that takes the selected yoga pose. The owner wants model recommendations first. The research was stopped before it reported.

### Done and visible
- Chanchal's look. He is drawn by `lib/chanchal/body.js`: a hollow head, one line weight, no neck, in the logo's pink with a paper edge. The red dot (it was meant as the heart Heartfulness rests attention on) is gone. He is pink and not orange on purpose: the orange figure is Alan Becker's own character, so only the build was borrowed.
- He says "hi" out loud when he waves (`lib/chanchal/voice.js`). Browsers allow no sound before the first click or key press, so on a fresh page the spoken hi comes with the first click, together with a second wave.

- The three guide pages (20 November). `app/guides.css` now styles them, and they were checked at 375, 768 and 1440 pixels wide: no sideways scroll, no console errors.
  - `/practice/chakras`: a seated figure stays in view on the ink field while the seven centres scroll past. The centre being read lights up, its symbol opens behind that spot, and seven beads set out like a spine jump to a centre. On a phone the beads become a strip that stays under the nav. The seven colours are tokens, `--color-chakra-1` to `--color-chakra-7` in `app/tokens.css`.
  - `/practice/yoga-poses`: one pose at a time on a paper disc on the sun field, a count for five breaths, and all fourteen below on numbered pebbles. The fourteen are links (`#pose-id`), so a pose can be shared or opened in a new tab.
  - `/practice/mandala`: the mandala on the ink field beside its controls.
  - Each guide ends with lily pads to step on (`components/guides/GuideEnd.js`). On the chakra page one more pad is left free and Chanchal sits on it. `--seat-size` and `--seat-rise` in `app/tokens.css` size that pad and the room kept above it.
  - The project's checker (`sloplint.mjs`) reports no failures and no open findings on the three pages.

- Chanchal's behaviour (20 November). `components/Chanchal.js` was rewritten: he is now moved by poses, not by falling points. Each frame a move from `lib/chanchal/moves.js` says where every joint should be, a spring carries it there, and the joint is clamped to its human range (`LIMITS` in `lib/chanchal/body.js`). He overshoots and wobbles but cannot land in a broken shape. The old rag-doll file is kept at `~/Documents/JM_website/wip_2026-11-18/Chanchal.ragdoll.js`.
  - On a pad: he drops, squashes as he lands, waves, says hi, then fidgets (looks round, pats his head, kicks a leg out, stretches, sways, drums his fingers). The fidgets thin out as his calm rises and stop when he is calm.
  - With no pad in view: he swims. He paddles and kicks along his path with his body pointed where he is going, and treads water when he stops. He follows the pointer on a desktop and picks his own spots on a phone. He is drawn solid in open parts of the page and faint when he is behind words or pictures (`openAt()` asks the page what is under him).
  - During a practice: he sits (on the pad if one is in view, else in the corner of the window) and breathes with the page. `lungs()` from `lib/breathSignal.js` drives his chest, head and hands, and small rings leave his head on each breath out. He cheers when the practice finishes.
  - Talking: when the visitor points at a picture or scrolls one into view, a small box by his head types what the picture shows and he babbles along. The words are the picture's alt text. To give a picture its own line, put `data-chanchal-say="..."` on it or on anything around it. Pictures with an empty alt are skipped.
  - Sounds now in use: hi, a plop on landing, a whee when he is dropped again from the nav, a yay after a practice, soft breaths during one (not during the silent timed sits), babble while he types, a giggle when he is clicked. All are off when the site's sound is off, and none can play before the first click or key press.
  - `/practice` has a pad for him: beside the sun on a wide screen, at the foot of the band on a narrow one.
  - Checked by screenshot at 1440 and 375, with reduced motion (he sits still on the pad), on `/support` (he sits in the corner) and with "Sit, Chanchal" chosen. No console errors. The checker reports no failures on `/`, `/practice` and `/events`.
  - Not verified: how any of the sounds actually sound. A person has to listen.

- The breathing bloom (20 November), `components/BreathBloom.js`. While a practice runs the sun turns into a flower: rays of cut paper reach out across the band as the lungs fill and pull back as they empty, rings of petals open from under the sun and fold away, each ring turning against its neighbour, and specks of air spiral in and out with the breath. Every round adds a ring, up to six, and starts with a burst of petal chips. The last breath leaves the flower open for a moment.
  - It is mounted in the hero (`tone="paper"`), the practice room (`tone="pond"`) and the yoga sequence (`tone="sun"`). `spread` sets how far the petals reach: 1 in the hero, where the headline steps aside, 0.34 where words stay close to the sun.
  - The canvas is `display: none` until a breath runs, and stays that way when motion is off, so an idle page pays nothing for it.
  - In the practice room the line about when to use a practice now hides while the practice runs, as the headline does in the hero.

- The pixel creatures (20 November). Eighteen small animals and objects, drawn by hand on grids of 14 to 33 pixels, one letter to a pixel, in `data/critters.js`. `components/Critter.js` paints them with the site's own colour tokens and plays their frames on one shared clock. `app/critters.css` places them.
  - The nine organisations on `/beyond` each have one standing on the rule above the name: a child with a schoolbag, a hen and chick, a medic's bag, a seedling, a bookworm, an elder with a stick, a cup of chai, a boat, a house with a lit window. `sprite` in `data/beyond.js` says which. Each is a plain picture of the kind of work, not a logo.
  - Every main topic has one standing on the edge of a band: frog (today on the home page, and `/practice`), egret (practice on the home page, and `/beyond`), snail (the newsletter, and `/issues`), dog with a ball (sittings, and `/events`), owl (support on the home page), cat asleep (the doors band, and `/support`), a bird in a nest (`/board`), a fish jumping (`/join`), and a monitor lizard that runs back and forth along the first band on `/campus`.
  - To stand a creature on a band, put `<div className="critter-edge critter-edge--right"><Critter name="frog" /></div>` first inside the band. A band cut "a" meets its top edge on the right, a band cut "b" on the left. Pick a creature that shows against the band above: the frog is pond green and disappears in front of a pond band.
  - They are backgrounds on empty boxes, not images, because they are decoration. The project's checker measures images as content, and it counted a creature standing between two bands as the bands touching.
  - With motion off each holds its first frame. Creatures off screen are not updated.
  - To redraw one, edit its rows in `data/critters.js`, or use the drawing kit in `~/Documents/JM_website/wip_2026-11-18/critters/` (`python3 export_js.py <path to data/critters.js>` writes the file).

- Switches for sound and motion (20 November). `components/SiteSwitches.js` puts two in the footer, "Sound is on" and "Motion is on". Sound covers every tone, bell and voice. Motion covers Chanchal, the bloom, the creatures and the small transitions: it sets `motion-off` on `<html>`, and `app/globals.css` now has the rules that hold everything still under that class. The nav's Chanchal button follows the motion switch.
  - "Sit, Chanchal" in the nav now also keeps him quiet: he does not talk about pictures once he has been asked to sit, or on a page that asks him to keep still.
  - The newsletter's breathing widget (`components/BreathingWidget.js`) announces each phase with `jm:breath`, so Chanchal breathes along on issue pages too.

### Checked on 20 November
- The project's checker (`sloplint.mjs`, with its screenshots) on all fifteen routes: no failures and no open findings on any of them.
- A production build (`next build`, with the dev server stopped): compiled with no warnings, 25 static pages.
- Every route answers 200 on the dev server, and no test run logged a console error.

### Left over
- Nobody has listened to Chanchal's sounds. They were checked by machine only: Whisper's small model hears the hi as "Hi!", its large model hears "Bye!" at the final volume.
- `lib/chanchal/voice.js` has one sound that nothing plays: hm.
- Lines of his own for each photograph (`data-chanchal-say`). Today he reads the alt text, and the photographs in the rails only say "photograph 3 of 17".
- `/team` and `/about` have no creature, because neither has a band edge to stand one on.
- `.chanchal-hi` in `app/globals.css` is no longer used (the speech box replaced it).
- The owner has not seen Chanchal in pink rather than orange, the creatures, or the bloom.
- The 3D figure that takes the selected yoga pose (phase 3). The picture of each pose sits in `.asana__art`, a slot keyed on the pose id, so a figure can replace it there.

### Working files
`~/Documents/JM_website/wip_2026-11-18/` holds the sprite drafts, the pose test harness (`fig/figtest.mjs`), the sound renderer and listening test (`snd/render.mjs`, `snd/hear.sh`) and the screenshot scripts in `scripts/`: `shot.mjs` (a route, a window size and scroll positions or selectors), `strip.mjs` (frames of Chanchal landing, swimming, breathing, talking, and of the bloom), `check.mjs` (phone, reduced motion, the support page, asked to sit) and `edges.mjs` (a close-up of every creature on a band edge). They were copied there because the session's scratch folder does not survive a restart.
