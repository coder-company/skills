---
name: guide-manual-steps
description: Guide a person through steps that require their identity, physical presence, private credential entry, or an interface the agent cannot operate. Use for third-party dashboards, device confirmation, account ownership, secret entry, or cutovers where the agent must hand over control and verify each returned state.
---

# Guide manual steps

## Confirm that the step must be manual

Use available read-only tools, APIs, browser control, repository configuration, and authoritative documentation before handing work to the user.

A step is manual when it requires:

- the user's identity or legal acknowledgment;
- private credential or payment entry the agent must not receive;
- hardware, biometric, mobile, or physical confirmation;
- access to an interface the current environment cannot inspect or control;
- a product decision that cannot be inferred from technical evidence.

Do not ask the user to copy commands, navigate pages, or inspect values that the agent can safely handle with available tools. Do not invent manual work to avoid a recoverable automation failure.

For a single question, approval, or one-click confirmation, ask it directly and do not expand it into the step format below.

## Resolve the exact starting state

Identify the product, account, environment, current screen or resource, intended result, and rollback boundary. Use current first-party instructions when the interface or procedure can change.

Do not assume menu labels or page order from memory. If the live interface cannot be inspected, say which version or documentation the instructions use and give the user a checkpoint that can reveal drift.

Protect secrets. Ask the user to enter a credential into the owning product, not to paste it into chat. Refer to secret names or storage locations without exposing values.

## Give one verifiable action at a time

For each step, provide:

1. **Location:** Where the user should be before acting.
2. **Action:** One concrete click, selection, entry, or physical confirmation.
3. **Expected result:** The visible state, stable identifier, or message that proves the action landed.
4. **Stop condition:** A mismatch, warning, account, target, or irreversible effect that should prevent the next step.

Use exact UI labels only when verified. Put warnings immediately before the action they govern. Do not hide an irreversible action in a long list.

Ask for non-secret evidence such as a visible status, redacted screenshot, resource ID, or confirmation message. Do not ask the user to report success without naming what they should observe.

## Keep agent and human work separate

State which steps the agent will complete before and after the manual action. Prepare everything reversible first so the user's attention is needed for the smallest possible window.

After the user returns evidence, validate it and continue automatically where authority permits. Do not make the user repeat context or execute agent-capable cleanup.

If the returned state differs from the checkpoint, stop and re-resolve the interface. Do not tell the user to keep clicking through an unknown screen.

## Finish at the owning system

Verify the final resource, account, callback, configuration, or external state from the authoritative system when possible. A user's click is not proof that an asynchronous operation completed.

Report what the user completed, what the agent completed, the verified final state, and any recovery or follow-up action. Never echo a secret value back or write it to a file, report, or transcript. Delete any screenshot or evidence file once it has been validated.
