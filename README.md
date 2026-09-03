# Make your coding agent less annoying

Coding agents can produce clever code, plausible guesses, shallow reviews, unsupported claims, and prose nobody wants to read.

These skills push back.

Each skill targets one failure mode. Use one, combine several, or change them to fit your team. They do not own your workflow.

## Install

You need Node.js and `npx`. Start the interactive installer:

```sh
npx skills@latest add coder-company/skills
```

The installer asks which skills and coding agents to use. To inspect the collection without installing it, run:

```sh
npx skills@latest add coder-company/skills --list
```

To install one skill for Codex in the current project without prompts, run:

```sh
npx skills@latest add coder-company/skills --skill keep-code-boring --agent codex -y
```

## The skills

Use the one that matches the failure. There is no setup mode, router, or prescribed sequence.

### Before it changes anything

- **[`define-done`](./skills/engineering/define-done/SKILL.md):** Turn a materially vague outcome into checks that can prove it wrong.
- **[`sharpen-requirements`](./skills/engineering/sharpen-requirements/SKILL.md):** Resolve only the ambiguity that would materially change the build.
- **[`write-a-plan`](./skills/engineering/write-a-plan/SKILL.md):** Turn an agreed design into small tasks with exact paths, checks, and expected failure output.
- **[`stress-test-the-design`](./skills/engineering/stress-test-the-design/SKILL.md):** Attack a design against a fixed rubric and sort findings into act on, consider, dismissed.
- **[`run-parallel-candidates`](./skills/engineering/run-parallel-candidates/SKILL.md):** Compare independent attempts against a pre-written rubric, then graft the best parts onto one base.
- **[`check-the-premise`](./skills/engineering/check-the-premise/SKILL.md):** Run a disposable experiment against the assumption that could sink the plan.
- **[`prototype-the-question`](./skills/engineering/prototype-the-question/SKILL.md):** Build disposable code to settle one design or feasibility question.
- **[`model-the-domain`](./skills/engineering/model-the-domain/SKILL.md):** Define concepts, vocabulary, relationships, and invariants from real scenarios.
- **[`design-module-boundaries`](./skills/engineering/design-module-boundaries/SKILL.md):** Place modules from caller needs, change coupling, ownership, and dependency direction.
- **[`sequence-migrations`](./skills/engineering/sequence-migrations/SKILL.md):** Order migrations into compatible states with a check and recovery boundary at every step.
- **[`confirm-destructive-actions`](./skills/engineering/confirm-destructive-actions/SKILL.md):** Resolve exact targets, exclusions, authority, and recovery before destructive work.

### While it changes code

- **[`keep-code-boring`](./skills/engineering/keep-code-boring/SKILL.md):** Choose the smallest complete design and reject abstractions built for imaginary requirements.
- **[`build-in-slices`](./skills/engineering/build-in-slices/SKILL.md):** Deliver cross-layer features as thin increments with observable behavior.
- **[`watch-the-test-fail`](./skills/engineering/watch-the-test-fail/SKILL.md):** Observe a focused test fail before making the smallest production change.
- **[`make-invalid-states-impossible`](./skills/engineering/make-invalid-states-impossible/SKILL.md):** Encode valid variants and reject malformed data at the trust boundary.
- **[`make-side-effects-idempotent`](./skills/engineering/make-side-effects-idempotent/SKILL.md):** Make duplicate and interrupted operations converge without repeated effects.
- **[`untangle-shared-state`](./skills/engineering/untangle-shared-state/SKILL.md):** Reduce shared mutation and make concurrent ownership explicit.
- **[`refactor-without-regressions`](./skills/engineering/refactor-without-regressions/SKILL.md):** Change structure while preserving the observable contract.
- **[`replace-an-api`](./skills/engineering/replace-an-api/SKILL.md):** Migrate consumers and prove the obsolete surface is gone.
- **[`fix-generated-files`](./skills/engineering/fix-generated-files/SKILL.md):** Change generated, vendored, and derived artifacts through the source that owns them.
- **[`preserve-git-state`](./skills/engineering/preserve-git-state/SKILL.md):** Keep unrelated staged, unstaged, untracked, stashed, and unpushed work intact.
- **[`break-the-loop`](./skills/engineering/break-the-loop/SKILL.md):** Stop retries that produce no new evidence and choose one discriminating action.
- **[`resolve-semantic-conflicts`](./skills/engineering/resolve-semantic-conflicts/SKILL.md):** Reconcile both sides' intended behavior, including conflicts Git merges without markers.
- **[`remove-code-slop`](./skills/engineering/remove-code-slop/SKILL.md):** Delete generated excess (narrating comments, trusted-path guards, one-caller wrappers) without changing behavior.
- **[`keep-execution-state`](./skills/engineering/keep-execution-state/SKILL.md):** Carry facts, ruled-out paths, and the next action as explicit state instead of transcript memory.
- **[`dispatch-subagents`](./skills/engineering/dispatch-subagents/SKILL.md):** Delegate with standalone briefs, disjoint write scopes, and independent verification of every result.

### Before it calls the work done

