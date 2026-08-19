---
name: prove-the-blast-radius
description: Find and verify indirect breakage a proposed or completed change could cause outside its diff. Use when a small change touches a shared contract, lifecycle, side effect, cache, schema, configuration, or widely used path. Do not use as a substitute for a general code review.
---

# Prove the blast radius

## Name the changed contract

Describe the value, timing, ordering, side effect, error, persistence, or lifecycle behavior that changes. Search direct callers, then follow dynamic registration, serialization, generated consumers, configuration, background work, caches, and external contracts that text search may miss.

## Rank plausible breakage

For each affected consumer, state the assumption it makes and how the change could violate it. Prioritize by reach, consequence, likelihood, and observability. Do not produce a flat caller list.

## Prove the hinge facts

Identify the one or two facts on which safety depends. Run focused code, inspect a real artifact, query the schema, or exercise a representative consumer to prove them. A persuasive writeup is not evidence.

If a fact cannot be verified, state the unresolved exposure and the smallest check needed. Do not broaden into unrelated architecture review or implement changes during a read-only assessment.

Report proven-safe paths, confirmed breakage, and unresolved risks separately.
