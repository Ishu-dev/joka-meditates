# Joka Meditates Website · Agent Instructions

This file is read automatically by OpenCode at the start of every session in this repo (falls back from `AGENTS.md` only if this file is missing, so this is now the canonical one, not `CLAUDE.md`). Keep it current as decisions get made during the build; do not let it go stale.

**Full working reference material lives in `docs/reference-issues/`** (issue-02.html, issue-03.html, issue-04.html). These are the four already-shipped newsletter issues with their logo images stripped out (they were 80-90% base64 image data, not useful as code reference). What remains in each file is the complete real CSS and JS: the theme toggle, the sound synthesis, every breathing/timer widget, the fade-in scroll behavior, and issue-specific patterns like the rain motif (issue 03), the reminder strip and verse plate (issue 04). The snippets and descriptions below are a summary, the actual working implementation is in those three files, read them directly rather than relying on this file alone for anything pixel-level.

**The full product spec lives in `docs/PRD.md`** (place the PRD file there). This file is the working-style and technical-pattern companion to that spec, read both, but treat the PRD as the source of truth for *what* to build and this file as the source of truth for *how*.

## Redesign in progress (read this first, added 18 November 2026)

The owner retired the newsletter-derived design system on 18 November 2026 and asked for a new design. Work is on branch `redesign-2026`. **`docs/REDESIGN_2026.md` is now the source of truth for the look, the pages, where content lives and what is still open.** Where this file and that one disagree, that one wins. In short:

- The sections below headed "Design system: port this exactly", "Theme toggle" and "Logo: two files" are superseded. Tokens are in `app/tokens.css`, the stylesheet is `app/globals.css`, the type is Anek Latin and Anek Devanagari, and the logo is the traced SVG in `public/brand/`.
- "No public user accounts" in the PRD is reversed: Google sign-in, streak sync, a leaderboard and a wall of thoughts are planned as phase 2.
- Material that was circulated to IIMC batches only (prep files from other clubs, consultant names and phone numbers) never goes into a data file or a client bundle. It waits for the IIMC sign-in.
- The character on the site is Chanchal, the restless mind of Gita 6.34. Read the layering note in the redesign doc before adding a `transform` or `z-index` near `<main>`.
- Still true from below: performance limits, sound by synthesis, no em dash anywhere, facts only from a real source.

## What this project is

Joka Meditates is IIM Calcutta's student-run Heartfulness meditation Student Interest Group. Instagram was permanently disabled, so this site and the twice-weekly newsletter ("the issue") are the club's only two channels. Four issues of the newsletter already exist as real, shipped, working HTML files, they are the design and interaction reference for this whole build, not a rough sketch to improve on.

**Owner:** Ishu Chaudhary, President. Sai Krishna, Vice President, has equal dashboard access.

**Guiding principle:** this is not "we have a website to check a box." Every feature gets judged on whether it makes someone come back, not whether it looks impressive once.

## Tech stack

- Next.js 14 (App Router), React 18, Tailwind CSS v3
- Supabase (Postgres + Auth) for the issues archive, budget data, and organizer login
- Deployed on Vercel, existing GitHub-connected project, this is not a new repo
- Fonts: Cormorant Garamond (display/headings), IBM Plex Sans (body/UI), loaded via `next/font`, not a runtime Google Fonts `<link>` (that shortcut was fine for standalone newsletter files, it is not fine for a site people load repeatedly)
- 3D: `react-three-fiber`, lazy-loaded via `next/dynamic` (`ssr: false`)
- Animation: CSS first, Motion (`motion`, motion.dev) for React micro-interactions, anime.js v4 only for complex SVG/stagger sequences; both dynamically imported per page, never in the shared bundle
- Component sources: copy-in registries only, Kokonut UI, Bklit UI (admin charts), Originkit, Lightswind, vetted per the checklist below

## Non-negotiable constraint: performance

- No heavy library ships in the shared/initial bundle. Anything visually rich (3D, mascot widget) loads on demand, per-page.
- Three.js scenes stay low-poly and simple, never a showcase scene.
- Decorative raster graphics: compressed, `loading="lazy"`, `aria-hidden="true"`, empty `alt=""`.
- Concrete target: sub-2s first contentful paint on mobile, throttled 4G, Lighthouse. Treat this as a real check, not a vague goal.
- Auth/dashboard code stays route-isolated so it never adds weight to public pages.

## Viewport / zoom behavior

`<meta name="viewport" content="width=device-width, initial-scale=1.0">`, same as every existing newsletter issue file. Do not disable zoom entirely, just keep layout from breaking at extreme zoom levels.

## Design system: port this exactly, do not redesign it (SUPERSEDED 18 Nov 2026, see docs/REDESIGN_2026.md)

The newsletter issues (four of them, already shipped) are the proven design system. Use their tokens and mechanisms directly rather than the earlier speculative "Divine Lotus" token set, which was never actually shipped anywhere.

