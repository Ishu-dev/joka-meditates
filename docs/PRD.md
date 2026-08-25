# Joka Meditates Website · Product Requirements Document

**Status:** All four phases shipped 2026-08-25. Repo: github.com/Ishu-dev/joka-meditates. Remaining: Supabase project activation (schema.sql + env vars + organizer accounts), Vercel import, content gaps in ASSETS.md (session schedule, meditation audio, favicon).
**Owner:** Ishu Chaudhary (President), Sai Krishna (VP)
**Built with:** OpenCode (terminal), model plan at max tier
**Budget:** ₹37,000
**Last updated:** revised 2026-08-24, adds the animation stack (§5, §7.5), component sourcing policy (§7.5), the audio-reactive mandala visualizer (§9.8), and the asset pipeline (§11). This document supersedes the earlier informal requirements list; treat it as the single source of truth

---

## 1. What this project is

Joka Meditates is the student-run Heartfulness meditation SIG at IIM Calcutta. The club's Instagram was permanently disabled, so the website and the twice-weekly newsletter ("the issue") are now the only two channels the club has. Four issues of the newsletter have already been built and sent (self-contained HTML files, hosted individually on Netlify). This PRD is for the actual website: a Next.js site that becomes the permanent home for the club, including an archive of every issue.

This is not a from-scratch design exercise. Four real, tested pieces of interface already exist, the newsletter issues, and they contain a working design system, a working dark/light toggle, working interactive breathing widgets, and a working sound engine. The instruction to the coding agent throughout this PRD is: **port what already works, don't redesign it.**

---

## 2. Goals

Applying High Tech Product Management thinking here means the site has to earn repeat visits, not just exist. Concretely:

- A student should have a reason to come back to the site more than once. The issues archive is that reason, not a static "About us" page nobody revisits.
- The site should feel distinct from a generic club webpage. The vibrancy problem flagged earlier (an prior build "looked AI-made / too simplistic") gets solved by importing the already-proven newsletter aesthetic, not by adding more stock design.
- Fast load matters more than feature count. A slow site loses the audience before the mascot or the 3D element ever gets seen.

## 3. Non-goals

- This is not an e-commerce or payments site. No transactions.
- No public user accounts. The only authenticated users are the two organizers.
- No native mobile app. Responsive web only.
- The 3D element is a delight feature, not core navigation. If it conflicts with the performance budget, it gets cut before anything else does.

## 4. Users

| Who | What they need |
|---|---|
| Prospective/current members browsing | Understand what the club does, see the practice guides, find the next session, read the latest issue |
| Returning readers | A reason to come back: new issues, without needing an email reminder every time |
| Ishu / Sai Krishna (organizers) | Publish a new issue without touching code, see the budget, no dev involvement per issue |
| Faculty coordinator (Prof. Anupama) | Occasional visibility, no special access required beyond what's public |

---

## 5. Tech stack

Pin this exactly, don't let the coding agent improvise a different stack mid-build:

- **Framework:** Next.js 14, App Router
- **Styling:** Tailwind CSS, using CSS custom properties for the theme tokens (see §7) rather than hardcoded Tailwind color values, so the light/dark toggle works the same way it already does in the newsletter issues
- **Auth:** Supabase Auth (Ishu has prior experience with this from HMC One Pulse)
- **Database:** Supabase Postgres, for the issues archive and budget line items
- **3D:** react-three-fiber + drei, lazy-loaded via `next/dynamic` with `ssr: false`, never in the initial bundle
- **Hosting:** Vercel (existing GitHub-connected project, do not create a new repo)
- **Fonts:** Cormorant Garamond (display) + IBM Plex Sans (body), loaded via `next/font`, not a runtime Google Fonts `<link>` tag, since we control the build now
- **Animation:** CSS keyframes/transitions first, Motion (`motion`, motion.dev) for React micro-interactions, anime.js v4 only for complex multi-target SVG/stagger sequences. Both libraries are dynamically imported inside the components that use them, never in the shared initial bundle
- **UI components:** copy-in source registries only (§7.5), no runtime component framework dependency

## 6. Repo and agent setup

