---
name: read-a-runtime-trace
description: Analyze an existing CPU profile, heap snapshot, execution trace, flamegraph, spindump, or similar captured artifact. Use when the artifact is the primary evidence for a performance or runtime question. Do not use when new live instrumentation must be designed first.
---

# Read a runtime trace

## Establish provenance

Identify the artifact type, capture window, workload, build, platform, sampling method, and known truncation. Do not compare captures produced by materially different methods without explaining the limitation.

## Follow the dominant evidence

Inspect totals before individual frames. Separate self time from cumulative time, allocation from retention, waiting from CPU work, and recurring activity from one-time startup. Account for missing symbols, sampling bias, async boundaries, scheduler time, and idle intervals.

Trace a costly frame or retained object back to the caller, owner, or lifecycle decision in source. A large frame is a lead, not automatically the root cause.

## Test the interpretation

State at least one competing explanation and the trace evidence that supports or weakens it. If the capture cannot distinguish them, request the smallest new capture or symbol information needed.

Report findings with artifact locations or timestamps and keep observed facts separate from inference. Do not claim an improvement without a comparable post-change capture.
