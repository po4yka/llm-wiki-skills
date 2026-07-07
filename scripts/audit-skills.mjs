#!/usr/bin/env node
// Deterministic Agent Skills audit for the llm-wiki-skill-doctor and
// llm-wiki-skill-compiler skills.
// Portable: audits any project, skills/ directory or single skill directory.
// No repository-root assumptions and no dependencies.
//
// Usage:
//   node audit-skills.mjs <path> [--strict]
//
// <path> may be: a project root (containing skills/), a skills/ directory,
// or a single skill directory (containing SKILL.md).
//
// Errors are Agent Skills contract violations; warnings are conventions and
// skill smells. Exit code: 1 when errors exist (or warnings with --strict).
// Read-only: never modifies files.

import fs from 'node:fs';
import path from 'node:path';

const NAME_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const SEMVER_PATTERN = /^\d+\.\d+\.\d+(?:[-+][0-9A-Za-z.-]+)?$/;
const MAX_BODY_CHARS = 18000;
const OVERLAP_RATIO = 0.72;
const RECOMMENDED_HEADINGS = ['goal', 'procedure', 'output', 'safety gates'];
const VOLATILE_TERMS = /\b(current|latest|recent|today|pricing|stars|release|version|maintenance status|provider support|news)\b/i;
const BROWSE_TERMS = /\b(browse|search|fresh sources|current sources|re-verify|cite)\b/i;
const DRY_RUN_TERMS = /\b(dry[- ]run|report-only|plan only|approval|review|confirm|PR-based|pull request)\b/i;
const WRITE_TERMS = /\b(delete|overwrite|rewrite|move files|bulk|apply mode|write access|direct writes)\b/i;
const ROOT_REF_PATTERN = /`((?:docs|templates|scripts|benchmarks|domain-packs|policies|examples)\/[^`\n]+)`/g;
const NPM_RUN_PATTERN = /`?npm run [^`\n]+`?/g;
const NODE_SCRIPT_PATTERN = /\bnode\s+(scripts\/[^\s`]+)/g;
const LOCAL_REF_PATTERN = /`((?:references|scripts|assets)\/[^`\n]+)`/g;

function usageExit() {
  console.error('usage: node audit-skills.mjs <path> [--strict]');
  process.exit(2);
}

const args = process.argv.slice(2).filter((a) => a !== '--strict');
const strict = process.argv.includes('--strict');
if (args.length !== 1) usageExit();
const target = path.resolve(args[0]);
if (!fs.existsSync(target) || !fs.statSync(target).isDirectory()) {
  console.error(`error: '${target}' is not a directory`);
  process.exit(2);
}

// Resolve skill directories from the given path.
let skillDirs = [];
let manifestRoot = null;
if (fs.existsSync(path.join(target, 'SKILL.md'))) {
  skillDirs = [target];
  manifestRoot = path.dirname(path.dirname(target));
} else {
  const skillsDir = fs.existsSync(path.join(target, 'skills')) ? path.join(target, 'skills') : target;
  manifestRoot = path.dirname(skillsDir) === skillsDir ? skillsDir : path.dirname(skillsDir);
  if (fs.existsSync(path.join(target, 'skills'))) manifestRoot = target;
  skillDirs = fs
    .readdirSync(skillsDir, { withFileTypes: true })
    .filter((entry) => entry.isDirectory() && !entry.name.startsWith('.'))
    .map((entry) => path.join(skillsDir, entry.name))
    .sort();
}

if (skillDirs.length === 0) {
  console.error(`error: no skill directories found under '${target}'`);
  process.exit(2);
}

const errors = [];
const warnings = [];
function fail(message) {
  errors.push(message);
  console.error(`✗ ${message}`);
}
function warn(message) {
  warnings.push(message);
  console.warn(`! ${message}`);
}

function unquote(value) {
  return String(value ?? '').trim().replace(/^['"]|['"]$/g, '').trim();
}

function parseFrontmatter(text) {
  const match = text.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n/);
  if (!match) return null;
  const fields = {};
  let currentObjectKey = null;
  for (const rawLine of match[1].split(/\r?\n/)) {
    const line = rawLine.replace(/\s+$/, '');
    if (!line.trim() || line.trim().startsWith('#')) continue;
    const nested = line.match(/^\s{2,}([a-zA-Z0-9_-]+):\s*(.*)$/);
    if (nested && currentObjectKey && typeof fields[currentObjectKey] === 'object') {
      fields[currentObjectKey][nested[1]] = unquote(nested[2]);
      continue;
    }
    const topLevel = line.match(/^([a-zA-Z0-9_-]+):\s*(.*)$/);
    if (topLevel) {
      const [, key, rawValue] = topLevel;
      if (rawValue === '') {
        fields[key] = {};
        currentObjectKey = key;
      } else {
        fields[key] = unquote(rawValue);
        currentObjectKey = null;
      }
      continue;
    }
    return { fields, malformedLine: rawLine };
  }
  return { fields, malformedLine: null };
}

function stripFrontmatter(text) {
  return text.replace(/^---\r?\n[\s\S]*?\r?\n---\r?\n/, '');
}

function headings(body) {
  return new Set(
    body
      .split(/\r?\n/)
      .map((line) => line.match(/^##\s+(.+?)\s*#*\s*$/)?.[1]?.trim().toLowerCase())
      .filter(Boolean),
  );
}

const descriptions = [];
const seenNames = new Set();
const skillDirNames = skillDirs.map((dir) => path.basename(dir));

for (const skillDir of skillDirs) {
  const skillName = path.basename(skillDir);
  const skillPath = path.join(skillDir, 'SKILL.md');

  if (!fs.existsSync(skillPath)) {
    fail(`${skillName}: missing SKILL.md`);
    continue;
  }

  const text = fs.readFileSync(skillPath, 'utf8');
  const parsed = parseFrontmatter(text);
  if (!parsed) {
    fail(`${skillName}: missing YAML frontmatter`);
    continue;
  }
  if (parsed.malformedLine) {
    fail(`${skillName}: malformed frontmatter line '${parsed.malformedLine}'`);
    continue;
  }
  const fm = parsed.fields;

  // Agent Skills contract (errors).
  if (!fm.name) fail(`${skillName}: missing frontmatter field 'name'`);
  if (!fm.description) fail(`${skillName}: missing frontmatter field 'description'`);
  if (fm.name && fm.name !== skillName) fail(`${skillName}: frontmatter name '${fm.name}' must match directory name`);
  if (fm.name && !NAME_PATTERN.test(fm.name)) fail(`${skillName}: invalid name '${fm.name}' (lowercase letters, numbers, hyphens)`);
  if (fm.name && seenNames.has(fm.name)) fail(`${skillName}: duplicate frontmatter name '${fm.name}'`);
  seenNames.add(fm.name);
  const description = fm.description ?? '';
  if (description.length > 1024) fail(`${skillName}: description exceeds 1024 characters`);
  if (description && description.length < 40) warn(`${skillName}: description is short (${description.length} chars); weak routing signal`);

  // Conventions (warnings).
  if (!fm.license) warn(`${skillName}: missing 'license' field`);
  if (!fm.compatibility || fm.compatibility.length < 20) warn(`${skillName}: compatibility should describe agent/runtime constraints`);
  if (!fm.metadata || typeof fm.metadata !== 'object') {
    warn(`${skillName}: missing metadata object (author, version, install_scope)`);
  } else {
    if (!fm.metadata.author) warn(`${skillName}: missing metadata.author`);
    if (!fm.metadata.version) warn(`${skillName}: missing metadata.version`);
    else if (!SEMVER_PATTERN.test(fm.metadata.version)) warn(`${skillName}: metadata.version is not semver-like ('${fm.metadata.version}')`);
    if (!fm.metadata.install_scope) warn(`${skillName}: missing metadata.install_scope (self-contained or pack-install-only)`);
    if (fm.metadata.deprecated === 'true' && !fm.metadata.replaced_by) {
      fail(`${skillName}: deprecated skills must declare metadata.replaced_by`);
    }
  }

  // Body checks.
  const body = stripFrontmatter(text);
  if (!body.match(/^#\s+.+/m)) warn(`${skillName}: missing H1 title after frontmatter`);
  const skillHeadings = headings(body);
  for (const heading of RECOMMENDED_HEADINGS) {
    if (!skillHeadings.has(heading)) warn(`${skillName}: missing recommended section '## ${heading}'`);
  }
  if (body.length > MAX_BODY_CHARS) {
    warn(`${skillName}: SKILL.md body is long (${body.length} chars); move background material to references/`);
  }
  if (VOLATILE_TERMS.test(text) && !BROWSE_TERMS.test(text)) {
    warn(`${skillName}: mentions volatile/current-state concepts without requiring browsing or re-verification`);
  }
  if (WRITE_TERMS.test(text) && !DRY_RUN_TERMS.test(text)) {
    warn(`${skillName}: mentions destructive or bulk writes without dry-run/review language`);
  }

  // Self-containment (errors when install_scope is self-contained).
  if (fm.metadata?.install_scope === 'self-contained') {
    for (const match of text.matchAll(ROOT_REF_PATTERN)) {
      fail(`${skillName}: references repository-root file '${match[1]}' not shipped with a single-skill install`);
    }
    for (const match of text.matchAll(NPM_RUN_PATTERN)) {
      fail(`${skillName}: advertises package.json command '${match[0]}' not shipped with a single-skill install`);
    }
    for (const match of text.matchAll(NODE_SCRIPT_PATTERN)) {
      if (!fs.existsSync(path.join(skillDir, match[1]))) {
        fail(`${skillName}: advertises missing local script '${match[1]}'`);
      }
    }
    for (const match of text.matchAll(LOCAL_REF_PATTERN)) {
      const relPath = match[1].replace(/\/\*\*$/, '').replace(/\/\*$/, '');
      if (!fs.existsSync(path.join(skillDir, relPath))) {
        fail(`${skillName}: references missing local file '${match[1]}'`);
      }
    }
  }

  descriptions.push({ skillName, description: description.toLowerCase() });
}

// Pairwise description overlap (trigger collision smell).
for (let i = 0; i < descriptions.length; i += 1) {
  for (let j = i + 1; j < descriptions.length; j += 1) {
    const a = descriptions[i];
    const b = descriptions[j];
    const aWords = new Set(a.description.split(/\W+/).filter((word) => word.length > 5));
    const bWords = new Set(b.description.split(/\W+/).filter((word) => word.length > 5));
    const overlap = [...aWords].filter((word) => bWords.has(word));
    const ratio = overlap.length / Math.max(1, Math.min(aWords.size, bWords.size));
    if (ratio > OVERLAP_RATIO) {
      warn(`${a.skillName} and ${b.skillName}: descriptions may overlap too much (${Math.round(ratio * 100)}%)`);
    }
  }
}

// Manifest check when skills.sh.json exists next to the skills directory.
const manifestPath = manifestRoot ? path.join(manifestRoot, 'skills.sh.json') : null;
if (manifestPath && fs.existsSync(manifestPath) && skillDirs.length > 1) {
  try {
    const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
    const listed = new Set((manifest.groupings ?? []).flatMap((group) => group.skills ?? []));
    for (const name of skillDirNames) {
      if (!listed.has(name)) warn(`skills.sh.json: skill '${name}' is not listed in any grouping`);
    }
    for (const name of listed) {
      if (!skillDirNames.includes(name)) fail(`skills.sh.json: grouping references missing skill '${name}'`);
    }
  } catch (error) {
    fail(`skills.sh.json could not be parsed: ${error.message}`);
  }
}

console.log(`\naudited ${skillDirs.length} skill(s): ${errors.length} error(s), ${warnings.length} warning(s)`);
if (errors.length > 0 || (strict && warnings.length > 0)) process.exit(1);
