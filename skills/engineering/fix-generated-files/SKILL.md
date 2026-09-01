---
name: fix-generated-files
description: Trace a generated, vendored, mirrored, compiled, or derived file to the source and command that own it, change the source, regenerate, and confirm a second regeneration produces no diff. Use when a change touches a lockfile, generated client, compiled bundle, snapshot, schema output, vendored dependency, or any file a build, sync, or upstream update could overwrite. Do not use for a handwritten file that merely looks repetitive or sits near generated output; edit it normally.
---

# Fix generated files at their source

Establish whether the file is derived, find the authoritative input and the supported regeneration command, change the input, regenerate, inspect the diff for unrelated churn, and prove the result survives a second regeneration.

## Route first

- No ownership evidence after a proportional search: the file is handwritten; edit it with `keep-code-boring`.
- The generated file is in conflict during a merge: resolve the owning sources first (`resolve-semantic-conflicts`), then regenerate.
- The change is to a vendored dependency's behavior: see the vendored section below before touching it.

## Establish whether the file is derived

Look for: generated-file headers; generator scripts, schema files, templates, or codegen configuration; package scripts, build rules, or repository instructions naming the file; duplicate files with a documented synchronization path; vendoring manifests, patch directories, or upstream version pins; committed output directories paired with source directories.

Do not decide from the filename or location. A `dist/` file can be the published source of truth in one repository; an ordinary-looking client can be generated in another.

If two candidates claim authority, inspect the command that reproduces the artifact and the history that changes them together (`git log --name-only` on both). Name the unresolved conflict before editing either.

## Change the owner

1. Identify the authoritative input.
2. Identify the exact supported regeneration or synchronization command from the repository (package script, Makefile target, documented command).
3. Reproduce the current artifact from the unchanged input when the generator is available and cheap. A clean reproduction proves the command and environment; an unexplained diff means the artifact was already hand-edited or the environment differs, and you must report that before proceeding.
4. Change the smallest authoritative input that owns the requested behavior.
5. Regenerate through the supported path, narrowed to the target when the generator supports it.
6. Read the complete generated diff for unrelated churn.

Do not hand-edit a lockfile, generated client, compiled bundle, snapshot, or mirrored document when an owning source and command exist. If the generator is unavailable or nondeterministic, report the missing tool or the unexplained churn; apply a temporary output patch only with the user's explicit acceptance that regeneration can overwrite it, and record the owning source that still needs correction.

## Handle vendored and upstream-owned code

Determine which mechanism the repository expects: an upstream contribution; a local patch applied during vendoring (a `patches/` directory or patch tool); a fork or version pin; a checked-in modification the update command preserves. Use that mechanism. Do not edit vendored output the next update will drop, and do not bump a version pin to avoid understanding the patch path.

## Verify survival

Run the generator or sync command again. The second run must produce no diff (`git status --porcelain` empty for the generated paths). For a known-nondeterministic generator, name the fields that legitimately change and confirm nothing else did. Then run the consumer check that observes the artifact (the test, build, or import that uses it).

Completion requires both: the authoritative input contains the intended change, and regeneration preserves it without unexplained additional changes.

## Stop signals

- You are editing a file with a "generated, do not edit" header: find the source.
- The first reproduction from unchanged input produced a diff: the artifact or environment is already out of sync; report before changing anything.
- The regenerated diff touches files unrelated to your change: narrow the generator target or explain the churn.
- The generator cannot run: say regeneration was not verified; do not imply it was.

## Shortcuts that fail

- "Patch the output, the test goes green": the next build regenerates the file and the fix disappears, with the test now failing on someone else's change.
- "Edit the lockfile by hand to fix the version": the package manager rewrites it from the manifest on the next install.
- "Edit the vendored file, it's in our repo": the next vendor update drops the edit silently.
- "Regenerate everything to be safe": the churn hides the requested change and makes the review impossible.

## Report

State the owning source and the evidence that established it; the regeneration command; the reproduction result from unchanged input; the source change; the generated diff summary with any unexplained churn; the second-run result; and the consumer check with its result. Quote generated lines only when read from the actual diff. If the file was handwritten, say "Not generated: <evidence>" and that it was edited normally.

## Critical failures

- A derived file hand-edited when an owning source and supported command exist.
- Ownership decided from filename or location alone.
- Second regeneration not run, or run with a diff left unexplained.
- Generated content quoted from memory or paraphrase rather than the actual diff.
- Vendored code edited directly when the repository has a patch or pin mechanism.
