---
name: show-your-sources
description: Answer a technical question, comparison, or verification request from primary sources retrieved during the investigation, with a citation beside every external claim and confidence labeled. Use when the user says look up, verify, compare, what does the spec say, is this still true, or the answer depends on a version or date. Do not use for questions the repository answers; read the code. Do not use for social signals; use find-network-signals.
---

# Show your sources

Define the decision the answer serves, retrieve the strongest available source for each claim during this investigation, label what is confirmed versus derived versus unknown, and lead with the answer. A remembered source is not a citation.

## Route first

- The fact lives in the repository or its pinned dependencies: read the code or the dependency's source at the pinned version; cite the file.
- The question is empirical about this system: `check-the-premise` or `prototype-the-question`.
- The user wants what a network of people is saying: `find-network-signals`.

## Define the question

Extract the decision, fact, or comparison the user needs and the constraints that bound it: version, date, platform, language, deployment environment, budget, compatibility. Resolve cheap ambiguity from the repository and context before asking.

Use live sources when the fact can change, when the user asks for verification or links, or when the answer depends on a current version. State the date or version boundary whenever it affects the answer.

## Use the strongest available evidence

In order of preference:

1. Specifications, standards, and official documentation for the relevant version.
2. Maintainer-owned source code, release notes, changelogs, and issue trackers.
3. First-party APIs, datasets, benchmarks, and product pages.
4. Original papers or authoritative institutional guidance.
5. Reputable secondary analysis, only when primary evidence is unavailable or insufficient, labeled as secondary.

Search snippets, AI-generated summaries, and unsourced posts are leads, not sources. For comparisons, apply the same criteria and evidence standard to every option; do not cite a vendor's claim for one option and a benchmark for another.

Cite only a source you opened in this investigation. Never construct a plausible URL or attach a remembered citation. If browsing is unavailable, label memory-derived claims "unverified, may be stale" and say what would verify them.

## Investigate proportionally

- Narrow factual question: one authoritative source, then answer.
- Consequential choice (meaningful time or money, a security or data boundary, a compatibility dependency): multiple independent primary sources, including evidence beyond the vendor's own claims.
- Conflicting sources: explain the disagreement and prefer the source that owns the behavior for the relevant version.
- Repository-specific question: combine external evidence with the actual local code and configuration.

Delegate parallel research tracks (see `dispatch-subagents`) only when independent tracks materially reduce time or cross-check a high-stakes conclusion; verify each returned citation yourself.

## Keep claims traceable

Attach a citation next to each claim that depends on external evidence, linking to the exact page, section, release, file, or paper. Mark each claim as: confirmed fact; conclusion derived from several facts; recommendation given the user's constraints; or unknown. Quote sparingly and preserve version qualifiers, limitations, and uncertainty.

## Stop signals

- You are typing a URL you have not opened: open it or drop the citation.
- The answer depends on a version and you have not named which: name it.
- One option's evidence is a marketing page and another's is a benchmark: equalize or say so.
- You are about to recommend from sources that do not settle the question: lead with "not settled" and name the resolving evidence.

## Shortcuts that fail

- "I remember the docs say": the docs changed two versions ago; the remembered behavior is the bug you are about to introduce.
- "The first search result is fine": the snippet summarizes a blog that summarized the docs incorrectly.
- "Compare the feature tables": each vendor's table is written to win; use the same criteria against primary evidence.
- "Give a recommendation anyway": a forced recommendation from noncommittal sources reads as confident and is wrong half the time.

## Report

Lead with the answer or recommendation (or "Not settled by available evidence"). Then the evidence needed to evaluate it, each claim labeled and cited; the meaningful tradeoffs; version or date boundaries; unknowns and the experiment or source that would resolve them; and the next action when one follows. Return findings in the conversation unless the user asked for a file or the repository requires a durable decision record; then place it in the established location and link it from the source of truth.

## Critical failures

- A citation to a source not opened during the investigation, or a constructed URL.
- A memory-derived claim presented as verified.
- A comparison using different evidence standards across options.
- A recommendation issued when the sources do not settle the question, without saying so.
- Version or date dependence omitted where it changes the answer.
