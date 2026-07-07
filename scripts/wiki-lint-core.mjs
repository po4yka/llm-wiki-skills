#!/usr/bin/env node
// Deterministic core checks for the wiki-lint skill.
// Portable: operates on any LLM-Wiki vault path, no repository-root assumptions.
//
// Usage:
//   node wiki-lint-core.mjs <vault-path> [--strict]
//
// Prints a draft lint report (Markdown) to stdout. Read-only: never modifies the vault.
// Exit code: 0 normally; 1 with --strict when critical or high findings exist.
//
// Covers the deterministic wiki-lint checks: inventory, links, provenance,
// trust and taxonomy. Contradiction analysis is intentionally out of scope —
// it requires judgement and stays with the agent.

import fs from 'node:fs';
import path from 'node:path';

const CORE_TYPES = new Set(['source', 'entity', 'concept', 'comparison', 'synthesis', 'query', 'report']);
const STATUSES = new Set(['draft', 'reviewed', 'verified', 'stale', 'archived']);
const REQUIRED_FIELDS = ['title', 'type', 'status', 'created', 'updated', 'review_required'];
const PROVENANCE_EXEMPT_TYPES = new Set(['synthesis', 'query', 'report']);
const CONFIDENCE_REVIEW_THRESHOLD = 0.7;
const HIGH_CONFIDENCE_THRESHOLD = 0.85;

function usageExit() {
  console.error('usage: node wiki-lint-core.mjs <vault-path> [--strict]');
  process.exit(2);
}

const args = process.argv.slice(2).filter((a) => a !== '--strict');
const strict = process.argv.includes('--strict');
if (args.length !== 1) usageExit();
const vaultRoot = path.resolve(args[0]);
if (!fs.existsSync(vaultRoot) || !fs.statSync(vaultRoot).isDirectory()) {
  console.error(`error: '${vaultRoot}' is not a directory`);
  process.exit(2);
}

function listMarkdownFiles(startDir) {
  const results = [];
  const stack = [startDir];
  while (stack.length > 0) {
    const current = stack.pop();
    for (const entry of fs.readdirSync(current, { withFileTypes: true })) {
      if (entry.name.startsWith('.') || entry.name === 'node_modules') continue;
      const abs = path.join(current, entry.name);
      if (entry.isDirectory()) stack.push(abs);
      else if (entry.isFile() && entry.name.endsWith('.md')) results.push(abs);
    }
  }
  return results.sort();
}

function rel(abs) {
  return path.relative(vaultRoot, abs).split(path.sep).join('/');
}

