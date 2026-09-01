---
name: read-a-runtime-trace
description: Analyze a captured profile, heap snapshot, flame graph, trace, spindump, or query plan as primary evidence, from totals down to the owning decision in source. Use when the user hands you an artifact and asks what is hot, where is the memory going, or read this flamegraph. Do not use when no artifact exists and a live process must be instrumented; use observe-the-runtime.
---

# Read a runtime trace

Establish what the artifact is and how it was captured, read its totals before any single frame, trace the dominant cost to the decision in source that owns it, and test your interpretation against at least one competing explanation the same artifact could support.

## Route first

- No artifact exists or the existing one cannot answer the question: `observe-the-runtime` to design the capture.
- The artifact confirms a hot path and the task is to optimize it: `measure-the-bottleneck` for the baseline-and-compare loop.
- The trace shows a race or ordering violation to fix: `untangle-shared-state`.

## Establish provenance

Before interpreting, record:

- artifact type and format (sampled CPU profile, instrumented trace, heap snapshot, allocation timeline, spindump, `EXPLAIN ANALYZE`, HAR);
- capture window: start, duration, what the workload was doing, whether it includes startup;
- build and platform: debug or release, optimization level, runtime version, symbols available;
- sampling method and rate, or instrumentation overhead;
- known truncation, filtering, or aggregation applied before you received it.

If any of these are unknown, ask for them or state the limit they impose. Two captures produced by different methods, builds, or workloads are not comparable; say so rather than comparing them.

## Read totals first

Before opening any frame:

- total duration or total retained size, and how much of it the artifact accounts for (unattributed, idle, and unsymbolized portions);
- the split between CPU work and waiting (I/O, locks, scheduler, GC);
- the split between one-time (startup, JIT warm-up, first-load) and steady-state cost;
- for heap artifacts, allocation versus retention, and the dominator or retainer tree rather than raw counts;
- for traces, the critical path versus concurrent work that did not extend it.

Then find the dominant contributor by cumulative cost, and check whether self time or a callee accounts for it. A frame with high cumulative and low self time is a caller decision; a frame with high self time is the work itself.

## Trace to the owning decision

Follow the dominant cost to source: the loop that calls the hot function, the query issued per row, the object graph that retains the snapshot's largest class, the lock held while waiting. Open the source at that location and read what decides the count, size, or wait.

State the finding as "X costs N (P% of total) because <decision at file:line>", with the artifact location (frame path, node ID, timestamp range, plan node) that supports it. A large frame is a lead; the decision that produces it is the finding.

Account for artifacts that mislead: missing symbols folding many functions into one, inlining hiding callers, async boundaries breaking the stack, sampling bias against short frames, GC attributed to whichever frame was running.

## Test the interpretation

Write down at least one competing explanation the artifact could also support ("the frame is hot because it waits on the lock, not because it computes"). Find the evidence in the artifact that supports or weakens each. If the artifact cannot distinguish them, name the smallest additional capture or symbol information that would (a wall-clock trace instead of CPU-only, a second snapshot after forced GC, a symbolized build).

Do not report an inference as an observation. Keep the two labeled.

## Stop signals

- You are looking at frames before recording provenance and totals: go back.
- The top frame has no symbols: get symbols or state that the dominant cost is unattributed.
- Your finding names a function but not the decision that makes it expensive: keep tracing.
- You are about to compare two captures with different workloads or builds: stop and state the incomparability.
- You are about to say a change "should" fix it: you have a hypothesis for `measure-the-bottleneck`, not a result.

## Shortcuts that fail

- "The widest bar is the problem": the widest bar in a flame graph is often the root or an event loop; its width is inherited from callees.
- "High allocation means a leak": allocation that is collected is churn; only retention across collections is a leak.
- "CPU profile shows nothing, so it's fast": a CPU profile does not show waiting; a stall lives in the wall-clock gaps.
- "Compare this profile with last week's": different build, data, or machine makes the diff noise.
- "The function name explains the cost": names describe intent; the decision at the call site (frequency, size, synchronous versus async) explains the cost.

## Report

Provide provenance (type, window, build, sampling, limits); totals and their attribution; the dominant costs ranked with artifact locations and percentages; each traced to the owning decision with file:line; competing explanations and the evidence for or against each, marked observed versus inferred; and the next capture needed if the artifact cannot settle the question. If the artifact shows no dominant cost, say so and give the distribution.

## Critical failures

- A finding stated without an artifact location that supports it.
- Provenance or totals skipped before frame-level claims.
- Inference labeled as observation.
- Two incomparable captures compared without the limitation stated.
- An improvement claimed with no comparable post-change capture.
