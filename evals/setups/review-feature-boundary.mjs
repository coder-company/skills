import { execFileSync } from "node:child_process";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { resolve } from "node:path";

const workspace = process.argv[2];
if (!workspace) throw new Error("workspace path is required");

function git(...args) {
  execFileSync("git", args, { cwd: workspace, stdio: "ignore" });
}

await mkdir(resolve(workspace, "src"), { recursive: true });
await mkdir(resolve(workspace, "test"), { recursive: true });
await writeFile(resolve(workspace, "package.json"), '{"type":"module","scripts":{"test":"node --test"}}\n');
await writeFile(resolve(workspace, "src/charge.mjs"), `export async function chargeWithRetry(payment, gateway) {
  return gateway.charge(payment, { idempotencyKey: payment.id });
}
`);
await writeFile(resolve(workspace, "test/charge.test.mjs"), `import assert from "node:assert/strict";
import test from "node:test";
import { chargeWithRetry } from "../src/charge.mjs";

test("charges a payment", async () => {
  const calls = [];
  const gateway = { async charge(payment, options) { calls.push([payment, options]); return "ok"; } };
  assert.equal(await chargeWithRetry({ id: "pay-1" }, gateway), "ok");
  assert.equal(calls[0][1].idempotencyKey, "pay-1");
});
`);

git("init", "-b", "main");
git("config", "user.name", "Skill Eval");
git("config", "user.email", "eval@example.invalid");
git("add", ".");
git("commit", "-m", "initial payment helper");
git("checkout", "-b", "retry-payments");

await writeFile(resolve(workspace, "src/charge.mjs"), `export async function chargeWithRetry(payment, gateway) {
  let lastError;
  for (let attempt = 1; attempt <= 2; attempt += 1) {
    try {
      return await gateway.charge(payment, { idempotencyKey: \`\${payment.id}-\${attempt}\` });
    } catch (error) {
      lastError = error;
    }
  }
  throw lastError;
}
`);
git("add", "src/charge.mjs");
git("commit", "-m", "retry timed out charges");

await writeFile(resolve(workspace, "src/charge.mjs"), `${await readFile(resolve(workspace, "src/charge.mjs"), "utf8")}\n// Retry count is intentionally capped.\n`);
git("add", "src/charge.mjs");
await writeFile(resolve(workspace, "test/charge.test.mjs"), (await readFile(resolve(workspace, "test/charge.test.mjs"), "utf8")).replace("charges a payment", "charges one payment"));
await writeFile(resolve(workspace, "review-notes.txt"), "Confirm retry behavior with the gateway team.\n");