function unquote(value) {
  return String(value ?? '').trim().replace(/^['"]|['"]$/g, '').trim();
}

function coerce(raw) {
  const value = unquote(raw);
  if (value === 'true') return true;
  if (value === 'false') return false;
  if (value === 'null' || value === '~' || value === '') return null;
  if (/^-?\d+(\.\d+)?$/.test(value)) return Number(value);
  return value;
}

function parseInlineArray(raw) {
  const inner = raw.trim().replace(/^\[/, '').replace(/\]$/, '').trim();
  if (!inner) return [];
  return inner.split(',').map((item) => coerce(item));
}

// Minimal YAML-ish frontmatter parser: scalars, inline arrays, block lists,
// one level of nested maps. Returns { fields, malformed } or null.
function parseFrontmatter(text) {
  const match = text.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?/);
  if (!match) return null;
  const fields = {};
  let currentKey = null;
  let currentMode = null; // 'list' | 'map'
  let malformed = null;

  for (const rawLine of match[1].split(/\r?\n/)) {
    const line = rawLine.replace(/\s+$/, '');
    if (!line.trim() || line.trim().startsWith('#')) continue;

    const listItem = line.match(/^\s+-\s*(.*)$/);
    if (listItem && currentKey && currentMode === 'list') {
      fields[currentKey].push(coerce(listItem[1]));
      continue;
    }

    const nested = line.match(/^\s{2,}([a-zA-Z0-9_-]+):\s*(.*)$/);
    if (nested && currentKey && currentMode === 'map') {
      fields[currentKey][nested[1]] = coerce(nested[2]);
      continue;
    }

    const topLevel = line.match(/^([a-zA-Z0-9_-]+):\s*(.*)$/);
    if (topLevel) {
      const [, key, rawValue] = topLevel;
      const value = rawValue.trim();
      if (value === '') {
        // Could open a block list or a nested map; decide on the next line.
        fields[key] = null;
        currentKey = key;
        currentMode = 'pending';
        continue;
      }
      if (value.startsWith('[')) {
        fields[key] = parseInlineArray(value);
      } else {
        fields[key] = coerce(value);
      }
      currentKey = null;
      currentMode = null;
      continue;
    }

    if (currentMode === 'pending') {
      // First continuation line decides the container type.
      if (/^\s+-\s*/.test(line)) {
        fields[currentKey] = [coerce(line.replace(/^\s+-\s*/, ''))];
        currentMode = 'list';
        continue;
      }
      const firstNested = line.match(/^\s{2,}([a-zA-Z0-9_-]+):\s*(.*)$/);
      if (firstNested) {
        fields[currentKey] = { [firstNested[1]]: coerce(firstNested[2]) };
        currentMode = 'map';
        continue;
      }
    }

    malformed = malformed ?? rawLine;
  }

  // Normalize pending empty containers to empty arrays.
  for (const [key, value] of Object.entries(fields)) {
    if (value === null && REQUIRED_FIELDS.includes(key)) fields[key] = null;
  }
  return { fields, malformed, body: text.slice(match[0].length) };
}

function stripCodeBlocks(markdown) {
  return markdown.replace(/```[\s\S]*?```/g, '').replace(/`[^`\n]*`/g, '');
}

// ---------------------------------------------------------------------------
// Load pages
// ---------------------------------------------------------------------------

const allFiles = listMarkdownFiles(vaultRoot);
const wikiFiles = allFiles.filter((abs) => rel(abs).startsWith('wiki/'));
const pageFiles = wikiFiles.filter((abs) => !['wiki/index.md', 'wiki/log.md'].includes(rel(abs)));

const pages = new Map(); // rel -> { fm, body, text, malformed }
for (const abs of allFiles) {
  const text = fs.readFileSync(abs, 'utf8');
  const parsed = parseFrontmatter(text);
  pages.set(rel(abs), {
    fm: parsed?.fields ?? null,
    malformed: parsed?.malformed ?? null,
    body: parsed?.body ?? text,
    text,
  });
}

const stemIndex = new Map(); // lowercase stem -> [rel]
for (const abs of allFiles) {
  const stem = path.basename(abs, '.md').toLowerCase();
  if (!stemIndex.has(stem)) stemIndex.set(stem, []);
  stemIndex.get(stem).push(rel(abs));
}
const relSet = new Set(allFiles.map((abs) => rel(abs)));

// ---------------------------------------------------------------------------
// Findings
// ---------------------------------------------------------------------------

const findings = {
  critical: [],
  high: [],
  medium: [],
  low: [],
};

function add(severity, section, message) {
  findings[severity].push({ section, message });
}

// 1. Inventory
const typeCounts = new Map();
const statusCounts = new Map();
for (const abs of pageFiles) {
  const relPath = rel(abs);
  const page = pages.get(relPath);

  if (!page.fm) {
    add('medium', 'inventory', `${relPath}: missing YAML frontmatter`);
    continue;
  }
  if (page.malformed) {
    add('medium', 'inventory', `${relPath}: malformed frontmatter line '${page.malformed}'`);
  }
  for (const field of REQUIRED_FIELDS) {
    if (page.fm[field] === undefined || page.fm[field] === null) {
      add('medium', 'inventory', `${relPath}: missing required frontmatter field '${field}'`);
    }
  }
  const type = page.fm.type;
  const status = page.fm.status;
  if (type !== undefined && type !== null) {
    typeCounts.set(type, (typeCounts.get(type) ?? 0) + 1);
    if (!CORE_TYPES.has(type)) add('low', 'taxonomy', `${relPath}: unknown core type '${type}'`);
  }
  if (status !== undefined && status !== null) {
    statusCounts.set(status, (statusCounts.get(status) ?? 0) + 1);
    if (!STATUSES.has(status)) add('low', 'taxonomy', `${relPath}: unknown status '${status}'`);
  }
}

// 2. Link checks
const inbound = new Map(); // rel -> count
function resolveWikilink(target) {
  const stem = target.split('#')[0].split('|')[0].trim().toLowerCase();
  if (!stem) return [];
  if (stem.includes('/')) {
    const withExt = stem.endsWith('.md') ? stem : `${stem}.md`;
    return relSet.has(withExt) ? [withExt] : [];
  }
  return stemIndex.get(stem) ?? [];
}

for (const abs of allFiles) {
  const fromRel = rel(abs);
  const content = stripCodeBlocks(pages.get(fromRel).body);

  for (const match of content.matchAll(/\[\[([^\]]+)\]\]/g)) {
    const targets = resolveWikilink(match[1]);
    if (targets.length === 0) {
      add('high', 'links', `${fromRel}: broken wikilink [[${match[1]}]]`);
    } else {
      for (const target of targets) inbound.set(target, (inbound.get(target) ?? 0) + 1);
    }
  }

  for (const match of content.matchAll(/\[[^\]]*\]\(([^)\s]+)\)/g)) {
    const href = match[1];
    if (/^(https?:|mailto:|#)/.test(href)) continue;
    const clean = href.split('#')[0];
    if (!clean.endsWith('.md')) continue;
    const resolved = clean.startsWith('/')
      ? clean.slice(1)
      : path.posix.normalize(path.posix.join(path.posix.dirname(fromRel), clean));
    if (!relSet.has(resolved)) {
      add('high', 'links', `${fromRel}: broken link '${href}'`);
    } else {
      inbound.set(resolved, (inbound.get(resolved) ?? 0) + 1);
    }
  }
}

const indexText = pages.get('wiki/index.md')?.text ?? '';
for (const abs of pageFiles) {
  const relPath = rel(abs);
  const referenced = (inbound.get(relPath) ?? 0) > 0 || indexText.includes(relPath);
  if (!referenced) add('medium', 'orphans', `${relPath}: not referenced by any page or wiki/index.md`);

  const content = stripCodeBlocks(pages.get(relPath).body);
  const hasOutbound = /\[\[[^\]]+\]\]/.test(content) || /\[[^\]]*\]\([^)]+\)/.test(content);
  if (!hasOutbound) add('low', 'links', `${relPath}: no outbound links`);
}

// Duplicate titles and near-duplicate slugs
const titleIndex = new Map();
for (const abs of pageFiles) {
  const relPath = rel(abs);
  const page = pages.get(relPath);
  const title = (page.fm?.title ?? page.body.match(/^#\s+(.+)$/m)?.[1] ?? '').toString().trim().toLowerCase();
  if (!title) continue;
  if (!titleIndex.has(title)) titleIndex.set(title, []);
  titleIndex.get(title).push(relPath);
}
for (const [title, relPaths] of titleIndex) {
  if (relPaths.length > 1) add('medium', 'links', `duplicate title '${title}': ${relPaths.join(', ')}`);
}
const slugIndex = new Map();
for (const abs of pageFiles) {
  const slug = path.basename(abs, '.md').toLowerCase().replace(/[-_]/g, '').replace(/s$/, '');
  if (!slugIndex.has(slug)) slugIndex.set(slug, []);
  slugIndex.get(slug).push(rel(abs));
}
for (const [, relPaths] of slugIndex) {
  if (relPaths.length > 1) add('low', 'links', `near-duplicate slugs: ${relPaths.join(', ')}`);
}

// 3 + 4. Provenance and trust checks
const today = new Date().toISOString().slice(0, 10);
for (const abs of pageFiles) {
  const relPath = rel(abs);
  const page = pages.get(relPath);
  if (!page.fm) continue;
  const fm = page.fm;

  const sources = [...(Array.isArray(fm.source_paths) ? fm.source_paths : []), ...(Array.isArray(fm.source_urls) ? fm.source_urls : [])];
  const factual = !PROVENANCE_EXEMPT_TYPES.has(fm.type);

  if (factual && fm.ai_generated === true && sources.length === 0) {
    add('high', 'provenance', `${relPath}: ai-generated factual page without source_paths/source_urls`);
  }
  if (factual && ['reviewed', 'verified'].includes(fm.status) && sources.length === 0) {
    add('high', 'provenance', `${relPath}: ${fm.status} page without provenance`);
  }
  if (typeof fm.ai_confidence === 'number' && fm.ai_confidence >= HIGH_CONFIDENCE_THRESHOLD && factual && sources.length === 0) {
    add('high', 'provenance', `${relPath}: high ai_confidence (${fm.ai_confidence}) with no source reference`);
  }

  if (typeof fm.ai_confidence === 'number' && fm.ai_confidence < CONFIDENCE_REVIEW_THRESHOLD && fm.review_required !== true) {
    add('critical', 'trust', `${relPath}: ai_confidence ${fm.ai_confidence} < ${CONFIDENCE_REVIEW_THRESHOLD} without review_required: true`);
  }
  if (fm.review_required === false && fm.status === 'draft') {
    add('high', 'trust', `${relPath}: review_required: false on a draft page`);
  }
  if (fm.status === 'verified' && typeof fm.stale_after === 'string' && fm.stale_after && fm.stale_after < today) {
    add('high', 'stale', `${relPath}: verified page past stale_after (${fm.stale_after})`);
  }
  if (/^Support:\s*ambiguous\b/m.test(page.body) && fm.review_required !== true) {
    add('high', 'trust', `${relPath}: ambiguous claim support without review_required: true`);
  }
}

// 6. Taxonomy checks (tags)
const taxonomyPath = path.join(vaultRoot, '_meta', 'taxonomy.md');
if (fs.existsSync(taxonomyPath)) {
  const taxonomyText = fs.readFileSync(taxonomyPath, 'utf8');
  const allowedTags = new Set([...taxonomyText.matchAll(/`([a-z0-9][a-z0-9-]*)`/g)].map((m) => m[1]));
  const usedTags = new Map();
  for (const abs of pageFiles) {
    const fm = pages.get(rel(abs)).fm;
    if (!fm || !Array.isArray(fm.tags)) continue;
    for (const tag of fm.tags) {
      usedTags.set(String(tag), (usedTags.get(String(tag)) ?? 0) + 1);
      if (!allowedTags.has(String(tag))) {
        add('low', 'taxonomy', `${rel(abs)}: tag '${tag}' not in _meta/taxonomy.md`);
      }
    }
  }
  for (const tag of allowedTags) {
    if (CORE_TYPES.has(tag) || STATUSES.has(tag)) continue;
    if (!usedTags.has(tag)) add('low', 'taxonomy', `taxonomy tag '${tag}' is unused`);
  }
}

// ---------------------------------------------------------------------------
// Report
// ---------------------------------------------------------------------------

function section(name, filter) {
  const rows = [];
  for (const severity of ['critical', 'high', 'medium', 'low']) {
    for (const finding of findings[severity]) {
      if (filter(finding)) rows.push(`- [${severity}] ${finding.message}`);
    }
  }
  return rows.length > 0 ? rows.join('\n') : '- none found by deterministic checks';
}

const total = findings.critical.length + findings.high.length + findings.medium.length + findings.low.length;
const lines = [];
lines.push(`# Wiki lint report (deterministic draft): ${today}`);
lines.push('');
lines.push('> Generated by wiki-lint-core.mjs. Contradiction checks and protected-section');
lines.push('> git checks are not included; the agent must add them before finalizing.');
lines.push('');
lines.push('## Summary');
lines.push('');
lines.push(`- pages scanned: ${pageFiles.length}`);
lines.push(`- findings: ${total} (critical: ${findings.critical.length}, high: ${findings.high.length}, medium: ${findings.medium.length}, low: ${findings.low.length})`);
lines.push('');
lines.push('## Critical issues');
lines.push('');
lines.push(section('critical', (f) => findings.critical.includes(f)));
lines.push('');
lines.push('## High-priority review queue');
lines.push('');
lines.push(section('high', (f) => findings.high.includes(f)));
lines.push('');
lines.push('## Broken links');
lines.push('');
lines.push(section('links', (f) => f.section === 'links'));
lines.push('');
lines.push('## Orphans');
lines.push('');
lines.push(section('orphans', (f) => f.section === 'orphans'));
lines.push('');
lines.push('## Provenance gaps');
lines.push('');
lines.push(section('provenance', (f) => f.section === 'provenance'));
lines.push('');
lines.push('## Stale pages');
lines.push('');
lines.push(section('stale', (f) => f.section === 'stale'));
lines.push('');
lines.push('## Contradictions');
lines.push('');
lines.push('- requires agent judgement; not covered by deterministic checks');
lines.push('');
lines.push('## Taxonomy drift');
lines.push('');
lines.push(section('taxonomy', (f) => f.section === 'taxonomy'));
lines.push('');
lines.push('## Suggested patches');
lines.push('');
lines.push('- to be proposed by the agent after review');
lines.push('');
lines.push('## Metrics');
lines.push('');
for (const [type, count] of [...typeCounts.entries()].sort()) lines.push(`- type ${type}: ${count}`);
for (const [status, count] of [...statusCounts.entries()].sort()) lines.push(`- status ${status}: ${count}`);
lines.push(`- trust findings: ${findings.critical.length + findings.high.length}`);
console.log(lines.join('\n'));

if (strict && (findings.critical.length > 0 || findings.high.length > 0)) {
  process.exit(1);
}
