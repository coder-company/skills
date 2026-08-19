---
name: validate-review-feedback
description: Evaluate inbound code review feedback before changing code. Use when a reviewer, bot, or pasted comment makes a factual claim about runtime behavior, types, security, performance, or project contracts that should be reproduced or checked against repository evidence.
---

# Validate review feedback

## Classify the feedback

For each actionable comment, distinguish:

- **Verifiable fact:** A claim about behavior, types, security, performance, compatibility, or a repository contract.
- **Established convention:** A rule in repository instructions, lint configuration, or accepted local patterns.
- **Preference:** Naming, phrasing, or style with no correctness consequence.
- **Scope request:** New behavior or work beyond correcting the reviewed change.
- **Question:** A request for explanation rather than a change.

When a comment fits more than one class, use the strongest one, in the order fact, convention, preference. A claim that a change violates a repository contract is a verifiable fact and must be reproduced, not applied as convention.

Do not treat confidence, length, citations, reviewer status, or terse wording as evidence. A short comment can identify a real leak. A detailed comment can cite behavior the pinned version does not have.

## Reproduce factual claims before editing

Use the smallest check that can settle the claim:

- a focused failing test;
- a type error against the repository's configured compiler;
- a query log or profile;
- a minimal call through the affected runtime path;
- the pinned dependency's source or authoritative versioned documentation;
- an existing contract, ADR, or compatibility test.

Trace the conditions under which the claimed consequence occurs. Do not change code merely because the comment sounds plausible. Do not dismiss a comment merely because the reviewer omitted proof.

If the claim cannot be reproduced safely, state what was checked, what remains uncertain, and the smallest missing observation. Do not convert uncertainty into agreement or rejection.

## Respond from evidence

- **Confirmed fact:** Fix the owning cause, add or preserve a regression check, and explain the evidence briefly.
- **Incorrect fact:** Keep the code unchanged and respond with the check or source that disproves the claim.
- **Convention:** Apply it when it is binding and in scope. Do not litigate cheap established style.
- **Preference:** Apply it when harmless or explain the tradeoff without manufacturing a correctness argument.
- **Scope request:** Separate it from the reviewed defect and obtain authority when it materially expands the task.
- **Question:** Answer it directly; do not edit code unless the answer exposes a defect.

Do not perform agreement. Phrases such as "great catch" are not verification. Do not reject feedback performatively either.

## Handle the review as a set

Comments can interact. A local fix for one may invalidate another or reveal that several comments share one cause. Group comments by owning boundary before editing, then rerun the evidence for each resolved claim.

Keep the review bounded. If comments expose an unresolved architectural or product decision, stop that group and surface the decision rather than arguing through every comment independently.

## Report resolution

For each comment, return one compact status:

- confirmed and fixed, with the proving check;
- disproved, with evidence;
- applied convention or preference;
- separated scope request;
- unresolved, with the missing observation.

For a factual claim, include the concrete observation that settled it: the failing assertion or runtime result before the fix, or the query count, type error, versioned source, or other discriminating evidence that disproved it. Do not replace the observation with a generic statement that the claim was reproduced or checked.
