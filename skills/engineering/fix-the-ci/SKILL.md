---
name: fix-the-ci
description: Drive a pull request's failing checks to green by reading the real check log, classifying each failure (diff-caused, stale base, flaky, infrastructure) with evidence, and fixing the first actionable cause. Use when the user says fix CI, get it green, checks are failing, or why is the build red. Do not use for a local test failure with no CI; use find-the-bug. Do not use to merge; use check-release-safety.
---

# Fix the CI

Read the failing check's own output, fix the first actionable cause with the smallest change, push, and repeat until the checks the merge actually requires are green. The tool's verdict is the source of truth; a summary list or a badge is not.

## Route first

- The failure reproduces locally and the cause is unclear: `find-the-bug`.
- The same failure has recurred twice with no new evidence: `break-the-loop`.
- The fix requires weakening or deleting a test: stop; establish from the contract that the test is wrong before touching it (see `validate-review-feedback` for the evidence standard).
- Checks are green and the question is whether to merge: `check-release-safety`.

## Read the real failure

1. Get the check list from the tool: `gh pr checks <number>` (or the platform equivalent). Note which checks are required for merge; a failing optional check is reported but does not block.
2. For each failing required check, open its log (`gh run view <run-id> --log-failed` or the job URL). Find the first error the job emitted, not the last line. Later errors are usually consequences.
3. Record for each failure: check name, run id, commit SHA it ran against, first error text, and the file or step it points to.

Confirm the run's SHA matches the PR head (`gh pr view <number> --json headRefOid`). A failure against an older SHA is stale and needs a fresh run, not a fix.

## Classify before acting

For each failure choose one class, with the evidence:

- **Diff-caused:** the error names code, a test, a type, a lint rule, or a config the PR changed, or the same command fails locally on the PR head and passes on the base. Fix it.
- **Stale base:** the error names code the PR did not touch, and the base branch has moved since the PR branched (`git log --oneline HEAD..origin/<base>` is non-empty). Merge or rebase onto the current base, then rerun.
- **Flaky:** the same job has passed and failed on the same SHA, or the error is a timeout, connection reset, or resource exhaustion unrelated to the diff. Trigger one fresh run of the whole workflow, not a job re-run, because a job re-run reuses the original checkout and environment. If the identical failure appears again on the same SHA, it is not flaky; reclassify as diff-caused or infrastructure.
- **Infrastructure:** runner image, credentials, quota, or external service outage. Do not change code. Report it with the evidence and the retry condition.

Do not classify as flaky on the first observation without either a prior pass on the same SHA or an error whose text is environmental.

## Fix the first actionable cause

- Reproduce locally when the job's command can run locally: run the exact command from the workflow file, not your approximation of it.
- Make the smallest change that addresses the first error. Do not fix errors you have not observed yet; the next run will show what remains.
- Do not add `continue-on-error`, `|| true`, `--no-verify`, skip markers, broadened `catch` blocks, or timeout increases without evidence that the step is progressing and merely slow.
- If the fix touches a lockfile or generated file, regenerate it with the owning tool (see `fix-generated-files`).
- Commit with a message that names the check and the cause. Push, then wait for the run to start and confirm it is running against the new SHA.

Repeat from "Read the real failure" after each run. Budget: five fix-push cycles. After that, stop and report the remaining failures with their classification and evidence; a sixth blind cycle is not progress.

## Handle stale review threads and conflicts

If the platform reports merge conflicts, resolve them with `resolve-semantic-conflicts`, then treat the result as a new SHA and re-read the checks. Do not resolve conflicts by taking one side wholesale.

## Stop signals

- You are about to re-run a job without having read its log: read the log first.
- The plan is to increase a timeout: find evidence the step was progressing (log timestamps advancing) before doing so.
- You are editing a test to make it pass: stop and prove the test's expectation is wrong from the contract, or fix the code.
- The second run on the same SHA shows the identical failure you called flaky: reclassify.
- You have pushed five fixes: report state instead of a sixth.

## Shortcuts that fail

- "The summary says one check failed, I'll fix that": a cancelled or duplicate job can hide behind a deduplicated summary; only the tool's per-check output is authoritative.
- "Re-run the failed job": a job re-run reuses the same ref snapshot and environment; if the cause was a stale checkout or a bad cache it repeats. Trigger a fresh workflow run.
- "Fix all the red lines at once": later errors are consequences of the first; fixing them separately introduces changes the next run shows were unnecessary.
- "Mark it as allowed to fail so the PR can merge": the check exists because something depends on it; silencing moves the failure to production.

## Report

For each check: name, final status, class, evidence (run id, SHA, first error text), the fix commit if any. Then the current head SHA and whether all required checks are green on that SHA (`gh pr checks` output quoted). If a failure remains, state its class, what you ruled out, and the exact next action or authority needed. If nothing was failing when you looked, say "No failing required checks on <SHA>."

## Critical failures

- Declaring the PR green without a check result on the current head SHA.
- Weakening, skipping, or deleting a test, or adding a fail-open flag, to make a check pass.
- Classifying a failure as flaky without a prior pass on the same SHA or environmental error text.
- Pushing a fix for an error you did not read in the log.
- Continuing past the fix-push budget without reporting.
