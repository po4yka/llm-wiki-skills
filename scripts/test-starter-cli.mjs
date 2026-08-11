import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { existsSync, mkdirSync, mkdtempSync, readFileSync, readdirSync, rmSync, symlinkSync, writeFileSync } from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { Readable, Writable } from 'node:stream';
import { initVault, interactiveInit } from '../bin/llm-wiki-starter.mjs';

const temporaryRoot = mkdtempSync(path.join(os.tmpdir(), 'llm-wiki-starter-'));
const target = path.join(temporaryRoot, 'vault');
const existingTarget = path.join(temporaryRoot, 'existing-vault');
const interactiveTarget = path.join(temporaryRoot, 'interactive-vault');

try {
  assert.throws(() => initVault({ target: os.homedir(), installSkills: false }), /Refusing to initialize broad directory/);
  const outsideTarget = path.join(temporaryRoot, 'outside-target');
  const linkedTarget = path.join(temporaryRoot, 'linked-target');
  mkdirSync(outsideTarget);
  symlinkSync(outsideTarget, linkedTarget, 'dir');
  assert.throws(() => initVault({ target: linkedTarget, installSkills: false }), /must not be a symbolic link/);
  assert.equal(existsSync(path.join(outsideTarget, 'AGENTS.md')), false);
  initVault({ target, installSkills: false, output: () => {} });
  assert.match(readFileSync(path.join(target, 'AGENTS.md'), 'utf8'), /Never edit files under `raw\/`/);
  assert.match(readFileSync(path.join(target, 'README.md'), 'utf8'), /already configured/);
  assert.match(readFileSync(path.join(target, 'raw/sources/example-source.md'), 'utf8'), /LLM-Wiki/);
  assert.match(readFileSync(path.join(target, '_meta/redaction-policy.yml'), 'utf8'), /documents_may_leave_machine: false/);
  assert.match(readFileSync(path.join(target, 'exports/profiles/public.yml'), 'utf8'), /enabled: true[\s\S]*raw\/\*\*[\s\S]*fail_on_findings: true/);
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

  const externalDist = path.join(temporaryRoot, 'external-dist');
  mkdirSync(path.join(externalDist, 'wiki'), { recursive: true });
  writeFileSync(path.join(externalDist, 'wiki/sentinel.txt'), 'keep\n');
  rmSync(path.join(target, 'dist'), { recursive: true });
  symlinkSync(externalDist, path.join(target, 'dist'), 'dir');
  const symlinkedBuild = spawnSync(npm, ['run', 'external:build'], { cwd: target, encoding: 'utf8' });
  assert.equal(symlinkedBuild.status, 1);
  assert.match(symlinkedBuild.stderr, /Symbolic links are not supported in export paths/);
  assert.equal(readFileSync(path.join(externalDist, 'wiki/sentinel.txt'), 'utf8'), 'keep\n');
  rmSync(path.join(target, 'dist'));

  writeFileSync(publicPage, readFileSync(publicPage, 'utf8').replace('review_required: false', 'review_required: false\nsensitivity: sensitive'));
  const blockedBuild = spawnSync(npm, ['run', 'external:build'], { cwd: target, encoding: 'utf8' });
  assert.equal(blockedBuild.status, 1);
  assert.equal(existsSync(path.join(target, 'dist/manifest.json')), false);
  assert.equal(JSON.parse(readFileSync(path.join(target, 'dist/redaction-report.json'), 'utf8')).finding_count, 1);

  mkdirSync(path.join(temporaryRoot, 'documents'));
  writeFileSync(path.join(temporaryRoot, 'documents/notes.md'), '# Notes\n');
  let transcript = '';
  const interactiveResult = await interactiveInit({
    target: 'interactive-vault',
    cwd: temporaryRoot,
    input: Readable.from(['2\n', 'documents\n', '1\n', '2\n']),
    output: new Writable({
      write(chunk, _encoding, callback) {
        transcript += chunk;
        callback();
      },
    }),
    installSkills: false,
  });
  assert.equal(interactiveResult.agent, 'codex');
  assert.equal(interactiveResult.documentsMayLeaveMachine, false);
  assert.equal(interactiveResult.publicExportEnabled, false);
  assert.equal(readFileSync(path.join(interactiveTarget, 'inbox/notes.md'), 'utf8'), '# Notes\n');
  assert.match(readFileSync(path.join(interactiveTarget, '_meta/redaction-policy.yml'), 'utf8'), /documents_may_leave_machine: false/);
  assert.match(readFileSync(path.join(interactiveTarget, 'exports/profiles/public.yml'), 'utf8'), /enabled: false/);
  assert.match(transcript, /Which agent do you use\?[\s\S]*Where are your documents\?[\s\S]*Process my inbox/);
  const disabledBuild = spawnSync(npm, ['run', 'external:build'], { cwd: interactiveTarget, encoding: 'utf8' });
  assert.equal(disabledBuild.status, 1);
  assert.match(disabledBuild.stderr, /Public export profile is disabled/);

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
