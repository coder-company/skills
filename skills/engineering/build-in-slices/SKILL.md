---
name: build-in-slices
description: Break a feature into thin end-to-end increments that each produce observable behavior. Use when a feature spans several layers or would otherwise be implemented as disconnected horizontal scaffolding. Do not use to split a small single-boundary change.
---

# Build in slices

## Find the thinnest useful path

Map the layers the feature crosses, then choose one narrow user or system scenario that reaches through the required layers. The first slice must produce observable behavior, not only schemas, interfaces, or unused infrastructure.

Order later slices by dependency and learning value. Keep each slice independently verifiable and reviewable. Name the behavior it adds and the check that proves it.

## Keep scaffolding earned

Add only infrastructure required by the current slice. Do not create all future variants, generalized extension points, or compatibility paths in advance. Temporary scaffolding must either disappear inside the slice or have an explicit immediate consumer.

## Preserve a working state

Finish production code, tests, generated artifacts, and required documentation for one slice before opening the next. Do not leave the repository compiling only after several partial slices are combined.

Report completed slices by behavior. Do not turn slices into issue-tracker ceremony unless the user asks for tickets.
