#!/usr/bin/env node

import { createHash } from 'node:crypto';
import { spawnSync } from 'node:child_process';
import {
  copyFileSync,
  cpSync,
  existsSync,
  lstatSync,
  mkdirSync,
  mkdtempSync,
  readFileSync,
  readdirSync,
  rmSync,
  statSync,
  writeFileSync,
} from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ownedOutputs = ['wiki', 'AGENTS.md', 'README.md', 'manifest.json', 'redaction-report.json', 'checksums.txt'];

function toPosix(filePath) {
  return filePath.split(path.sep).join('/');
}

function listFiles(directory, predicate = () => true) {
  if (!existsSync(directory)) return [];
  const files = [];
  const stack = [directory];

  while (stack.length > 0) {
    const current = stack.pop();
    for (const entry of readdirSync(current, { withFileTypes: true })) {
      const filePath = path.join(current, entry.name);
      if (entry.isDirectory()) stack.push(filePath);
      else if (entry.isFile() && predicate(filePath)) files.push(filePath);
    }
  }

  return files.sort();
}

function sha256(filePath) {
  return createHash('sha256').update(readFileSync(filePath)).digest('hex');
}

function field(frontmatter, name) {
  return frontmatter.match(new RegExp(`^${name}:\\s*([^#\\n]+)`, 'mi'))?.[1].trim().toLowerCase();
}

function eligibilityFindings(sourceRoot) {
  const findings = [];
  const supportedExtensions = /\.(md|txt|json|ya?ml)$/i;
  const directories = [sourceRoot];
  while (directories.length > 0) {
    const directory = directories.pop();
    for (const entry of readdirSync(directory, { withFileTypes: true })) {
      const entryPath = path.join(directory, entry.name);
      if (entry.isDirectory()) directories.push(entryPath);
      else if (!entry.isFile()) {
        findings.push({
          file: `wiki/${toPosix(path.relative(sourceRoot, entryPath))}`,
          line: 1,
          kind: 'unsupported_file',
          category: 'eligibility',
        });
      }
    }
  }
  for (const filePath of listFiles(sourceRoot)) {
    if (!supportedExtensions.test(filePath)) {
      findings.push({
        file: `wiki/${toPosix(path.relative(sourceRoot, filePath))}`,
        line: 1,
        kind: 'unsupported_file',
        category: 'eligibility',
      });
    }
  }

  for (const filePath of listFiles(sourceRoot, (candidate) => candidate.endsWith('.md'))) {
    const relative = toPosix(path.relative(sourceRoot, filePath));
    const text = readFileSync(filePath, 'utf8');
    const frontmatter = text.startsWith('---') ? text.split(/^---\s*$/m)[1] ?? '' : '';
    const status = field(frontmatter, 'status') ?? field(frontmatter, 'review_state');

    if (!['approved', 'published', 'reviewed', 'verified'].includes(status)) {
      findings.push({ file: `wiki/${relative}`, line: 1, kind: 'unapproved_page', category: 'eligibility' });
    }
    if (field(frontmatter, 'review_required') !== 'false') {
      findings.push({ file: `wiki/${relative}`, line: 1, kind: 'review_required', category: 'eligibility' });
    }
    const publicationState = field(frontmatter, 'publication_state');
    if (publicationState && publicationState !== 'public') {
      findings.push({ file: `wiki/${relative}`, line: 1, kind: 'non_public_page', category: 'eligibility' });
    }
    if (/^tags:\s*\[[^\]]*\b(private|sensitive)\b/im.test(frontmatter)) {
      findings.push({ file: `wiki/${relative}`, line: 1, kind: 'blocked_tag', category: 'eligibility' });
    }
  }
  return findings;
}

function clearOwnedOutputs(distRoot) {
  for (const output of ownedOutputs) rmSync(path.join(distRoot, output), { recursive: true, force: true });
}

function assertSafePath(root, target) {
  const relative = path.relative(root, target);
  if (relative === '..' || relative.startsWith(`..${path.sep}`) || path.isAbsolute(relative)) {
    throw new Error(`Path escapes the vault: ${target}`);
  }

  let current = root;
  for (const part of relative.split(path.sep).filter(Boolean)) {
    current = path.join(current, part);
    if (existsSync(current) && lstatSync(current).isSymbolicLink()) {
      throw new Error(`Symbolic links are not supported in export paths: ${toPosix(path.relative(root, current))}`);
    }
  }
}

function writeJson(filePath, value) {
  writeFileSync(filePath, `${JSON.stringify(value, null, 2)}\n`);
}

