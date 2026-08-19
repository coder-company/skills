import assert from "node:assert/strict";
import test from "node:test";
import { getActiveConnections } from "../src/connection.mjs";
import { runRequest } from "../src/request.mjs";

test("closes the connection when the request fails", async () => {
  await assert.rejects(() => runRequest(async () => {
    throw new Error("boom");
  }));
  assert.equal(getActiveConnections(), 0);
});
