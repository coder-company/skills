---
name: observe-the-runtime
description: Diagnose a live intermittent symptom through targeted runtime instrumentation. Use for leaks, idle CPU, races, stalls, event-order bugs, or glitches that require observing a running process. Do not use when an existing captured profile or trace is the primary evidence.
---

# Observe the runtime

## Make the symptom observable

Define the event or resource that changes incorrectly and the smallest workload that can trigger it. Add temporary instrumentation at boundaries that distinguish competing explanations. Prefer counters, timestamps, identities, lifecycle transitions, and bounded samples over broad debug logging.

Protect secrets and personal data. Keep overhead low enough that instrumentation does not create or hide the symptom. State when timing perturbation remains a risk.

## Run a discriminating experiment

Capture a healthy and failing run when possible. Correlate events by stable identifiers and compare ordering, ownership, resource growth, or latency. Change one variable at a time.

Do not name a cause from a code path that merely could run. Tie the claim to an observed transition or absence.

## Remove diagnostic residue

After diagnosis or repair, remove temporary instrumentation unless it has durable operational value, bounded cost, and an owner. Re-run the real symptom boundary and report what was observed, what remains inferred, and what could not be reproduced.
