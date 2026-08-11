#!/usr/bin/env node

import { spawnSync } from 'node:child_process';
import {
  accessSync,
  constants,
  copyFileSync,
  existsSync,
  lstatSync,
  mkdirSync,
  readFileSync,
  readdirSync,
  realpathSync,
  statSync,
  writeFileSync,
} from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { createInterface } from 'node:readline';
import { parseArgs } from 'node:util';

const packageRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const profile = JSON.parse(readFileSync(path.join(packageRoot, 'profiles/external-starter/profile.json'), 'utf8'));
const directories = [
  'raw/sources',
  'raw/assets',
  'inbox',
  'wiki/sources',
  'wiki/entities',
  'wiki/concepts',
  'wiki/comparisons',
  'wiki/public',
  'wiki/synthesis',
  'wiki/queries',
  '_agent/reports',
  '_agent/scripts',
  '_meta/schemas',
  'exports/profiles',
];
const files = [
  ['templates/external-starter/AGENTS.md', 'AGENTS.md'],
  ['templates/external-starter/CLAUDE.md', 'CLAUDE.md'],
  ['templates/external-starter/README.md', 'README.md'],
  ['templates/external-starter/example-source.md', 'raw/sources/example-source.md'],
  ['templates/external-starter/redaction-policy.yml', '_meta/redaction-policy.yml'],
  ['templates/external-starter/export-profile.yml', 'exports/profiles/public.yml'],
  ['templates/wiki/index.md', 'wiki/index.md'],
  ['templates/wiki/log.md', 'wiki/log.md'],
  ['templates/schemas/page.schema.json', '_meta/schemas/page.schema.json'],
  ['scripts/build-external.mjs', '_agent/scripts/build-external.mjs'],
  ['scripts/redact-preview.mjs', '_agent/scripts/redact-preview.mjs'],
];

const starterPackage = {
  private: true,
  scripts: {
    'external:build': 'node _agent/scripts/build-external.mjs',
  },
};
const externalBuildCommand = starterPackage.scripts['external:build'];

function run(command, args, cwd, stdio = 'inherit') {
  const result = spawnSync(command, args, { cwd, stdio });
  if (result.error) throw result.error;
  if (result.status !== 0) throw new Error(`${command} exited with status ${result.status}`);
}

function preflight(target) {
  if (Number(process.versions.node.split('.')[0]) < 18) throw new Error('Node.js 18 or newer is required.');
  run('git', ['--version'], target, 'ignore');
  for (const [source] of files) accessSync(path.join(packageRoot, source), constants.R_OK);
  for (const skill of profile.skills) accessSync(path.join(packageRoot, 'skills', skill, 'SKILL.md'), constants.R_OK);
  accessSync(target, constants.W_OK);
}

function writeIfMissing(source, target, changes) {
  if (existsSync(target)) {
    changes.skipped += 1;
    return false;
  }
  copyFileSync(source, target, constants.COPYFILE_EXCL);
  changes.created += 1;
  return true;
}

function assertSafePath(root, target) {
  const relative = path.relative(root, target);
  if (relative === '..' || relative.startsWith(`..${path.sep}`) || path.isAbsolute(relative)) {
    throw new Error(`Path escapes the wiki directory: ${target}`);
  }

  let current = root;
  for (const part of relative.split(path.sep).filter(Boolean)) {
    current = path.join(current, part);
    if (existsSync(current) && lstatSync(current).isSymbolicLink()) {
      throw new Error(`Symbolic links are not supported in starter paths: ${current}`);
    }
  }
}

function setCreatedBoolean(target, key, value) {
  const text = readFileSync(target, 'utf8');
  const pattern = new RegExp(`(^\\s*${key}:\\s*)(true|false)`, 'm');
  if (!pattern.test(text)) throw new Error(`Starter policy is missing ${key}.`);
  writeFileSync(target, text.replace(pattern, `$1${value}`));
}

function planDocuments(source, target) {
  if (!source) return [];
  source = path.resolve(source);
  if (!existsSync(source)) throw new Error(`Documents path does not exist: ${source}`);
  if (statSync(source).isDirectory() && (target === source || target.startsWith(`${source}${path.sep}`))) {
    throw new Error('The wiki directory must be outside the documents directory.');
  }

  const plan = [];
  const visit = (current, relative) => {
    const stats = statSync(current);
    if (stats.isFile()) {
      plan.push([current, relative]);
      return;
    }
    if (!stats.isDirectory()) throw new Error(`Unsupported document entry: ${current}`);
    for (const entry of readdirSync(current, { withFileTypes: true })) {
      if (entry.isSymbolicLink()) throw new Error(`Document symlinks are not supported: ${path.join(current, entry.name)}`);
      visit(path.join(current, entry.name), path.join(relative, entry.name));
    }
  };

  const stats = statSync(source);
  visit(source, stats.isFile() ? path.basename(source) : '');
  return plan;
}

