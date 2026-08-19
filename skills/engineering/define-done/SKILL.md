---
name: define-done
description: Turn a vague requested outcome into observable completion conditions before implementation. Use when a change spans multiple components or carries material product risk and the request provides no behavior, observation point, or threshold that can distinguish done from plausible-looking work.
---

# Define done

## Find the missing observation

Extract what the user wants to become true. Check the repository, current behavior, issue, screenshots, logs, tests, and surrounding conversation for an existing observation point before asking questions.

An observation point is where the result can be seen or measured, such as:

- exact CLI output and exit status;
- HTTP response and persisted state;
- visible UI behavior before and after reload;
- latency percentile for a named route and workload;
- emitted event, file, database row, or external side effect;
- compatibility behavior for a named consumer;
- absence of a reproduced failure under stated conditions.

Do not replace a missing observation with an implementation list. "Add caching" is an approach. "Reduce p99 for search from 900 ms to under 300 ms for the recorded workload without stale results" is a completion condition.

## Scale the definition to the task

Use this skill when ambiguity could make substantial work appear complete without solving the intended problem.

Do not interrupt a small task whose boundary is already obvious. A request to fix a focused failing test or add a named option with exact output does not need a separate definition exercise. Proceed and use the existing check.

Do not demand numeric thresholds for qualitative product choices when a concrete reference, interaction, or approved example is the real standard.

## Write falsifiable conditions

For each material outcome, state:

1. **Initial condition:** The state or input that exposes the need.
2. **Action:** What the user or system does.
3. **Observable result:** What can be inspected at the boundary.
4. **Failure result:** What would show the work is not done.
5. **Constraints:** Behavior, compatibility, safety, performance, or scope that must remain.

Prefer the smallest set of conditions that would catch a convincing wrong implementation. Avoid restating every implementation detail as acceptance criteria.

If a threshold is missing and different values would produce materially different work, obtain or measure it before implementation. If the repository already establishes the threshold, cite that evidence instead of asking the user.

## Separate facts from decisions

Mark:

- conditions derived from explicit user or repository requirements;
- measurements observed from the current system;
- assumptions that still need confirmation;
- product decisions that cannot be inferred from technical evidence.

Do not invent traffic levels, user preferences, compatibility promises, or performance targets to make the definition look complete.

## Hand the conditions to implementation

Keep the result close to the work. Use the current task, issue, or repository's established specification location. Do not create a planning document merely because this skill ran.

Implementation can begin when the conditions make a wrong result detectable and no unresolved decision would change the design materially. Report the conditions and the exact checks that can prove them.
