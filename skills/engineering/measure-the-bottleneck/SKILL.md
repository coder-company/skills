---
name: measure-the-bottleneck
description: Diagnose and improve a performance regression or bottleneck against a reproducible baseline. Use when work is slow, memory-heavy, resource-intensive, or has a numeric performance target. Do not use for correctness failures with no performance claim.
---

# Measure the bottleneck

## Define the metric

Choose the user-relevant metric, workload, environment, warm-up, sample count, and acceptable threshold. Capture a baseline before changing code. If the symptom cannot be measured reliably, fix the measurement before optimizing.

## Locate the cost

Use the profiler, trace, counters, query plan, allocation data, or timing breakdown appropriate to the boundary. Separate dominant cost from visible but insignificant work. Form one falsifiable hypothesis at a time.

## Change one cause

Make the smallest change that tests the hypothesis. Repeat the same workload under comparable conditions. Reject wins within noise and account for correctness, memory, startup, throughput, latency distribution, and downstream costs that matter.

Do not optimize from intuition, one unrepeatable timing, a microbenchmark unrelated to the reported workload, or Big O alone.

## Report the comparison

Give the baseline and result with units, environment, sample method, variance or distribution when relevant, and correctness checks. State limits instead of generalizing beyond the measured workload.
