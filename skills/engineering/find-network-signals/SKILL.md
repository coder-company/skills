---
name: find-network-signals
description: Find current, source-linked ideas moving through the public social circle around a named person, company, or community, building the circle from observed interactions and ranking posts that carry a concrete claim. Use when the user asks what a founder's circle is discussing or what signals are emerging around a named account. Do not use for a company brief, a single-account summary, or research with no seed account; use show-your-sources.
---

# Find network signals

Resolve the seed and the time window, derive the circle from observed interactions rather than from fame, collect posts that carry a claim, rank them by specificity and independent corroboration, and return a short list with direct links and an auditable methods note.

## Route first

- No seed account or community is named: `show-your-sources` for general research.
- The user wants a summary of one account's posts: summarize it; no circle is needed.
- The platform requires access you do not have: say so; do not scrape or bypass authentication.

## Define the search

Resolve the seed (verified accounts, current organization), the question, the platforms in scope, and the shortest time window that can answer the request. If the seed is ambiguous, resolve it from current public evidence before collecting.

Use public, authorized access methods only. Respect platform limits and privacy boundaries; do not expose personal data unrelated to the request. If a platform tool bills per call, estimate the cost before the first call and stop at the budget the user set.

## Build the circle from interactions

Start from the seed's verified accounts. Derive the circle from observed replies, mentions, reposts, quotes, collaborations, and recurring conversation partners within the window. Verify each identity from profiles and first-party links.

Include insiders and outsiders when both shape the conversation, with no fixed count or ratio. Do not substitute famous peers, competitors, or investors because they seem relevant; membership comes from interaction evidence. If the evidence cannot establish a circle, say so and stop, or ask whether to broaden the method.

## Collect evidence

Gather recent original posts, substantive replies, quoted commentary, and threads from the seed and the evidence-backed circle. For each, keep the URL, author, timestamp, and reported engagement. Engagement measures reach, not quality.

Discard empty reposts, promotion without a claim, congratulations, generic inspiration, and repeated announcements. Do not silently substitute another platform for an unavailable account unless the user permits cross-platform evidence.

## Rank signals

A post qualifies as a signal only if it contains at least one of: a concrete claim or prediction; a disclosed number, experiment, or result; a product, hiring, market, or technical move; a specific disagreement with a widely held view; the same specific idea appearing independently across the circle.

Rank by relevance to the question, specificity, independent corroboration, recency, and decision value. Group posts that support one idea. Separate what a source states from your inference about the pattern.

## Stop signals

- You are adding a well-known account with no observed interaction with the seed: remove it.
- A candidate signal is an announcement or vibe with no claim: drop it.
- The list has a fixed target length and you are stretching to fill it: return fewer.
- You are about to describe a pattern with no post that states it: label it inference or drop it.

## Shortcuts that fail

- "Everyone knows who's in this founder's circle": the assumed peer set is a press narrative; the interaction graph is the circle.
- "High engagement means important": reach rewards outrage and announcements, not claims.
- "Pad to ten items": items six through ten are noise the reader must sift, and they discredit the first five.
- "Summarize the mood": mood is not a signal; a specific claim with a link is.

## Report

A short numbered list. Each item: an idea-led title, one explanation, and direct links to the strongest supporting posts, with dates and reach only where they aid interpretation. Then one compact methods note: seed accounts, circle members sampled, platforms, time window, and access method. If fewer strong signals survive, return fewer; if none, write "No qualifying signals in <window>" and name the evidence gap.

## Critical failures

- A circle member included without observed interaction evidence.
- A signal with no direct link to a post that states it.
- An inferred pattern presented as something a source said.
- List padded to a target length, or an invented peer set.
- Private accounts scraped, authentication bypassed, or unrelated personal data exposed.
