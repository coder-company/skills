---
name: define-done
description: Turn a vague outcome into a few falsifiable completion conditions, each with an observation point that separates done from plausible work, before implementation. Use when a request spans components or carries risk and gives no behavior, check, or threshold, or the user says make it work, make it faster, or improve this. Do not use for a focused failing test or a named option with exact output. Do not use to choose which behavior to build; use sharpen-requirements.
---

# Define done

Find where the result can be observed, write the fewest conditions that would catch a convincing wrong implementation, separate what is known from what is assumed, and hand the conditions to the work in the place the repository already uses. Do not create a document because this skill ran.

## Route first

- The gap is which behavior to build, not how to tell it is built: `sharpen-requirements`.
- The check exists (a failing test, a named command with expected output): implement; skip this skill.
- The conditions are set and the work needs ordering: `write-a-plan`.
- The run will be autonomous: the conditions become the stop predicate in `work-unattended`.

## Find the missing observation

Extract what the user wants to become true. Before asking anything, check the repository, current behavior, issue, screenshots, logs, tests, and the conversation for an existing observation point.

An observation point is where the result can be seen or measured:

- exact CLI output and exit status;
- HTTP response and the persisted state after it;
- visible UI behavior before and after reload;
- a latency percentile for a named route and recorded workload;
- an emitted event, file, row, or external side effect;
- compatibility behavior for a named consumer;
- absence of a reproduced failure under stated conditions, at a stated repetition count.

Do not replace a missing observation with an implementation list. "Add caching" is an approach; "p99 for `/search` on the recorded workload drops from 900 ms to under 300 ms with no stale results" is a condition.

## Scale to the task

Apply this skill when ambiguity could let substantial work look complete without solving the problem. Do not interrupt a small task with a self-evident boundary. Do not demand numeric thresholds for qualitative product choices when an approved reference, interaction, or example is the real standard; name that reference as the condition.

## Write falsifiable conditions

For each material outcome:

1. **Initial condition:** the state or input that exposes the need.
2. **Action:** what the user or system does.
3. **Observable result:** what can be inspected at the boundary, with the exact command or interaction.
4. **Failure result:** what would show the work is not done.
5. **Constraints:** behavior, compatibility, safety, performance, or scope that must remain unchanged.

Keep the set to the smallest number that would catch a convincing wrong implementation; three to six conditions cover most features. Do not restate every implementation detail as a criterion.

If a threshold is missing and different values would change the work, obtain it: measure the current system, cite where the repository already sets it, or ask the user with a recommended value and the measurement behind it. Do not invent traffic levels, targets, or compatibility promises.

## Separate facts from decisions

Mark each condition and threshold as one of:

- derived from an explicit user or repository requirement (cite it);
- measured from the current system (give the command and result);
- an assumption awaiting confirmation (state the default you will take and whether it is reversible);
- a product decision no technical evidence can settle (ask, with a recommendation).

## Hand the conditions to the work

Put the conditions where the work lives: the task description, the issue, the PR description, or the repository's established specification location. Implementation can begin when the conditions make a wrong result detectable and no unresolved decision would change the design materially.

## Stop signals

- Your condition names an approach ("use a queue"): rewrite it as what is observed.
- You are asking the user for a number you could measure: measure it.
- The condition list is longer than eight: cut to the ones that catch a wrong implementation.
- A condition has no failure result: it cannot be falsified; rewrite or drop it.
- You are opening a new planning document: put the conditions where the work already is.

## Shortcuts that fail

- "Tests pass means done": the tests were written for the previous behavior; the new requirement needs its own observation.
- "I'll know it when I see it": without a written failure result, plausible work passes and the gap surfaces after delivery.
- "Pick a reasonable threshold": an invented number becomes a requirement nobody set; measure or ask.
- "List every acceptance criterion": a long list hides the two that would catch a wrong implementation and takes longer to verify than to build.
- "Skip this, the request is clear": if two implementers would produce different observable results, it is not clear.

## Report

Return the conditions (initial condition, action, observable result with exact check, failure result, constraints), each marked derived, measured, assumed, or decision; the observation points found in the repository with pointers; thresholds with their source; and open decisions with recommendations. If the task needed no definition, say "Existing check suffices: <check>" and proceed.

## Critical failures

- A condition stated as an approach or implementation step rather than an observation.
- A threshold invented instead of measured, cited, or asked.
- A condition without a failure result.
- Implementation started while an open decision would materially change the design.
- A planning document created without the user asking for one.
