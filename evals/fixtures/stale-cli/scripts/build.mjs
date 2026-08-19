import { copyFile } from "node:fs/promises";

await copyFile("src/format.mjs", "dist/format.mjs");
