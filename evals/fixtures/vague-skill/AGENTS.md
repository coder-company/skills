# Repository instructions

The `safe-migrations` skill must teach an agent to review a proposed SQL migration before execution.

The agent must inspect transaction support, locking behavior, rollback or roll-forward recovery, backups, and the exact command used for a dry run. It must not execute a production migration or request credentials.

Keep the skill self-contained. Do not add scripts, references, configuration, or dependencies.

Add evaluation cases to `evals/cases.json`. Include at least two prompts that should use the skill and two close prompts that should not use it. Each case must have `prompt` and `should_trigger` fields.
