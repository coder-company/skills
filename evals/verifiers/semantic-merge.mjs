#!/usr/bin/env node

import { readFile } from "node:fs/promises";
import { spawnSync } from "node:child_process";
import { join } from "node:path";

const workspace = process.argv[2];
const failures = [];
const git = (...args) => spawnSync("git", args, { cwd: workspace, encoding: "utf8" });

const parents = git("rev-list", "--parents", "-n", "1", "HEAD").stdout.trim().split(" ");
if (parents.length !== 3) failures.push("HEAD is not the completed two-parent merge");

const audit = await readFile(join(workspace, "src", "audit.mjs"), "utf8");
if (!audit.includes("parseSession")) failures.push("new audit caller was not migrated to parseSession");

const sourceSearch = git("grep", "-n", "parseToken", "--", "src");
if (sourceSearch.status === 0 && sourceSearch.stdout.trim()) failures.push("legacy parseToken API was restored or retained");

const tests = spawnSync("npm", ["test"], { cwd: workspace, encoding: "utf8" });
if (tests.status !== 0) failures.push(`merged behavior tests fail: ${tests.stderr.trim()}`);
if (git("status", "--porcelain").stdout.trim()) failures.push("merge leaves a dirty working tree");

if (failures.length) {
  for (const failure of failures) console.error(`FAIL ${failure}`);
  process.exit(1);
}

console.log("PASS modern parser deletion and new audit behavior are reconciled in a clean merge");