### Color tokens

```css
:root{
  --paper:#f4f2ea;
  --ink:#26261f;
  --ink-soft:#585848;
  --accent:#c2447e;
  --accent-soft:#fbe4ee;
  --deep:#2f5d54;
  --deep-soft:#e2ede9;
  --rule:#d9d4c3;
  --link:#6b4f8f;
  --radius:14px;
}
@media (prefers-color-scheme: dark){
  :root:not([data-theme="light"]){
    --paper:#191a17; --ink:#ece8dc; --ink-soft:#a6a394;
    --accent:#f2a6c6; --accent-soft:#39202b; --deep:#8fc4b6;
    --deep-soft:#1f2f2b; --rule:#383730; --link:#b79fd6;
  }
}
:root[data-theme="dark"]{
  --paper:#191a17; --ink:#ece8dc; --ink-soft:#a6a394;
  --accent:#f2a6c6; --accent-soft:#39202b; --deep:#8fc4b6;
  --deep-soft:#1f2f2b; --rule:#383730; --link:#b79fd6;
}
```

Wire these into `tailwind.config.js` as CSS-variable-backed colors. Never hardcode hex in components.

### Theme toggle (system preference + manual override + persistence)

This exact pattern is already built and working in Issue 04, port the logic, don't re-derive it:

- Default to system preference via the media query above.
- A visible toggle button sets `data-theme="light"` or `data-theme="dark"` on `<html>`, which overrides the media query regardless of system setting.
- Persist the manual choice in `localStorage` (key: `jm-theme`). On load, check `localStorage` first; if nothing saved, fall through to system preference.
- The logo (see below) switches using the identical `data-theme` mechanism, not a separate system.

### Logo: two files, switch with theme

Two logo files exist: black-text version (light mode) and white-text version (dark mode). Implement as two `<img>` (or `next/image`) elements with CSS `display` controlled by the same `data-theme` selectors as the color tokens, not a single image with a colored background badge, that was a workaround used before both files existed and should not be ported forward.

### Sound: synthesize, never ship audio files for UI feedback

Interactive elements (breathing widgets, timers) use the Web Audio API to synthesize soft sine-wave tones, zero audio assets, zero added weight. Pattern already proven:

```js
function playTone(freq, duration, volume){
  const ctx = getAudioCtx(); // singleton AudioContext, resume() if suspended
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.type = 'sine';
  osc.frequency.value = freq;
  gain.gain.setValueAtTime(volume || 0.06, ctx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + duration);
  osc.connect(gain); gain.connect(ctx.destination);
  osc.start(); osc.stop(ctx.currentTime + duration);
}
```

A site-wide sound toggle should gate this the same way the theme toggle gates color, one clear on/off, remembered per session.

### Reusable interactive components (build once, compose per issue)

The four existing issues all reuse the same handful of patterns. Build these as real React components rather than one-off page markup:

