---
name: trace-code-history
description: Explain why code, architecture, configuration, or a workaround exists by tracing repository history and durable decision evidence. Use when the user asks why something was built this way, whether a constraint still applies, or which original decision a proposed change could undo.
---

# Trace code history

## Separate how from why

First establish what the current code does from callers, data flow, tests, and runtime behavior. Then investigate why that shape was chosen.

Current behavior does not prove original intent. A comment can be stale. A commit message can describe the change without explaining the decision. Treat each source according to what it can establish.

If the user asks only how a subsystem works, explain the current path without inventing rationale or opening a historical investigation.

## Build the evidence chain

Search proportionally across:

- ADRs, design documents, specifications, and issue discussions;
- commits that introduced and materially changed the code;
- blame as a pointer to those commits, not as a conclusion;
- tests and compatibility fixtures added with the decision;
- dependency versions, platform constraints, incidents, or migration notes;
- current callers that still rely on the behavior.

Prefer sources created near the decision, but check whether later evidence superseded them. Cite exact files, commits, issues, or lines that are available in the current environment.

Do not infer author motivation from a code pattern alone. Do not present a plausible architectural story as recorded intent.

## Classify each conclusion

Use one of:

- **Recorded decision:** A durable source states the rationale and scope.
- **Behavioral constraint:** Tests, callers, or runtime evidence prove what must remain, even if the original rationale is missing.
- **Historical inference:** Several sources support a likely explanation but do not state it directly.
- **Unknown:** Available evidence does not establish why.
- **Superseded:** The original reason is recorded, but later changes remove or replace the constraint.

Keep these labels close to the claims they qualify.

## Test whether the reason still applies

Trace the original constraint to current state:

- Is the affected dependency or platform version still pinned?
- Do external consumers still use the contract?
- Does the failure the workaround prevented still reproduce?
- Did a migration or redesign remove the old boundary?
- Does a later ADR explicitly replace the decision?

Absence of a local caller is not proof that a public contract is unused. Lack of a current failure is not proof that a guard is obsolete.

When a safe, bounded check can settle the question, run it. Otherwise state the remaining uncertainty and the evidence needed to remove the constraint.

## Return the useful explanation

Lead with the current answer. Then give:

- what the code does now;
- the recorded decision or strongest evidence for why;
- what is fact, inference, unknown, or superseded;
- whether the constraint still applies;
- the consequence of changing it.

Do not create a repository history document unless the user asks or the decision belongs in the project's established durable record.
