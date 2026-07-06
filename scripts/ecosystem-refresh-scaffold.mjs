import fs from 'node:fs';
import path from 'node:path';
import { repoRoot, readText } from './lib/repo.mjs';

const args = process.argv.slice(2);
const outIndex = args.indexOf('--out');
const docIndex = args.indexOf('--doc');
const outPath = path.resolve(repoRoot, outIndex >= 0 ? args[outIndex + 1] : 'dist/ecosystem-refresh-report.md');
const docPath = path.resolve(repoRoot, docIndex >= 0 ? args[docIndex + 1] : 'docs/13-ecosystem-matrix.md');
const today = new Date().toISOString().slice(0, 10);

function parseCurrentAsOf(text) {
  return text.match(/Current as of:\s*(\d{4}-\d{2}-\d{2})/i)?.[1] ?? null;
}

function parseSeedUrls(text) {
  return [...text.matchAll(/^\s*-\s+(https?:\/\/\S+)\s*$/gm)].map((match) => match[1]);
}

function parseImplementationRows(text) {
  const rows = [];
  const sectionMatch = text.match(/## Seed registry: LLM-Wiki and repo-wiki implementations\s*\n([\s\S]*?)(\n## |$)/);
  if (!sectionMatch) return rows;

  for (const line of sectionMatch[1].split(/\r?\n/)) {
    if (!line.startsWith('| `')) continue;
    const cells = line
      .split('|')
      .slice(1, -1)
      .map((cell) => cell.trim());
    if (cells.length < 5) continue;
    rows.push({ project: cells[0].replace(/`/g, ''), family: cells[1], whatToVerify: cells[2], fitSignal: cells[3], avoidWhen: cells[4] });
  }

  return rows;
}

function parseEvidenceLabels(text) {
  return [...text.matchAll(/`(verified-current|verify-before-use|experimental|adjacent)`/g)].map((match) => match[1]);
}

function table(headers, rows, formatter) {
  const lines = [`| ${headers.join(' |')} |`, `|${headers.map(() => '---').join('|')}|`];
  for (const row of rows) {
    lines.push(`| ${formatter(row).map((value) => String(value ?? '').replace(/\|/g, '\\|')).join(' | ')} |`);
  }
  return `${lines.join('\n')}\n`;
}

if (!fs.existsSync(docPath)) {
  console.error(`Ecosystem matrix not found: ${path.relative(repoRoot, docPath)}`);
  process.exit(1);
}

const text = readText(docPath);
const currentAsOf = parseCurrentAsOf(text);
const seedUrls = parseSeedUrls(text);
const implementationRows = parseImplementationRows(text);
const evidenceLabels = [...new Set(parseEvidenceLabels(text))];

const githubUrls = seedUrls.filter((url) => url.includes('github.com/'));
const nonGithubUrls = seedUrls.filter((url) => !url.includes('github.com/'));

const lines = [
  `# Ecosystem refresh report: ${today}`,
  '',
  '## Summary',
  '',
  `- Matrix document: ${path.relative(repoRoot, docPath)}`,
  `- Matrix current-as-of date: ${currentAsOf ?? 'missing'}`,
  `- Implementation rows found: ${implementationRows.length}`,
  `- Seed URLs found: ${seedUrls.length}`,
  `- GitHub seed URLs: ${githubUrls.length}`,
  `- Non-GitHub seed URLs: ${nonGithubUrls.length}`,
  `- Evidence labels mentioned: ${evidenceLabels.length > 0 ? evidenceLabels.join(', ') : 'none'}`,
  '',
  '> This is an offline deterministic scaffold. It does not browse, call GitHub APIs or update maturity claims. Use `llm-wiki-ecosystem-registry` with web access to verify current status and update the matrix.',
  '',
  '## Implementation verification queue',
  '',
];

if (implementationRows.length > 0) {
  lines.push(table(['Project', 'Family', 'What to verify'], implementationRows, (row) => [row.project, row.family, row.whatToVerify]));
} else {
  lines.push('No implementation rows found.\n');
}

lines.push('## Seed URLs', '');
if (seedUrls.length > 0) {
  lines.push(table(['URL', 'Type', 'Recommended check'], seedUrls.map((url) => ({ url, type: url.includes('github.com/') ? 'github' : 'docs/web' })), (row) => [row.url, row.type, row.type === 'github' ? 'README, license, commits, releases, issues, security posture' : 'official docs, current API behavior, version/date, security notes']));
} else {
  lines.push('No seed URLs found.\n');
}

lines.push('## Refresh checklist', '', '- [ ] Check official README/docs for each recommended project.', '- [ ] Check license and data-use constraints.', '- [ ] Check recent commits/releases/issues for maturity.', '- [ ] Check local/cloud model and parser behavior.', '- [ ] Check storage/export format and lock-in risk.', '- [ ] Check provenance, review gates and write safety.', '- [ ] Mark each claim as `verified-current`, `verify-before-use`, `experimental` or `adjacent`.', '- [ ] Update `Current as of` in the matrix after verification.', '', '## Suggested follow-up prompt', '', '```text', 'Use llm-wiki-ecosystem-registry to refresh docs/13-ecosystem-matrix.md. Verify current status from official sources only, cite every current-state claim, and propose a patch rather than directly rewriting recommendations.', '```', '');

fs.mkdirSync(path.dirname(outPath), { recursive: true });
fs.writeFileSync(outPath, `${lines.join('\n')}\n`);
console.log(`✓ wrote ${path.relative(repoRoot, outPath)}`);
