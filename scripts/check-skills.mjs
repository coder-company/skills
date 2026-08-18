#!/usr/bin/env node

import { readFile, readdir, stat } from "node:fs/promises";
import { join, relative } from "node:path";
import process from "node:process";

const root = process.argv[2] ?? process.cwd();
const skillsRoot = join(root, "skills");
const errors = [];

async function exists(path) {
  try {
    await stat(path);
    return true;
  } catch {
    return false;
  }
}

async function findSkillFiles(directory) {
  const found = [];
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    const path = join(directory, entry.name);
    if (entry.isDirectory()) {
      found.push(...(await findSkillFiles(path)));
    } else if (entry.name === "SKILL.md") {
      found.push(path);
    }
  }
  return found;
}

function parseFrontmatter(text, path) {
  const match = text.match(/^---\n([\s\S]*?)\n---\n/);
  if (!match) {
    errors.push(`${path}: missing YAML frontmatter`);
    return {};
  }

  const fields = {};
  for (const line of match[1].split("\n")) {
    const separator = line.indexOf(":");
    if (separator === -1) continue;
    fields[line.slice(0, separator).trim()] = line.slice(separator + 1).trim();
  }
  return fields;
}

const skillFiles = await findSkillFiles(skillsRoot);
const skillNames = new Set();

for (const path of skillFiles) {
  const text = await readFile(path, "utf8");
  const displayPath = relative(root, path);
  const fields = parseFrontmatter(text, displayPath);
  const allowedFields = new Set(["name", "description"]);

  for (const field of Object.keys(fields)) {
    if (!allowedFields.has(field)) {
      errors.push(`${displayPath}: unsupported frontmatter field ${field}`);
    }
  }
  if (!fields.name) errors.push(`${displayPath}: missing name`);
  if (!fields.description) errors.push(`${displayPath}: missing description`);

  const folderName = path.split("/").at(-2);
  if (fields.name && fields.name !== folderName) {
    errors.push(`${displayPath}: name ${fields.name} does not match folder ${folderName}`);
  }
  if (fields.name) skillNames.add(fields.name);

  for (const [, reference] of text.matchAll(/`(references\/[^`]+\.md)`/g)) {
    const referencePath = join(path, "..", reference);
    if (!(await exists(referencePath))) {
      errors.push(`${displayPath}: missing ${reference}`);
    }
  }

  const metadataPath = join(path, "..", "agents", "openai.yaml");
  if (!(await exists(metadataPath))) {
    errors.push(`${displayPath}: missing agents/openai.yaml`);
  } else {
    const metadata = await readFile(metadataPath, "utf8");
    if (fields.name && !metadata.includes(`$${fields.name}`)) {
      errors.push(`${relative(root, metadataPath)}: default prompt must mention $${fields.name}`);
    }
  }
}

const casesPath = join(root, "evals", "cases.json");
const cases = JSON.parse(await readFile(casesPath, "utf8"));
const caseIds = new Set();

for (const testCase of cases) {
  if (!testCase.id || caseIds.has(testCase.id)) errors.push(`evals/cases.json: duplicate or missing id ${testCase.id}`);
  caseIds.add(testCase.id);
  if (!skillNames.has(testCase.skill)) errors.push(`${testCase.id}: unknown skill ${testCase.skill}`);
  if (!testCase.prompt?.trim()) errors.push(`${testCase.id}: missing prompt`);
  if (!Array.isArray(testCase.assertions) || testCase.assertions.length === 0) {
    errors.push(`${testCase.id}: missing assertions`);
  }
}

if (errors.length) {
  for (const error of errors) console.error(`FAIL ${error}`);
  process.exitCode = 1;
} else {
  console.log(`PASS ${skillFiles.length} skills and ${cases.length} evaluation cases`);
}
