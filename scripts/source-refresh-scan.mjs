import fs from 'node:fs';
import path from 'node:path';
import { listFiles, repoRelative, repoRoot, readText } from './lib/repo.mjs';

const args = process.argv.slice(2);
const outIndex = args.indexOf('--out');
const todayIndex = args.indexOf('--today');
const outPath = path.resolve(repoRoot, outIndex >= 0 ? args[outIndex + 1] : 'dist/source-refresh-report.md');
const today = todayIndex >= 0 ? args[todayIndex + 1] : new Date().toISOString().slice(0, 10);
const currentAsOfMaxAgeDays = Number(process.env.CURRENT_AS_OF_MAX_AGE_DAYS ?? 90);

function parseDate(value) {
  if (!value || value === 'null' || value === 'YYYY-MM-DD') return null;
  const match = String(value).match(/\d{4}-\d{2}-\d{2}/);
  if (!match) return null;
  const date = new Date(`${match[0]}T00:00:00Z`);
  return Number.isNaN(date.getTime()) ? null : date;
}

function daysBetween(a, b) {
  return Math.floor((b.getTime() - a.getTime()) / 86_400_000);
}

function extractFrontmatter(text) {
  const match = text.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n/);
  return match ? match[1] : '';
}

function scalar(frontmatter, key) {
  const match = frontmatter.match(new RegExp(`^${key}:\\s*(.*)$`, 'm'));
  if (!match) return null;
  return match[1].replace(/^['"]|['"]$/g, '').trim();
}

function listValues(frontmatter, key) {
  const lines = frontmatter.split(/\r?\n/);
  const values = [];
  let inList = false;

  for (const line of lines) {
    if (line.match(new RegExp(`^${key}:\\s*\\[\\]\\s*$`))) return [];
    if (line.match(new RegExp(`^${key}:\\s*$`))) {
      inList = true;
      continue;
    }

    if (inList) {
      const item = line.match(/^\s*-\s*(.*)$/);
      if (item) {
        values.push(item[1].replace(/^['"]|['"]$/g, '').trim());
        continue;
      }

      if (/^[A-Za-z0-9_-]+:/.test(line)) {
        inList = false;
      }
    }
  }

  return values.filter(Boolean);
}

function markdownFiles() {
  return listFiles(repoRoot, (_abs, rel) => {
    if (!rel.endsWith('.md')) return false;
    if (rel.startsWith('node_modules/') || rel.startsWith('.git/') || rel.startsWith('dist/')) return false;
    return true;
  });
}

const todayDate = parseDate(today) ?? new Date();
const stalePages = [];
const sourceGaps = [];
const missingLocalSources = [];
const currentAsOfItems = [];
const urlSources = [];
let frontmatterPages = 0;

for (const filePath of markdownFiles()) {
  const rel = repoRelative(filePath);
  const text = readText(filePath);
  const frontmatter = extractFrontmatter(text);

  if (frontmatter) {
    frontmatterPages += 1;
    const type = scalar(frontmatter, 'type');
    const status = scalar(frontmatter, 'status');
    const updated = scalar(frontmatter, 'updated');
    const staleAfter = scalar(frontmatter, 'stale_after');
    const sourcePaths = listValues(frontmatter, 'source_paths');
    const sourceUrls = listValues(frontmatter, 'source_urls');

    const staleDate = parseDate(staleAfter);
    if (staleDate && staleDate <= todayDate) {
      stalePages.push({ rel, type, status, updated, staleAfter, action: 'Run llm-wiki-source-refresh with current sources.' });
    }

    const sourceLike = ['source', 'entity', 'concept', 'comparison', 'synthesis', 'query'].includes(type ?? '');
    const generatedOrReviewed = ['reviewed', 'verified', 'stale'].includes(status ?? '');

    if (sourceLike && generatedOrReviewed && sourcePaths.length === 0 && sourceUrls.length === 0) {
      sourceGaps.push({ rel, type, status, action: 'Add source_paths/source_urls or demote trust status.' });
    }

    for (const sourcePath of sourcePaths) {
      if (/^https?:\/\//i.test(sourcePath)) continue;
      if (sourcePath.includes('YYYY') || sourcePath === '[]') continue;
      const absSource = path.resolve(repoRoot, sourcePath);
      if (!absSource.startsWith(repoRoot) || !fs.existsSync(absSource)) {
        missingLocalSources.push({ rel, sourcePath, action: 'Verify path or update provenance.' });
      }
    }

    for (const url of sourceUrls) {
      if (/^https?:\/\//i.test(url)) {
        urlSources.push({ rel, url, action: 'Needs web-capable refresh if claim is current-state or stale.' });
      }
    }
  }

  const currentAsOfMatch = text.match(/Current as of:\s*(\d{4}-\d{2}-\d{2})/i);
  if (currentAsOfMatch) {
    const currentAsOf = currentAsOfMatch[1];
    const currentAsOfDate = parseDate(currentAsOf);
    const ageDays = currentAsOfDate ? daysBetween(currentAsOfDate, todayDate) : null;
    if (ageDays !== null && ageDays >= currentAsOfMaxAgeDays) {
      currentAsOfItems.push({ rel, currentAsOf, ageDays, action: 'Re-run relevant refresh skill and update current-as-of metadata.' });
    }
  }
}

function table(headers, rows, formatter) {
  const lines = [`| ${headers.join(' |')} |`, `|${headers.map(() => '---').join('|')}|`];
  for (const row of rows) {
    lines.push(`| ${formatter(row).map((value) => String(value ?? '').replace(/\|/g, '\\|')).join(' | ')} |`);
  }
  return `${lines.join('\n')}\n`;
}

const lines = [
  `# Source refresh report: ${today}`,
  '',
  '## Summary',
  '',
  `- Markdown files scanned: ${markdownFiles().length}`,
  `- Pages with frontmatter: ${frontmatterPages}`,
  `- Pages past \`stale_after\`: ${stalePages.length}`,
  `- Reviewed/verified/stale pages missing source references: ${sourceGaps.length}`,
  `- Missing local source paths: ${missingLocalSources.length}`,
  `- External source URLs found: ${urlSources.length}`,
  `- Current-as-of docs older than ${currentAsOfMaxAgeDays} days: ${currentAsOfItems.length}`,
  '',
  '> This is an offline deterministic report. It does not browse the web and does not update truth claims. Use `llm-wiki-source-refresh` with web access for source verification and patch proposals.',
  '',
  '## Pages checked',
  '',
];

if (stalePages.length > 0) {
  lines.push(table(['Page', 'Type', 'Status', 'Updated', 'stale_after', 'Action'], stalePages, (row) => [row.rel, row.type, row.status, row.updated, row.staleAfter, row.action]));
} else {
  lines.push('No pages with expired `stale_after` were found.\n');
}

lines.push('## Provenance gaps', '');
if (sourceGaps.length > 0) {
  lines.push(table(['Page', 'Type', 'Status', 'Action'], sourceGaps, (row) => [row.rel, row.type, row.status, row.action]));
} else {
  lines.push('No reviewed/verified/stale pages without source references were found.\n');
}

lines.push('## Missing local sources', '');
if (missingLocalSources.length > 0) {
  lines.push(table(['Page', 'Missing source path', 'Action'], missingLocalSources, (row) => [row.rel, row.sourcePath, row.action]));
} else {
  lines.push('No missing local `source_paths` were found.\n');
}

lines.push('## Current-as-of refresh queue', '');
if (currentAsOfItems.length > 0) {
  lines.push(table(['Document', 'Current as of', 'Age days', 'Action'], currentAsOfItems, (row) => [row.rel, row.currentAsOf, row.ageDays, row.action]));
} else {
  lines.push('No stale `Current as of` markers were found.\n');
}

lines.push('## External source URLs', '');
if (urlSources.length > 0) {
  lines.push(table(['Page', 'URL', 'Action'], urlSources, (row) => [row.rel, row.url, row.action]));
} else {
  lines.push('No external `source_urls` were found in frontmatter.\n');
}

lines.push('## Recommended next actions', '', '1. Run `llm-wiki-source-refresh` for rows in the stale/current-as-of queues.', '2. Use `llm-wiki-provenance` for provenance gaps.', '3. Use `llm-wiki-conflict-resolver` for contradicted claims after web verification.', '4. Do not auto-update verified pages without human review.', '');

fs.mkdirSync(path.dirname(outPath), { recursive: true });
fs.writeFileSync(outPath, `${lines.join('\n')}\n`);
console.log(`✓ wrote ${path.relative(repoRoot, outPath)}`);
