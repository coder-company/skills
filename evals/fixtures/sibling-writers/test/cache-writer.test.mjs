import assert from "node:assert/strict";
import test from "node:test";
import { writeCache } from "../src/cache-writer.mjs";

test("the reported cache writer never truncates the live target", async () => {
  const operations = [];
  const filesystem = {
    async writeFile(path, contents) {
      operations.push(["writeFile", path, contents]);
    },
    async rename(from, to) {
      operations.push(["rename", from, to]);
    },
  };

  await writeCache("cache.json", "fresh", filesystem);

  assert.deepEqual(operations, [
    ["writeFile", "cache.json.tmp", "fresh"],
    ["rename", "cache.json.tmp", "cache.json"],
  ]);
});