- **[`find-the-bug`](./skills/engineering/find-the-bug/SKILL.md):** Diagnose from a reproduced failure and keep evidence separate from inference.
- **[`measure-the-bottleneck`](./skills/engineering/measure-the-bottleneck/SKILL.md):** Improve a bottleneck against a comparable measured baseline.
- **[`observe-the-runtime`](./skills/engineering/observe-the-runtime/SKILL.md):** Instrument a running process to expose an intermittent transition.
- **[`read-a-runtime-trace`](./skills/engineering/read-a-runtime-trace/SKILL.md):** Interpret a captured profile, trace, or snapshot from its dominant evidence.
- **[`match-the-reference`](./skills/engineering/match-the-reference/SKILL.md):** Close measured visual differences under matched rendering conditions.
- **[`prove-the-blast-radius`](./skills/engineering/prove-the-blast-radius/SKILL.md):** Trace a changed contract beyond the diff and prove its hinge facts.
- **[`verify-real-behavior`](./skills/engineering/verify-real-behavior/SKILL.md):** Exercise the nearest real user or system boundary instead of trusting a proxy.
- **[`review-the-diff`](./skills/engineering/review-the-diff/SKILL.md):** Review changes in risk order and report only actionable findings.
- **[`validate-review-feedback`](./skills/engineering/validate-review-feedback/SKILL.md):** Reproduce factual inbound review claims before changing code.
- **[`check-release-safety`](./skills/engineering/check-release-safety/SKILL.md):** Refresh remote state, inspect the exact release artifact, and name the down path before publishing.
- **[`fix-the-ci`](./skills/engineering/fix-the-ci/SKILL.md):** Read the real check log, classify each failure with evidence, fix the first cause, confirm green on the head SHA.
- **[`make-the-pr-reviewable`](./skills/engineering/make-the-pr-reviewable/SKILL.md):** Order commits, separate mechanical from judgment changes, prove the tree identical, write a verifiable description.

### When it needs evidence or another person

- **[`show-your-sources`](./skills/engineering/show-your-sources/SKILL.md):** Answer technical questions from current primary sources without inventing certainty.
- **[`find-network-signals`](./skills/engineering/find-network-signals/SKILL.md):** Find current ideas moving through an evidence-backed public social circle.
- **[`trace-code-history`](./skills/engineering/trace-code-history/SKILL.md):** Explain why code exists and whether its recorded constraint still applies.
- **[`explain-the-system`](./skills/engineering/explain-the-system/SKILL.md):** Walk through how a subsystem works from entry to exit with file and line pointers.
- **[`hand-off-work`](./skills/productivity/hand-off-work/SKILL.md):** Pin unfinished state, rejected paths, evidence, and the next action for a fresh context.
- **[`guide-manual-steps`](./skills/productivity/guide-manual-steps/SKILL.md):** Hand over only actions that require a person's identity, credentials, or physical presence.

### When it runs on its own

- **[`work-unattended`](./skills/productivity/work-unattended/SKILL.md):** Fix a falsifiable stop predicate, an autonomy boundary, and a stall rule before running without a human.
- **[`log-decisions`](./skills/productivity/log-decisions/SKILL.md):** Keep an append-only trail of judgment calls with evidence pointers, audited before the run ends.
- **[`capture-the-lesson`](./skills/productivity/capture-the-lesson/SKILL.md):** Turn a task's reworks and missed triggers into at most three structural changes, checks before text.

### When it writes

- **[`say-it-clearly`](./skills/productivity/say-it-clearly/SKILL.md):** Preserve meaning while removing throat-clearing, vague verbs, fake certainty, and decorative structure.
- **[`write-a-personal-essay`](./skills/productivity/write-a-personal-essay/SKILL.md):** Assemble narrated fragments into a personal essay without erasing the author's voice or lived details.
- **[`generate-chaitanya-essay-images`](./skills/productivity/generate-chaitanya-essay-images/SKILL.md):** Generate and verify the hand-drawn ink image system used on [chaitanya.gg](https://chaitanya.gg).
- **[`write-a-skill`](./skills/engineering/write-a-skill/SKILL.md):** Build skills from observed failures, explicit trigger boundaries, and behavioral evidence.
- **[`fit-skills-to-the-model`](./skills/engineering/fit-skills-to-the-model/SKILL.md):** Refit existing skills to the frontier models running them, one evidenced hunk at a time.

## Design rules

These skills are small enough to understand and strict where agents commonly fail:

- Evidence before diagnosis.
- Risk before style in code review.
- Repository conventions before personal taste.
- Primary sources before confident claims.
- The reader's task before the writer's performance.
- Observed failures before skill instructions.
- Real artifacts before completion claims.
- Recovery before irreversible actions.
- Optional skills before workflow ownership.

Every skill shares one shape so an agent can find the same thing in the same place: a routing section naming sibling skills, procedure sections organized by decision, then `Stop signals`, `Shortcuts that fail`, `Report`, and `Critical failures`. Descriptions load into every session, so they are capped at 500 characters and must carry a `Use when` clause with literal user phrases and a `Do not use` clause naming the sibling that owns each near miss. Bodies load only on trigger and are capped at 1000 words (1350 for the four broad skills). The validator enforces all of this.

The prompts and expected behaviors used to test each skill live in [`evals/cases.json`](./evals/cases.json). Validate the skill structure, metadata, internal links, and evaluation manifest with:

```sh
node scripts/check-skills.mjs
```

A successful run reports the number of skills and evaluation cases, then exits with status `0`.

To compare an edited collection with a frozen baseline, use Pi or Codex as the solver and Pi as the blinded grader:

```sh
node scripts/run-evals.mjs \
  --candidate-root=. \
  --baseline-root=../skills-baseline \
  --case=debug-real-sibling-writers \
  --runs=3
```

Add `--harness=codex` to repeat the case with Codex. Fixture-backed cases run in fresh temporary workspaces and may include deterministic hidden verifiers. The command exits nonzero if the baseline wins or the candidate has a critical failure.
Use `--skill=find-the-bug` to run one skill's cases instead of the full collection.
Pass comma-separated IDs to `--case` to run a focused set.

Codex defaults to `workspace-write`. On a host where its sandbox cannot start, use `--codex-sandbox=danger-full-access` only for an isolated disposable evaluation workspace.

## License

[GNU General Public License v3.0](./LICENSE)
