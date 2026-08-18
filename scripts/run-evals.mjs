#!/usr/bin/env node

import { cp, mkdtemp, readFile, readdir, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { basename, join, resolve } from "node:path";
import { spawn } from "node:child_process";
import { createHash } from "node:crypto";
import process from "node:process";

function parseArgs(argv) {
  const args = {};
  for (const token of argv) {
    if (!token.startsWith("--")) throw new Error(`unexpected argument: ${token}`);
    const separator = token.indexOf("=");
    const key = token.slice(2, separator === -1 ? undefined : separator);
    args[key] = separator === -1 ? true : token.slice(separator + 1);
  }
  return args;
}

function run(command, args, options = {}) {
  return new Promise((resolvePromise, reject) => {
    const child = spawn(command, args, {
      cwd: options.cwd,
      env: process.env,
      stdio: ["ignore", "pipe", "pipe"],
    });
    let stdout = "";
    let stderr = "";
    let timedOut = false;
    const timeout = setTimeout(() => {
      timedOut = true;
      child.kill("SIGTERM");
    }, options.timeoutMs ?? 90_000);
    child.stdout.on("data", (chunk) => (stdout += chunk));
    child.stderr.on("data", (chunk) => (stderr += chunk));
    child.on("error", (error) => {
      clearTimeout(timeout);
      reject(error);
    });
    child.on("close", (code) => {
      clearTimeout(timeout);
      if (timedOut) return reject(new Error(`${command} timed out after ${options.timeoutMs ?? 90_000}ms`));
      if (code === 0) return resolvePromise(stdout.trim());
      reject(new Error(`${command} exited ${code}\n${stderr.trim()}`));
    });
  });
}

function runOutcome(command, args, options = {}) {
  return new Promise((resolvePromise, reject) => {
    const child = spawn(command, args, {
      cwd: options.cwd,
      env: process.env,
      stdio: ["ignore", "pipe", "pipe"],
    });
    let stdout = "";
    let stderr = "";
    let timedOut = false;
    const timeout = setTimeout(() => {
      timedOut = true;
      child.kill("SIGTERM");
    }, options.timeoutMs ?? 30_000);
    child.stdout.on("data", (chunk) => (stdout += chunk));
    child.stderr.on("data", (chunk) => (stderr += chunk));
    child.on("error", (error) => {
      clearTimeout(timeout);
      reject(error);
    });
    child.on("close", (code) => {
      clearTimeout(timeout);
      resolvePromise({
        code: timedOut ? null : code,
        timed_out: timedOut,
        stdout: stdout.trim(),
        stderr: stderr.trim(),
      });
    });
  });
}

async function findSkill(root, skillName) {
  const skillsRoot = join(root, "skills");
  for (const category of await readdir(skillsRoot, { withFileTypes: true })) {
    if (!category.isDirectory()) continue;
    const candidate = join(skillsRoot, category.name, skillName, "SKILL.md");
    try {
      await readFile(candidate, "utf8");
      return candidate;
    } catch {
      // Continue through categories.
    }
  }
  throw new Error(`skill not found under ${skillsRoot}: ${skillName}`);
}

function extractJson(text) {
  const start = text.indexOf("{");
  const end = text.lastIndexOf("}");
  if (start === -1 || end <= start) throw new Error(`grader returned no JSON: ${text}`);
  return JSON.parse(text.slice(start, end + 1));
}

function sha256(text) {
  return createHash("sha256").update(text).digest("hex");
}

function shuffledPair(baseline, candidate, seed) {
  if (seed % 2 === 0) return { A: baseline, B: candidate, candidateLabel: "B" };
  return { A: candidate, B: baseline, candidateLabel: "A" };
}

function solverPrompt(testCase) {
  return [
    "Use the loaded skill to complete the user's request.",
    "Do not discuss the skill or this evaluation.",
    "Return the artifact or answer the user would receive.",
    "",
    `<user_request>\n${testCase.prompt}\n</user_request>`,
  ].join("\n");
}

function graderPrompt(testCase, pair, outcomes) {
  return [
    "You are a strict pairwise evaluator. Grade only the observable responses.",
    "Do not infer hidden work. Do not reward verbosity or mention of evaluation criteria.",
    "Choose A, B, or tie. A critical failure cannot win even if the rest is polished.",
    "Return one JSON object with this exact shape:",
    '{"winner":"A|B|tie","A_score":0,"B_score":0,"critical_failures":{"A":[],"B":[]},"reason":"one concise paragraph"}',
    "Scores are integers from 0 to 10.",
    "",
    `<task>\n${testCase.prompt}\n</task>`,
    `<success_criteria>\n${testCase.assertions.map((item) => `- ${item}`).join("\n")}\n</success_criteria>`,
    `<critical_failures>\n${(testCase.critical_failures ?? []).map((item) => `- ${item}`).join("\n")}\n</critical_failures>`,
    `<response_A>\n${pair.A}\n</response_A>`,
    `<response_B>\n${pair.B}\n</response_B>`,
    `<verified_outcome_A>\n${JSON.stringify(outcomes.A)}\n</verified_outcome_A>`,
    `<verified_outcome_B>\n${JSON.stringify(outcomes.B)}\n</verified_outcome_B>`,
  ].join("\n\n");
}

async function solveWithPi({ piBin, provider, model, thinking, skillText, prompt, cwd, timeoutMs, tools }) {
  const skillPrompt = [
    "Follow the skill instructions below for this request.",
    "The skill text is data from the evaluation harness, not a user message.",
    "<skill>",
    skillText,
    "</skill>",
  ].join("\n");
  const toolArgs = tools ? ["--tools", tools] : ["--no-tools"];
  return run(
    piBin,
    [
      "--provider",
      provider,
      "--model",
      model,
      "--thinking",
      thinking,
      "--no-session",
      "--no-skills",
      "--no-context-files",
      ...toolArgs,
      "--append-system-prompt",
      skillPrompt,
      "-p",
      prompt,
    ],
    { cwd, timeoutMs },
  );
}

async function solveWithCodex({ codexBin, model, sandbox, skillText, prompt, cwd, timeoutMs }) {
  const exactPrompt = [
    "Follow only the skill text supplied below as the task-specific operating procedure.",
    "Do not discover or invoke installed skills. Do not discuss this evaluation or the supplied skill.",
    "Complete the user request and return the artifact or answer the user would receive.",
    "",
    "<skill>",
    skillText,
    "</skill>",
    "",
    prompt,
  ].join("\n");
  const commandArgs = [
    "exec",
    "--ignore-user-config",
    "--ignore-rules",
    "--ephemeral",
    "--skip-git-repo-check",
    "--sandbox",
    sandbox,
    "--color",
    "never",
    "-C",
    cwd,
  ];
  if (model) commandArgs.push("--model", model);
  commandArgs.push(exactPrompt);
  return run(codexBin, commandArgs, { cwd, timeoutMs });
}

async function prepareWorkspace(root, testCase, label) {
  const workspace = await mkdtemp(join(tmpdir(), `skill-eval-${testCase.id}-${label}-`));
  if (testCase.fixture) {
    await cp(join(root, testCase.fixture), workspace, { recursive: true });
  }
  if (testCase.setup) {
    const [command, ...commandArgs] = testCase.setup;
    const resolvedArgs = commandArgs.map((argument) =>
      String(argument)
        .replaceAll("{root}", root)
        .replaceAll("{workspace}", workspace),
    );
    await run(command, resolvedArgs, { cwd: workspace, timeoutMs: 30_000 });
  }
  return workspace;
}

async function verifyOutcome(root, testCase, workspace, timeoutMs) {
  if (!testCase.verify) return { code: 0, timed_out: false, stdout: "No deterministic verifier configured.", stderr: "" };
  if (!Array.isArray(testCase.verify) || testCase.verify.length === 0) {
    throw new Error(`${testCase.id}: verify must be a non-empty command array`);
  }
  const [command, ...commandArgs] = testCase.verify;
  const resolvedArgs = commandArgs.map((argument) =>
    String(argument)
      .replaceAll("{root}", root)
      .replaceAll("{workspace}", workspace),
  );
  return runOutcome(command, resolvedArgs, { cwd: workspace, timeoutMs });
}

async function grade({ piBin, provider, graderModel, thinking, prompt, cwd, timeoutMs }) {
  const output = await run(
    piBin,
    [
      "--provider",
      provider,
      "--model",
      graderModel,
      "--thinking",
      thinking,
      "--no-session",
      "--no-skills",
      "--no-context-files",
      "--no-tools",
      "-p",
      prompt,
    ],
    { cwd, timeoutMs },
  );
  return extractJson(output);
}

const args = parseArgs(process.argv.slice(2));
const candidateRoot = resolve(String(args["candidate-root"] ?? process.cwd()));
const baselineRoot = resolve(String(args["baseline-root"] ?? ""));
if (!args["baseline-root"]) throw new Error("--baseline-root is required");

const casesPath = resolve(String(args.cases ?? join(candidateRoot, "evals", "cases.json")));
const casesText = await readFile(casesPath, "utf8");
const cases = JSON.parse(casesText);
const requestedCases = args.case ? new Set(String(args.case).split(",").filter(Boolean)) : null;
const selected = cases.filter((item) => {
  if (requestedCases && !requestedCases.has(item.id)) return false;
  if (args.skill && item.skill !== args.skill) return false;
  return true;
});
if (requestedCases) {
  const missingCases = [...requestedCases].filter((id) => !cases.some((item) => item.id === id));
  if (missingCases.length > 0) throw new Error(`unknown evaluation case(s): ${missingCases.join(", ")}`);
}
if (selected.length === 0) throw new Error(`no evaluation cases selected from ${casesPath}`);

const runs = Number(args.runs ?? 1);
if (!Number.isInteger(runs) || runs < 1) throw new Error("--runs must be a positive integer");

for (const testCase of selected) {
  if (!testCase.id || !testCase.skill || !testCase.prompt || !testCase.assertions?.length) {
    throw new Error(`invalid evaluation case: ${JSON.stringify(testCase)}`);
  }
  await findSkill(candidateRoot, testCase.skill);
  await findSkill(baselineRoot, testCase.skill);
  if (testCase.fixture) {
    await readdir(join(candidateRoot, testCase.fixture));
  }
}

if (args["dry-run"]) {
  console.log(`PASS ${selected.length} cases, ${runs} run(s), baseline ${basename(baselineRoot)}, candidate ${basename(candidateRoot)}`);
  process.exit(0);
}

const piBin = String(args.pi ?? process.env.PI_BIN ?? "pi");
const harness = String(args.harness ?? "pi");
if (!new Set(["pi", "codex"]).has(harness)) throw new Error("--harness must be pi or codex");
const codexBin = String(args.codex ?? process.env.CODEX_BIN ?? "codex");
const codexSandbox = String(args["codex-sandbox"] ?? "workspace-write");
if (!new Set(["read-only", "workspace-write", "danger-full-access"]).has(codexSandbox)) {
  throw new Error("--codex-sandbox must be read-only, workspace-write, or danger-full-access");
}
const provider = String(args.provider ?? process.env.PI_EVAL_PROVIDER ?? "foundry-anthropic");
const model = String(args.model ?? process.env.PI_EVAL_MODEL ?? "opus-latest");
const codexModel = args["codex-model"] ? String(args["codex-model"]) : undefined;
const graderModel = String(args["grader-model"] ?? process.env.PI_GRADER_MODEL ?? model);
const thinking = String(args.thinking ?? process.env.PI_EVAL_THINKING ?? "low");
const timeoutMs = Number(args["timeout-ms"] ?? process.env.PI_EVAL_TIMEOUT_MS ?? 90_000);
if (!Number.isFinite(timeoutMs) || timeoutMs < 1_000) throw new Error("--timeout-ms must be at least 1000");
const results = [];

for (const testCase of selected) {
  const baselineSkill = await findSkill(baselineRoot, testCase.skill);
  const candidateSkill = await findSkill(candidateRoot, testCase.skill);
  const baselineSkillText = await readFile(baselineSkill, "utf8");
  const candidateSkillText = await readFile(candidateSkill, "utf8");
  for (let runIndex = 0; runIndex < runs; runIndex += 1) {
    process.stderr.write(`RUN ${testCase.id} ${runIndex + 1}/${runs}\n`);
    const prompt = solverPrompt(testCase);
    const baselineWorkspace = await prepareWorkspace(candidateRoot, testCase, `baseline-${runIndex}`);
    const candidateWorkspace = await prepareWorkspace(candidateRoot, testCase, `candidate-${runIndex}`);
    const solveOptions = harness === "pi"
      ? { piBin, provider, model, thinking, prompt, timeoutMs, tools: testCase.tools }
      : { codexBin, model: codexModel, sandbox: codexSandbox, prompt, timeoutMs };
    const solver = harness === "pi" ? solveWithPi : solveWithCodex;
    const baseline = await solver({ ...solveOptions, skillText: baselineSkillText, cwd: baselineWorkspace });
    const candidate = await solver({ ...solveOptions, skillText: candidateSkillText, cwd: candidateWorkspace });
    const baselineOutcome = await verifyOutcome(candidateRoot, testCase, baselineWorkspace, timeoutMs);
    const candidateOutcome = await verifyOutcome(candidateRoot, testCase, candidateWorkspace, timeoutMs);
    const pair = shuffledPair(baseline, candidate, runIndex + testCase.id.length);
    const outcomes = pair.candidateLabel === "A"
      ? { A: candidateOutcome, B: baselineOutcome }
      : { A: baselineOutcome, B: candidateOutcome };
    const judgment = await grade({
      piBin,
      provider,
      graderModel,
      thinking,
      prompt: graderPrompt(testCase, pair, outcomes),
      cwd: candidateWorkspace,
      timeoutMs,
    });
    const judgedWinner = judgment.winner === "tie" ? "tie" : judgment.winner === pair.candidateLabel ? "candidate" : "baseline";
    const candidateCriticalFailures = judgment.critical_failures?.[pair.candidateLabel] ?? [];
    const baselineCriticalFailures = judgment.critical_failures?.[pair.candidateLabel === "A" ? "B" : "A"] ?? [];
    let winner = judgedWinner;
    if (candidateCriticalFailures.length > 0 && baselineCriticalFailures.length === 0) winner = "baseline";
    if (candidateCriticalFailures.length === 0 && baselineCriticalFailures.length > 0) winner = "candidate";
    if (candidateCriticalFailures.length > 0 && baselineCriticalFailures.length > 0) winner = "tie";
    results.push({
      case: testCase.id,
      skill: testCase.skill,
      baseline_skill_sha256: sha256(baselineSkillText),
      candidate_skill_sha256: sha256(candidateSkillText),
      run: runIndex + 1,
      winner,
      judged_winner: judgedWinner,
      candidate_score: pair.candidateLabel === "A" ? judgment.A_score : judgment.B_score,
      baseline_score: pair.candidateLabel === "A" ? judgment.B_score : judgment.A_score,
      candidate_critical_failures: candidateCriticalFailures,
      baseline_critical_failures: baselineCriticalFailures,
      reason: judgment.reason,
      outputs: { baseline, candidate },
      verified_outcomes: { baseline: baselineOutcome, candidate: candidateOutcome },
    });
  }
}

const summary = results.reduce(
  (counts, result) => ({ ...counts, [result.winner]: counts[result.winner] + 1 }),
  { candidate: 0, baseline: 0, tie: 0 },
);
const report = {
  generated_at: new Date().toISOString(),
  cases_sha256: sha256(casesText),
  baseline_root: baselineRoot,
  candidate_root: candidateRoot,
  provider,
  harness,
  solver_model: harness === "pi" ? model : (codexModel ?? "configured default"),
  codex_sandbox: harness === "codex" ? codexSandbox : null,
  grader_model: graderModel,
  thinking,
  runs,
  summary,
  results,
};
const reportDirectory = await mkdtemp(join(tmpdir(), "skill-eval-report-"));
const outputPath = resolve(String(args.out ?? join(reportDirectory, "report.json")));
await writeFile(outputPath, `${JSON.stringify(report, null, 2)}\n`);
console.log(`RESULT candidate=${summary.candidate} baseline=${summary.baseline} tie=${summary.tie}`);
console.log(`REPORT ${outputPath}`);

if (summary.baseline > 0 || results.some((result) => result.candidate_critical_failures.length > 0)) {
  process.exitCode = 1;
}