function copyDocuments(plan, target) {
  const inbox = path.join(target, 'inbox');
  for (const [source, relative] of plan) {
    const destination = path.join(inbox, relative);
    mkdirSync(path.dirname(destination), { recursive: true });
    copyFileSync(source, destination, constants.COPYFILE_EXCL);
  }
}

function validateDocumentTargets(plan, target) {
  const inbox = path.join(target, 'inbox');
  for (const [, relative] of plan) {
    if (existsSync(path.join(inbox, relative))) throw new Error(`Inbox file already exists: ${relative}`);
  }
}

function ensureStarterPackage(target, changes) {
  const packagePath = path.join(target, 'package.json');
  if (!existsSync(packagePath)) {
    writeFileSync(packagePath, `${JSON.stringify(starterPackage, null, 2)}\n`, { flag: 'wx' });
    changes.created += 1;
    return;
  }

  const packageJson = JSON.parse(readFileSync(packagePath, 'utf8'));
  const existingCommand = packageJson.scripts?.['external:build'];
  if (existingCommand === externalBuildCommand) {
    changes.skipped += 1;
    return;
  }
  if (existingCommand) throw new Error('package.json already defines external:build; refusing to overwrite it.');

  packageJson.scripts = { ...packageJson.scripts, 'external:build': externalBuildCommand };
  writeFileSync(packagePath, `${JSON.stringify(packageJson, null, 2)}\n`);
  changes.updated += 1;
}

export function initVault({
  target = process.cwd(),
  agent,
  installSkills = true,
  documents = [],
  documentsMayLeaveMachine = false,
  publicExportEnabled = true,
  output = console.log,
} = {}) {
  target = path.resolve(target);
  if (target === path.parse(target).root || target === os.homedir()) throw new Error(`Refusing to initialize broad directory: ${target}`);
  if (existsSync(target) && lstatSync(target).isSymbolicLink()) throw new Error(`Target must not be a symbolic link: ${target}`);
  if (existsSync(target) && !statSync(target).isDirectory()) throw new Error(`Target is not a directory: ${target}`);
  mkdirSync(target, { recursive: true });
  const targetPaths = [
    ...directories.map((directory) => path.join(target, directory)),
    ...files.map(([, destination]) => path.join(target, destination)),
    path.join(target, 'package.json'),
    ...documents.map(([, relative]) => path.join(target, 'inbox', relative)),
  ];
  for (const targetPath of targetPaths) assertSafePath(target, targetPath);
  validateDocumentTargets(documents, target);
  preflight(target);

  for (const directory of directories) mkdirSync(path.join(target, directory), { recursive: true });

  const changes = { created: 0, updated: 0, skipped: 0 };
  for (const [source, destination] of files) {
    const created = writeIfMissing(path.join(packageRoot, source), path.join(target, destination), changes);
    if (created && destination === '_meta/redaction-policy.yml') {
      setCreatedBoolean(path.join(target, destination), 'documents_may_leave_machine', documentsMayLeaveMachine);
    }
    if (created && destination === 'exports/profiles/public.yml') {
      setCreatedBoolean(path.join(target, destination), 'enabled', publicExportEnabled);
    }
  }
  ensureStarterPackage(target, changes);
  copyDocuments(documents, target);

  const insideGit = spawnSync('git', ['rev-parse', '--show-toplevel'], { cwd: target, stdio: 'ignore' }).status === 0;
  if (!insideGit) run('git', ['init', '-q'], target);

  if (installSkills) {
    const args = ['add', packageRoot, ...profile.skills.flatMap((skill) => ['--skill', skill]), '--copy', '-y'];
    if (agent) args.push('-a', agent);
    run(process.platform === 'win32' ? 'skills.cmd' : 'skills', args, target);
  }

  for (const required of ['AGENTS.md', 'CLAUDE.md', 'README.md', 'package.json', 'wiki/index.md', 'wiki/log.md', '_agent/scripts/build-external.mjs', '_agent/scripts/redact-preview.mjs', '_meta/redaction-policy.yml', '_meta/schemas/page.schema.json', 'exports/profiles/public.yml']) {
    if (!existsSync(path.join(target, required))) throw new Error(`Preflight failed: missing ${required}`);
  }

  output(`LLM-Wiki starter ready in ${target}`);
  output(`Created ${changes.created} files; updated ${changes.updated}; preserved ${changes.skipped} existing files; installed ${installSkills ? profile.skills.length : 0} skills.`);
  if (documents.length > 0) output(`Copied ${documents.length} document(s) to inbox/.`);
  output('Preflight passed. Next: ask your agent to use llm-wiki-zero-to-working-wiki.');
}

