#!/usr/bin/env node

import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { spawnSync } from 'node:child_process';
import {
  copyFileSync,
  existsSync,
  mkdirSync,
  mkdtempSync,
  readFileSync,
  readdirSync,
  rmSync,
  writeFileSync,
} from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const agent = process.argv[process.argv.indexOf('--agent') + 1];
if (!['claude-code', 'codex'].includes(agent)) {
  console.error('Usage: node scripts/test-product-e2e.mjs --agent claude-code|codex');
  process.exit(2);
}

const e2eRoot = mkdtempSync(path.join(process.env.RUNNER_TEMP ?? os.tmpdir(), 'llm-wiki-product-e2e-'));
const runnerRoot = path.join(e2eRoot, 'runner');
const vaultRoot = path.join(runnerRoot, 'vault');
const homeRoot = path.join(e2eRoot, 'home');
const cleanEnv = {
  ...process.env,
  CI: '1',
  NO_COLOR: '1',
  FORCE_COLOR: '0',
  HOME: homeRoot,
  CODEX_HOME: path.join(homeRoot, '.codex'),
  XDG_CONFIG_HOME: path.join(homeRoot, '.config'),
};

function run(command, args, { cwd = repoRoot, input, timeout = 10 * 60 * 1000 } = {}) {
  console.log(`$ ${command} ${args.join(' ')}`);
  const result = spawnSync(command, args, {
    cwd,
    input,
    env: cleanEnv,
    encoding: 'utf8',
    maxBuffer: 20 * 1024 * 1024,
    timeout,
  });
  if (result.stdout) process.stdout.write(result.stdout);
  if (result.stderr) process.stderr.write(result.stderr);
  if (result.error) throw result.error;
  if (result.status !== 0) throw new Error(`${command} exited with status ${result.status}`);
  return result.stdout;
}

function read(relativePath) {
  return readFileSync(path.join(vaultRoot, relativePath), 'utf8');
}

function assertFile(relativePath, pattern) {
  assert.equal(existsSync(path.join(vaultRoot, relativePath)), true, `missing ${relativePath}`);
  if (pattern) assert.match(read(relativePath), pattern, relativePath);
}

function sha256(filePath) {
  return createHash('sha256').update(readFileSync(filePath)).digest('hex');
}

