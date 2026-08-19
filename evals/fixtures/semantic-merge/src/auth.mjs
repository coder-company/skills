import { parseToken } from "./token.mjs";

export function authenticate(value) {
  return parseToken(value).subject;
}
