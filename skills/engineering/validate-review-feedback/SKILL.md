---
name: validate-review-feedback
description: Evaluate a code review comment before changing code by classifying it (fact, convention, preference, scope, question), reproducing factual claims with the smallest discriminating check, and responding from evidence. Use when a reviewer, bot, or pasted comment says a change is wrong, leaks, is slow, or breaks a contract, or the user says address the review comments. Do not use to write the review; use review-the-diff. Do not use for CI failures; use fix-the-ci.
---

# Validate review feedback

Classify each comment, reproduce any factual claim before editing, apply binding conventions without argument, and respond with the observation that settled each item. Neither confidence nor politeness is evidence, in either direction.

## Route first

- The request is to review the change: `review-the-diff`.
- The comment is a failing check, not a person: `fix-the-ci`.
- A confirmed defect needs its cause found: `find-the-bug`, then fix with `keep-code-boring`.
- Comments expose an unresolved product or architecture decision: stop that group and surface the decision.

## Classify each comment

Assign the strongest class that fits, in this order:

- **Verifiable fact:** a claim about behavior, types, security, performance, compatibility, or a repository contract. A claim that the change violates a contract is a fact to reproduce, not a convention to apply.
- **Established convention:** a rule in repository instructions, lint configuration, or accepted local patterns.
- **Preference:** naming, phrasing, or style with no correctness consequence.
- **Scope request:** new behavior beyond correcting the reviewed change.
- **Question:** a request for explanation.

Confidence, length, citations, reviewer seniority, bot origin, and terseness are not evidence. A one-line comment can name a real leak; a detailed one can cite behavior the pinned version does not have.

## Reproduce factual claims before editing

Use the smallest check that can settle the claim: a focused failing test; a type error against the repository's configured compiler; a query log or profile; a minimal call through the affected runtime path; the pinned dependency's source or versioned documentation; an existing contract, ADR, or compatibility test.

Trace the conditions under which the claimed consequence occurs. Do not change code because the comment sounds plausible; do not dismiss it because proof was omitted. If the claim cannot be reproduced safely, record what was checked, what remains uncertain, and the smallest missing observation. Uncertainty is not agreement or rejection.

## Respond from evidence

- **Confirmed fact:** fix the owning cause, add or keep a regression check, cite the evidence in one line.
- **Incorrect fact:** leave the code unchanged; reply with the check or source that disproves the claim.
- **Convention:** apply it when binding and in scope; do not litigate established style.
- **Preference:** apply when harmless, or state the tradeoff without manufacturing a correctness argument.
- **Scope request:** separate it from the defect; obtain authority when it materially expands the task.
- **Question:** answer it; edit code only if the answer exposes a defect.

Do not perform agreement ("great catch") or disagreement. State the observation.

## Handle the review as a set

Group comments by owning boundary before editing. A fix for one can invalidate another, and several comments often share one cause. After resolving a group, rerun the evidence for each claim in it.

## Stop signals

- You are editing because the reviewer sounded certain: reproduce first.
- You are rejecting because the reviewer gave no proof: reproduce first.
- Two comments point at the same function from different angles: they may share a cause; group them.
- A comment asks for a feature: it is scope, not a defect; separate it.

## Shortcuts that fail

- "Apply everything, it's faster than arguing": an incorrect factual claim applied introduces the bug the reviewer imagined.
- "The bot is usually wrong, ignore it": bots find the null dereference on line 412 that nobody read.
- "Senior reviewer, must be right": seniority does not know which version of the library is pinned.
- "Fix each comment in order": the third fix reverts the first when they share a cause.

## Report

For each comment, one line: confirmed and fixed (with the proving check and its output); disproved (with the evidence); applied convention or preference; separated scope request; or unresolved (with the missing observation). For factual claims, include the concrete observation (failing assertion, query count, type error, versioned source line), not "checked". If no comment required a change, say so with the evidence per comment.

## Critical failures

- Code changed for a factual claim that was not reproduced.
- A factual claim dismissed without a check or source.
- A binding repository convention argued against instead of applied.
- A scope request implemented as part of the fix without authority.
- A resolution reported without the concrete observation that settled it.