- This is an **existing** Next.js project, already connected to Vercel via GitHub. The coding agent must open that existing folder, not scaffold a new project. If the folder can't be found locally, clone it from the connected GitHub repo.
- `CLAUDE.md` already exists in the repo root with the original project context. **OpenCode reads `AGENTS.md` first and falls back to `CLAUDE.md` automatically if no `AGENTS.md` exists**, so this file is already being read, nothing to redo.
- Recommended: copy `CLAUDE.md` to `AGENTS.md` (OpenCode's native, tool-agnostic convention) rather than relying on the fallback indefinitely. Keep both in sync, or just rename and delete the old one if Claude Code compatibility is no longer needed.
- No em dash character anywhere in any content the agent generates, site copy, commit messages, comments. This is a standing rule, not a one-off request.

---

## 7. Design system

**Use the newsletter's design system as the source of truth, not the earlier "Divine Lotus" tokens from the original website context doc.** The newsletter palette has been through four real issues and is proven; the older token set was speculative and was never actually shipped anywhere. Concretely, port these CSS custom properties directly:

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
}
/* dark mode: --paper:#191a17, --ink:#ece8dc, --ink-soft:#a6a394,
   --accent:#f2a6c6, --accent-soft:#39202b, --deep:#8fc4b6,
   --deep-soft:#1f2f2b, --rule:#383730, --link:#b79fd6 */
