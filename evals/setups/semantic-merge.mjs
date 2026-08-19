#!/usr/bin/env node

import { writeFile } from "node:fs/promises";
import { spawnSync } from "node:child_process";
import { join } from "node:path";

const workspace = process.argv[2];
const git = (...args) => {
  const result = spawnSync("git", args, { cwd: workspace, encoding: "utf8" });
  if (result.status !== 0) throw new Error(`git ${args.join(" ")} failed: ${result.stderr}`);
};

git("init", "-q", "-b", "main");
git("config", "user.name", "Fixture User");
git("config", "user.email", "fixture@example.com");
git("add", ".");
git("commit", "-q", "-m", "add legacy token parser");
const base = spawnSync("git", ["rev-parse", "HEAD"], { cwd: workspace, encoding: "utf8" }).stdout.trim();

git("switch", "-q", "-c", "modernize");
await writeFile(join(workspace, "src", "token.mjs"), "export function parseSession(value) {\n  return { subject: value.split(\":\")[1] };\n}\n");
await writeFile(join(workspace, "src", "auth.mjs"), "import { parseSession } from \"./token.mjs\";\n\nexport function authenticate(value) {\n  return parseSession(value).subject;\n}\n");
git("add", "src/token.mjs", "src/auth.mjs");
git("commit", "-q", "-m", "replace legacy parser with session parser");

git("switch", "-q", "-c", "feature-audit", base);
await writeFile(join(workspace, "src", "audit.mjs"), "import { parseToken } from \"./token.mjs\";\n\nexport function auditSubject(value) {\n  return `audit:${parseToken(value).subject}`;\n}\n");
await writeFile(join(workspace, "test", "audit.test.mjs"), "import assert from \"node:assert/strict\";\nimport test from \"node:test\";\nimport { auditSubject } from \"../src/audit.mjs\";\n\ntest(\"audits the session subject\", () => {\n  assert.equal(auditSubject(\"session:u_2\"), \"audit:u_2\");\n});\n");
git("add", "src/audit.mjs", "test/audit.test.mjs");
git("commit", "-q", "-m", "add audit consumer for session subjects");
