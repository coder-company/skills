---
name: measure-the-bottleneck
description: Diagnose and improve a performance problem against a reproducible baseline by fixing the metric and workload, locating the dominant cost with a profiler, changing one cause, and comparing under matched conditions. Use when the user says this is slow, reduce memory, speed this up, or gives a numeric target. Do not use for correctness failures; use find-the-bug. Do not use to read an existing profile; use read-a-runtime-trace.
---

# Measure the bottleneck

Define the metric, capture a baseline you can rerun, find where the time or memory actually goes, change one cause, and rerun the same measurement. Reject any improvement you cannot distinguish from noise.

## Route first

- The primary evidence is a captured profile, trace, or heap snapshot: `read-a-runtime-trace`.
- The symptom is intermittent and needs live instrumentation to catch: `observe-the-runtime`.
- The "slow" report is a hang or a wrong result: `find-the-bug`.
- The target is a sustained campaign against one metric with many accepted wins: run this skill in a loop, one commit per accepted win, with the baseline re-established after each.

## Fix the metric and the workload

Write down before measuring:

- **Metric:** what the user experiences (wall time of a request, p95 latency of a route, peak RSS, throughput, startup time, bundle size). Not CPU time of a function unless that is the user's metric.
- **Workload:** the input, data size, concurrency, and sequence that exhibits the problem. Prefer a recorded real workload over a synthetic one; if synthetic, state how it differs.
- **Environment:** machine, build flags, runtime version, caches warm or cold, background load. Measure where the problem is reported when you can; a laptop number does not establish a production threshold.
- **Sampling:** warm-up runs, sample count (at least five for wall-time measurements), and the statistic you will compare (median and p95, not mean alone).
- **Target:** the threshold that counts as done, from the user or the requirement. If none exists, say so and report the improvement without claiming success.

Capture the baseline with a script or command you can rerun unchanged. Record the numbers and the variance. If run-to-run variance is larger than the improvement you expect, fix the measurement (isolate, pin CPU, increase samples) before optimizing.

## Locate the dominant cost

Use the tool that matches the boundary: CPU profiler, allocation profiler, query plan (`EXPLAIN ANALYZE`), network waterfall, flame graph, tracing spans, `time` breakdown for a CLI. Read totals before frames: separate self time from cumulative, waiting from computing, one-time startup from per-request cost, allocation from retention.

Trace the dominant cost back to the decision in source that causes it (an N+1 query, a synchronous call in a loop, an unbounded cache, a repeated parse). Form one hypothesis stated as a prediction: "if the parse is hoisted out of the loop, wall time drops by roughly the loop count times the parse cost."

Do not optimize from intuition, from a single timing, from a microbenchmark unrelated to the workload, or from complexity class alone.

## Change one cause

Make the smallest change that tests the hypothesis. Rerun the identical measurement: same command, data, warm-up, environment, sample count.

Accept the change only if:

- the improvement exceeds the measured variance;
- correctness checks still pass (tests, output comparison on the workload);
- memory, startup, throughput, tail latency, and downstream costs did not regress beyond what the user accepts;
- the change is explainable by the hypothesis.

If the prediction failed, revert the change and record the hypothesis as ruled out with its numbers. Do not keep a change "because it can't hurt."

Repeat with the next dominant cost until the target is met or the remaining cost is spread across many small items with no single lead.

## Stop signals

- You are editing code before a baseline exists: capture the baseline first.
- The improvement is inside the noise band: it is not an improvement yet; increase samples or discard.
- You changed two things between measurements: revert one and remeasure.
- The microbenchmark improved but the user's metric did not: the benchmark is not the workload.
- Correctness output differs after the change: it is a bug, not an optimization.

## Shortcuts that fail

- "The profiler says this function is hot, optimize it": a hot frame is a lead; its caller's decision (calling it in a loop) is usually the fix, and the frame may be waiting rather than working.
- "It's O(n^2), that must be it": complexity class predicts nothing about a workload where n is 12; measure.
- "Ran it twice, it's faster": two runs cannot separate the change from cache state or background load.
- "Add a cache": a cache trades memory and staleness for time; without measuring both sides you may have moved the problem.
- "It's faster on my machine": the reported environment has different I/O, data size, and concurrency; report the limits of where you measured.

## Report

Give the metric, workload, and environment; the baseline (samples, median, p95 or distribution, variance); each hypothesis with its prediction, change, and measured result (accepted or ruled out); the final measurement on the same terms; correctness checks run; regressions in other dimensions or "none measured in: <list>"; and the target with whether it was met. State what you did not measure and where the result may not transfer. If no change met the acceptance rule, say "No accepted improvement" and give the ruled-out list.

## Critical failures

- An optimization committed without a baseline measured under the same conditions.
- An improvement claimed that is within measured variance or from a single run.
- Two or more changes between measurements.
- Correctness or another performance dimension regressed without being reported.
- A result generalized beyond the measured workload or environment.
