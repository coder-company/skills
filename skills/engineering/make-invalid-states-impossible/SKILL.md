---
name: make-invalid-states-impossible
description: Redesign types, constructors, and parsers so combinations the domain rejects cannot be constructed in trusted code, with validation once at the boundary that receives untrusted data. Use when a struct has nullable fields valid only together, booleans that must stay in sync, status strings compared everywhere, unchecked casts, or repeated validation at call sites. Do not use for annotation cleanup with no invalid state. Do not use when concepts are unsettled; use model-the-domain.
---

# Make invalid states impossible

Find the combinations the domain forbids, replace the representation that allows them with one that cannot express them, and move validation to the single boundary where untrusted data enters. Inside that boundary, code trusts the types and stops re-checking.

## Route first

- The concepts themselves are unclear or overloaded: `model-the-domain` first.
- The change alters a public contract or persisted format: `replace-an-api` for the migration; this skill designs the target type.
- The invalid state is a concurrency interleaving rather than a data shape: `untangle-shared-state`.
- The request is an annotation, lint, or style fix with no invalid state: make it. Do not claim anything about combinations in code you have not read; without the code, show the annotation pattern as an illustrative diff and ask for the file to apply it.

## Enumerate the illegal combinations

List the type's fields and valid combinations, then the combinations the representation allows but the domain rejects. Common shapes:

- Two optional fields where exactly one must be present (`error` and `value`).
- A status field plus fields that only mean something in some statuses (`shippedAt` when `status != shipped`).
- A boolean pair with a forbidden combination (`isDeleted` and `isActive` both true).
- A collection that must be non-empty, sorted, or unique, held as a plain list.
- A string that must match a format (email, ID, path) held as a plain string and re-validated at each use.
- A range held as start and end, allowing end before start.
- A partially constructed object whose required fields are filled in later.
- A cast from external data to an internal type with no check.

Count the invalid combinations; the redesign should reduce that number to zero. If it is already zero, stop.

## Choose the representation

Apply the first that fits:

1. **Sum type or tagged union** for "one of these shapes": `Loading | Loaded(data) | Failed(error)` instead of three optionals. Each variant carries only the fields valid for it.
2. **State-specific types** for lifecycle: `Draft`, `Submitted`, `Shipped` as separate types, with transition functions that take one and return the next.
3. **Construction over restriction** for structural invariants: a non-empty list is `head + rest`; a range is `start + duration`; a sorted collection is built only through an inserting constructor.
4. **Branded or newtype wrappers** for validated primitives: `Email`, `UserId`, `AbsolutePath` produced only by a parser that checks the format.
5. **Derive, do not duplicate** for sync fields: compute `isActive` from `deletedAt`; store one.
6. **Exhaustive matching**: switch on the variant with the compiler or a runtime check that fails on an unknown variant, so adding a state forces every handler to decide.

Prefer the smallest change that removes the counted combinations; do not brand every string in the codebase.

## Move validation to the boundary

Identify where untrusted data enters: request bodies, CLI arguments, environment variables, files, database rows, messages, third-party responses. At each entry, parse into the internal type once, with a function that returns either the valid value or a described error. Everything past that function takes the typed value and does not re-validate.

Delete downstream checks the type now makes unnecessary, and their tests only if the parser's tests cover the same cases. Keep checks at the boundary between independently deployed systems.

## Migrate the callers

- Update constructors first, so the compiler or test suite lists every site that built the old shape.
- At each site, decide which variant the old data represented. A site that cannot decide has found a real ambiguity; record it, do not default.
- For persisted data in the old shape, write the parser to accept it and map it to a variant, and note whether a data migration is needed (see `sequence-migrations`).
- Run the type check and tests for every touched module.

## Stop signals

- You are adding a runtime check inside trusted code for a state the type already excludes: delete the check or fix the type.
- The new type has an `unknown`, `any`, or `default` branch that silently accepts a bad value: the boundary is leaking.
- You are branding a primitive that has no invariant: revert; it adds noise without removing a state.
- A caller needs to construct a "temporary invalid" value: the lifecycle has a missing state; add it.
- The invalid-combination count did not go down: the representation changed shape without removing states.

## Shortcuts that fail

- "Add a validate() method callers must call": a method that callers must remember is a convention, not a guarantee; the combination still exists between construction and validation.
- "Make the field required and default it": a default hides the case where the data was missing and turns a construction error into a silent wrong value.
- "Check it everywhere to be safe": repeated checks disagree over time and mark that nobody trusts the type; validate once at the boundary.
- "Keep the boolean, add a comment": comments do not stop the fourth combination from being constructed.
- "Cast the external payload, the schema is stable": schemas drift and the cast is where drift becomes corrupted state deep inside the system.

## Report

State the type or types changed, the invalid combinations before and after (with counts), the representation chosen and why, the boundary parsers added with the errors they return, the downstream checks removed, callers migrated with any ambiguity found, and the type check and test commands run with results. If no invalid state existed, say so in one sentence, after reading the type, and do the requested change.

## Critical failures

- The redesigned type still allows a combination the domain rejects.
- Validation left duplicated inside trusted code after the boundary parser exists.
- A default or catch-all branch that turns invalid input into a valid-looking value.
- A public contract or persisted format changed without a migration path.
- Types strengthened where no invalid state appeared, adding wrappers with no invariant.
