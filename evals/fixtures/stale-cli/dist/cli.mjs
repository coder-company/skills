import { formatStatus } from "./format.mjs";

console.log(formatStatus(process.argv[2] ?? "unknown"));
