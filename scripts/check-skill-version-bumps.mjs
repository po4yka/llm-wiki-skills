import { spawnSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { parseFrontmatter } from './lib/frontmatter.mjs';
import { failFactory, repoRoot, readText } from './lib/repo.mjs';

const { fail, finish } = failFactory();
const baseRef = process.env.SKILL_VERSION_BASE_REF ?? process.env.GITHUB_BASE_REF ?? 'main';
const strict = process.env.SKILL_VERSION_STRICT === '1' || process.argv.includes('--strict');

function git(args) {
  return spawnSync('git', args, {
    cwd: repoRoot,
    encoding: 'utf8',
    maxBuffer: 20 * 1024 * 1024,
  });
}

function gitText(args) {
  const result = git(args);
  if (result.status !== 0) return null;
  return result.stdout.trim();
}

function refExists(ref) {
  return git(['rev-parse', '--verify', ref]).status === 0;
}

function chooseBaseRef() {
  return [`origin/${baseRef}`, baseRef].find(refExists) ?? null;
}

function getFileAt(ref, filePath) {
  const result = git(['show', `${ref}:${filePath}`]);
  return result.status === 0 ? result.stdout : null;
}

const isGitRepo = git(['rev-parse', '--is-inside-work-tree']).status === 0;
if (!isGitRepo) {
  console.log('! not a git repository; skipping skill version bump check');
  finish('checked skill version bumps');
}

const chosenBaseRef = chooseBaseRef();
if (!chosenBaseRef) {
  console.log(`! could not find ${baseRef} or origin/${baseRef}; skipping skill version bump check`);
  console.log('  In CI, fetch the base branch before running with --strict.');
  finish('checked skill version bumps');
}

const mergeBase = gitText(['merge-base', 'HEAD', chosenBaseRef]);
if (!mergeBase) {
  console.log(`! could not compute merge-base with ${chosenBaseRef}; skipping skill version bump check`);
  finish('checked skill version bumps');
}

const changed = gitText(['diff', '--name-only', mergeBase, 'HEAD'])?.split('\n').filter(Boolean) ?? [];
const changedSkills = changed.filter((filePath) => /^skills\/[^/]+\/SKILL\.md$/.test(filePath));

for (const filePath of changedSkills) {
  const currentPath = path.join(repoRoot, filePath);
  if (!fs.existsSync(currentPath)) continue;

  const previousText = getFileAt(mergeBase, filePath);
  if (!previousText) continue;

  const current = parseFrontmatter(readText(currentPath))?.fields;
  const previous = parseFrontmatter(previousText)?.fields;
  const currentVersion = current?.metadata?.version;
  const previousVersion = previous?.metadata?.version;

  if (!currentVersion || !previousVersion) {
    fail(`${filePath}: missing metadata.version in current or base version`);
    continue;
  }

  if (currentVersion === previousVersion) {
    const message = `${filePath}: changed without metadata.version bump (${currentVersion})`;
    if (strict) fail(message);
    else console.warn(`! ${message}`);
  }
}

finish(`checked version bumps for ${changedSkills.length} changed skill files against ${chosenBaseRef}${strict ? ' (strict)' : ' (advisory)'}`);
