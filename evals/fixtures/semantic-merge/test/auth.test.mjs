import assert from "node:assert/strict";
import test from "node:test";
import { authenticate } from "../src/auth.mjs";

test("authenticates a session token", () => {
  assert.equal(authenticate("session:u_1"), "u_1");
});
