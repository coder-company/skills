---
name: check-release-safety
description: Check remote divergence, the actual merge or release result, coupled metadata, and rollback before a mutating release action, then verify the released state afterward. Use immediately before merging, force-pushing shared history, pushing a tag, publishing a package, applying a production migration, or dispatching a deployment.
---

# Check release safety

## Identify the remote mutation

Name the exact action, repository or service, target branch, tag, package, environment, version, and actor identity. Resolve stable identifiers and effective credentials before mutation.

Respect an offline preparation boundary. When the task forbids contacting the remote service or registry, do not run identity, availability, version, or metadata queries such as `npm whoami` or `npm view`. Prepare and inspect local artifacts only, and list remote checks as pending gates rather than claiming they ran.

This skill begins when the change is otherwise ready and a remote action could make it shared or externally visible. It does not replace implementation tests, code review, destructive target confirmation, or the ordering of a multi-step migration. It covers one remote action.

Do not invoke it for a local commit, a draft pull request, or an ordinary fast-forward push to an unshared personal branch unless repository policy gives that push release consequences. For those near misses, use only the repository's normal push hygiene. Do not import release checks, workflow audits, rollback plans, or post-push monitoring without evidence that the branch has release consequences.

## Refresh remote truth

Fetch or read the authoritative remote state immediately before the action. Check:

- target ref and expected SHA;
- source ref and commits not present on either side;
- required checks and review state for the exact head being released;
- active releases, locks, migrations, or deployment operations that could conflict;
- the authenticated account, organization, registry, cluster, or cloud environment.

Do not rely on a stale local tracking ref, browser tab, cached status, or earlier green run.

## Verify the result that will ship

When possible, construct or inspect the actual merge, package, image, migration set, or deployment revision before publishing it.

Run the relevant checks against that result, not merely the source branch. A branch can pass while the merge result fails. A build can pass while the published package omits files. A migration can parse while its target schema is different.

Confirm coupled metadata required by the repository, such as:

- manifest and lockfile;
- schema and generated client;
- migration and model;
- package version, tag, and changelog;
- image digest and deployment revision;
- release notes and externally visible compatibility statements.

Use repository evidence to determine these pairs. Do not impose every metadata artifact on every project.

When a release defect escaped existing tests, add the smallest durable check that would have failed on the broken artifact. Prove the new check is non-vacuous when a safe temporary reversal or fixture can demonstrate that without contaminating the final tree.

## Name the down path

For each externally irreversible element, state the concrete recovery action:

- revert commit or follow-up release;
- package deprecation or replacement version;
- tag handling allowed by the registry or project policy;
- deployment rollback to a known digest;
- database down migration, snapshot restore, or forward fix;
- resource recreation or explicit absence of recovery.

Verify that the path exists and is usable for the target. If no recovery exists, say so before mutation and obtain the authority required by the repository or user.

Do not name an older version, tag, image, snapshot, or migration as the rollback target until its actual artifact or state has been checked. A previous release made from the same broken configuration may not be a safe target.

Green tests cannot satisfy this section.

## Mutate and verify

Proceed only when every check above is resolved and the user has authorized this specific action against this specific target. If anything is unresolved, report the blocking item instead of mutating. Then run the narrow remote action and verify from the authoritative remote system:

- the expected ref, version, digest, migration, or deployment is active;
- required checks apply to the released revision;
- health or smoke checks run against that revision;
- no asynchronous operation remains pending without being reported.

Report the released identifier, remote state checked before and after, merge-result or artifact verification, metadata coupling, down path, and any remaining monitoring window.

Remove local package archives, scratch installs, temporary manifests, generated inspection output, and other verification artifacts that the repository does not track. Inspect the final working tree before reporting readiness. Do not leave a tarball or temporary release artifact behind merely because it proved the package contents.