export function buildExternal({ root = process.cwd(), output = console.log } = {}) {
  root = path.resolve(root);
  if (existsSync(root) && lstatSync(root).isSymbolicLink()) throw new Error(`Vault root must not be a symbolic link: ${root}`);
  const publicWiki = path.join(root, 'wiki/public');
  const profilePath = path.join(root, 'exports/profiles/public.yml');
  const policyPath = path.join(root, '_meta/redaction-policy.yml');
  const distRoot = path.join(root, 'dist');

  for (const target of [publicWiki, profilePath, policyPath, path.join(root, 'AGENTS.md'), path.join(root, 'README.md'), distRoot]) {
    assertSafePath(root, target);
  }

  for (const required of [publicWiki, profilePath, policyPath, path.join(root, 'AGENTS.md'), path.join(root, 'README.md')]) {
    if (!existsSync(required)) throw new Error(`Missing required path: ${toPosix(path.relative(root, required))}`);
  }
  if (!statSync(publicWiki).isDirectory()) throw new Error('wiki/public must be a directory.');

  const profile = readFileSync(profilePath, 'utf8');
  const policy = readFileSync(policyPath, 'utf8');
  if (/^enabled:\s*false\s*$/m.test(profile)) throw new Error('Public export profile is disabled.');
  if (!/wiki\/public\/\*\*/.test(profile) || !/fail_on_findings:\s*true/.test(profile)) {
    throw new Error('Public export profile must allow only wiki/public/** and fail on findings.');
  }
  if (!/mode:\s*preview-first/.test(policy)) throw new Error('Redaction policy must use preview-first mode.');

  const temporaryRoot = mkdtempSync(path.join(os.tmpdir(), 'llm-wiki-external-'));
  const stage = path.join(temporaryRoot, 'dist');

  try {
    mkdirSync(path.join(stage, 'wiki'), { recursive: true });
    cpSync(publicWiki, path.join(stage, 'wiki'), { recursive: true });
    copyFileSync(path.join(root, 'AGENTS.md'), path.join(stage, 'AGENTS.md'));
    copyFileSync(path.join(root, 'README.md'), path.join(stage, 'README.md'));

    const scanner = path.join(path.dirname(fileURLToPath(import.meta.url)), 'redact-preview.mjs');
    const scan = spawnSync(process.execPath, [scanner, '--json', '.'], { cwd: stage, encoding: 'utf8' });
    if (scan.status !== 0) throw new Error(scan.stderr.trim() || 'Redaction scan failed.');

    const sensitiveFindings = JSON.parse(scan.stdout).findings.map((finding) => ({
      ...finding,
      category: 'sensitive',
    }));
    const findings = [...sensitiveFindings, ...eligibilityFindings(publicWiki)];
    const report = {
      status: findings.length === 0 ? 'passed' : 'failed',
      finding_count: findings.length,
      findings,
    };

    if (findings.length > 0) {
      mkdirSync(distRoot, { recursive: true });
      clearOwnedOutputs(distRoot);
      writeJson(path.join(distRoot, 'redaction-report.json'), report);
      throw new Error(`External build blocked by ${findings.length} unresolved finding(s). See dist/redaction-report.json.`);
    }

    writeJson(path.join(stage, 'redaction-report.json'), report);
    const artifacts = listFiles(stage).map((filePath) => ({
      path: toPosix(path.relative(stage, filePath)),
      sha256: sha256(filePath),
    }));
    const manifest = {
      profile_id: 'public',
      created_at: new Date().toISOString(),
      status: 'passed',
      inputs: {
        wiki_paths: ['wiki/public/**'],
        export_profile: 'exports/profiles/public.yml',
        redaction_policy: '_meta/redaction-policy.yml',
      },
      revisions: {
        profile_sha256: sha256(profilePath),
        policy_sha256: sha256(policyPath),
      },
      counts: {
        pages_included: listFiles(publicWiki, (candidate) => candidate.endsWith('.md')).length,
        unresolved_findings: 0,
      },
      outputs: artifacts,
      reports: { redaction: 'redaction-report.json' },
    };
    writeJson(path.join(stage, 'manifest.json'), manifest);

    const checksumLines = listFiles(stage)
      .map((filePath) => `${sha256(filePath)}  ${toPosix(path.relative(stage, filePath))}`)
      .join('\n');
    writeFileSync(path.join(stage, 'checksums.txt'), `${checksumLines}\n`);

    mkdirSync(distRoot, { recursive: true });
    clearOwnedOutputs(distRoot);
    for (const artifact of ownedOutputs) {
      const source = path.join(stage, artifact);
      if (existsSync(source)) cpSync(source, path.join(distRoot, artifact), { recursive: true });
    }

    output(`External build passed: ${manifest.counts.pages_included} page(s), 0 unresolved findings.`);
    return manifest;
  } finally {
    rmSync(temporaryRoot, { recursive: true, force: true });
  }
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  try {
    buildExternal();
  } catch (error) {
    console.error(`external:build: ${error.message}`);
    process.exitCode = 1;
  }
}
