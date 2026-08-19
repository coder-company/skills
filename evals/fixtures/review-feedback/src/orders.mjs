export function listOrders(database) {
  return database.orders.findMany({ include: { user: true } });
}
