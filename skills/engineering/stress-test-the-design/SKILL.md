---
name: stress-test-the-design
description: Subject a design, plan, or architectural decision to adversarial review against a fixed rubric, with independent reviewers where available, and sort findings into act on, consider, and dismissed with reasons. Use when the user says poke holes in this, what am I missing, tear this apart, or before committing to an expensive-to-reverse shape. Do not use on existing code; use review-the-diff. Do not use for missing requirements; use sharpen-requirements.
---

# Stress-test the design

Attack the design along fixed lines of inquiry, gather findings from reviewers who did not author it, then decide as the lead which findings change the design and which do not, and say why for each. The output is a shorter list of decisions, not a longer list of worries.

## Route first

- The artifact is code, a diff, or a PR: `review-the-diff`.
- The gaps are missing requirements rather than design weaknesses: `sharpen-requirements`.
- A finding turns on an empirical question (will the library do X, does the latency fit): `check-the-premise` settles it; do not debate it.
- The design should be compared against alternatives rather than attacked: `run-parallel-candidates`.

## Fix the rubric

Write the lines of inquiry before reading the design closely. Use these and add domain-specific ones the task demands:

1. **Failure paths:** what happens on timeout, partial write, duplicate delivery, invalid input, dependency outage, concurrent actors. Which of these does the design address explicitly, and which are silent?
2. **Invariants:** what must always be true, where is each enforced, and what single change would break it unnoticed?
3. **Boundaries and ownership:** which module owns each decision; where does one component need to know another's internals; which interface would change if the storage, transport, or vendor changed?
4. **Migration and reversibility:** how does the system reach this design from the current state, what runs in the intermediate state, and how is the change undone?
5. **Load and limits:** the largest input, fan-out, or rate the design claims to handle, and what evidence supports the claim.
6. **Security and trust:** where untrusted data enters, what is validated at that edge, what authority each component holds.
7. **Operability:** how a failure would be noticed, diagnosed, and repaired in production; what is logged and measured.
8. **Simplicity:** what the design would lose if each component were removed; which components exist for a hypothetical requirement.

Each reviewer gets the same rubric and the same artifact. Do not tell reviewers which parts you doubt.

## Gather findings

Run the review yourself against every rubric line. Then, where the harness allows, dispatch two or three independent reviewers (see `dispatch-subagents`), preferring different model families when the harness exposes them, each with the rubric and this return format:

```
FINDING: <one line>
RUBRIC: <line number>
SEVERITY: blocks | should-fix | minor
EVIDENCE: <the passage, diagram element, or absence in the design that supports it>
SUGGESTION: <the smallest change that resolves it, or "none">
```

Reviewers who find nothing under a rubric line write "No finding" for it. Reviewers do not praise, restate the design, or grade style.

## Judge as the lead

Merge findings by rubric line. Agreement across independent reviewers is high signal; a finding raised by one reviewer is not wrong for being alone, but requires your own check against the design.

Sort every finding into exactly one bucket:

- **Act on:** the design changes. State the change. Cap this list at five; if you have more, the design has a structural problem to name at the top rather than five patches.
- **Consider:** real but not decisive now; record the trigger that would promote it to act on.
- **Dismissed:** state the concrete reason (the design already handles it at a named place; the scenario is out of scope by the stated requirement; the cost exceeds the risk with the numbers). A dismissal without a reason is a deferred finding, not a dismissal.

Rules for the judgment:

- A hypothetical failure with no path from current requirements is minor unless it is irreversible.
- "I would have done it differently" is not a finding.
- A finding that depends on a fact you can observe (run a query, read a limit, time an operation) gets observed before it is bucketed.
- Severity comes from consequence and likelihood, never from how many reviewers raised it.

## Stop signals

- You are reading the design for weaknesses before writing the rubric: write the rubric first.
- The act-on list has more than five items: stop and name the structural problem.
- A dismissal reads "unlikely" or "not a concern" with no pointer: add the reason or move it to consider.
- You are bucketing a finding that a two-minute experiment would settle: run the experiment.
- A reviewer's finding quotes a passage that is not in the design: discard the finding and note the reviewer error.

## Shortcuts that fail

- "I'll review it myself; reviewers add noise": the author's blind spots are exactly what a single pass reproduces. One independent read changes the finding set.
- "Report everything so nothing is missed": an unsorted list transfers the judgment to the reader and buries the two findings that matter.
- "Dismiss what I already thought about": thought about is not addressed at a named place. Point to where the design handles it.
- "Weight findings by how many reviewers raised them": correlated reviewers share blind spots; independent agreement is signal, but a lone finding with evidence still stands.
- "Treat every finding as a design change": the design becomes a patchwork of defenses against hypotheticals.

## Report

Return, in order: the rubric used; the act-on list with the change for each; the consider list with promotion triggers; the dismissed list with reasons; the agreement map (which findings multiple reviewers raised independently); experiments you ran to settle findings, with results. If nothing survived to act on, say "Act on: none" and keep the dismissed list so the reader can trust the verdict.

## Critical failures

- Rubric written or altered after reading reviewer findings.
- Reviewers told which parts of the design to attack or what the author suspects.
- A dismissed finding with no concrete reason.
- An act-on list longer than five without a named structural problem.
- A finding bucketed on speculation when an available observation would have settled it.
