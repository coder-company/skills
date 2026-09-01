---
name: trace-code-history
description: Explain why code, a configuration, an architecture, or a workaround exists by tracing repository history and durable decision records, labeling each conclusion as recorded, behavioral constraint, inference, unknown, or superseded, and testing whether the reason still applies. Use when the user asks why was this built this way, does this constraint still apply, who added this and why, or what would removing this undo. Do not use to explain how the code works today; use explain-the-system.
---

# Trace code history

Establish what the code does now, then find why it took that shape from sources created near the decision, label each conclusion by the strength of its evidence, and test whether the original reason still holds before saying what a change would undo.

## Route first

- The question is how it works, not why: `explain-the-system`.
- The question is whether removing it would break something today: `prove-the-blast-radius` for the hinge facts, after this skill establishes the recorded reason.
- The user wants the answer recorded durably: put it in the repository's existing decision location only if one exists and the user asks.

## Separate how from why

First establish current behavior from callers, data flow, tests, and, when cheap, a run. Then investigate why. Current behavior does not prove intent: a comment can be stale, a commit message can describe the change without the decision, and a pattern can be an accident.

## Build the evidence chain

Search proportionally, starting with the cheapest:

1. `git log -S'<distinctive token>' --oneline` and `git log --follow -p -- <path>` to find the introducing and materially changing commits; `git blame` only as a pointer to those commits.
2. The commit messages, linked issues or PRs (`gh pr view <n>` when the message references one), and review threads.
3. ADRs, design documents, specifications, and migration notes in the repository.
4. Tests and compatibility fixtures added with the change; they state what the author needed to remain true.
5. Dependency versions, platform constraints, and incident references near the commit date.
6. Current callers that still rely on the behavior.

Prefer sources created near the decision, then check whether later evidence superseded them. Cite exact commits, files, lines, and issues that exist in the current environment. Never infer motivation from a pattern alone or present a plausible story as recorded intent.

## Classify each conclusion

Attach one label to every claim:

- **Recorded decision:** a durable source states the rationale and scope.
- **Behavioral constraint:** tests, callers, or runtime evidence prove what must remain even though the rationale is missing.
- **Historical inference:** several sources support a likely explanation without stating it.
- **Unknown:** the evidence does not establish why.
- **Superseded:** the original reason is recorded and later changes removed or replaced the constraint.

## Test whether the reason still applies

Trace the original constraint to the present: is the dependency or platform version still pinned; do external consumers still use the contract; does the failure the workaround prevented still reproduce; did a migration or redesign remove the boundary; does a later decision explicitly replace this one?

Absence of a local caller does not prove a public contract unused. Absence of a current failure does not prove a guard obsolete. When a safe bounded check settles the question (run the old failing case, query the consumer), run it; otherwise state the remaining uncertainty and the evidence that would remove the constraint.

## Stop signals

- You are writing "this was probably added because": label it inference or find the source.
- `git blame` gave you a name and you stopped: open the commit and what it references.
- The commit message describes the change but not the reason: keep following the linked issue or the tests it added.
- You are about to say the constraint no longer applies without a check: run one or say untested.

## Shortcuts that fail

- "The comment explains it": comments outlive the constraint they describe and are edited less than the code.
- "Blame says who, that's the why": blame names the last formatter run or the person who moved the file.
- "No caller uses it, so the reason is gone": the caller is in another repository or a persisted format.
- "It looks like a hack, so it's safe to remove": the hack is holding back a reproducible failure nobody documented; reproduce before removing.

## Report

Lead with the current answer in one or two sentences. Then: what the code does now; the recorded decision or strongest evidence with exact citations; each claim's label; whether the constraint still applies and the check that established it (or "untested"); and the consequence of changing it. If the evidence does not establish why, say "Unknown: <what was searched>" rather than supplying a story.

## Critical failures

- A rationale presented as recorded that no cited source states.
- A claim without a label, or an inference labeled as a recorded decision.
- "No longer applies" asserted without a check or an "untested" marker.
- Blame output used as a conclusion rather than a pointer.
- A history document created in the repository without the user asking.
