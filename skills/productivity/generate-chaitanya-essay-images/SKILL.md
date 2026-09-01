---
name: generate-chaitanya-essay-images
description: Generate, finish, integrate, and verify hand-drawn ink essay illustrations, OG cards, and icons for Chaitanya Mishra's personal site chaitanya.gg using its fixed sketch visual language, warm-paper palette, Switzer typography, and social-crawler checks. Use only for image work intended for chaitanya.gg or a direct continuation of that image system. Do not generalize this aesthetic to other blogs, factual diagrams, screenshots, or unrelated brands.
---

# Generate Chaitanya's essay images

Create images for [chaitanya.gg](https://chaitanya.gg), the personal site of Chaitanya Mishra. Follow this system exactly. Do not reinterpret it as a generic editorial style.

Every essay gets one hand-drawn ink illustration whose physical metaphor carries the essay's deepest idea. The image must reward a second look: someone who has read the essay should see more in it than someone who has not.

Read `references/visual-system.md` before generating an image.

## Resolve the image idea

Read the essay first. Write one sentence naming the deep message the sketch must carry — not the topic, the message. Wait until the essay has a stable title and central idea.

Choose one physical scene that expresses it: hands, seeds, kites, paper planes, footprints, houses, ladders, masks, arrows, everyday physical objects behaving slightly impossibly. The best sketches state a quiet argument (the string matters more than the kite; the shadow works while the mask performs).

Reject generic writing imagery: desks, laptops, notebooks-as-subject, lightbulbs, question marks, floating documents, and people staring into space.

## Generate the sketch

Use the available image-generation tool at 16:9 (1:1 for icons). Anchor every prompt with this style block:

> Minimal hand-drawn ink sketch on clean warm off-white paper (#faf9f6). A single fine black ink line drawing with delicate cross-hatching, enormous negative space, calm and precise like a premium product illustration. No text, no border, no color other than black ink on paper.

Then describe the one scene and name the deep message inside the prompt so the composition serves it. Keep the subject weighted low or to one side; leave most of the paper empty.

## Process into site assets

Sources stay in the agent assets folder. Processed files live in the Essays repo:

- `public/images/art/{slug}-wide.webp` — essay page hero at 1360×640. Trim the sketch to its ink bounds first, then resize to fit and pad with the paper color to the full canvas. Never center-crop the hero; cropping cuts the drawing off on the page.
- `public/images/art/{slug}.webp` — 352×352 homepage thumbnail (center crop is fine at this size).
- OG cards via `scripts/render-og-v3.sh <art.png> <out.jpg> "Title"` — the sketch as the field, Switzer Semibold title top-left in ink `#1c1b18`, `chaitanya.gg` small bottom-left in `#71706a`, 1200×630 sRGB JPEG, cache-busted filename (`og-{slug}-YYYYMMDD.jpg`).

Titles sit top-left, so compositions must keep the upper-left quadrant quiet.

The site icon is a single hand-drawn ink open circle (an unfinished loop) on paper. All favicon sizes (16, 32, 48, 180, 192, 512) derive from the same mark. Do not replace it with a letter or a new symbol.

## Technical diagrams (SVG, not sketches)

Architecture and system diagrams inside essays or thesis documents are hand-written inline SVG, never generated raster images. Wrap each one as:

```html
<figure class="essay-diagram">
  <div class="diagram-scroll"><svg viewBox="..." role="img" aria-label="...">...</svg></div>
  <figcaption>One sentence stating what the diagram argues.</figcaption>
</figure>
```

Rules that make them render correctly on chaitanya.gg:

- Color only with the site's CSS variables (`var(--ink)`, `var(--muted)`, `var(--border)`, `var(--border-strong)`, `var(--surface)`) or `currentColor` so all three themes (light, dark, OLED) work. Never hard-code hex fills.
- The site CSS breaks `.essay-diagram` out of the reading column to `min(94vw, 64rem)` and gives the inner SVG `min-width: 56rem` with horizontal scroll on small screens. Design at that width; do not squeeze a wide system into the text column.
- Typography inside SVGs: Switzer (`var(--font)`) for labels, Geist Mono (`var(--mono)`) for identifiers and states, generous spacing. Diagrams need breathing room; when in doubt, make it bigger and emptier.
- Each diagram must argue one thing (a lifecycle, a layering, a contrast), not decorate.

## Typography

All rendered text uses Switzer (Fontshare, free): Semibold for titles, Medium for the domain line. Never render titles inside the generated image; overlay them deterministically.

## Integrate social metadata

Add absolute URLs on chaitanya.gg for `og:image`, `og:image:url`, `og:image:secure_url`, `twitter:image`, and `twitter:image:src`. Declare `image/jpeg`, width `1200`, height `630`.

Use a cache-busting filename when replacing an image. Do not overwrite an immutable URL and expect social crawlers to refresh it.

## Verify delivery

Inspect the final raster: title accuracy, crop, upper-left quiet zone, sketch legibility at thumbnail size, file size.

Request the live image with WhatsApp, Facebook, and Twitter crawler user agents. Each request must return `200`, the expected content type, and nonzero bytes. Check the live page metadata with the same user agents.

Inspect desktop and mobile rendering where the image appears in the page. Do not declare completion from the local file alone.

The live site is the visual reference: [chaitanya.gg](https://chaitanya.gg).
