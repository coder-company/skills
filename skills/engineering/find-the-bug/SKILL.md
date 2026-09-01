---
name: find-the-bug
description: Diagnose bugs, crashes, wrong output, flaky behavior, and regressions from a reproduced failure and a ledger of tested hypotheses before changing code, then fix the owning cause and verify at the real boundary. Use when the user says debug, diagnose, why is this failing, root cause, or reports a symptom. Do not use for performance-only complaints; use measure-the-bottleneck. Do not use when reproduction needs live capture; use observe-the-runtime.
---

# Find the bug

Reproduce the failure with a command whose output shows the user's exact symptom, then form hypotheses and test the cheapest discriminating one, recording each result in a ledger so no test is repeated. Fix the boundary that owns the cause, prove the fix against the original reproduction, and search for the same cause elsewhere.

## Route first

- The complaint is slowness or memory with no wrong output: `measure-the-bottleneck`.
- The failure will not reproduce and needs runtime capture: `observe-the-runtime`.
- Two fixes have failed without narrowing the cause: `break-the-loop`.
- A captured profile or trace is the primary evidence: `read-a-runtime-trace`.
- The user asked only for a diagnosis: stop after the cause is proven; do not implement.

## Match the depth to the failure

- A local, deterministic failure with an existing test or command: run the test, read the failing code, fix the owning expression, rerun the test, and report in a few lines. No ledger, hypothesis list, phases, or plan.
- An intermittent, distributed, production-only, destructive, or security-sensitive failure: use every section below and keep the ledger from the first step.

## Protect the system

- Redact credentials, tokens, cookies, personal data, and private payloads from every command and excerpt.
- Prefer read-only inspection before mutation. Never reproduce destructive behavior against production data.
- Tag every temporary probe, log line, fixture, and flag with one unique marker (for example `[DBG-4c1e]`) and record its location as you add it, so cleanup is a search. Leave pre-existing and user-owned changes untouched.
- Ask for new access only after safe in-scope checks cannot answer the question.

## Establish a reproduction

1. Restate observed and expected behavior in testable terms.
2. Find the smallest command or interaction that exercises the failing boundary: an existing test, a focused CLI call, an API request, a browser step, a replayed trace, a minimal script.
3. Run it. Capture the assertion, error, output difference, or visible behavior. The output must show the user's symptom, not a related one.
4. Run it again to learn whether it is deterministic. For intermittent failures, raise the rate with repetition, a fixed seed, controlled time, concurrency, or load before proceeding.

No reproduction, no hypothesis testing. If you catch yourself reading code to build a theory before this command exists, stop and build the command.

If direct reproduction is unavailable (production-only data, hardware you lack), use the strongest evidence that exists (logs, traces, a recorded request), state the limitation, and continue with static tracing. Do not claim reproduction you did not achieve.

## Keep the ledger

On the long path, maintain a compact record from the first hypothesis and consult it before every test:

```
observed:   <facts established, each with the command or file:line>
ruled_out:  <hypothesis> : <the check whose result falsified it>
open:       <hypotheses still live, ranked by cheapest discriminator>
next:       <the single check to run and the result that would separate the open hypotheses>
```

Do not rerun a check listed under `ruled_out` under unchanged conditions. Do not promote an `open` hypothesis to a cause without an observation that only it predicts. See `keep-execution-state` when the investigation grows long.

## Narrow the cause

- Trace the path that owns the symptom: inputs, state changes, calls, errors, outputs, across the failing boundary. Log what enters and exits each component boundary on the path when the path is unclear.
- Compare working and failing cases when both exist: a passing input, a previous revision (`git bisect` when the regression window is known), another environment.
- Reduce the scenario while preserving the failure. Take the split that cuts the most remaining possibility space.
- For failures after a restart, deploy, or upgrade, suspect state (caches, migrations, config, stale artifacts) before code.
- Form three to five plausible explanations when several remain; one is enough for a small local bug. Test the cheapest discriminating prediction first. Change one variable at a time.

After confirming a defective pattern, search from the repository root for the same sequence, copied helpers, and other callers. Separate confirmed affected sites from code that only looks similar.

## Stop after three failed fixes

If three attempted fixes have each failed or each revealed a new failure elsewhere, stop fixing. That pattern is evidence of a wrong model of the system or a design problem, not a fourth bug. Record the three attempts in the ledger, state what they jointly rule out, and either redesign the affected boundary (see `design-module-boundaries`) or report the architectural finding to the user.

## Fix the owning boundary

When authorized to fix:

1. Add or identify a regression check at the narrowest boundary that expresses the real failure. Confirm it fails for the reported behavior.
2. Correct the cause at the boundary that owns it. Do not patch the symptom at a caller when the shared function is wrong; a guard in one caller leaves its siblings broken.
3. Confirm the regression check passes and rerun the original reproduction.
4. Fix confirmed copies of the same cause in the repository unless the user limited the target or a copy crosses a public-contract, ownership, security, or migration boundary; report those instead.
5. Run nearby checks that could expose collateral regressions.

Do not add a shallow test that cannot catch the real bug. If no useful seam exists, verify at the nearest real boundary (see `verify-real-behavior`) and report the missing seam.

## Clean up

Search for your marker and remove every probe, fixture, flag, and debug path. Confirm the diff contains only the fix and its test.

## Stop signals

- You have a theory and no reproduction command: build the command.
- You are about to run a check already in `ruled_out`: state what changed, or pick another check.
- The fix is a null check, try/catch, or retry at the point where the error appears: ask what produced the bad value and fix there.
- The third fix just failed: stop and reassess the model.
- You are writing "root cause" for a hypothesis with no discriminating observation: label it inference.

## Shortcuts that fail

- "The stack trace points here, so fix here": the frame where the error surfaces is usually the consumer of a bad value produced earlier; the fix there hides the producer.
- "I'll try a change and see": an untested change with no predicted outcome produces no information when it fails and false confidence when it passes.
- "It passed once after my change, so it's fixed": for an intermittent failure, one pass is within the original failure rate; rerun at scale.
- "Reading the code is faster than reproducing": reading produces plausible theories; only the reproduction shows which one is true.
- "Add logging everywhere": untargeted logs bury the transition that matters; log at the boundaries that separate hypotheses.

## Report

For the short path: the test command, the one-line cause, the diff, and the rerun result. Otherwise state: the reproduction command and its observed output; the cause with the evidence that distinguishes it from the alternatives; the ledger's `ruled_out` list; the change made, if any, with the regression check and the rerun of the original reproduction; sibling sites searched (scope, confirmed, similar-but-safe); cleanup confirmed by marker search; and remaining uncertainty. An inconclusive result is valid: report observed, ruled out, remaining (as inference), and the single next discriminator.

## Critical failures

- A cause named without a reproduction or an observation that distinguishes it from alternatives.
- A ledger, hypothesis list, or investigation plan produced for a deterministic local failure that has a reproducing test.
- A symptom patched at the consumer while the producing boundary stays wrong.
- Continuing to attempt fixes after three failures without reassessing.
- A test added that would pass with the bug present.
- Probes, fixtures, or flags left in the change, or user-owned changes disturbed.
