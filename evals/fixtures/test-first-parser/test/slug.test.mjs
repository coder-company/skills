import assert from "node:assert/strict";
import test from "node:test";

import { parseSlug } from "../src/slug.mjs";

test("normalizes a leading slash", () => {
  assert.equal(parseSlug("/docs"), "docs");
});
