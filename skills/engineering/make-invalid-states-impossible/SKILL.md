---
name: make-invalid-states-impossible
description: Redesign types and constructors so invalid combinations cannot enter trusted application code. Use when primitives, nullable fields, boolean combinations, unchecked casts, or partial objects permit states the domain rejects. Do not use for style-only type annotation cleanup.
---

# Make invalid states impossible

## Enumerate valid states

Write the actual variants, required data for each variant, transitions, and invariants. Find where untrusted input becomes trusted and where invalid combinations are currently constructed.

## Encode the distinctions

Use discriminated unions, enums with payloads, branded or refined values, opaque constructors, exhaustive matching, and separate input and trusted types as supported by the language. Parse and validate at external boundaries, then let internal code rely on the stronger type.

Do not lie through casts, non-null assertions, overly broad optionals, stringly typed tags, or a boolean for each state. Do not add wrapper types that express no invariant.

## Migrate construction sites

Update every constructor, serializer, deserializer, fixture, and public consumer affected by the new representation. Preserve wire formats unless a contract change is authorized. Add compile-time and runtime tests at the appropriate boundaries.

Finish when invalid internal construction fails at compile time where possible and malformed external data fails explicitly at parsing.
