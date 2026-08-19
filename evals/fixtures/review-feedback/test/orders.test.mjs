import assert from "node:assert/strict";
import test from "node:test";
import { listOrders } from "../src/orders.mjs";

test("loads orders and users in one query", async () => {
  let queries = 0;
  const database = {
    orders: {
      findMany(options) {
        queries += 1;
        assert.deepEqual(options, { include: { user: true } });
        return [{ id: "o_1", user: { id: "u_1" } }];
      },
    },
  };

  const orders = await listOrders(database);
  assert.equal(queries, 1);
  assert.equal(orders[0].user.id, "u_1");
});