- `<BreathingWidget phases={[{label, duration, scale, tone}]} cycles={n} />`, drives a circle that scales per phase, optional tone per phase, optional user-set cycle count (issue 04's Nadi Shodhana widget is the fullest version of this, with a min/max cycle input)
- `<CountdownTimer seconds={n} onComplete={...} />`, start/pause/reset, plays a completion chime
- `<PlaylistLink title={} meta={} href={} />`, the recurring playlist-card pattern
- `<VersePlate source={} devanagari={} transliteration={} sense={} />`, the inscription-style block used for Sanskrit verses (only needed if future issues reuse it)

### `<MandalaVisualizer />`: audio-reactive mandala

- Canvas 2D, radial symmetry, AnalyserNode FFT drives petal scale/glow/hue mapped to the `--accent`/`--deep` tokens
- Sound sources: built-in synth drones via the `playTone` engine (selectable frequencies, zero assets), optional mic input behind an explicit permission prompt
- devicePixelRatio capped at 2, rAF paused when `document.hidden`, static SVG mandala fallback under `prefers-reduced-motion`, no audio without a user gesture
- Dynamically imported; only routes that mount it pay for it. 3D R3F variant is a Phase 4 option, prototype via a Casberry export (particles.casberry.in) then rewrite lean

### Animation library rules

- Preference order: CSS keyframes/transitions, then Motion (motion.dev), then anime.js v4 for multi-target SVG/stagger work. Everything freezes under `prefers-reduced-motion`.
- Scroll reveals use IntersectionObserver, not a scroll-listener library.

### Approved component registries and vetting

Copy-in source registries (we own the code, no runtime dependency):

- Kokonut UI (kokonutui.com): `npx shadcn@latest add @kokonutui/<name>`, React + Tailwind + Motion + Lucide, matches our stack
- Bklit UI (bklit.com): `npx shadcn@latest add @bklit/<chart>`, MIT charts, `/admin` budget view only
- Originkit (originkit.dev): animated particle/text/canvas components via CLI or MCP, free API key
- Lightswind (lightswind.com): 160+ components incl. particle and shader backgrounds, copy-in source + Tailwind plugin

Vetting checklist before any borrowed component lands in the repo: colors remapped to our tokens (defaults never ship), no colliding global CSS/keyframe names, canvas/WebGL components dynamically imported, license recorded in `CREDITS.md`, dark mode verified against the `data-theme` mechanism, unused variants stripped.

Inspiration references (templates Nexflow, FinTechX, Verseo, Galilee, DreamMotion, Cloud.Craft; tools manus.im, particles.casberry.in) are never copied wholesale, links pending from the owner.

### Signature animated components (existing, keep if still present in current build)

- `BreathingLotus.js`: layered SVG lotus, `breathe` and `bloom` keyframes, staggered petal delays, soft radial glow. `aria-hidden`, freezes under `prefers-reduced-motion`.
- `CornerFlourish.js`: art-nouveau SVG ornament, hidden below ~480px, `aria-hidden`, never overlaps text.

Evaluate whether these still fit the newsletter-derived palette above, adjust their stroke/fill colors to the new tokens if they read as mismatched.

## Site structure

```
app/
  about/page.js
  events/page.js
  join/page.js
  practice/
    page.js
    chakras/page.js
    yoga-poses/page.js
    mandala/page.js       # audio-reactive mandala visualizer
  team/page.js
  issues/
    page.js              # archive, newest first
    [slug]/page.js        # renders one issue from Supabase
  admin/                  # organizer login, not a guessable route
  layout.js
  page.js
components/
  BreathingLotus.js
  CornerFlourish.js
  MandalaVisualizer.js
  BreathingWidget.js
  CountdownTimer.js
  PlaylistLink.js
  Footer.js
  MemberCard.js
  NavBar.js
  ThemeToggle.js
  SoundToggle.js
public/
  brand/                  # both logo files, favicon, OG image
  graphics/
  team/
  events/
  audio/
assets-inbox/               # raw owner uploads, agent processes into public/, never referenced by the site
docs/
  PRD.md
  reference-issues/         # the four shipped newsletter issues
ASSETS.md, CREDITS.md       # asset inventory and attribution, repo root
```

## Supabase schema (sketch, finalize before Phase 1)

```
issues
  id            uuid
  slug          text unique
  title         text
  subtitle      text
  published_at  timestamptz
  content       jsonb        -- structured blocks, not raw HTML

budget_items
  id            uuid
  label         text
  amount        numeric
  category      text
  added_at      timestamptz
```

Organizer-only write access via Supabase RLS policies, public read access to `issues` only where `published_at` is not null.

## Team roster (Batch 2026-27)

- Ishu Chaudhary, President
- Sai Krishna, Vice President
- Ruchir Saini, Logistics Head
- Harshavardhan Devsoth, Marketing Head
- Meghana Vihulekar, Practice & Wellbeing Head
- Chandana Amireddy, Events Head
- Faculty coordinator: none currently, the previously listed name was wrong. Do not add one unless the owner confirms.

## Contact

Official email: `joka-meditates@email.iimcal.ac.in` (do not reintroduce the old `imcal` typo).

## Content gaps (real assets needed from the owner, not code work)

Graphics and team headshots are already on disk (`graphics/`, `team/`) and inventoried in `ASSETS.md`. Drop new raw files into `assets-inbox/` and the agent processes them into `public/` per the README rules.

1. Both logo files into `/public/brand`
2. Guided meditation audio into `/public/audio`, if `/practice` gets a player
3. Yoga Day and other event photos into `/public/events`
4. ~~Real WhatsApp community link for `/join`~~ done: https://chat.whatsapp.com/GlJ7rURYrjT88BT8h5IwYR
5. `og-image.png` (1200x630) and `favicon.ico` in `/public/brand`, the og-image can be generated with `@vercel/og` from the logo and tokens
6. Real session schedule (day, time, location) for `/join` and the footer

Update 2026-08-25: Instagram is back. The handle @joka_meditates is live again (link verified), so the earlier "IG permanently disabled, never link it" rule is reversed. Link it in the footer and `/join`.

## Working style notes

- Iterate visually with the owner in the loop rather than one-shot generating a full redesign. The original "looks AI-made" feedback came from a single-pass build with no follow-up refinement, don't repeat that pattern.
- Rollout order: (1) issues archive + migrate the four existing issues, (2) organizer login + publishing flow, (3) core pages, (4) mascot and 3D last, since they're delight features and should never block a functioning site.
- Verify any referenced library, registry, or template actually exists before writing it into a spec; inspiration references are never copied wholesale and licenses get recorded in `CREDITS.md`.
- Never use the em dash character anywhere in generated content, code comments, UI copy, docs, commit messages, including this file.
