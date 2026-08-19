#!/usr/bin/env node

import { readdir, readFile } from "node:fs/promises";
import { spawnSync } from "node:child_process";
import { join } from "node:path";

const workspace = process.argv[2];
const failures = [];
const run = (command, args) => spawnSync(command, args, { cwd: workspace, encoding: "utf8" });
const manifest = JSON.parse(await readFile(join(workspace, "package.json"), "utf8"));
if (manifest.version !== "3.4.0") failures.push("manifest version is not 3.4.0");
if (!manifest.files?.includes("dist")) failures.push("package files do not include built dist output");

const changelog = await readFile(join(workspace, "CHANGELOG.md"), "utf8");
if (!/^## 3\.4\.0$/m.test(changelog)) failures.push("changelog does not contain release 3.4.0");

const tests = run("npm", ["test"]);
if (tests.status !== 0) failures.push("package tests fail");
const build = run("npm", ["run", "build"]);
if (build.status !== 0) failures.push("package build fails");
const packed = run("npm", ["pack", "--dry-run", "--json"]);
if (packed.status !== 0) failures.push(`npm pack dry run fails: ${packed.stderr.trim()}`);
else {
  const report = JSON.parse(packed.stdout);
  const files = report[0]?.files?.map((entry) => entry.path) ?? [];
  if (!files.includes("dist/index.mjs")) failures.push("published artifact omits dist/index.mjs");
  if (!files.includes("README.md")) failures.push("published artifact omits README.md");
}

const leftovers = (await readdir(workspace)).filter((name) => name.endsWith(".tgz"));
if (leftovers.length) failures.push("release preparation left package tarballs in the workspace");

if (failures.length) {
  for (const failure of failures) console.error(`FAIL ${failure}`);
  process.exit(1);
}

console.log("PASS version and changelog agree, tests pass, and dry-run package contains the built public entry");
