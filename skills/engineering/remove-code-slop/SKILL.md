---
name: remove-code-slop
description: Find and remove machine-generated excess without changing behavior (narrating comments, guards on trusted paths, one-caller wrappers, unused parameters, speculative config, type escapes, duplicated helpers, dead code). Use when the user says deslop, clean this up, over-engineered, what can we delete, or before committing generated code. Do not use for prose; use say-it-clearly. Do not use for correctness review; use review-the-diff.
---

# Remove code slop

Produce a list of concrete deletions and reductions, each with a location, a tag, the replacement, and the evidence that the removal changes no behavior. Then apply them only within the requested scope and prove the checks still pass. Correctness, security, validation, and accessibility code is never slop.

## Route first

- The request is about a diff's correctness: `review-the-diff`.
- The excess is architectural (wrong module boundaries, layered abstractions across files): `design-module-boundaries` or `refactor-without-regressions`.
- The text is documentation or a message: `say-it-clearly`.
- Deleting something requires proving no external consumer depends on it: `prove-the-blast-radius` for that item.

## Set the scope

Default scope is the current change: `git diff <merge-base>...HEAD` plus uncommitted changes. Widen to a directory or the repository only when the user asked for an audit. Record the scope and the check that must stay green (test, lint, type commands).

Run the check before touching anything and record the result; a red baseline cannot prove the removal changed nothing.

## Find slop

Inspect every file in scope and tag each finding:

- `comment`: a comment that restates the adjacent code, narrates a phase ("// Step 2: validate input"), announces an edit ("// added for the new flow"), or has drifted from the code. Keep comments that state a constraint, an invariant, a non-obvious why, or a reference the code cannot carry.
- `guard`: a `try/catch`, null check, or type check on a path where the value is already guaranteed by a type, an earlier validation, or the caller's contract. Keep guards at trust boundaries (user input, network, file, environment, deserialization).
- `fallback`: a default branch, `?? {}`, `|| []`, or retry that hides a condition the code should fail on. Keep fallbacks the requirement asks for.
- `wrapper`: a function, class, or module with one caller that adds no name, invariant, or test seam. Inline it. Keep it when the name documents a concept the call site would otherwise need a comment for.
- `param`: unused parameters, options objects with one used field, flags with one value at every call site.
- `dup`: a helper that reimplements something already in the repository or the standard library. Cite the existing location.
- `config`: configuration, constants, or environment variables with no variation across environments or call sites.
- `escape`: `any`, `as unknown as`, `@ts-ignore`, `# type: ignore`, `// eslint-disable`, or equivalent suppressions added by the change without a stated reason.
- `dead`: code unreachable after the change, commented-out code, or exports with no importer inside the scope's ownership.
- `speculative`: interfaces with one implementation, factories with one product, extension points with no extension, generics used with one type.

For `dead`, `wrapper`, and `dup`, gather the evidence before listing: search from the repository root for callers, dynamic references (string lookups, reflection, dependency injection registrations, configuration files), public exports, and tests. A search that finds nothing inside one package is not evidence for a public export or dynamically loaded component; report those as uncertain.

## Apply within scope

For each finding, in file order:

1. Make the removal or reduction. Do not combine it with a behavior change, rename, or unrelated tidying.
2. If a removed guard or fallback was the only thing preventing a failure on a real input, the finding was wrong: restore it and note the input.
3. Run the fastest relevant check after each file and the full recorded check after all.

When a `do not remove` comment guards a constraint, replace it with the cheapest enforcement the repository has (a type, an assertion, a test, or a lint rule); otherwise keep the comment and say why.

Do not touch: input validation at trust boundaries, error handling that prevents data loss or leaves the system consistent, authentication and authorization checks, accessibility attributes, logging the operators rely on, and anything the user explicitly requested. When refusing a removal, name the input the guard handles and the behavior it changes (a 400 instead of an unhandled rejection), then offer behavior-preserving tidy-ups. Describe only code you have read; hedge about the rest.

## Stop signals

- A search in one directory found nothing: search from the repository root and check dynamic references first.
- A removal changes an observable output, status code, log line operators consume, or error type: it is a behavior change, not slop. Revert and report separately.
- The check turned red after a removal: revert that removal before continuing.
- You are rewriting logic to be shorter rather than deleting excess: stop; compression is not removal.

## Shortcuts that fail

- "Comments are harmless, leave them": narrating comments drift from the code and future edits preserve the wrong description.
- "The extra try/catch is defensive": a catch on a trusted path converts a programming error into silent wrong behavior; guards belong at the trust boundary.
- "The helper might get a second caller": one caller means the abstraction is a guess; inline it and extract when the second caller exists.
- "Delete the export, nothing in this package uses it": public exports, reflection, and configuration-driven loading live outside the package.

## Report

List findings in file order, one line each:

`<path>:<start>-<end>: <tag>: <what>. <replacement or "delete">. Evidence: <search or contract that shows no behavior change>.`

Then: the scope, baseline and post-change check results with the exact command, findings applied, findings not applied with the reason (out of scope, uncertain reference, requires authority), and files touched. Write findings in plain terms; do not label them with this skill's rule names or list steps not run. If nothing qualified, write "No slop found in <scope>." and list what you inspected.

## Critical failures

- Removing validation, authorization, data-integrity handling, or accessibility code as slop.
- A deletion whose only evidence is a search limited to one package or directory.
- Any observable behavior change shipped as a slop removal.
- Reporting the check as passing without running it after the changes.
- Combining slop removal with unrelated edits in the same change.
