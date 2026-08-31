# chaitanya.gg image system

This reference applies only to [chaitanya.gg](https://chaitanya.gg) and direct continuations of that system.

## Character

Hand-drawn ink sketches that read like a careful person thinking on paper. Each image is one physical scene carrying one deep message from the essay. Calm, precise, humane — the clean-water restraint of a premium product page, drawn by hand.

## Palette

- Warm paper: `#faf9f6`
- Ink: `#1c1b18` (black ink only; hatching may soften it)
- Muted caption gray: `#71706a` (rendered type only, never inside the sketch)

No color inside the artwork. No accent colors anywhere in the system.

## Drawing vocabulary

Fine single-line ink work with delicate cross-hatching. Hands, seeds, kites, strings, paper planes, flight paths, footprints, houses and chimneys, ladders, masks, shadows, arrows, spirals. Everyday physical things, allowed one quiet impossibility that states the essay's argument (a ladder whose rungs are papers; a shadow that works while the mask performs).

Objects keep believable weight and perspective. No fantasy machinery, no decorative texture, no backgrounds beyond the paper itself.

## Composition

- Generate at 16:9. Keep the subject weighted low or to one side; most of the paper stays empty.
- The upper-left quadrant must stay quiet: OG titles are overlaid there.
- The sketch must stay legible at a 352px square center crop (homepage thumbnail).

## Deliverables per essay

| Asset | Size | Location |
| --- | --- | --- |
| Essay hero | 1360×640 webp | `public/images/art/{slug}-wide.webp` |
| Thumbnail | 352×352 webp | `public/images/art/{slug}.webp` |
| OG card | 1200×630 jpg | `public/og-{slug}-YYYYMMDD.jpg` |

## Rendered type

Switzer only (Fontshare). OG title: Semibold, ink, top-left at +72+64 in a 760px column. Domain line: Medium 26px, muted gray, bottom-left at +72+56. Never ask the image model to render text.

## Icon

One hand-drawn ink open circle — an unfinished loop with a gap at the upper right, natural taper at the stroke ends — centered on paper. It must read at 16px. All favicon sizes derive from this one mark.
