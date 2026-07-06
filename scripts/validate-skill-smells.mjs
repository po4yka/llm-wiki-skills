import path from 'node:path';
import { stripFrontmatter } from './lib/frontmatter.mjs';
import { failFactory, listSkillNames, repoRoot, readText } from './lib/repo.mjs';

const { fail, finish } = failFactory();
const warnings = [];
const maxSkillBodyChars = 18000;
const volatileTerms = /\b(current|latest|recent|today|pricing|stars|release|version|maintenance status|provider support|news)\b/i;
const browseTerms = /\b(browse|search|fresh sources|current sources|re-verify|cite)\b/i;
const dryRunTerms = /\b(dry[- ]run|report-only|plan only|approval|review|confirm|PR-based|pull request)\b/i;
const writeTerms = /\b(delete|overwrite|rewrite|move files|bulk|apply mode|write access|direct writes)\b/i;

function warn(message) {
  warnings.push(message);
  console.warn(`! ${message}`);
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

for (const skillName of listSkillNames()) {
  const skillPath = path.join(repoRoot, 'skills', skillName, 'SKILL.md');
  const text = readText(skillPath);
  const body = stripFrontmatter(text);
  const skillHeadings = headings(body);

  if (body.length > maxSkillBodyChars) {
    warn(`${skillName}: SKILL.md is long (${body.length} chars); consider moving background material to references/`);
  }

  if (!skillHeadings.has('when to use')) {
    warn(`${skillName}: missing optional but useful '## When to use' section`);
  }

  if (!skillHeadings.has('inputs')) {
    warn(`${skillName}: missing optional but useful '## Inputs' section`);
  }

  if (!skillHeadings.has('output')) {
    fail(`${skillName}: missing required '## Output' section for predictable agent responses`);
  }

  if (!skillHeadings.has('safety gates')) {
    fail(`${skillName}: missing required '## Safety gates' section`);
  }

  if (volatileTerms.test(text) && !browseTerms.test(text)) {
    warn(`${skillName}: mentions volatile/current-state concepts but does not explicitly require browsing or re-verification`);
  }

  if (writeTerms.test(text) && !dryRunTerms.test(text)) {
    warn(`${skillName}: mentions destructive or bulk writes without obvious dry-run/review language`);
  }

  const description = text.match(/^description:\s*(.*)$/m)?.[1]?.trim() ?? '';
  descriptions.push({ skillName, description: description.toLowerCase() });
}

for (let i = 0; i < descriptions.length; i += 1) {
  for (let j = i + 1; j < descriptions.length; j += 1) {
    const a = descriptions[i];
    const b = descriptions[j];
    const aWords = new Set(a.description.split(/\W+/).filter((word) => word.length > 5));
    const bWords = new Set(b.description.split(/\W+/).filter((word) => word.length > 5));
    const overlap = [...aWords].filter((word) => bWords.has(word));
    const ratio = overlap.length / Math.max(1, Math.min(aWords.size, bWords.size));
    if (ratio > 0.72) {
      warn(`${a.skillName} and ${b.skillName}: descriptions may overlap too much (${Math.round(ratio * 100)}%)`);
    }
  }
}

if (warnings.length > 0) {
  console.warn(`\n${warnings.length} skill smell warning(s)`);
}

finish(`validated skill smells for ${descriptions.length} skills`);
