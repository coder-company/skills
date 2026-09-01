---
name: design-module-boundaries
description: Decide where a responsibility lives and what its interface is from evidence about callers, change coupling, dependency direction, and domain vocabulary, producing a deep module with a small surface. Use when creating a package or module, moving a responsibility across a boundary, splitting a subsystem, or replacing a utils grab-bag. Do not use for one file added to an established module. Do not use for unsettled vocabulary; use model-the-domain.
---

# Design module boundaries

Write the caller's usage first, name the one decision or invariant the module owns, check the dependency direction, then pressure the proposed boundary with a current caller, the next known variation, and one failure path. A boundary that callers must look through is not a boundary.

## Route first

- The terms are contested or overloaded: `model-the-domain` first.
- The boundary change requires callers to move to a new interface: `replace-an-api` for the migration.
- The move is purely structural with the interface unchanged: `refactor-without-regressions`.
- A one-file addition to an established module: mirror one existing sibling, wire the existing registry, add the sibling-style test, and stop. No base class, decorator, package, or registry the siblings do not already use. Without the code, show the addition as an illustrative diff and say it is not applied; do not claim it was made.

## Gather the evidence

Inspect before proposing:

- how each caller uses the capability, by file:line, and what it needs to observe;
- which files change together in history (`git log --format=%h --name-only` over the relevant paths, then count co-occurrence), distinguishing product coupling from formatting or generated churn;
- data and control flow across the proposed line;
- current imports and their direction, and any cycles (`madge`, `go list -deps`, `cargo tree`, or the imports);
- vocabulary in requirements, issues, and the public API;
- tests, for what consumers assert.

Two functions that look alike but change for different reasons belong apart.

## Write the caller's view first

Before choosing files or types, write two or three realistic call sites as code. The interface should:

- expose the capability without exposing internal sequencing (no "call `init`, then `load`, then `apply`");
- keep invariants inside (callers cannot produce an invalid state);
- use domain types where primitives would allow invalid values;
- make error and lifecycle behavior visible in the signature;
- have no configuration for variation that does not exist yet.

If the caller's view needs internal knowledge to be correct, the boundary is in the wrong place.

## Name one responsibility

State, in one sentence, the decision or invariant the module owns ("decides which price applies to a cart line", "guarantees every outbound event has a version"). Derive the name from that sentence in the domain's vocabulary, or the mechanism's for an adapter (`http`, `postgres`, `codegen`).

Reject the boundary if its only name is `utils`, `helpers`, `common`, `shared`, `core`, `lib`, `manager`, or `handler`. Those words describe a location, not ownership.

## Prefer depth

A deep module has a small stable surface hiding substantial decisions. Tests:

- **Deletion test:** delete the module and inline its contents; if complexity did not move, the module was a pass-through.
- **Adapter count:** one adapter behind an interface is a hypothetical seam; two real adapters justify the interface. Do not introduce an interface for one implementation without a current test or volatility need.
- **Leak test:** if a caller must change when the module's storage, transport, or algorithm changes, the module leaks that decision.

Fewer, deeper modules beat many shallow ones.

## Protect dependency direction

The new module must not import from anything that already imports it. Write down the allowed dependencies. Separate policy (domain rules) from mechanism (frameworks, I/O) only when that reduces observed co-change, not to satisfy a diagram.

Check for cycles after the move and confirm the build's module graph agrees.

## Pressure the boundary

Walk through those that exist and record the result:

1. A current caller: does it get what it needs without reaching inside?
2. The next known variation: does it fit behind the surface or force a change to every caller?
3. One failure path: is the error visible where the caller can act on it?
4. A change that previously touched several files: does it now touch one module?
5. Deleting one internal detail: does anything outside the module notice?

If callers still need internals, the boundary is shallow or misplaced. If unrelated changes now touch the module, the responsibility is too broad. Revise before moving code.

## Stop signals

- You are choosing files before writing the caller's usage: write the usage.
- The module's name is a location word: find the owned decision or drop the module.
- The interface has an "options" bag with one used field: remove the variation.
- A cycle appears after the move: the direction is wrong; do not break it with a lazy import.
- Two modules changed together in every recent commit: they are one module.

## Shortcuts that fail

- "These files look alike, group them": syntactic similarity groups code that changes for different reasons, so every change touches the group.
- "Add an interface so it's testable later": one implementation behind an interface is indirection with no seam; add it when the second implementation or the test exists.
- "Put it in shared for now": nothing leaves `shared`; it becomes the dependency of everything and the owner of nothing.
- "Split it into small modules for clarity": each caller now assembles the pieces, and the assembly knowledge is duplicated.

## Report

Give the evidence gathered (callers, co-change findings, dependency direction), the caller's view as code, the owned responsibility and name, allowed dependencies, the depth tests' results, the pressure walk results, alternatives considered and why each lost, and the first check that would reveal the boundary is wrong. If no boundary change is warranted, say so in one sentence and do the requested change; do not deliver evidence sections for a decision that was not made.

## Critical failures

- A module created or named by location words with no stated owned decision.
- An interface introduced for a single implementation with no current test or volatility need.
- A dependency cycle introduced or hidden with a lazy import.
- Files chosen before the caller's view was written.
- Boundary proposed without the co-change or caller evidence.
