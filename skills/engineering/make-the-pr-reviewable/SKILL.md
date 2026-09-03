---
name: make-the-pr-reviewable
description: Shape a branch into a pull request a reviewer can verify in one pass, with dependency-ordered commits, mechanical changes separated from judgment changes, a tree proven identical after any rewrite, and a description covering why, scope, tradeoffs, blast radius, and verification. Use when the user says open a PR, clean up the commits, split this, or write the PR description. Do not use to review the code; use review-the-diff. Do not use to merge; use check-release-safety.
---

# Make the PR reviewable

Arrange the branch so a reviewer reads the decisions first, the mechanical fallout second, and can confirm each claim in the description with a command. Never rewrite history without proving the final tree is identical to the tree you started from.

## Route first

- The branch contains unrelated work: split it into separate PRs before shaping either one.
- The diff has not been reviewed for correctness: `review-the-diff` first, then shape.
- Shaping requires resolving conflicts with the base: `resolve-semantic-conflicts`.
- The user wants to merge, tag, or publish: `check-release-safety`.

## Establish the boundary

1. Record the base and head: `git merge-base HEAD origin/<base>` and `git rev-parse HEAD`.
2. Record the tree you must preserve: `ORIGINAL_TREE=$(git rev-parse HEAD^{tree})`.
3. Review the full diff once: `git diff <merge-base>...HEAD --stat` and the diff itself. Classify every file as **judgment** (a decision a reviewer must evaluate: logic, interface, schema, config semantics) or **mechanical** (rename fallout, formatting, generated output, lockfile, import reordering, bulk call-site updates).

If the PR holds more than one independent judgment change, recommend splitting with the boundary, then do the work both answers need: record the tree, classify files, and order commits so each candidate PR is contiguous. Skip the combined description; a PR that should be two wastes the review.

## Order the commits

Target a commit sequence a reviewer can read top to bottom:

1. Preparatory refactors that change no behavior (each with the check that proves it).
2. The judgment change, in the smallest number of commits that each leave the tree building and tests passing.
3. Mechanical fallout, one commit per kind ("regenerate client", "update call sites", "format").
4. Tests and documentation may live with the change they cover or in the following commit; never before the code they test unless the commit is a deliberate failing-test commit and says so.

Reorder without an interactive rebase (`git rebase -i` needs a terminal; script `GIT_SEQUENCE_EDITOR` or build a fresh branch with `git cherry-pick` in the new order). After the rewrite, prove identity:

```sh
test "$(git rev-parse HEAD^{tree})" = "$ORIGINAL_TREE" && echo TREE_IDENTICAL
```

If the trees differ, find the difference with `git diff $ORIGINAL_TREE HEAD` and either restore it or state in the description exactly what changed and why. Do not push a rewritten branch whose tree differs unintentionally.

Squash only fixup commits ("typo", "address review", "wip") into the commit they fix. Do not squash the whole branch into one commit when the sequence carries review information.

## Write commit messages

Each commit message states what changed and why in the first line (under 72 characters), then the reasoning a reviewer needs and the check run. A message that only restates the diff ("update auth.ts") carries no review information.

## Write the description

Use these sections, in this order, each answerable from the diff or a command:

- **Why:** the problem or requirement, with a link to the issue or spec when one exists.
- **What changed:** the judgment changes as a short list; then "Mechanical:" naming the fallout commits so reviewers can skim them.
- **Tradeoffs:** alternatives considered and why they lost, in one line each. "None" if there were none.
- **Blast radius:** contracts, consumers, migrations, feature flags, or environments the change can affect beyond the diff, and how each was checked (see `prove-the-blast-radius` when a shared contract changed).
- **Verification:** the exact commands run, on which SHA, with their observed result. Include the boundary-level check (see `verify-real-behavior`), not only unit tests.
- **Review guide:** the order to read the commits and the one or two files where the decision lives.
- **Out of scope / follow-ups:** what a reviewer might expect and will not find, with the reason.

Do not write "tests pass" without the command. Do not describe work not in the diff.

## Push and open

Push with `--force-with-lease` (never bare `--force`) when history was rewritten. If the push is rejected, the remote moved: fetch, inspect, and re-derive; do not override.

Open the PR against the confirmed base with the title matching the first judgment commit's subject. Add the labels and reviewers the repository convention uses; check for a PR template in `.github/` and follow it.

Read back the created PR (`gh pr view <number>`) and confirm base, head SHA, and description rendered.

## Stop signals

- You classified every file as judgment: either the PR is too large or the classification is wrong. Re-check for mechanical fallout.
- The tree check did not print `TREE_IDENTICAL` and you cannot explain the difference: restore before pushing.
- The description says "various fixes" or "cleanup": name each.
- You are about to `--force`: use `--force-with-lease`, and only on a branch you own.
- Two independent judgment changes remain in one branch: recommend splitting.

## Shortcuts that fail

- "Squash everything, it's simpler": the sequence that showed the refactor was behavior-preserving is gone, and the reviewer must re-derive it.
- "The rebase looked fine": rebases silently drop or duplicate hunks; only the tree hash proves nothing changed.
- "Reviewers can figure out what's mechanical": they read every line at the same attention level and miss the decision in the noise.
- "Force-push, the remote is mine": a rejected push means someone or something moved the branch; `--force` discards it.

## Report

Include: base and head SHAs, the tree identity result, the final commit list with one line each, the classification (judgment vs mechanical files), the PR URL, and any split recommendation with the proposed boundary. If no reshaping was needed, say so and list what you checked.

## Critical failures

- History rewritten and pushed without a tree identity check or an explanation of the difference.
- Bare `--force` push, or `--force-with-lease` after a rejected push without investigating.
- Description claims a verification that was not run on the pushed SHA.
- Two independent judgment changes shipped in one PR without recommending a split.
- Commit order that leaves an intermediate commit not building or failing tests without saying so.
