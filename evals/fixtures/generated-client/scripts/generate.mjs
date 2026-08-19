import { mkdir, readFile, writeFile } from "node:fs/promises";

const schema = JSON.parse(await readFile("schemas/user.json", "utf8"));
const nullable = schema.fields.deletedAt.nullable;
const output = `// Generated from schemas/user.json by npm run generate. Do not edit.\nexport const deletedAtNullable = ${nullable};\n`;

await mkdir("src/generated", { recursive: true });
await writeFile("src/generated/user-client.mjs", output);
