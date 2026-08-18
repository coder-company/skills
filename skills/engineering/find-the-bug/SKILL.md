---
name: find-the-bug
description: Diagnose bugs, crashes, incorrect output, flaky behavior, and performance regressions with evidence before changing code. Use when a user asks to debug, diagnose, investigate, find a root cause, or fix a reported failure. Scale the investigation to the problem, protect secrets, distinguish symptoms from causes, and verify any fix at the real failure boundary.
---

# Debug from evidence

## Match the work to the request

- If the user asks for diagnosis, find and explain the cause. Do not implement a fix unless the request includes one.
- If the user asks for a fix, diagnose, implement the narrowest complete correction, and verify it.
- If the user reports a simple, local failure with an obvious executable check, keep the loop short.
- If the failure is intermittent, distributed, destructive, production-only, or security-sensitive, use the full investigation process.

Do not turn routine debugging into a ceremony. Do not skip evidence because a theory sounds plausible.

## Protect the system and its data

- Redact credentials, tokens, cookies, personal data, and private payloads from commands and excerpts.
- Prefer read-only inspection before mutation.
- Do not reproduce destructive behavior against production data.
- Ask for new access or authority only after safe in-scope checks cannot answer the question.
- Keep temporary instrumentation narrow, identifiable, and removable.

## Establish the failure

1. Restate the observed behavior and the expected behavior in testable terms.
2. Identify the smallest command or interaction that exercises the actual failure boundary.
3. Run it and capture the relevant signal: assertion, error, output difference, trace, metric, or visible behavior.
4. Repeat it enough to understand whether the result is deterministic.

Prefer an existing test, focused CLI command, API request, browser interaction, trace replay, benchmark, or minimal harness. For an intermittent bug, improve the reproduction rate with repetition, a fixed seed, controlled time, concurrency, or stress.

If direct reproduction is unavailable, use the strongest evidence that exists, state the limitation, and continue with static tracing or historical artifacts. Do not falsely claim reproduction. A missing local reproduction is a constraint, not an automatic reason to stop.

## Narrow the cause

Trace the path that owns the symptom:

1. Follow inputs, state changes, calls, errors, and outputs across the failing boundary.
2. Compare working and failing cases when both exist.
3. Reduce the scenario while preserving the failure.
4. Form the smallest set of plausible explanations that the evidence supports.
5. Test the cheapest discriminating prediction first. Change one variable at a time.

Use a ranked hypothesis list only when several credible causes remain. For a small local bug, one evidence-backed hypothesis can be enough. Label inference as inference, and discard a theory when its prediction fails.

For performance failures, measure before optimizing. Capture a baseline, inspect the relevant profiler, query plan, allocation data, or timing breakdown, and compare the same workload after the change.

## Fix the owning boundary

When authorized to fix the bug:

1. Add or identify a regression check at the narrowest boundary that can express the real failure.
2. Confirm that the check fails for the reported behavior when practical.
3. Correct the cause without unrelated cleanup or speculative fallback paths.
4. Confirm that the regression check passes.
5. Re-run the original reproduction or closest boundary-level check.

Do not add a shallow test that cannot catch the real bug. If the architecture provides no useful test seam, verify with the best available boundary and report the missing seam as a maintainability risk.

## Clean up and report

- Remove temporary logs, probes, fixtures, flags, and debug-only code.
- Run nearby checks that could expose collateral regressions.
- Report the observed cause, the evidence that distinguishes it from alternatives, the change made if any, and the verification command or interaction.
- Separate confirmed facts, remaining uncertainty, and deliberately deferred work.

Never describe a theory as the root cause unless the evidence links it to the symptom.
