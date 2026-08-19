---
name: design-module-boundaries
description: Place responsibilities and design module interfaces from evidence about callers, change coupling, dependency direction, and domain language. Use when ownership or dependency direction is changing: creating a package or module, moving a responsibility across an existing boundary, splitting a subsystem, or replacing a shallow shared or utils container.
---

# Design module boundaries

## Start from callers and change evidence

Inspect:

- how callers use the capability today;
- which files and concepts change together in repository history;
- data and control flow across the proposed boundary;
- current dependency direction and cycles;
- vocabulary in product requirements, issues, ADRs, and public APIs;
- tests that reveal what consumers need to observe.

Do not create a module because several files look similar. Similar syntax can serve different reasons to change. Co-change history is evidence, not an automatic boundary: distinguish repeated product coupling from mechanical formatting or generated churn.

## Name one responsibility

State the decision or invariant the module owns. Derive its name from recognizable domain or infrastructure vocabulary.

Reject a new boundary when its only distinguishing name is `utils`, `helpers`, `common`, `shared`, `core`, `lib`, `manager`, or `handler`. These words can appear as supporting context, but they do not identify ownership.

Technical adapter boundaries such as `http`, `db`, `codegen`, or `filesystem` are valid when they isolate an external mechanism behind a domain-facing interface. Do not force domain names onto implementation adapters.

## Write the caller-facing surface first

Sketch the smallest realistic caller usage before choosing internal files. The interface should:

- expose the capability callers need without leaking internal sequencing;
- keep invariants inside the module;
- avoid pass-through methods that add navigation without hiding complexity;
- use domain types where primitive values would permit invalid states;
- make error and lifecycle behavior explicit;
- avoid configuration for variation that does not exist.

Prefer a deep module: a small stable surface that hides substantial decisions. Do not split code merely to produce more packages.

## Protect dependency direction

The new module must not import from a layer that already depends on it. Identify allowed dependencies and check for cycles before moving code.

Keep policy independent of external mechanisms when that separation reduces change coupling. Do not introduce an interface only to satisfy a diagram when there is one implementation and no useful test or volatility seam.

## Test the proposed boundary

Pressure the design with whichever of these exist:

- a current caller;
- the next known variation;
- one failure path;
- a change that previously touched several files;
- deletion of one internal implementation detail.

If callers still need internal knowledge, the boundary is shallow or misplaced. If unrelated changes now touch the module, the responsibility is too broad.

Do not produce an architecture memo for one ordinary file added to an established module. Use this skill only when ownership or dependency direction is actually changing.

Report the evidence, caller-facing interface, owned invariant, allowed dependencies, any alternative that was seriously considered and rejected, and the first check that would reveal a bad boundary.
