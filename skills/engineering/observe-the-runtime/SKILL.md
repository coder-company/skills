---
name: observe-the-runtime
description: Diagnose an intermittent live symptom with targeted, removable instrumentation on a running process, comparing healthy and failing runs. Use when chasing memory growth, idle CPU, races, stalls, event-order bugs, or anything the user describes as sometimes, randomly, or only in staging. Do not use when a captured profile is the primary evidence; use read-a-runtime-trace. Do not use for deterministic failures; use find-the-bug.
---

# Observe the runtime

Make the symptom observable with the smallest instrumentation that distinguishes the competing explanations, capture a healthy run and a failing run, correlate them by stable identifiers, and name the cause only from a transition you observed. Remove every probe afterward.

## Route first

- A captured artifact already exists and can answer the question: `read-a-runtime-trace`.
- The failure is deterministic: `find-the-bug`.
- The instrumentation reveals a shared-state race to fix: `untangle-shared-state`.
- The symptom is a throughput or latency number rather than a wrong transition: `measure-the-bottleneck`.

## Define the symptom as an observable

Write the symptom as a measurable transition or trend: "RSS grows 5 MB per minute at idle", "the handler for event B runs before event A's completion callback", "CPU stays above 30% with no requests for more than 60 s". Then write the smallest workload or wait that should trigger it.

Improve the reproduction rate before instrumenting: loop the trigger, add load, fix the seed, shrink timeouts, or run longer. A symptom that appears in one run out of two is diagnosable; one in a hundred needs a better trigger first. Record the rate.

Identify the two or three competing explanations and, for each, the observation that would confirm or rule it out. Instrument for those observations only.

## Instrument for discrimination

Prefer, in order: existing metrics and logs at higher verbosity; runtime inspection tools (heap snapshot, thread dump, `strace`, `perf`, async hooks, event-loop lag monitors, database slow-query logs); then added code.

When adding code:

- tag every probe with one unique marker (for example `[PROBE-7f3a]`) so it can be found and removed with a search;
- emit counters, timestamps, identities (request ID, object ID, thread ID), and lifecycle transitions (created, acquired, released, closed), not free-form dumps;
- bound the volume: sample, rate-limit, or cap, so instrumentation does not itself cause the memory growth or timing change you are chasing;
- never log secrets, tokens, or personal data; log their identifiers or hashes.

Record every probe location in your notes as you add it.

State the perturbation risk: instrumentation changes timing. If a race disappears when observed, that is evidence about the race window, not proof it is gone.

## Capture and compare

Capture at least one healthy run and one failing run under the same workload. Correlate events by identifier and compare:

- ordering (which event preceded which, per identifier);
- ownership (who acquired and who released; what was never released);
- growth (which counter or heap category rose across the failing window and stayed flat in the healthy one);
- latency (where the gap opened).

For memory: force a collection, snapshot, run the workload, force a collection, snapshot again; the objects retained across the second collection are the lead, and their retaining path is the evidence.

For hangs: capture handles and a stack sample before interrupting the process; after interruption the state is gone.

Change one variable between runs. Name a cause only when you observed the transition (or its absence) that the explanation predicts. A code path that could run is a hypothesis, not a finding.

## Remove the residue

After diagnosis or fix, search for the marker and delete every probe, temporary flag, and fixture. Keep instrumentation only if it has durable operational value, bounded cost, an owner, and the user agrees; then rewrite it as a maintained metric or log, not as the probe.

Rerun the real symptom trigger with the fix in place, at least as many iterations as the original failure rate needed, and report the observed rate.

## Stop signals

- You are adding logging everywhere rather than at the points that separate hypotheses: name the hypotheses first.
- The reproduction rate is below what your run budget can catch: improve the trigger before instrumenting.
- A probe logs a value that could be a secret or personal data: change it to an identifier.
- The symptom vanished when instrumented: record it as a timing-sensitive lead; do not report it as fixed.
- You are about to name a cause from reading code alone: find the observed transition or label it inference.

## Shortcuts that fail

- "Add debug logs and read the output": untargeted logs bury the transition that matters and often change the timing that produced it.
- "It didn't reproduce, so it's fixed": an intermittent symptom that fails to appear in a few runs has not been shown anything; rerun at the original rate's scale.
- "It's a race, add a sleep": a sleep moves the window; the ownership problem remains and returns under different load.
- "Read the code path, that must be it": several paths could produce the symptom; only the observed order says which did.
- "Leave the probes in, they're useful": untended probes become the next leak or log flood; convert or remove.

## Report

State the symptom as an observable with its reproduction rate before and after; the competing explanations and what observation was chosen for each; probes added with locations and markers, and their removal confirmed by search; the healthy versus failing comparison with the correlated events or growth that discriminated; the cause with the observed transition, marked observed versus inferred; and what could not be reproduced. If the diagnosis is inconclusive, list what was ruled out and the next discriminating capture.

## Critical failures

- A cause named without an observed transition or growth that supports it.
- Probes left in the code after the task without an owner and the user's agreement.
- Secrets or personal data written to logs or captures.
- "Fixed" claimed after fewer runs than the original failure rate required.
- Instrumentation heavy enough to create or mask the symptom, without the perturbation being reported.
