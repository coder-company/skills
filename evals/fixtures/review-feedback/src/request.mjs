import { openConnection } from "./connection.mjs";

export async function runRequest(operation) {
  const connection = openConnection();
  const result = await operation();
  connection.close();
  return result;
}