```

**Theme switching:** system preference by default, with a manual toggle that overrides it and persists via `localStorage`. This exact pattern (`data-theme` attribute on `<html>`, `:not([data-theme="light"])` guard on the dark media query, explicit `[data-theme="dark"]` override block) is already built and working in Issue 04. Port it directly rather than re-deriving it.

**Logo:** two files exist, black-text version for light mode, white-text version for dark mode. Both should switch automatically with the theme, same mechanism as the toggle above (two `<img>` elements, CSS controls which is visible). Get both files from Ishu before starting, they're the ones already used in Issue 04.

**Sound:** the newsletter issues use the Web Audio API to synthesize soft tones for breathing-widget phase changes and completion chimes, zero audio files, zero added weight. If any interactive practice element on the site plays sound, use this same synthesis approach rather than shipping audio assets.

---

## 7.5 Animation stack and component sourcing

**Motion preference order:** CSS keyframes/transitions, then Motion (motion.dev), then anime.js v4 for multi-target SVG/stagger work, then custom canvas or react-three-fiber for generative scenes. Every animated element freezes under `prefers-reduced-motion`. Scroll reveals use IntersectionObserver, not scroll-listener libraries.

**Verified copy-in registries** (source lands in the repo, we own it, no runtime dependency):

| Library | What it gives us | Install |
|---|---|---|
| Kokonut UI (kokonutui.com) | Animated cards, buttons, particle button, micro-interactions. React + Tailwind + Motion + Lucide, matches our stack | `npx shadcn@latest add @kokonutui/<name>` |
| Bklit UI (bklit.com) | MIT-licensed charts, for the `/admin` budget view only | `npx shadcn@latest add @bklit/<chart>` |
| Originkit (originkit.dev) | 50 animated components: SVG particles, text effects, canvas scenes. Free API key, CLI + MCP | CLI or MCP fetch |
| Lightswind (lightswind.com) | 160+ components incl. particle and shader backgrounds, copy-in source with Tailwind plugin | `npx lightswind add <name>` |

**Vetting checklist before any borrowed component lands in the repo:**

1. Colors remapped to our CSS tokens, library defaults never shipped
2. No global CSS or keyframe names colliding with ours
3. Canvas/WebGL components dynamically imported
4. License recorded in `CREDITS.md`
5. Dark mode verified against the `data-theme` mechanism
6. Unused variants stripped from the copied source

**Inspiration references, never copied wholesale:** templates Nexflow, FinTechX, Verseo, Galilee, DreamMotion, Cloud.Craft (links pending from the owner); tools manus.im (AI-assisted asset/content experiments) and Casberry Particles (particles.casberry.in, prototype bespoke particle scenes and export react-three-fiber code we then trim, adapt, and own).

---

## 8. Information architecture

```
/                     Home, mission, next session, latest issue preview
/about                What the club is, faculty coordinator, team
/practice             Practice hub
/practice/chakras     7-Chakra Alignment Guide
/practice/yoga-poses  14-Pose Yoga Guide
/practice/mandala     Audio-reactive mandala visualizer (§9.8)
/events               Upcoming and past events (Yoga Day, BMB collabs, etc.)
/join                 How to join, session schedule
/issues               Newsletter archive, all issues, newest first
/issues/[slug]        Individual issue, rendered from the database (see §9)
/team                 Team roster with photos
/admin                Organizer login, budget view, issue publishing (auth-gated)
```

## 9. Feature specifications

### 9.1 Issues archive (the return-visit driver)

This is the most important feature in the PRD. It's the difference between a static club page and something people check twice a week.

- Each issue is a database row (Supabase table `issues`: `id`, `slug`, `title`, `subtitle`, `published_at`, `content` as structured JSON or MDX, `theme_accent` if issues ever vary color). The four already-built issues should be migrated in as the first four rows, either by hand or by having the agent parse the existing HTML files into the same structure.
- `/issues` lists all published issues as cards: title, one-line subtitle, date, and gets a visit-worthy landing page in its own right, not just a dropdown.
- `/issues/[slug]` renders the full issue using the same design system and interactive components already proven, breathing widgets, timers, playlists, the works. These components should be built once as reusable React components (`<BreathingWidget phases={...} />`, `<CountdownTimer seconds={...} />`) so every future issue can compose them without writing new JS each time.
- **Acceptance criterion:** publishing a new issue must require zero code changes and zero deploys. It's a database insert through the organizer login (§9.2), not a pull request.

### 9.2 Organizer login and admin

- Supabase Auth, email/password or magic link, restricted to Ishu and Sai Krishna's accounts only, no public signup.
- Logged-in view at `/admin` shows: current budget (line items, amounts, running total against the ₹37,000 cap) and an issue editor (create/edit/publish an issue without touching code).
- Budget data lives in its own Supabase table (`budget_items`: `id`, `label`, `amount`, `category`, `added_at`), editable only by logged-in organizers, not publicly visible.

### 9.3 Mascot / agent personality

- A small persistent character (Duolingo/Claude-style) that appears site-wide, offers light guidance ("Ready for a breathing break?"), and gives the site a personality beyond a static club page.
- Keep this scoped: a single SVG or Lottie animation with 3-5 states (idle, wave, celebrate, prompt), not a full conversational agent. This is a delight feature, not a chatbot, don't let it balloon in scope or bundle size.
- Should not appear on `/issues/[slug]` pages, those already carry their own personality and shouldn't compete for attention with the reading experience.

### 9.4 3D element

- One deliberate use of react-three-fiber, most naturally the lotus mark itself rendered in 3D on the homepage, slowly rotating or responding to scroll/cursor.
- Must be lazy-loaded (`next/dynamic`, `ssr: false`) and must not appear in the initial JS bundle. If Lighthouse or bundle analysis shows it affecting first load, cut it before cutting anything else in this PRD.

### 9.5 Visitor analytics

- Vercel Analytics, dev-side only. No visible counter on the public site. This was already discussed and settled, don't resurrect the "show a counter" idea, a low early number works against the club, not for it.

### 9.6 Theme toggle

- Already specified in §7. Applies site-wide, not just to `/issues/[slug]`.

### 9.7 Responsive and zoom behavior

- `<meta name="viewport" content="width=device-width, initial-scale=1.0">` for zoom clamping, matches what's already in every issue file.
- Test breakpoints: mobile (< 480px), tablet, laptop. The newsletter issues already have a working `@media (max-width: 480px)` pattern to reference.

### 9.8 Audio-reactive mandala visualizer

The "random mandala that reacts to sound" idea, scoped properly. A generative mandala that blooms in rhythm with audio. 2D first, 3D optional and last.

- **Sound sources:** (a) built-in synth drones through the existing `playTone` engine, selectable frequencies (e.g. 174/285/396/432/528/639 Hz), zero audio assets; (b) device microphone behind an explicit permission prompt; (c) later, reactive-to-playlist mode if a practice audio player ships.
- **2D implementation:** Canvas 2D + requestAnimationFrame, AnalyserNode FFT drives petal radius, glow, and hue; radial symmetry with configurable petal count; hue mapped to the `--accent`/`--deep` tokens; devicePixelRatio capped at 2; rAF paused when the tab is hidden; static mandala SVG fallback under `prefers-reduced-motion`.
- **3D version (optional, Phase 4):** react-three-fiber points scene under the same lazy-load discipline as the homepage lotus. Prototype fast via a Casberry export, then rewrite lean.
- **Placement (decided 2026-08-25):** one place only, a dedicated `/practice/mandala` page. No home widget, it stays out of the initial-load path entirely.
- **Acceptance:** no sound without a user gesture; zero bundle impact on routes that don't mount it; keyboard-operable controls; Lighthouse on other routes unaffected.

---

## 10. Performance budget

This is a hard constraint, not a nice-to-have:

- No heavy libraries (three.js, any charting library, any animation library beyond CSS) in the initial JS bundle. Everything heavy is lazy-loaded behind `next/dynamic`.
- Target: sub-2-second First Contentful Paint on mobile, throttled 4G, per Lighthouse.
- Fonts loaded via `next/font` (self-hosted, no render-blocking external request), not a runtime `<link>` to Google Fonts like the standalone issue files currently use, that shortcut was fine for a single-file newsletter, it's not fine for a site users load repeatedly.
- Images (team photos, event photos) served via `next/image` with proper sizing, never raw unsized `<img>` tags outside the already-established logo-switching pattern.
- Animation libraries follow the same rule as everything heavy: Motion and anime.js are dynamically imported inside only the components that need them, and borrowed component source is trimmed of unused variants before it lands in the repo.

---

## 11. Asset pipeline and content assets

The graphics library and team headshots are already on disk and scanned (inventoried in `ASSETS.md` at the repo root). The checklist below is what is still genuinely missing. Flagging so this doesn't block silently mid-build:

- [ ] Both logo files (black-text and white-text versions), already in hand from the newsletter work, just need to land in the repo's `/public/brand` folder
- [x] Team photos for `/team` (6 headshots on disk, need a uniform aspect-ratio crop before publishing)
- [ ] Yoga Day and other event photos for `/events`
- [ ] Guided meditation audio file(s), if any are meant to live on `/practice`
- [ ] `og-image.png` (1200×630) and `favicon.ico` for `/public`, the og-image can be generated with `@vercel/og` from the logo and tokens instead of hand-made
- [ ] Real session schedule (day, time, location) for `/join` and the site footer, this was also a gap in the newsletter issues
- [ ] **WhatsApp link** for `/join` (confirm this still applies)
- [x] Instagram link: the @joka_meditates handle is live again as of 2026-08-25 (earlier drafts dropped it because the account was disabled; that is no longer true). Linked in the footer and `/join`.

### 11.1 Intake and processing workflow

- Owner drops raw files into `assets-inbox/`; the agent scans them (vision read), tags content, renames to the README conventions, compresses, and moves final files into `public/` subfolders. Nothing in `assets-inbox/` is ever referenced by the site directly.
- Compression: originals stay untouched in `assets-inbox/`; `-web` derivatives follow the README rules (under 400KB, width under 2000px, `-web` suffix). Decorative graphics render at low opacity (10-25%), `aria-hidden`, lazy-loaded.
- Every published asset gets an entry in `CREDITS.md` (source, license, date) and either suggested alt text in `ASSETS.md` or a decorative `aria-hidden` marking.

### 11.2 Sourcing better assets when the club does not have one

- Allowed open-license sources: Unsplash/Pexels (photos), Lucide (icons), unDraw/Open Peeps (illustrations), SVGRepo with a per-asset license check. Every fetch logged in `CREDITS.md`.
- Prefer WebP/AVIF derivatives for photos; PNG is fine for the existing line-art and watercolor sets.

---

## 12. Rollout plan

1. **Phase 1:** Port the design system (§7), migrate the four existing issues into the database, ship `/issues` and `/issues/[slug]`. This alone gets the "return visit" mechanic live.
2. **Phase 2:** Organizer login and admin publishing flow. Once this ships, issue publishing stops depending on a developer entirely.
3. **Phase 3:** Core pages, `/about`, `/practice` + sub-pages, `/events`, `/team`, `/join`.
4. **Phase 4:** Mascot, homepage 3D, and the audio-reactive mandala visualizer (§9.8), the delight layer, deliberately last so they never block a functioning site. The 2D mandala may pull forward into Phase 3 alongside `/practice` since it is canvas-only and cheap.

## 13. Open decisions

- Confirm the exact Supabase schema for `issues.content`, structured JSON (safer, more portable) vs. MDX (more flexible for one-off interactive widgets like a new issue's unique breathing pattern). Recommend JSON with a small set of reusable block types, given every issue so far reuses the same handful of component patterns.
- Confirm whether `/practice/chakras` and `/practice/yoga-poses` are static content pages or should also pull from the database, static is simpler and there's no evidence yet that this content changes often.
- Confirm session schedule details before `/join` and the footer can be finalized.
- Mandala visualizer placement: decided 2026-08-25, `/practice/mandala` page only, no home widget.
- Mandala scope: ship 2D only, or 2D now and the 3D react-three-fiber version in Phase 4.
- Mandala presets: which drone frequencies ship, and whether microphone input ships at launch or later.

---

*This document assumes the coding agent has full context from `AGENTS.md`/`CLAUDE.md` for coding conventions and prior decisions. This PRD is the product spec; the agent file is the working-style spec. Keep them in sync as decisions get made during the build.*
