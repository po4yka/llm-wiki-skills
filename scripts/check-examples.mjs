import fs from 'node:fs';
import path from 'node:path';
import { failFactory, listFiles, repoRoot, readText } from './lib/repo.mjs';

const { fail, finish } = failFactory();
const requiredPaths = [
  'examples/README.md',
  'examples/minimal-vault/AGENTS.md',
  'examples/minimal-vault/CLAUDE.md',
  'examples/minimal-vault/raw/sources/example-source.md',
  'examples/minimal-vault/wiki/index.md',
  'examples/minimal-vault/wiki/log.md',
  'examples/minimal-vault/expected/ingest-summary.md',
  'examples/minimal-vault/expected/query-answer.md',
  'examples/minimal-vault/expected/lint-report.md',
  'examples/provenance-gaps/wiki/concepts/unsupported-claims.md',
  'examples/provenance-gaps/expected/provenance-report.md',
  'examples/claim-anchors/wiki/concepts/supported-claims.md',
  'examples/contradiction-case/wiki/concepts/retrieval-defaults.md',
  'examples/contradiction-case/expected/conflict-resolution.md',
  'examples/repo-docs-project/AGENTS.md',
  'examples/repo-docs-project/expected/repo-docs-plan.md',
  'examples/redaction-case/private-note.md',
  'examples/redaction-case/expected/redaction-preview.md',
  'docs/quickstart.md',
  'docs/skill-router.md',
];

const expectedSections = new Map([
  ['examples/minimal-vault/expected/ingest-summary.md', ['## Ingest summary', '## Required sections in generated source page', '## Safety expectations']],
  ['examples/minimal-vault/expected/query-answer.md', ['## Answer', '## Evidence used', '## File-back expectation', '## Safety expectation']],
  ['examples/minimal-vault/expected/lint-report.md', ['## Summary', '## Required sections', '## Safety expectation']],
  ['examples/provenance-gaps/expected/provenance-report.md', ['## Provenance summary', '## Claims expected to be flagged', '## Required classification', '## Safety expectation']],
  ['examples/contradiction-case/expected/conflict-resolution.md', ['## Conflict summary', '## Expected classification', '## Expected resolution options', '## Safety expectation']],
  ['examples/repo-docs-project/expected/repo-docs-plan.md', ['## Repo docs summary', '## Required pages or proposals', '## Instruction-file expectation', '## Safety expectation']],
  ['examples/redaction-case/expected/redaction-preview.md', ['## Expected finding categories', '## Safety expectation']],
]);

function hasFrontmatter(text) {
  return /^---\r?\n[\s\S]*?\r?\n---\r?\n/.test(text);
}

function frontmatterField(text, field) {
  const match = text.match(new RegExp(`^${field}:\\s*(.*)$`, 'm'));
  return match?.[1]?.trim() ?? null;
}

for (const relPath of requiredPaths) {
  if (!fs.existsSync(path.join(repoRoot, relPath))) {
    fail(`missing required example or onboarding file: ${relPath}`);
  }
}

for (const [relPath, sections] of expectedSections) {
  const absPath = path.join(repoRoot, relPath);
  if (!fs.existsSync(absPath)) continue;
  const text = readText(absPath);
  for (const section of sections) {
    if (!text.includes(section)) {
      fail(`${relPath}: missing expected section '${section}'`);
    }
  }
}

const exampleWikiFiles = listFiles(path.join(repoRoot, 'examples'), (_abs, rel) => {
  return /\/wiki\//.test(rel) && rel.endsWith('.md');
});

for (const filePath of exampleWikiFiles) {
  const rel = path.relative(repoRoot, filePath);
  const text = readText(filePath);

  if (!hasFrontmatter(text)) {
    fail(`${rel}: example wiki page must have frontmatter`);
    continue;
  }

  const status = frontmatterField(text, 'status');
  const reviewRequired = frontmatterField(text, 'review_required');

  if (status === 'verified') {
    fail(`${rel}: example generated/wiki fixture must not be status: verified`);
  }

  if (reviewRequired !== 'true') {
    fail(`${rel}: example wiki page should use review_required: true`);
  }
}

const redactionFixture = readText(path.join(repoRoot, 'examples/redaction-case/private-note.md'));
if (!redactionFixture.includes('example.test') || !redactionFixture.includes('service.internal')) {
  fail('examples/redaction-case/private-note.md must contain only synthetic redaction fixtures');
}

finish(`validated ${requiredPaths.length} required files, ${expectedSections.size} expected reports and ${exampleWikiFiles.length} example wiki pages`);
