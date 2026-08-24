# Joka Meditates Assets Directory

This directory contains public assets for the **Joka Meditates** website. To keep the project clean, lightweight, and maintainable, please follow the guidelines below when modifying or adding files.

## 📂 Folder Structure

```text
/public
  /brand        -> Circular logo, favicon, and social media/OpenGraph preview images
  /graphics     -> Curated decorative graphic assets sorted into subfolders:
    /lotus      -> Lotus flower graphics
    /chakras    -> Chakra symbols and illustrations
    /lilypads   -> Lilypad and leaf illustrations
    /mandalas   -> Mandala patterns (circular and hexagonal)
    /yoga-poses -> Yoga poses line art/illustrations
    /flowers    -> Other flower graphics (e.g. cherry blossoms)
    /misc       -> Uncategorized assets (brain illustrations, swans, dragonflies, watercolor washes)
  /team         -> Member headshots (ishu.jpg, sai.jpg, etc.)
  /events       -> Photos from events (e.g., Yoga Day photos)
  /audio        -> Guided meditation audios (.mp3 / .wav)
```

## 🏷️ Naming Conventions

All decorative graphic filenames **must** follow these rules:
- **Lowercase-kebab-case** only.
- Prefix with the category folder name, followed by a two-digit index number.
  - E.g., `lotus-01.png`, `chakra-03.png`, `yoga-pose-07.png`, `mandala-02.png`, `lilypad-01.png`, `flower-01.png`, `misc-brain-01.png`.
- Flagged/compressed web versions should use the `-web` suffix before the extension (e.g., `lotus-03-web.png`).

## ⚡ Performance & Optimization Guidelines

Before adding any graphic:
1. **File Size Limit**: Keep all graphics **under 400KB**.
2. **Dimension Limit**: Keep widths **under 2000px** (preferably 1080px for square graphics).
3. **Web-Optimized Versions**: If a high-quality original is needed but exceeds 400KB, keep the original file and create a compressed version with a `-web` suffix (using PNG quantization/WebP conversion). Use the `-web` version on the live site.

## 🎨 Graphic Restraint & Usage Rules

Restraint is the core design philosophy of this website. Do not clutter pages with decorative elements.

1. **Limit**: At most **one** decorative graphic per page section.
2. **Styling**: Render as a background accent at **low opacity (10-25%)** so they never overlap or interfere with text readability.
3. **Accessibility**: All decorative assets must include `aria-hidden="true"`, empty `alt=""`, and use `loading="lazy"` (along with `next/image` where possible).
4. **Interactive centerpieces**: The SVG breathing animations in the heroes must remain the primary interactive focal points; do not replace them with static raster graphics.
