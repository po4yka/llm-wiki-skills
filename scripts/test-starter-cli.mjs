import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { existsSync, mkdirSync, mkdtempSync, readFileSync, readdirSync, rmSync, writeFileSync } from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { initVault } from '../bin/llm-wiki-starter.mjs';

const temporaryRoot = mkdtempSync(path.join(os.tmpdir(), 'llm-wiki-starter-'));
const target = path.join(temporaryRoot, 'vault');
const existingTarget = path.join(temporaryRoot, 'existing-vault');

try {
  assert.throws(() => initVault({ target: os.homedir(), installSkills: false }), /Refusing to initialize broad directory/);
  initVault({ target, installSkills: false, output: () => {} });
  assert.match(readFileSync(path.join(target, 'AGENTS.md'), 'utf8'), /Never edit files under `raw\/`/);
  assert.match(readFileSync(path.join(target, 'README.md'), 'utf8'), /already configured/);
  assert.match(readFileSync(path.join(target, 'raw/sources/example-source.md'), 'utf8'), /LLM-Wiki/);
  assert.match(readFileSync(path.join(target, '_meta/redaction-policy.yml'), 'utf8'), /mode: preview-first/);
  assert.match(readFileSync(path.join(target, 'exports/profiles/public.yml'), 'utf8'), /raw\/\*\*[\s\S]*fail_on_findings: true/);
  assert.match(readFileSync(path.join(target, 'package.json'), 'utf8'), /external:build/);

  const publicPage = path.join(target, 'wiki/public/example.md');
  writeFileSync(publicPage, '---\ntitle: Public example\nstatus: reviewed\ncreated: 2026-08-11\nupdated: 2026-08-11\nreview_required: false\n---\n\n# Public example\n');
  const npm = process.platform === 'win32' ? 'npm.cmd' : 'npm';
  const passedBuild = spawnSync(npm, ['run', 'external:build'], { cwd: target, encoding: 'utf8' });
  assert.equal(passedBuild.status, 0, passedBuild.stderr);
  assert.deepEqual(readdirSync(path.join(target, 'dist')).sort(), [
    'AGENTS.md',
    'README.md',
    'checksums.txt',
    'manifest.json',
    'redaction-report.json',
    'wiki',
  ]);
  assert.equal(existsSync(path.join(target, 'dist/wiki/example.md')), true);
  assert.equal(JSON.parse(readFileSync(path.join(target, 'dist/manifest.json'), 'utf8')).status, 'passed');

  writeFileSync(publicPage, readFileSync(publicPage, 'utf8').replace('review_required: false', 'review_required: false\nsensitivity: sensitive'));
  const blockedBuild = spawnSync(npm, ['run', 'external:build'], { cwd: target, encoding: 'utf8' });
  assert.equal(blockedBuild.status, 1);
  assert.equal(existsSync(path.join(target, 'dist/manifest.json')), false);
  assert.equal(JSON.parse(readFileSync(path.join(target, 'dist/redaction-report.json'), 'utf8')).finding_count, 1);

  mkdirSync(existingTarget);
  writeFileSync(path.join(existingTarget, 'package.json'), '{"private":true,"description":"keep me"}\n');
  initVault({ target: existingTarget, installSkills: false, output: () => {} });
  const existingPackage = JSON.parse(readFileSync(path.join(existingTarget, 'package.json'), 'utf8'));
  assert.equal(existingPackage.description, 'keep me');
  assert.equal(existingPackage.scripts['external:build'], 'node _agent/scripts/build-external.mjs');

  writeFileSync(path.join(target, 'AGENTS.md'), 'keep me\n');
  initVault({ target, installSkills: false, output: () => {} });
  assert.equal(readFileSync(path.join(target, 'AGENTS.md'), 'utf8'), 'keep me\n');
  console.log('✓ starter CLI creates a vault, builds safe exports and preserves existing files');
} finally {
  rmSync(temporaryRoot, { recursive: true, force: true });
}
