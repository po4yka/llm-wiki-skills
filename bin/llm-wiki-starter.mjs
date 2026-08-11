#!/usr/bin/env node

import { spawnSync } from 'node:child_process';
import {
  accessSync,
  constants,
  copyFileSync,
  existsSync,
  mkdirSync,
  readFileSync,
  realpathSync,
  statSync,
  writeFileSync,
} from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import { fileURLToPath, pathToFileURL } from 'node:url';
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
    return;
  }
  copyFileSync(source, target, constants.COPYFILE_EXCL);
  changes.created += 1;
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

export function initVault({ target = process.cwd(), agent, installSkills = true, output = console.log } = {}) {
  target = path.resolve(target);
  if (target === path.parse(target).root || target === os.homedir()) throw new Error(`Refusing to initialize broad directory: ${target}`);
  if (existsSync(target) && !statSync(target).isDirectory()) throw new Error(`Target is not a directory: ${target}`);
  mkdirSync(target, { recursive: true });
  preflight(target);

  for (const directory of directories) mkdirSync(path.join(target, directory), { recursive: true });

  const changes = { created: 0, updated: 0, skipped: 0 };
  for (const [source, destination] of files) {
    writeIfMissing(path.join(packageRoot, source), path.join(target, destination), changes);
  }
  ensureStarterPackage(target, changes);

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
  output('Preflight passed. Next: ask your agent to use llm-wiki-zero-to-working-wiki.');
}

function main() {
  const { values, positionals } = parseArgs({
    options: {
      agent: { type: 'string', short: 'a' },
      help: { type: 'boolean', short: 'h' },
    },
    allowPositionals: true,
  });

  if (values.help) {
    console.log('Usage: llm-wiki-starter init [directory] [--agent <agent-id>]');
    return;
  }

  const [command = 'init', directory = '.'] = positionals;
  if (command !== 'init' || positionals.length > 2) throw new Error('Usage: llm-wiki-starter init [directory] [--agent <agent-id>]');
  initVault({ target: directory, agent: values.agent });
}

if (process.argv[1] && import.meta.url === pathToFileURL(realpathSync(process.argv[1])).href) {
  try {
    main();
  } catch (error) {
    console.error(`llm-wiki-starter: ${error.message}`);
    process.exitCode = 1;
  }
}
