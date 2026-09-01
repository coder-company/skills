---
name: generate-chaitanya-essay-images
description: Generate, process, integrate, and verify hand-drawn ink essay illustrations, OG cards, favicons, and inline SVG diagrams for Chaitanya Mishra's site chaitanya.gg, using its fixed sketch language, warm-paper palette, Switzer typography, and crawler checks. Use when asked for an essay image, hero, OG card, thumbnail, icon, or diagram for chaitanya.gg or its essays repository. Do not use this aesthetic for other sites, brands, or projects.
---

# Generate Chaitanya's essay images

Read the essay, name the one deep message the sketch must carry, generate a single ink drawing with the fixed style block, process it into the site's exact assets, wire the social metadata with a cache-busted URL, and verify the live image with real crawler user agents. Read `references/visual-system.md` before generating.

## Route first

- The image is for any site other than [chaitanya.gg](https://chaitanya.gg): do not use this system; ask what visual language applies.
- The essay text is not final: wait for a stable title and central idea; the sketch encodes the message.
- The request is an architecture or system diagram inside an essay: use the inline SVG rules below, never a raster.

## Resolve the image idea

Read the essay. Write one sentence naming the deep message (not the topic) the sketch must carry. Choose one physical scene that argues it: hands, seeds, kites, paper planes, footprints, houses, ladders, masks, arrows, everyday objects behaving slightly impossibly. The best sketches state a quiet argument (the string matters more than the kite; the shadow works while the mask performs) and reward a second look from someone who has read the essay.

Reject generic writing imagery: desks, laptops, notebooks as subject, lightbulbs, question marks, floating documents, people staring into space.

## Generate the sketch

Use the available image-generation tool at 16:9 (1:1 for icons). Anchor every prompt with this block:

> Minimal hand-drawn ink sketch on clean warm off-white paper (#faf9f6). A single fine black ink line drawing with delicate cross-hatching, enormous negative space, calm and precise like a premium product illustration. No text, no border, no color other than black ink on paper.

Then describe the one scene and state the deep message inside the prompt. Weight the subject low or to one side and leave most of the paper empty; titles overlay top-left, so the upper-left quadrant stays quiet.

## Process into site assets

Sources stay in the agent assets folder. Processed files live in the Essays repository:

- `public/images/art/{slug}-wide.webp`: essay hero at 1360x640. Trim to the ink bounds, resize to fit, pad with the paper color to the full canvas. Never center-crop the hero.
- `public/images/art/{slug}.webp`: 352x352 homepage thumbnail (center crop acceptable).
- OG card via `scripts/render-og.sh <art.png> <out.jpg> "Title"`: sketch as the field, Switzer Semibold title top-left in ink `#1c1b18`, `chaitanya.gg` small bottom-left in `#71706a`, 1200x630 sRGB JPEG, cache-busted filename `og-{slug}-YYYYMMDD.jpg`.

All rendered text uses Switzer (Fontshare): Semibold for titles, Medium for the domain line. Never render titles inside the generated image; overlay them deterministically.

The site icon is one hand-drawn ink open circle (an unfinished loop) on paper; all favicon sizes (16, 32, 48, 180, 192, 512) derive from that mark. Do not replace it with a letter or new symbol.

## Inline SVG diagrams

Architecture and system diagrams are hand-written inline SVG wrapped as:

```html
<figure class="essay-diagram">
  <div class="diagram-scroll"><svg viewBox="..." role="img" aria-label="...">...</svg></div>
  <figcaption>One sentence stating what the diagram argues.</figcaption>
</figure>
```

Color only with the site's CSS variables (`var(--ink)`, `var(--muted)`, `var(--border)`, `var(--border-strong)`, `var(--surface)`) or `currentColor` so light, dark, and OLED themes all work; never hard-code hex fills. The site breaks `.essay-diagram` out of the reading column to `min(94vw, 64rem)` and gives the SVG `min-width: 56rem` with horizontal scroll on small screens; design at that width. Labels in Switzer (`var(--font)`), identifiers and states in Geist Mono (`var(--mono)`), generous spacing. Each diagram argues one thing (a lifecycle, a layering, a contrast).

## Integrate social metadata

Set absolute chaitanya.gg URLs for `og:image`, `og:image:url`, `og:image:secure_url`, `twitter:image`, and `twitter:image:src`; declare `image/jpeg`, width `1200`, height `630`. When replacing an image, use a new cache-busted filename; never overwrite an immutable URL and expect crawlers to refresh.

## Verify delivery

Inspect the final raster: title accuracy, crop, upper-left quiet zone, legibility at thumbnail size, file size. Request the live image and the live page with WhatsApp, Facebook, and Twitter crawler user agents; each must return `200`, the expected content type, and nonzero bytes. Inspect desktop and mobile rendering where the image appears. The local file alone does not establish completion.

## Stop signals

- The prompt describes the essay's topic rather than its message: rewrite the one-sentence message first.
- The scene is a desk, laptop, lightbulb, or floating document: pick a physical metaphor.
- You are about to center-crop the hero: trim, fit, and pad instead.
- The OG filename matches an existing one: cache-bust it.
- A diagram has a hex fill: replace with a CSS variable.

## Shortcuts that fail

- "Render the title into the image": generated text is misspelled and un-editable; overlay it with the script.
- "Reuse the old OG URL": social crawlers cache by URL and keep showing the old card for weeks.
- "Check the file locally and ship": the live crawler request fails on content type or redirect, and previews show nothing.
- "Draw the diagram as a raster": it breaks in dark and OLED themes and cannot be edited later.

## Report

State the deep-message sentence, the scene chosen, the prompt used, asset paths written with dimensions, the OG filename, metadata tags set, and the crawler verification results per user agent (status, content type, bytes) for image and page. If any verification was not run, say "Not verified: <check>".

## Critical failures

- Hero center-cropped or title rendered inside the generated image.
- OG image replaced at an existing URL without cache-busting.
- Completion claimed without live crawler checks for all three user agents.
- A raster used for an architecture diagram, or hard-coded hex fills in an SVG.
- The aesthetic applied to a destination other than chaitanya.gg.
