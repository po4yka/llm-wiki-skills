import path from 'node:path';
import { failFactory, listFiles, repoRelative, repoRoot, readText } from './lib/repo.mjs';

const { fail, finish } = failFactory();

const currentAsOfDocs = [
  'docs/03-second-brain-methodology.md',
  'docs/04-anti-slop-and-trust.md',
  'docs/05-tooling-landscape.md',
  'docs/06-implementation-playbook.md',
  'docs/07-skills-overview.md',
  'docs/08-evaluation-and-metrics.md',
  'docs/09-references.md',
  'docs/10-skill-system-roadmap.md',
  'docs/11-use-case-skill-catalog.md',
  'docs/adoption-objections.md',
  'docs/adoption-q-and-a.md',
  'docs/criticism-and-mitigations.md',
  'docs/paf-nexus-cortex.md',
  'docs/company-information-flows.md',
];

const removedAdoptionPaths = [
  '20-adoption-objections.md',
  '21-adoption-q-and-a.md',
  '22-criticism-and-mitigations.md',
  '22-paf-nexus-cortex.md',
  '23-company-information-flows.md',
];

const textFiles = listFiles(repoRoot, (_absPath, relPath) => {
  if (/^(node_modules|\.git|\.tmp|dist)\//.test(relPath)) return false;
  return /\.(md|ya?ml|json|mjs)$/.test(relPath);
});

function checkUniqueDocPrefixes() {
  const seen = new Map();
  const docs = listFiles(path.join(repoRoot, 'docs'), (_absPath, relPath) => /^docs\/\d{2}-[^/]+\.md$/.test(relPath));

  for (const filePath of docs) {
    const relPath = repoRelative(filePath);
    const prefix = path.basename(relPath).slice(0, 2);
    const existing = seen.get(prefix);
    if (existing) {
      fail(`docs/: numeric prefix ${prefix} is shared by ${existing} and ${relPath}`);
      continue;
    }
    seen.set(prefix, relPath);
  }
}

function checkCurrentAsOfMarkers() {
  for (const relPath of currentAsOfDocs) {
    const text = readText(path.join(repoRoot, relPath));
    if (!/^> Current as of: \d{4}-\d{2}-\d{2}$/m.test(text)) {
      fail(`${relPath}: missing '> Current as of: YYYY-MM-DD' marker for refresh scanning`);
    }
  }
}

function checkRemovedAdoptionPaths() {
  for (const filePath of textFiles) {
    const relPath = repoRelative(filePath);
    const text = readText(filePath);

    for (const removedPath of removedAdoptionPaths) {
      if (relPath.endsWith(removedPath)) {
        fail(`${relPath}: adoption docs must use named slugs, not numbered prefixes`);
      }
      if (relPath !== 'scripts/validate-docs-metadata.mjs' && text.includes(removedPath)) {
        fail(`${relPath}: references removed numbered adoption path '${removedPath}'`);
      }
    }
  }
}

function checkExternalSpecPins() {
  const mcpDatePattern = /modelcontextprotocol\.io\/specification\/(\d{4}-\d{2}-\d{2})/g;
  const unsupportedMcpVersionPattern = /\b2025-06-18\b/g;
  const oldSlsaPattern = /slsa\.dev\/spec\/v1\.1\b/g;

  for (const filePath of textFiles) {
    const relPath = repoRelative(filePath);
    const text = readText(filePath);

    for (const match of text.matchAll(mcpDatePattern)) {
      if (match[1] !== '2025-11-25') {
        fail(`${relPath}: MCP spec links must use 2025-11-25, found ${match[1]}`);
      }
    }

    for (const match of text.matchAll(unsupportedMcpVersionPattern)) {
      fail(`${relPath}: stale MCP spec revision '${match[0]}'`);
    }

    for (const match of text.matchAll(oldSlsaPattern)) {
      fail(`${relPath}: stale SLSA spec revision '${match[0]}'`);
    }
  }
}

function checkSourceMapEntriesAreUsed() {
  const docs12 = readText(path.join(repoRoot, 'docs', '12-evidence-and-faq.md'));
  if (/^- Infini Memory:/m.test(docs12)) {
    fail('docs/12-evidence-and-faq.md: Source map must not list Infini Memory unless the body uses it');
  }
}

function checkAgentFacingLanguage() {
  const skillFiles = listFiles(path.join(repoRoot, 'skills'), (_absPath, relPath) => /\.(md|ya?ml|json)$/.test(relPath));
  const cyrillicPattern = /[А-Яа-яЁё]/u;

  for (const filePath of skillFiles) {
    const relPath = repoRelative(filePath);
    const text = readText(filePath);
    const match = cyrillicPattern.exec(text);
    if (match) {
      fail(`${relPath}: agent-facing skill files must be English-only; found Cyrillic text`);
    }
  }
}

checkUniqueDocPrefixes();
checkCurrentAsOfMarkers();
checkRemovedAdoptionPaths();
checkExternalSpecPins();
checkSourceMapEntriesAreUsed();
checkAgentFacingLanguage();

finish('validated documentation metadata and freshness guardrails');
