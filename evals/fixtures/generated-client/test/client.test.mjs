import assert from "node:assert/strict";
import test from "node:test";
import { acceptsUser } from "../src/user.mjs";

test("accepts an active user with no deletion timestamp", () => {
  assert.equal(acceptsUser({ id: "u_1", deletedAt: null }), true);
});

test("accepts a deleted user with a timestamp", () => {
  assert.equal(acceptsUser({ id: "u_2", deletedAt: "2026-08-19T00:00:00Z" }), true);
});
