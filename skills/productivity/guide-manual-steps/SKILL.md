---
name: guide-manual-steps
description: Guide a person through steps that need their identity, physical presence, credential entry, or an interface the agent cannot operate, one verifiable action at a time, verifying each returned state from the owning system. Use when a task needs a third-party dashboard, device confirmation, account ownership, payment or secret entry, or the user says walk me through this. Do not use for a single question or one-click approval; ask directly. Do not use to escape a recoverable automation failure.
---

# Guide manual steps

Confirm the step is manual, resolve the exact starting state from current first-party instructions, hand over one action at a time with its expected result and stop condition, validate the evidence the user returns, and finish by verifying the owning system.

## Route first

- One question, approval, or one-click confirmation: ask it in a sentence; do not expand into steps.
- The step is automatable with available tools, APIs, or browser control: do it; do not hand it to the user.
- The step is a release or destructive action the user must authorize: `check-release-safety` or `confirm-destructive-actions` supply the gate; this skill supplies the walkthrough.

## Confirm the step must be manual

Exhaust read-only tools, APIs, browser control, repository configuration, and documentation first. A step is manual when it requires the user's identity or legal acknowledgment; credential or payment entry the agent must not receive; hardware, biometric, mobile, or physical confirmation; an interface the environment cannot inspect or control; or a product decision no technical evidence settles.

Do not ask the user to copy commands, navigate pages, or read values the agent can handle. Do not invent manual work to escape a recoverable automation failure; fix the failure.

## Resolve the starting state

Identify the product, account, environment, current screen or resource, intended result, and rollback boundary. Use current first-party instructions; do not recall menu labels or page order from memory. If the live interface cannot be inspected, name the version or documentation the instructions follow and give the user a checkpoint that would reveal drift.

Protect secrets: ask the user to enter credentials into the owning product, never into chat. Refer to secret names or storage locations, not values.

## Give one verifiable action at a time

For each step:

1. **Location:** where the user should be before acting.
2. **Action:** one click, selection, entry, or physical confirmation.
3. **Expected result:** the visible state, stable identifier, or message that proves it landed.
4. **Stop condition:** the mismatch, warning, wrong account, wrong target, or irreversible effect that must halt progress.

Use exact UI labels only when verified. Place a warning immediately before the action it governs; never bury an irreversible action in a list. Ask for non-secret evidence (visible status, redacted screenshot, resource ID, confirmation message); never ask "did it work" without naming what to observe.

## Keep agent and human work separate

State which steps the agent completes before and after the manual window, and prepare every reversible step first so the user's attention is needed for the smallest window. When evidence returns, validate it and continue automatically where authority permits; do not make the user repeat context or perform agent-capable cleanup. If the returned state differs from the checkpoint, stop and re-resolve the interface; do not tell the user to keep clicking through an unknown screen.

## Finish at the owning system

Verify the final resource, account, callback, configuration, or external state from the authoritative system when possible. A user's click is not proof an asynchronous operation completed. Delete any screenshot or evidence file once validated.

## Stop signals

- You are about to describe a menu path from memory: check current documentation or say which version you are following.
- The instruction asks for a secret in chat: redirect entry to the owning product.
- The user's returned state does not match the expected result: stop; re-resolve before the next step.
- You are giving three actions in one step: split them.

## Shortcuts that fail

- "Click through Settings, then Security, then Tokens": the labels moved last quarter; the user is lost at step two and you cannot see where.
- "Paste the token here and I'll configure it": the token is now in a transcript and possibly a log.
- "Let me know when it's done": the user reports done; the asynchronous provisioning failed silently.
- "Do the whole flow manually, automation is being flaky": the flaky automation was recoverable, and the user now owns a task the agent should have.

## Report

State what the user completed and what the agent completed; the verified final state from the owning system with the identifier observed; any recovery or follow-up action; and confirmation that evidence files were deleted. Never echo a secret value in the report. If the flow stopped at a checkpoint mismatch, report the last verified state and what differed.

## Critical failures

- A secret value requested in chat, echoed, or written to a file or report.
- A step handed to the user that available tools could perform.
- Completion claimed from the user's report without verifying the owning system where verification was possible.
- Irreversible action given without an immediately preceding warning and stop condition.
- UI labels or paths stated as exact without verification.
