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
    const value = line.slice(separator + 1).trim();
    if (!value.startsWith('"') && !value.startsWith("'") && value.includes(": ")) {
      errors.push(`${path}: plain YAML scalar contains an unquoted colon`);
    }
    fields[line.slice(0, separator).trim()] = value;
  }
  return fields;
}

const skillFiles = await findSkillFiles(skillsRoot);
const skillNames = new Set();
const requiredSections = ["## Stop signals", "## Shortcuts that fail", "## Report", "## Critical failures"];
const vagueWords = /\b(properly|carefully|robust|comprehensive|thorough|thoroughly|seamless|seamlessly|high quality|state of the art|battle-tested)\b/gi;
const maxBodyLines = 500;
const maxDescriptionChars = 500;
const maxBodyWords = 1000;
const broadSkills = new Set(["find-the-bug", "keep-code-boring", "review-the-diff", "write-a-skill"]);
const maxBroadBodyWords = 1350;
let totalDescriptionChars = 0;

function checkBody(text, displayPath, name) {
  const lines = text.split("\n");
  const wordLimit = broadSkills.has(name) ? maxBroadBodyWords : maxBodyWords;
  if (lines.length > maxBodyLines) {
    errors.push(`${displayPath}: ${lines.length} lines exceeds ${maxBodyLines}`);
  }
  lines.forEach((line, index) => {
    if (/[\u2013\u2014]/.test(line)) {
      errors.push(`${displayPath}:${index + 1}: contains an em or en dash`);
    }
  });
  for (const section of requiredSections) {
    if (!text.includes(`\n${section}`)) {
      errors.push(`${displayPath}: missing section ${section}`);
    }
  }
  const body = text.replace(/^---[\s\S]*?---\n/, "");
  const words = body.split(/\s+/).filter(Boolean).length;
  if (words > wordLimit) {
    errors.push(`${displayPath}: body is ${words} words; limit ${wordLimit}`);
  }
  const prose = text.replace(/`[^`\n]*`/g, "").replace(/"[^"\n]*"/g, "");
  const vague = [...prose.matchAll(vagueWords)].map((match) => match[0]);
  if (vague.length) {
    errors.push(`${displayPath}: vague quality words: ${[...new Set(vague.map((word) => word.toLowerCase()))].join(", ")}`);
  }
}

function checkDescription(description, displayPath) {
  const value = description.replace(/^["']|["']$/g, "");
  if (value.length > maxDescriptionChars) {
    errors.push(`${displayPath}: description is ${value.length} characters; limit ${maxDescriptionChars} (descriptions load into every session)`);
  }
  if (/[<>]/.test(value)) errors.push(`${displayPath}: description contains angle brackets`);
  if (!/\bUse when\b/.test(value)) errors.push(`${displayPath}: description lacks a "Use when" trigger clause`);
  if (!/\bDo not use\b/.test(value)) errors.push(`${displayPath}: description lacks a "Do not use" near-miss clause`);
}

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
  if (fields.name && (fields.name.length > 64 || !/^[a-z0-9]+(-[a-z0-9]+)*$/.test(fields.name))) {
    errors.push(`${displayPath}: name must be kebab-case and at most 64 characters`);
  }
  if (!fields.description) errors.push(`${displayPath}: missing description`);
  if (fields.description) {
    checkDescription(fields.description, displayPath);
    totalDescriptionChars += fields.description.length;
  }
  checkBody(text, displayPath, fields.name);

  const folderName = path.split("/").at(-2);
  if (fields.name && fields.name !== folderName) {
    errors.push(`${displayPath}: name ${fields.name} does not match folder ${folderName}`);
  }
  if (fields.name) skillNames.add(fields.name);

  for (const [, reference] of text.matchAll(/`((?:references|scripts)\/[^`\s<]+\.(?:md|sh|mjs|js|py))/g)) {
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
  if (!Array.isArray(testCase.critical_failures) || testCase.critical_failures.length === 0) {
    errors.push(`${testCase.id}: missing critical_failures (the grader has no automatic-loss condition without them)`);
  }
  if (testCase.fixture && !(await exists(join(root, testCase.fixture)))) {
    errors.push(`${testCase.id}: missing fixture ${testCase.fixture}`);
  }
  if (testCase.setup !== undefined && (!Array.isArray(testCase.setup) || testCase.setup.length === 0)) {
    errors.push(`${testCase.id}: setup must be a non-empty command array`);
  }
  if (testCase.verify !== undefined && (!Array.isArray(testCase.verify) || testCase.verify.length === 0)) {
    errors.push(`${testCase.id}: verify must be a non-empty command array`);
  }
}

const casesPerSkill = new Map();
for (const testCase of cases) casesPerSkill.set(testCase.skill, (casesPerSkill.get(testCase.skill) ?? 0) + 1);
for (const name of skillNames) {
  if ((casesPerSkill.get(name) ?? 0) < 2) errors.push(`evals/cases.json: ${name} has fewer than 2 evaluation cases`);
}

console.log(`descriptions: ${skillFiles.length} skills, ${totalDescriptionChars} chars (~${Math.round(totalDescriptionChars / 4)} tokens in every session)`);

if (errors.length) {
  for (const error of errors) console.error(`FAIL ${error}`);
  process.exitCode = 1;
} else {
  console.log(`PASS ${skillFiles.length} skills and ${cases.length} evaluation cases`);
}
