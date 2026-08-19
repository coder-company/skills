import { readFile } from "node:fs/promises";
import { spawnSync } from "node:child_process";
import { pathToFileURL } from "node:url";
import { join, resolve } from "node:path";

const workspace = resolve(process.argv[2]);
const testFile = await readFile(join(workspace, "test/slug.test.mjs"), "utf8");

if (!/trailing slash/i.test(testFile)) {
  throw new Error("missing a focused trailing-slash regression test");
}

const { parseSlug } = await import(pathToFileURL(join(workspace, "src/slug.mjs")));
assertRejectsTrailingSlash(parseSlug);

const run = spawnSync(process.execPath, ["--test"], {
  cwd: workspace,
  encoding: "utf8",
});

if (run.status !== 0) {
  throw new Error(`fixture tests failed\n${run.stdout}\n${run.stderr}`);
}

console.log("PASS trailing slash is rejected and the regression suite passes");

function assertRejectsTrailingSlash(parser) {
  try {
    parser("docs/");
  } catch {
    return;
  }
  throw new Error("parseSlug still accepts a trailing slash");
}
