---
name: generate-chaitanya-essay-images
description: Generate, finish, integrate, and verify OG images, heroes, and icons specifically for Chaitanya Mishra's Essays using its fixed scientific-macro visual language, exact palette, deterministic Geist typography, and social-crawler checks. Use only for image work intended for essays.chaitanya.science or a direct continuation of that image system. Do not generalize this aesthetic to other blogs, factual diagrams, screenshots, or unrelated brands.
---

# Generate Chaitanya's essay images

Create images for [Chaitanya Mishra's Essays](https://essays.chaitanya.science). Follow this system exactly. Do not reinterpret it as a generic editorial style.

Create a physical visual metaphor from the essay's central tension. Do not illustrate the title literally.

Read `references/visual-system.md` before generating an image.

## Resolve the image idea

Read the essay first. Write one sentence naming the tension the image must carry. Wait until the essay has a stable title and central idea.

Choose one physical system that can express the tension: paper fibers, capillary ink, glass vessels, optical instruments, material cross-sections, threads, lenses, brass pins, or scientific specimens.

Reject generic writing imagery: desks, laptops, notebooks, pens, lightbulbs, question marks, floating documents, and people staring into space.

## Generate the background

Use the available image-generation tool. Generate a photographic background without text.

For an OG image:

- Compose for 1200 by 630.
- Keep the left 46 percent dark and quiet for typography.
- Weight the physical subject to the lower right and far right.
- Use teal-black shadows, warm paper or ivory materials, restrained brass, glass, and one turquoise `#20808D` signal.
- Preserve believable material texture.
- Avoid logos, letters, numbers, watermarks, fake UI, neon, purple, glow, graphic gradients, centered subjects, and symmetrical layouts.

Generate at the tool's supported landscape size. Crop and finish locally. Do not ask the image model to render the title.

For the homepage hero, use a 3:1 crop with quiet negative space, visible paper fibers or a material cross-section, and one turquoise focal detail. Do not add embedded text.

For the site icon, preserve the existing warm-paper folded-page `C` on `#0B6963`. Test it at 16, 32, 180, 192, and 512 pixels. Do not replace the mark with a generated letter or unrelated symbol.

## Add deterministic type

Overlay the title, `Chaitanya Mishra`, and `essays.chaitanya.science` with Geist. Keep the title left aligned and within the quiet field.

Use `scripts/render-og.sh` when ImageMagick is available:

```sh
scripts/render-og.sh \
  generated-background.png \
  og-essay-slug.jpg \
  "Essay title" \
  "Chaitanya Mishra" \
  "essays.chaitanya.science" \
  /path/to/font.otf
```

The script creates a 1200 by 630 sRGB JPEG. Keep the generated source beside other source assets and serve the optimized JPEG from a stable public URL.

## Integrate social metadata

Add absolute URLs for `og:image`, `og:image:url`, `og:image:secure_url`, `twitter:image`, and `twitter:image:src`. Declare `image/jpeg`, width `1200`, and height `630`.

Use a cache-busting filename when replacing an image. Do not overwrite a year-long immutable URL and expect social crawlers to refresh it.

## Verify delivery

Inspect the final raster. Check title accuracy, crop, left-side contrast, object placement, and file size.

Request the live image with WhatsApp, Facebook, and Twitter crawler user agents. Each request must return `200`, the expected image content type, and nonzero bytes. Check the live page metadata with the same user agents.

Inspect desktop and mobile rendering when the image also appears in the page. Do not declare completion from the local file alone.

The live site is the visual reference: [essays.chaitanya.science](https://essays.chaitanya.science).
