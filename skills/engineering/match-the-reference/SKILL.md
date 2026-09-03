---
name: match-the-reference
description: Make a rendered interface match a supplied screenshot, design, or known-good implementation by reproducing the reference conditions and closing measured differences layer by layer. Use when the user says make it look like this, match the design, pixel-perfect, or supplies an image to match. Do not use for open-ended redesign without a reference. Do not use for non-visual behavior; use verify-real-behavior.
---

# Match the reference

Reproduce the reference's rendering conditions before editing anything, capture the current state under those conditions, then fix differences from the outside in (geometry, layout, type, color, states), measuring after each pass. Parity is a measured difference, not an impression from two images at different scales.

## Route first

- The reference is a behavior, not a look (a flow, a response): `verify-real-behavior`.
- The task is choosing between visual variants: `prototype-the-question` with the variants behind one switcher.
- Matching requires changing the markup's semantics or accessibility: the reference does not authorize that. Finish the layers that do not need it and report the conflict first.

## Normalize the conditions

Record from the reference and reproduce in the target:

- viewport width and height, device pixel ratio, zoom;
- fonts (family, weights loaded, fallback behavior) and whether the reference used system fonts;
- content: the same text, images, counts, and lengths, or fixture data that matches exactly;
- theme, color scheme, locale, direction;
- interaction state (hover, focus, open menu, scroll position) and animation time (settled or at a specific frame);
- browser or renderer and version when it affects rendering.

If a condition cannot be matched (a proprietary font, a different renderer), record it and exclude that difference from parity claims. Do not report pixel parity for a comparison whose conditions differ.

## Capture and diff

Capture the current rendering under the normalized conditions with a repeatable command (a screenshot script, a visual test runner, a browser automation call). Save the reference and the capture at the same pixel dimensions.

Measure the difference: an image diff with a pixel or percentage count, an overlay at 50% opacity, or per-element bounding-box measurements from the DOM. Record the number. This is your baseline.

Do not judge from two images side by side at different sizes or from memory of the reference.

## Fix in layers

Work outside in; a later layer's differences are meaningless until the earlier ones are within tolerance:

1. **Viewport and outer geometry:** page width, container size, margins, scroll extents.
2. **Layout:** grid and flex structure, spacing, alignment, wrapping points, element order.
3. **Typography:** family, size, weight, line height, letter spacing, wrapping, truncation.
4. **Surface:** color, borders, radii, shadows, icons, images, opacity.
5. **States:** hover, focus, active, disabled, loading, empty, error, responsive breakpoints the reference defines.

After each layer, recapture and re-measure. Change values with evidence (measured from the reference, read from the design tokens, or inspected in the known-good implementation), not by guessing and re-shooting. When the target and reference share a design system, prefer the token over a literal.

## Protect what the reference does not show

Keep semantics, accessibility attributes, focus order, keyboard behavior, and supported responsive ranges. Do not hide content, hardcode fixture text into production, rasterize live UI into an image, disable a state, or remove an element to make one screenshot match. If parity requires any of these, finish every other layer and report the conflict as the first line.

## Stop signals

- You are editing CSS before capturing a baseline: capture first.
- The two images being compared have different dimensions or scale: renormalize.
- You are tuning a value by repeated guessing: measure it from the reference instead.
- A fix on a later layer is needed while an earlier layer still differs: go back to the earlier layer.
- A change would remove an accessible name, focus target, or responsive behavior: leave that difference open and report it.

## Shortcuts that fail

- "Looks the same to me": unmeasured comparison misses 2 px offsets, wrong weights, and off-by-one colors that users notice as "something is off."
- "Match the desktop screenshot only": the reference implies the states and breakpoints the product supports; the one screenshot is a sample.
- "Nudge the padding until it lines up": hand-tuned literals drift from the design system and break at the next content change.
- "Hardcode the fixture text so the wrapping matches": production content differs; the wrapping rule is what must match.
- "Screenshot the reference at whatever size": scale differences make every measurement wrong.

## Report

State the normalized conditions and any that could not be matched; the baseline difference measurement with the method; each layer's changes with the evidence for each value and the measurement after; the final measurement per tested state; states and breakpoints tested; and the differences that remain with their explanation. If parity conflicts with accessibility or semantics, report the conflict as the first line.

## Critical failures

- Parity claimed without a measured comparison under matched conditions.
- Content hidden, state disabled, text hardcoded, or UI rasterized to make a screenshot match.
- Accessibility or semantics degraded to reach visual parity.
- Values tuned by guessing rather than measured from the reference or its tokens.
- Only one state or breakpoint tested when the reference defines more.
