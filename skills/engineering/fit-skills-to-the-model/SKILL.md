---
name: fit-skills-to-the-model
description: Refit a skill collection to the frontier models running it, removing text written for an older model's failures and adding what current model guides call for, one evidenced hunk at a time. Use when asked to "optimize my skills for Astra and Fable", "audit skills for the new model", "remove prompt cruft", or why a skill makes the agent over-plan or ask permission. Do not use to create a skill from a failure; use write-a-skill. Do not use for request code or model IDs; use the migration guide.
---

# Fit skills to the model

Change skill text only where a current vendor guide, the text's provenance, or a rerun case shows it was written for a model that no longer runs it. Every hunk names the pattern it removes or the behavior it adds, and its evidence. Length alone is never the reason.

## Route first

- A new skill from an observed failure, or a change to what a skill does: `write-a-skill`.
- A finished task with reworks and no mechanism chosen: `capture-the-lesson`.
- Request code (model IDs, effort or reasoning settings, sampling parameters, forced tool choice, cache headers): the provider's migration guide. Touch skill text only if the request names it.

## Read the current guides, not memory

Fetch each target model's vendor guide before classifying a line; guidance and effort semantics change every release. `references/model-guides.md` holds the guide URLs, the published snippets in ASCII, the overlap between vendors, and the date each page was checked. When a page has changed since then, the page wins and the reference is updated in the same change.

Name every target model in the report; no hunk may fix GPT-6 Astra by breaking Claude Fable 5.1, or the reverse.

## Inventory and provenance

Descriptions load into every session and may carry calibrated urgency for routing; bodies load on trigger; references load when linked. Cases, verifiers, and hooks can assert the wording you are about to remove.

For each line you propose to change, read its history with `git log -S "<text>"`: which commit added it, for which model, and what failure it patched. A line whose failure still reproduces on a target stays. A line whose failure names a retired model, or no failure, is a candidate.

## Classify each line

Ask of each instruction: could the model already know this?

- Keep context: audience, environment facts, tool contracts, the quality bar, hard judgment calls, and the reason behind each constraint. Context is never cruft.
- Test constraints: restatements of trained defaults, behavior the model now does unprompted, workarounds for failures the target no longer has.

Exact commands belong where one sequence is safe; goals and checks belong where several implementations are correct.

## Remove what the models outgrew

Both guides mark these harmful on current models; grep signals are in the reference:

- Pressure language on behavior text (`MUST`, `NEVER`, `CRITICAL`) and hedges on requirements (`try to`, `if possible`).
- Step choreography for judgment tasks; prohibition runs with no stated reason.
- Anti-narration and anti-formatting rules. Claude Fable 5.1 already under-narrates and under-formats, so these strip what the reader wanted.
- Numeric output caps and update cadences. Remove the whole pattern, not one limb.
- Fossils: pinned model names, "now" and "no longer", incident IDs, date conditionals.
- Descriptions that grew one synonym per missed trigger.
- Text duplicated between SKILL.md and references that has drifted.

Rewrite over delete when the instruction still has a live purpose. State the rule once, where the decision happens, with its reason.

## Add what the models now need

Fitting runs both directions. Both vendors publish snippets for the same gaps: act on authorized work instead of asking, and finish it; user instructions outrank a skill; hold scope to the request and report extras instead of doing them; size tests to the change; plain prose over stock phrases and contrastive framing; delegate parallel work; write final messages a reader without the transcript can follow. Add a fit only where a case or transcript shows the gap, not as a preamble on every skill. Single-vendor fits are listed in the reference.

Where the models pull apart, write the conditional rule. "Use lists when the items are parallel" serves both; "never use bullets" serves neither.

## Verify before keeping a change

1. Run `node scripts/check-skills.mjs`. Fix structure before behavior.
2. Grep cases, verifiers, hooks, and READMEs for the exact text removed; update each match in the same hunk.
3. Rerun the affected skill's cases against a frozen baseline copy on each target harness, one skill at a time. If a cut loses, re-add the rule in its minimal form, not the paragraph.
4. Record model, harness, repetitions, and result per case, or "unrun".

## Stop signals

- You are deleting a line because the file is long: find the pattern or keep the line.
- A removed phrase appears in a case or verifier: update both or keep the text.
- A hunk helps one target and hurts the other: write the conditional form or drop it.

## Shortcuts that fail

- "Shorter is better for new models": a shortening pass deletes the highest-value words first, the context and reasons. Classify, then cut patterns.
- "Add the vendor's autonomy block everywhere": it also makes an interactive skill stop asking about ambiguity. Add it where a case shows early stopping.
- "The model still needs this guardrail": that test keeps everything. Ask for provenance and a reproducing failure.
- "I know these models, skip the guide": level names, defaults, and failure modes changed between releases. Cite the fetched page.

## Report

Lead with the target models and the guide pages fetched, with dates. Then one entry per finding: location, quoted evidence, pattern, why obsolete or missing for the named model, confidence (high when the fetched guide documents it, medium for observed behavior, low for idiom dating, which is flagged not edited), and action (remove, rewrite with replacement, move, add, flag). Then the diff, one hunk per finding, and the evaluation record per case or "unrun". Null result: "No dated patterns found for [models]: the skill text is current, and nothing was changed."

## Critical failures

- A line deleted with length as the only stated reason.
- Context, a tool contract, or a constraint's reason removed.
- A finding with no fetched guide, provenance, or rerun case behind it.
- Pressure language or a single-model booster added to behavior text.
- Evaluation results reported that did not run.
