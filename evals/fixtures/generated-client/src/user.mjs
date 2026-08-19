import { deletedAtNullable } from "./generated/user-client.mjs";

export function acceptsUser(user) {
  if (typeof user.id !== "string") return false;
  if (user.deletedAt === null) return deletedAtNullable;
  return typeof user.deletedAt === "string";
}
