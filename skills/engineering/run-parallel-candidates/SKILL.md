---
name: run-parallel-candidates
description: Produce several independent attempts at one design or artifact, judge them against a rubric fixed in advance, pick a base, and graft the stronger parts of the others into it. Use when a first attempt would lock in an expensive shape (public interface, data model, core algorithm) or the user says try a few approaches, bake-off, or compare designs. Do not use for routine changes with a repository pattern, or for empirical questions; use check-the-premise.
---

# Run parallel candidates

Write the brief and the rubric before any candidate exists, run the candidates independently, judge them against the rubric, then build the result from one base plus grafts. The value comes from independence: candidates must not see each other, and the judge must not see the author's preference.

## Route first

- The question is empirical ("does the proxy stream?"): `check-the-premise`.
- A single design question with a cheap experiment: `prototype-the-question`.
- The work is ordinary and a repository pattern exists: implement it with `keep-code-boring`.
- The candidates are executing planned tasks, not competing: `dispatch-subagents`.

## Frame the contest

Write these to a file before dispatching:

1. **Brief:** the problem, the constraints copied verbatim from the requirement, the interfaces the result must consume and produce, and what is out of scope. The brief must be complete enough that a divergence between candidates reflects design choice, not missing information.
2. **Rubric:** three to six criteria a judge can check from the artifact alone. Each criterion names how it is checked (a command, a reading, a count). Examples: "passes `npm test -- auth`", "public surface has at most three exported functions", "no caller needs to know the storage backend", "handles the empty and the duplicate case named in the brief". Do not include "elegant", "clean", or "idiomatic".
3. **Output paths:** one directory, branch, or file per candidate. Candidates writing to a shared path is shared mutable state and destroys the comparison.
4. **Count:** two to four candidates. More than four is rarely read end to end.

Keep the rubric out of the candidate briefs. Candidates that optimize for the rubric converge on it and hide the design space you wanted to explore.

Give each candidate the same brief. To widen the spread, add one contrasting constraint per candidate ("minimize new types", "optimize for the read path", "no new dependency") and record which candidate got which.

## Run the candidates

Dispatch all candidates in the same turn, each in isolation, with the return contract from `dispatch-subagents`. Do not answer a candidate's question with information the others did not get; if the brief was incomplete, stop the wave, fix the brief, and rerun all candidates.

Run the rubric's executable checks against every candidate before reading any of them, and record the results.

## Judge

Read every candidate end to end before ranking. Skimming several candidates selects the one whose surface looks most familiar, which is the bias the contest exists to defeat.

Where the harness allows, have an independent judge (a fresh agent, ideally a different model) score the candidates against the rubric without seeing which candidate you favor. Compare its ranking with yours; disagreement is information, not noise.

Fill a table: one row per criterion, one column per candidate, each cell the observed result with a pointer (test output, file:line, count). Then decide:

- **Convergence:** candidates arrived at the same shape. Ship the consensus; the decision was not as open as it looked.
- **One clear winner:** use it as the base.
- **Wide divergence with no winner:** the brief was underspecified. Name the missing decision, resolve it (or ask the user if it is a product call), rewrite the brief, and rerun. Do not average the candidates.

## Graft

From the base, pull in specific parts of the others that scored higher on a criterion: a data structure, an error path, a test, a naming scheme. Each graft is a change to the base with the criterion it improves stated. Re-run the rubric checks after grafting; a graft that breaks the base's passing criterion is rejected.

Delete the losing candidates' artifacts from the working tree. Keep them only in a scratch location if the user wants the record.

## Stop signals

- You are reading candidate two while already leaning toward candidate one: finish reading all candidates, then fill the table before deciding.
- The rubric contains an adjective with no check: rewrite it or remove it.
- Two candidates wrote to the same path: the results are contaminated. Rerun with separate paths.
- You are about to merge halves of two candidates without a base: pick a base first.
- The candidates disagree on what the brief meant: fix the brief, not the candidates.

## Shortcuts that fail

- "I'll just pick the one that looks right": the contest then cost N times a single attempt and produced one attempt's judgment.
- "Sharing the rubric with candidates makes them better": it makes them the same; the spread is what you paid for.
- "Let candidates see each other's work to save time": independence is the mechanism; contamination turns three candidates into one.
- "Divergence means I should blend them": blended designs inherit the conflicting assumptions of both. Divergence means an undecided requirement.
- "Skip the executable checks; I can tell by reading": readers systematically miss the failing edge case the brief named.

## Report

Include the brief, the rubric with its checks, the results table with pointers, the chosen base and why, each graft with the criterion it improved, the post-graft check results, and the location of the final artifact. If the outcome was convergence, say so and name what that implies about the decision. If the outcome was a rerun, name the requirement that was missing.

## Critical failures

- Rubric written or changed after reading the candidates.
- A candidate seeing another candidate's output before judging.
- Ranking issued without reading every candidate end to end or without running the executable rubric checks.
- Blending candidates without a designated base.
- Losing candidates' code left in the delivered change.
