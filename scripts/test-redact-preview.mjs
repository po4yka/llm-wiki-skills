import assert from 'node:assert/strict';
import { mkdtempSync, mkdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawnSync } from 'node:child_process';

const repoRoot = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const scanner = path.join(repoRoot, 'scripts/redact-preview.mjs');
const root = mkdtempSync(path.join(os.tmpdir(), 'llm-wiki-redaction-'));
const policyPath = path.join(root, '_meta/redaction-policy.yml');
const samplePath = path.join(root, 'sample.md');
const secrets = ['CUSTOM-4821', 'spacing-secret-1', 'bearer-secret-2', '-----BEGIN PRIVATE KEY-----'];

function run(...args) {
  return spawnSync(process.execPath, [scanner, ...args], { cwd: root, encoding: 'utf8' });
}

try {
  mkdirSync(path.dirname(policyPath));
  const policy = readFileSync(path.join(repoRoot, 'templates/external-starter/redaction-policy.yml'), 'utf8')
    .replace('patterns:\n', 'patterns:\n  custom_id: "CUSTOM-[0-9]{4}"\n');
  writeFileSync(policyPath, policy);
  writeFileSync(samplePath, `${secrets[0]}\napi_key = ${secrets[1]}\nAuthorization: Bearer ${secrets[2]}\n${secrets[3]}\ncreated: 2026-08-11\n`);

  const configured = run('--json', 'sample.md');
  assert.equal(configured.status, 0, configured.stderr);
  assert.deepEqual(JSON.parse(configured.stdout).findings.map(({ line, kind }) => [line, kind]), [
    [1, 'custom_id'],
    [2, 'secret_like'],
    [3, 'secret_like'],
    [4, 'secret_like'],
  ]);
  for (const secret of secrets) assert.equal(`${configured.stdout}${configured.stderr}`.includes(secret), false);
  assert.equal(run('--policy', policyPath, '--json', 'sample.md').status, 0);
  const blocked = run('--fail-on-findings', 'sample.md');
  assert.equal(blocked.status, 1);
  for (const secret of secrets) assert.equal(`${blocked.stdout}${blocked.stderr}`.includes(secret), false);

  writeFileSync(policyPath, 'patterns:\n  broken: "["\n');
  assert.equal(run('--json', 'sample.md').status, 2);
  writeFileSync(policyPath, 'version: 1\n');
  assert.equal(run('--json', 'sample.md').status, 2);
  assert.equal(run('--policy', 'missing.yml', '--json', 'sample.md').status, 2);

  rmSync(policyPath);
  writeFileSync(samplePath, 'token = fallback-secret\n');
  const fallback = run('--json', 'sample.md');
  assert.equal(fallback.status, 0, fallback.stderr);
  assert.deepEqual(JSON.parse(fallback.stdout).findings.map(({ kind }) => kind), ['secret_like']);

  console.log('✓ redaction policy patterns and safe output');
} finally {
  rmSync(root, { recursive: true, force: true });
}
