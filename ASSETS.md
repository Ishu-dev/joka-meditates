# Joka Meditates · Asset Inventory

Scanned 2026-08-24. Raw owner uploads land in `assets-inbox/`; processed site assets live in `public/` per the README rules. This file tracks what exists, its state, and what still needs work.

## Graphics (`graphics/`, 16MB, to be copied into `public/graphics/`)

| Folder | Count | Contents | Style | State |
|---|---|---|---|---|
| lotus | 17 | Watercolor lotus flowers, 1080x1080 | Soft pink watercolor | Good; `-web` versions exist for most, `lotus-04` and `lotus-11` generated 2026-08-24 |
| mandalas | 8 | Circular line-art mandalas | Black ink on white | Good; `mandala-01` and `mandala-06` have `-web` versions |
| chakras | 7 | One per chakra for the 7-Chakra Alignment Guide | Colored line art with soft wash, Sanskrit-named | Decided 2026-08-25: this is the set for `/practice/chakras` |
| lilypads | 5 | Watercolor lotus leaves | Green watercolor | Good; `lilypad-02` has `-web` version |
| flowers | 2 | Cherry blossom style flower | Watercolor | Good; `-web` version exists |
| yoga-poses | 14 | One per pose for the 14-Pose Yoga Guide | Black line art, halftone accents | Good, all under limits |
| misc | 17 | Meditation figures, swan, koi, brain, dragonfly, book, hands-sun, watercolor washes | Mixed | Good; `-web` versions exist for the oversized ones |

### ~~Open naming decision: chakras~~ Resolved

The folder previously held two competing sets. Owner kept the Sanskrit-named set; the stray line-art file is preserved in `assets-inbox/chakra-lineart-stray-01.png`.

### Files over the 400KB README limit

13 originals exceed 400KB. All except `lotus-04` and `lotus-11` already had `-web` derivatives; those two were generated (720px, ~220KB each) on 2026-08-24. Keep originals for print/future use, ship only `-web` versions.

## Brand (`brand/`, to be copied into `public/brand/`)

| File | Size | Notes |
|---|---|---|
| logo-black-text.png | 166K | Transparent background, dark green text + pink lotus, for light mode, 500x500, alpha verified |
| logo-white-text.png | 165K | Transparent background, white text + pink lotus, for dark mode, 500x500, alpha verified |

Resolved 2026-08-25: owner uploaded transparent-background exports (removebg), replacing the earlier baked-background versions. Originals (transparent and baked) preserved in `assets-inbox/`. Ready for the two-`<img>` `data-theme` switch in the NavBar.

## Chakras: decision made

Owner picked the Sanskrit-named colored set (`01_muladhara.png` through `07_sahasrara.png`, 7 files, line art with soft wash). The stray `chakra-01.png` from the old black line-art set was moved to `assets-inbox/chakra-lineart-stray-01.png` for safekeeping.

## Team headshots (`team/`, 668KB, to be copied into `public/team/`)

| File | Dimensions | Notes |
|---|---|---|
| ishu.jpeg | 1220x1253 | Near-square |
| sai-krishna.jpeg | 995x1581 | Renamed from `sai krishna.jpeg` (space in filename broke URL conventions) |
| ruchir.jpeg | 916x1073 | |
| meghana.jpeg | 1280x960 | Landscape, needs crop |
| harsha.jpeg | 720x1280 | Portrait |
| chandana.jpeg | 588x1280 | Tall portrait |

Action before publishing to `/team`: crop all six to one aspect ratio (recommend 4:5 portrait), serve via `next/image`.

## Still missing (owner, not code work)

1. Event photos (Yoga Day etc.) into `/public/events`
2. Guided meditation audio into `/public/audio`, if `/practice` gets a player
3. `favicon.ico` (og-image can be generated with `@vercel/og` from the logo and tokens)
4. Real WhatsApp community link and session schedule

## Decorative usage rules (from README, enforced in build)

- Max one decorative graphic per page section
- Low opacity background accents (10-25%), never over text
- `aria-hidden="true"`, empty `alt=""`, `loading="lazy"`
- SVG breathing animations stay the primary interactive focal points
