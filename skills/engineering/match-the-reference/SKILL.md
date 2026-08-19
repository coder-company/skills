---
name: match-the-reference
description: Make a rendered interface match a supplied screenshot, design, or known-good implementation through repeated visual comparison. Use when visual parity is an explicit requirement. Do not use for open-ended redesign or subjective visual improvement without a reference.
---

# Match the reference

## Normalize the comparison

Identify the exact reference, viewport, scale, fonts, content, theme, platform, interaction state, and animation time. Reproduce those conditions before editing. If they cannot match, name the mismatch and avoid false pixel-level claims.

## Compare in layers

Capture the current rendering. Fix differences in this order:

1. viewport and outer geometry;
2. layout, spacing, and alignment;
3. typography and wrapping;
4. color, borders, shadows, and icons;
5. interaction, responsive, focus, loading, empty, and error states.

Use overlays, image diffs, measurements, or stable visual tests when available. Do not tune arbitrary CSS values from memory or judge parity from separate unscaled images.

## Protect behavior

Preserve accessibility, semantics, supported responsiveness, and interaction. Do not hide content, hardcode fixture text, rasterize live UI, or disable a valid state to improve one screenshot.

Repeat capture and comparison until remaining differences are measured and explained. Report tested states and any reference condition you could not reproduce.