function createPrompter(input, output) {
  const lines = createInterface({ input, crlfDelay: Infinity });
  const answers = lines[Symbol.asyncIterator]();
  return {
    async ask(prompt) {
      output.write(prompt);
      const answer = await answers.next();
      if (answer.done) throw new Error('Interactive input ended before setup was complete.');
      return answer.value.trim();
    },
    close: () => lines.close(),
  };
}

async function askChoice(prompter, question, options, defaultIndex = 0) {
  while (true) {
    const choices = options.map((option, index) => `  ${index + 1}) ${option.label}`).join('\n');
    const answer = await prompter.ask(`? ${question}\n${choices}\n> `);
    if (!answer) return options[defaultIndex].value;
    const selected = options[Number(answer) - 1] ?? options.find((option) => option.label.toLowerCase() === answer.toLowerCase());
    if (selected) return selected.value;
  }
}

export async function interactiveInit({
  target = path.resolve(process.cwd(), 'my-llm-wiki'),
  cwd = process.cwd(),
  input = process.stdin,
  output = process.stdout,
  installSkills = true,
} = {}) {
  const prompter = createPrompter(input, output);
  try {
    const agent = await askChoice(prompter, 'Which agent do you use?', [
      { label: 'Claude Code', value: 'claude-code' },
      { label: 'Codex', value: 'codex' },
    ]);
    const documentsAnswer = await prompter.ask('? Where are your documents? (leave blank to skip)\n> ');
    const documentsMayLeaveMachine = await askChoice(prompter, 'Can documents leave this machine?', [
      { label: 'No', value: false },
      { label: 'Yes', value: true },
    ]);
    const publicExportEnabled = await askChoice(prompter, 'Enable the public-export profile?', [
      { label: 'Yes', value: true },
      { label: 'No', value: false },
    ]);
    const resolvedTarget = path.resolve(cwd, target);
    const documents = planDocuments(documentsAnswer ? path.resolve(cwd, documentsAnswer) : '', resolvedTarget);
    initVault({
      target: resolvedTarget,
      agent,
      installSkills,
      documents,
      documentsMayLeaveMachine,
      publicExportEnabled,
      output: (message) => output.write(`${message}\n`),
    });
    output.write(`\nReady. Open ${resolvedTarget} in ${agent === 'claude-code' ? 'Claude Code' : 'Codex'} and say: "Process my inbox".\n`);
    return { target: resolvedTarget, agent, documentsMayLeaveMachine, publicExportEnabled };
  } finally {
    prompter.close();
  }
}

async function main() {
  const { values, positionals } = parseArgs({
    options: {
      agent: { type: 'string', short: 'a' },
      interactive: { type: 'boolean', short: 'i' },
      help: { type: 'boolean', short: 'h' },
    },
    allowPositionals: true,
  });

  if (values.help) {
    console.log('Usage: llm-wiki-starter [init [directory] [--agent <agent-id>]] [--interactive]');
    return;
  }

  if (values.interactive || (positionals.length === 0 && process.stdin.isTTY && process.stdout.isTTY)) {
    const directory = positionals[1] ?? 'my-llm-wiki';
    if (positionals.length > 0 && positionals[0] !== 'init') throw new Error('Interactive setup accepts only the init command.');
    await interactiveInit({ target: directory });
    return;
  }

  const [command = 'init', directory = '.'] = positionals;
  if (command !== 'init' || positionals.length > 2) throw new Error('Usage: llm-wiki-starter init [directory] [--agent <agent-id>]');
  initVault({ target: directory, agent: values.agent });
}

if (process.argv[1] && import.meta.url === pathToFileURL(realpathSync(process.argv[1])).href) {
  try {
    await main();
  } catch (error) {
    console.error(`llm-wiki-starter: ${error.message}`);
    process.exitCode = 1;
  }
}
