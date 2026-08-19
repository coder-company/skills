---
name: fix-generated-files
description: Trace generated, vendored, mirrored, compiled, or derived files to the source and command that own them before editing. Use when a requested change touches an artifact that regeneration, synchronization, compilation, or an upstream update could overwrite.
---

# Fix generated files at their source

## Establish whether the file is derived

Before editing a suspicious artifact, look for ownership evidence:

- generated-file headers;
- generator scripts, schema files, templates, or code generation configuration;
- package scripts, build rules, lockfile metadata, or repository instructions;
- duplicate files with a documented synchronization path;
- vendoring manifests, patch directories, or upstream version pins;
- committed output directories paired with source directories.

Do not decide from the filename alone. A file under `dist/` may be the published source of truth in one repository, while an ordinary-looking client file may be generated in another.

If two candidates claim authority, inspect the command that reproduces the artifact and repository history that changes them together. Name the unresolved ownership conflict before editing either one.

## Change the owner

When the artifact is derived:

1. Identify the authoritative input.
2. Identify the exact supported regeneration or synchronization command.
3. Reproduce the current artifact from the unchanged input if the generator is available and cheap to run. A clean reproduction proves that the command and environment are valid.
4. Change the smallest authoritative input that owns the requested behavior.
5. Regenerate through the supported path.
6. Inspect the complete generated diff for unrelated churn.

Do not patch only the output to obtain a green test. Do not hand-edit a lockfile, generated client, compiled bundle, snapshot, or mirrored document when the repository provides an owning source and supported command.

If the generator is unavailable or nondeterministic, do not pretend the output is maintainable. Report the missing tool or unexplained churn. Apply a temporary output patch only when the user explicitly accepts that regeneration can overwrite it, and record the owning source that still needs correction.

## Handle vendored and upstream-owned code

For vendored code, determine whether the repository expects:

- an upstream contribution;
- a local patch applied during vendoring;
- a fork or version pin;
- a checked-in modification preserved by the update command.

Use the repository's supported mechanism. Do not edit vendored output directly when the next update drops local changes. Do not replace a version pin or dependency merely to avoid understanding the patch path.

## Recognize the near miss

Do not invoke a generation workflow for a handwritten file merely because it has repeated structure or lives near generated output. If no ownership evidence exists after a proportional search, edit the file normally and follow repository conventions.

Do not regenerate the entire repository for a local documentation typo when the documented generator supports a narrow target. Avoid broad churn that hides the requested change.

## Verify survival

Run the relevant generator or synchronization command again after the change. The second run should produce no diff. When the generator is known to be nondeterministic, name the fields that legitimately change and confirm nothing else did. Then run the consumer check that observes the generated artifact.

When the generator cannot run at all, say that regeneration was not verified rather than implying it was.

Completion requires both:

- the authoritative input contains the intended change; and
- regeneration preserves the result without unexplained additional changes.

Report the owning source, regeneration command, consumer check, and any generated churn that remains unexplained. Quote generated diffs only when read directly from the resulting file or diff. Never reconstruct or paraphrase a generated line as though it were exact output.