function verifyResult(fixtureText, expectedSkills) {
  const skillRoot = path.join(vaultRoot, agent === 'claude-code' ? '.claude/skills' : '.agents/skills');
  const installedSkills = readdirSync(skillRoot, { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .map((entry) => entry.name)
    .sort();
  assert.deepEqual(installedSkills, [...expectedSkills].sort());

  assert.equal(read('raw/sources/e2e-source.md'), fixtureText, 'raw fixture changed');
  assertFile('wiki/sources/e2e-source.md');
  assert.match(read('wiki/sources/e2e-source.md'), /status:\s*draft/);
  assert.match(read('wiki/sources/e2e-source.md'), /review_required:\s*true/);
  assert.match(read('wiki/sources/e2e-source.md'), /raw\/sources\/e2e-source\.md/);
  assert.match(read('wiki/index.md'), /e2e-source/);
  assert.match(read('wiki/log.md'), /e2e-source/);
  assertFile('wiki/queries/maintenance-loop.md');
  assert.match(read('wiki/queries/maintenance-loop.md'), /status:\s*draft/);
  assert.match(read('wiki/queries/maintenance-loop.md'), /review_required:\s*true/);
  assert.match(read('wiki/queries/maintenance-loop.md'), /periodic lint/i);
  assert.match(read('wiki/queries/maintenance-loop.md'), /raw\/sources\/e2e-source\.md/);
  assertFile('_agent/reports/e2e-lint.md', /^# Wiki lint report \(deterministic draft\):/);
  assert.equal(JSON.parse(read('_agent/reports/e2e-redaction.json')).finding_count, 0);
  assertFile('wiki/public/maintenance-loop.md');
  assert.match(read('wiki/public/maintenance-loop.md'), /status:\s*(reviewed|verified)/);
  assert.match(read('wiki/public/maintenance-loop.md'), /review_required:\s*false/);
  assert.match(read('wiki/public/maintenance-loop.md'), /publication_state:\s*public/);
  assert.match(read('wiki/public/maintenance-loop.md'), /sensitivity:\s*public/);
  assert.match(read('wiki/public/maintenance-loop.md'), /source_paths:/);

  assert.deepEqual(readdirSync(path.join(vaultRoot, 'dist')).sort(), [
    'AGENTS.md',
    'README.md',
    'checksums.txt',
    'manifest.json',
    'redaction-report.json',
    'wiki',
  ]);
  assert.deepEqual(readdirSync(path.join(vaultRoot, 'dist/wiki')).sort(), ['maintenance-loop.md']);
  assertFile('dist/wiki/maintenance-loop.md');
  assert.equal(JSON.parse(read('dist/manifest.json')).status, 'passed');
  assert.equal(JSON.parse(read('dist/redaction-report.json')).finding_count, 0);

  for (const line of read('dist/checksums.txt').trim().split('\n')) {
    const match = line.match(/^([a-f0-9]{64})  (.+)$/);
    assert.ok(match, `invalid checksum line: ${line}`);
    const artifact = path.resolve(vaultRoot, 'dist', match[2]);
    assert.ok(artifact.startsWith(`${path.join(vaultRoot, 'dist')}${path.sep}`), `unsafe checksum path: ${match[2]}`);
    assert.equal(sha256(artifact), match[1], `checksum mismatch: ${match[2]}`);
  }
}

try {
  mkdirSync(runnerRoot, { recursive: true });
  mkdirSync(homeRoot, { recursive: true });
  writeFileSync(path.join(runnerRoot, 'package.json'), '{"private":true}\n');

  const packOutput = run('npm', ['pack', '--json', '--pack-destination', e2eRoot]);
  const tarball = path.join(e2eRoot, JSON.parse(packOutput)[0].filename);
  run('npm', ['install', '--ignore-scripts', '--no-audit', '--no-fund', tarball], { cwd: runnerRoot });

  cleanEnv.PATH = `${path.join(runnerRoot, 'node_modules/.bin')}${path.delimiter}${cleanEnv.PATH}`;
  run(path.join(runnerRoot, 'node_modules/.bin/llm-wiki-starter'), ['init', vaultRoot, '--agent', agent], { cwd: runnerRoot });

  const fixturePath = path.join(repoRoot, 'examples/minimal-vault/raw/sources/example-source.md');
  const fixtureText = readFileSync(fixturePath, 'utf8');
  rmSync(path.join(vaultRoot, 'raw/sources/example-source.md'));
  copyFileSync(fixturePath, path.join(vaultRoot, 'inbox/e2e-source.md'));
  copyFileSync(path.join(vaultRoot, 'inbox/e2e-source.md'), path.join(vaultRoot, 'raw/sources/e2e-source.md'));
  mkdirSync(path.join(vaultRoot, 'wiki/sources'), { recursive: true });
  mkdirSync(path.join(vaultRoot, 'wiki/queries'), { recursive: true });
  writeFileSync(path.join(vaultRoot, 'wiki/sources/e2e-source.md'), `---
title: E2E source
type: source
status: draft
created: 2026-08-11
updated: 2026-08-11
review_required: true
source_paths:
  - raw/sources/e2e-source.md
tags: []
---

# E2E source

A living wiki preserves raw sources, saves useful answers, and runs periodic lint checks.
`);
  writeFileSync(path.join(vaultRoot, 'wiki/queries/maintenance-loop.md'), `---
title: Maintenance loop
type: query
status: draft
created: 2026-08-11
updated: 2026-08-11
review_required: true
source_paths:
  - raw/sources/e2e-source.md
tags: []
---

# Maintenance loop

The source recommends preserving raw sources, saving useful answers, and running periodic lint checks.
`);
  writeFileSync(path.join(vaultRoot, 'wiki/public/maintenance-loop.md'), `---
title: Maintenance loop
type: query
status: reviewed
created: 2026-08-11
updated: 2026-08-11
review_required: false
publication_state: public
sensitivity: public
source_paths:
  - raw/sources/e2e-source.md
tags: []
---

# Maintenance loop

The source recommends preserving raw sources, saving useful answers, and running periodic lint checks.
`);
  writeFileSync(path.join(vaultRoot, 'wiki/index.md'), `${read('wiki/index.md')}\n- e2e-source: wiki/sources/e2e-source.md\n`);
  writeFileSync(path.join(vaultRoot, 'wiki/log.md'), `${read('wiki/log.md')}\n- e2e-source: raw/sources/e2e-source.md\n`);

  const skillRoot = path.join(vaultRoot, agent === 'claude-code' ? '.claude/skills' : '.agents/skills');
  const lintReport = run(process.execPath, [path.join(skillRoot, 'wiki-lint/scripts/wiki-lint-core.mjs'), vaultRoot], { cwd: vaultRoot });
  writeFileSync(path.join(vaultRoot, '_agent/reports/e2e-lint.md'), lintReport);
  const redactionReport = run(process.execPath, ['_agent/scripts/redact-preview.mjs', '--json', '--fail-on-findings', 'wiki/public'], { cwd: vaultRoot });
  writeFileSync(path.join(vaultRoot, '_agent/reports/e2e-redaction.json'), redactionReport);
  run('npm', ['run', 'external:build'], { cwd: vaultRoot });

  const profile = JSON.parse(readFileSync(path.join(repoRoot, 'profiles/external-starter/profile.json'), 'utf8'));
  verifyResult(fixtureText, profile.skills);
  console.log(`✓ ${agent} completed install → ingest → query → lint → redact → external export`);
  rmSync(e2eRoot, { recursive: true, force: true });
} catch (error) {
  console.error(error.stack ?? error.message);
  console.error(`E2E workspace preserved at ${e2eRoot}`);
  process.exitCode = 1;
}
