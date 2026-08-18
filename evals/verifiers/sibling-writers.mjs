import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { pathToFileURL } from "node:url";
import { resolve } from "node:path";

const workspace = process.argv[2];
if (!workspace) throw new Error("workspace path is required");

const modules = [
  ["src/cache-writer.mjs", "writeCache"],
  ["packages/session/cache.mjs", "writeSessionCache"],
  ["plugins/image/cache.mjs", "writeImageCache"],
];

for (const [relativePath, exportName] of modules) {
  const moduleUrl = `${pathToFileURL(resolve(workspace, relativePath)).href}?verify=${Date.now()}`;
  const loaded = await import(moduleUrl);
  const operations = [];
  const filesystem = {
    async writeFile(path, contents) {
      operations.push(["writeFile", path, contents]);
    },
    async rename(from, to) {
      operations.push(["rename", from, to]);
    },
  };
  await loaded[exportName]("cache.json", "fresh", filesystem);
  assert.deepEqual(operations, [
    ["writeFile", "cache.json.tmp", "fresh"],
    ["rename", "cache.json.tmp", "cache.json"],
  ], `${relativePath} still exposes an empty target`);
}

const auditWriter = await readFile(resolve(workspace, "src/audit-writer.mjs"), "utf8");
assert.equal(auditWriter, `export async function writeAudit(path, contents, filesystem) {\n  const temporaryPath = \`\${path}.tmp\`;\n  await filesystem.writeFile(temporaryPath, contents);\n  await filesystem.rename(temporaryPath, path);\n}\n`, "already-safe audit writer changed");

console.log("PASS all confirmed sibling writers fixed and safe writer preserved");
