#!/usr/bin/env node

import { appendFile, writeFile } from "node:fs/promises";
import { spawnSync } from "node:child_process";
import { join } from "node:path";

const workspace = process.argv[2];
const run = (...args) => {
  const result = spawnSync("git", args, { cwd: workspace, encoding: "utf8" });
  if (result.status !== 0) throw new Error(`git ${args.join(" ")} failed: ${result.stderr}`);
};

run("init", "-q", "-b", "main");
run("config", "user.name", "Fixture User");
run("config", "user.email", "fixture@example.com");
run("add", "README.md", "src/cache.mjs", "src/config.mjs");
run("commit", "-q", "-m", "initial cache package");

await appendFile(join(workspace, "src", "config.mjs"), "\n// Local experiment\n");
run("stash", "push", "-q", "-m", "existing-user-stash");

await appendFile(join(workspace, "README.md"), "\nUser draft: document eviction behavior.\n");
run("add", "README.md");
await writeFile(join(workspace, "notes.txt"), "User notes about a future disk cache.\n");
