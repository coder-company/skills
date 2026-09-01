---
name: check-release-safety
description: Before one remote release action, refresh the remote state, verify the exact artifact or merge result that ships, confirm coupled metadata, and verify a usable rollback; then verify the released state. Use when about to merge, push a tag, publish a package, force-push shared history, apply a production migration, or deploy. Do not use for a local commit, draft PR, or push to an unshared branch. Do not use for deletion judgment; use confirm-destructive-actions.
---

# Check release safety

Name the one remote action, read the authoritative remote state immediately before it, inspect the result that will actually ship rather than the source branch, name and verify the down path, then mutate and verify from the remote system. Green tests on the branch satisfy none of these.

## Route first

- The action deletes or rewrites user-owned state: `confirm-destructive-actions` for target and recovery.
- The action is one step of a multi-step migration: `sequence-migrations` orders it; this skill gates the step.
- Checks are failing: `fix-the-ci` first.
- The task forbids contacting the remote (offline preparation): prepare local artifacts only and list remote checks as pending gates; do not run `npm whoami`, `npm view`, or equivalents.

## Identify the mutation

Record the exact action, repository or service, target branch or tag, package, environment, version, and the authenticated identity that will perform it. Resolve stable identifiers (SHA, digest, version) before mutation. This skill covers one remote action; do not import release ceremony onto an ordinary push to a personal branch unless repository policy gives that push release consequences.

## Refresh remote truth

Fetch or read the remote immediately before acting:

- target ref and its expected SHA;
- source ref and commits present on only one side (`git log --oneline target..source` and `source..target`);
- required checks and review state for the exact head being released;
- active releases, locks, migrations, or deployments that could conflict;
- the authenticated account, organization, registry, cluster, or cloud environment.

A local tracking ref, browser tab, cached status, or earlier green run is not remote truth.

## Verify the result that ships

Construct or inspect the actual merge result, package contents, image, migration set, or deployment revision, and run the relevant checks against it. A branch can pass while the merge result fails; a build can pass while the published tarball omits files; a migration can parse while the target schema differs.

Confirm coupled metadata the repository requires, using repository evidence to decide which pairs apply: manifest and lockfile; schema and generated client; migration and model; version, tag, and changelog; image digest and deployment revision; release notes and compatibility statements.

When a release defect escaped existing tests, add the smallest durable check that would have failed on the broken artifact, and prove it is non-vacuous when a safe temporary reversal or fixture allows.

## Name and verify the down path

For each externally irreversible element, state the recovery action (revert or follow-up release, package deprecation or replacement version, tag handling allowed by policy, rollback to a known digest, down migration or snapshot restore, or explicit absence of recovery) and verify the target exists and is usable. Do not name a previous version, tag, image, or snapshot as the rollback target until its artifact has been checked; a prior release from the same broken configuration is not safe.

If no recovery exists, say so before mutation and obtain the authority the repository or user requires.

## Mutate and verify

Proceed only when every item above is resolved and the user authorized this action against this target. Run the narrow action, then verify from the authoritative remote system: the expected ref, version, digest, migration, or deployment is active; required checks apply to the released revision; health or smoke checks pass against it; no asynchronous operation is pending unreported.

Remove local package archives, scratch installs, temporary manifests, and inspection output the repository does not track. Inspect the working tree before reporting.

## Stop signals

- You are reasoning from the branch's green run: inspect the merge result or artifact.
- The rollback target is "the previous version" and you have not checked it: check it.
- The remote fetch is more than a few minutes old: refresh.
- You are about to add release checks to a push with no release consequences: stop; use ordinary push hygiene.

## Shortcuts that fail

- "CI is green on the branch": the merge result and the published artifact are different objects from the branch.
- "We can always roll back": rollback to an unverified target fails at the moment it is needed.
- "The lockfile is probably fine": manifest and lockfile drift ships a different dependency set than was tested.
- "Push now, verify later": an asynchronous deploy that fails silently is discovered by users.

## Report

Give the released identifier (SHA, version, digest); remote state checked before and after; how the shipped result was verified; metadata pairs confirmed; the down path and its verification; remaining monitoring window or pending operations; and cleanup confirmed. If a gate blocked the action, report the blocking item and do not mutate. In offline mode, list each remote check as "pending: <check>".

## Critical failures

- Mutation performed with any gate unresolved or without authorization for this specific target.
- Verification performed on the source branch instead of the shipped result.
- Rollback target named without checking its artifact.
- Remote state not refreshed immediately before the action.
- Released state not verified from the authoritative remote system afterward.
