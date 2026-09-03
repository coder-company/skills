---
name: install-system-cli
description: Install or upgrade one CLI from its authoritative release channel while exposing one system-wide command and keeping configuration separate. Use when asked "install the latest CLI", "make this available to everyone", or "use the official curl installer" on a managed Linux host. Do not use for project dependencies or tools already current in the native system package set.
---

# Install a system CLI

Install one verified payload, expose one command through the host's system profile, and keep mutable configuration and credentials outside the installation. Treat the host configuration as the source of truth for how commands enter `PATH`.

## Route first

- For a project dependency pinned by a lockfile, use the project's package manager and do not load this skill.
- If the current tool is already packaged at the required version in the host's native declarative package set, add that package directly instead of creating a vendor payload.
- If the request is only to compare releases or installation methods, use `show-your-sources` and do not change the host.
- For an unexplained broken installation, use `find-the-bug` before replacing it.

## Establish ownership

Read the host configuration, current `PATH`, all matching commands from `type -a`, and conventional installation locations before changing anything. Identify the package manager or declarative profile that owns system commands. Record existing config, auth, data, services, and payload paths separately.

Choose the release channel from current primary evidence. Prefer, in order: a current package in the host's declarative package set; the vendor's signed or checksummed release artifact; the vendor's documented installer. Do not choose npm, pip, Homebrew, or a community installer merely because it is shorter. Use one of those only when the vendor identifies it as the supported channel for that CLI.

Stop if two maintained upstreams provide materially different products and the user's wording does not select one.

## Install one payload

When the native declarative package is current, add it to the existing system package list and rebuild the host.

When the vendor release must live outside the immutable store, use this layout unless the existing host contract names another one:

```text
/opt/<tool>/releases/<version>/...
/opt/<tool>/bin/<command> -> /opt/<tool>/releases/<version>/<command>
system profile <command> -> /opt/<tool>/bin/<command>
```

Download to a temporary path, verify the published checksum or signature, inspect the archive paths, then install with root ownership and executable permissions. Switch the stable `/opt` link only after the payload passes a direct version or help check. Keep the previous release until the new command passes the final smoke test, then follow the user's retention policy.

Expose exactly one canonical command in the existing declarative system profile. On NixOS, add a small `runCommand` launcher to `environment.systemPackages` only when the vendor payload cannot be expressed as a current Nix package. Rebuild with `nixos-rebuild switch`; do not use `nix profile install` as a second system profile.

Do not create a user-local copy, global language-package install, compatibility alias, background service, default config, or login item unless the request requires it. Never move credentials into `/opt`.

## Preserve mutable state

Before an upgrade, determine whether config, auth, plugins, databases, logs, or service definitions live beneath the old payload. Move none of them by assumption. Preserve their paths and permissions, and pass the existing config path explicitly when the service or command requires it.

For a new install, leave configuration and authentication untouched unless the user also asked to configure or start the tool. A successful binary installation does not imply a configured service.

## Verify the real command

Open a fresh login shell as the intended user. Verify:

- `type -a <command>` reports one usable command;
- `readlink -f "$(command -v <command>)"` reaches the intended release;
- the command reports the expected version or renders help without loader errors;
- the payload is root-owned and not writable by ordinary users;
- no unintended user-local, language-package, or second profile copy exists;
- the declarative host configuration contains the launcher or package;
- configuration, credentials, and services changed only when requested.

If any check fails, keep the work open and repair the installation or restore the previous stable link.

## Stop signals

- The latest release is known only from a search snippet: query the upstream release API or release page.
- The archive has no verifiable digest or signature: inspect the vendor's documented installer and build provenance before executing it.
- A command already resolves from more than one path: inventory ownership before installing another copy.
- The new binary requires config to start: verify with a non-starting version or help command and leave configuration for its own task.

## Shortcuts that fail

- "Install the package with the shortest command": it may select a stale or unofficial channel. Verify ownership and version first.
- "Put it in `~/.local/bin` for now": it creates a second personal command outside the system contract. Use the existing system profile.
- "Run the curl script as root": it can mix payload, config, service, and update state. Inspect it or install its verified release artifact.
- "Copy the working directory from another machine": it can copy credentials, stale binaries, and machine-specific state. Transfer mutable state only in a separate authorized task.
- "The rebuild succeeded, so the CLI works": a profile symlink can still be dangling or the binary can lack a loader. Test from a fresh login shell.

## Report

State the installed version, authoritative source, canonical command, resolved payload path, verification performed, and whether configuration or a service remains intentionally absent. If no change was needed, say: "No installation changed: the system profile already exposes the requested current version from its authoritative package."

## Critical failures

- More than one usable installation or command path remains after the task.
- An unverified artifact or unofficial channel is installed when an authoritative release exists.
- Credentials or configuration are copied, replaced, or exposed without authorization.
- The declarative host configuration does not own the resulting system command.
- Completion is reported without testing the command from the intended user's fresh login shell.
