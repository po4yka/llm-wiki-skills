import path from 'node:path';
import { stripFrontmatter } from './lib/frontmatter.mjs';
import { failFactory, listSkillNames, repoRoot, readText } from './lib/repo.mjs';

const { fail, finish } = failFactory();
const warnings = [];
const enforceWarnings = process.env.SKILL_SMELLS_STRICT === '1' || process.argv.includes('--strict');
const maxSkillBodyChars = 18000;
const volatileTerms = /\b(current|latest|recent|today|pricing|stars|release|version|maintenance status|provider support|news)\b/i;
const browseTerms = /\b(browse|search|fresh sources|current sources|re-verify|cite)\b/i;
const dryRunTerms = /\b(dry[- ]run|report-only|plan only|approval|review|confirm|PR-based|pull request)\b/i;
const writeTerms = /\b(delete|overwrite|rewrite|move files|bulk|apply mode|write access|direct writes)\b/i;
const triggerBoundaryChecks = [
  {
    skillName: 'llm-wiki-eval',
    required: ['define', 'interpret', 'metrics'],
    banned: ['with-wiki versus without-wiki trial', 'eval framework'],
  },
  {
    skillName: 'llm-wiki-benchmark-suite',
    required: ['execute', 'pilot', 'baseline'],
    banned: ['eval framework', 'ci gate'],
  },
  {
    skillName: 'llm-wiki-eval-tooling',
    required: ['select', 'framework', 'ci gates'],
    banned: ['execute a with-wiki', 'pilot benchmark'],
  },
  {
    skillName: 'llm-wiki-capture-pipeline',
    required: ['cross-channel', 'architecture', 'metadata contract'],
    banned: ['telegram, email', 'api setup'],
  },
  {
    skillName: 'llm-wiki-channel-capture',
    required: ['named', 'connector', 'api setup'],
    banned: ['cross-channel topology', 'capture architecture'],
  },
  {
    skillName: 'llm-wiki-faq',
    required: ['stakeholder', 'concise', 'objection'],
    banned: ['failure-mode register', 'residual-risk scorecard'],
  },
  {
    skillName: 'llm-wiki-critique-audit',
    required: ['adversarial', 'failure-mode', 'residual-risk'],
    banned: ['stakeholder faq', 'concise rebuttal'],
  },
  {
    skillName: 'llm-wiki-provenance',
    required: ['inspect', 'repair', 'gap report'],
    banned: ['stable claim ids', 'deterministic claim'],
  },
  {
    skillName: 'llm-wiki-claim-anchors',
    required: ['deterministic', 'anchor ids', 'evidence has been inspected'],
    banned: ['provenance gap report before adding'],
  },
  {
    skillName: 'llm-wiki-threat-model',
    required: ['formal', 'threat model', 'trust boundaries'],
    banned: ['existing configuration', 'safe enough'],
  },
  {
    skillName: 'llm-wiki-security-review',
    required: ['existing', 'review', 'safe enough'],
    banned: ['stride, linddun', 'attack-surface mapping'],
  },
];

const routeBoundaryChecks = [
  {
    skillName: 'llm-wiki-faq',
    required: ['answer objection', 'stakeholder faq'],
    banned: ['risk report', 'bad fit assessment', 'failure mode register'],
  },
  {
    skillName: 'llm-wiki-critique-audit',
    required: ['failure mode register', 'residual risk scorecard'],
    banned: ['answer objection', 'stakeholder faq'],
  },
  {
    skillName: 'llm-wiki-eval',
    required: ['define measurement', 'interpret eval results'],
    banned: ['run with wiki pass', 'eval framework selection'],
  },
  {
    skillName: 'llm-wiki-benchmark-suite',
    required: ['run baseline pass', 'run with wiki pass'],
    banned: ['define measurement', 'eval framework selection'],
  },
  {
    skillName: 'llm-wiki-eval-tooling',
    required: ['eval framework selection', 'ci eval gates'],
    banned: ['run with wiki pass'],
  },
  {
    skillName: 'llm-wiki-capture-pipeline',
    required: ['cross channel topology', 'dedupe boundary'],
    banned: ['telegram connector', 'channel api setup'],
  },
  {
    skillName: 'llm-wiki-channel-capture',
    required: ['specific channel connector', 'channel api setup'],
    banned: ['cross channel topology', 'dedupe boundary'],
  },
  {
    skillName: 'llm-wiki-provenance',
    required: ['provenance gaps', 'repair evidence links'],
    banned: ['stable claim ids', 'source anchor ids'],
  },
  {
    skillName: 'llm-wiki-claim-anchors',
    required: ['stable claim ids', 'source anchor ids'],
    banned: ['missing sources', 'repair evidence links'],
  },
  {
    skillName: 'llm-wiki-security-review',
    required: ['existing configuration safety', 'mcp exposure review'],
    banned: ['stride analysis', 'risk matrix'],
  },
  {
    skillName: 'llm-wiki-threat-model',
    required: ['stride analysis', 'risk matrix'],
    banned: ['is my setup safe', 'existing configuration safety'],
  },
];

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
const descriptionBySkill = new Map();

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
    warn(`${skillName}: missing recommended '## Output' section for predictable agent responses`);
  }

  if (!skillHeadings.has('safety gates')) {
    warn(`${skillName}: missing recommended '## Safety gates' section`);
  }

  if (volatileTerms.test(text) && !browseTerms.test(text)) {
    warn(`${skillName}: mentions volatile/current-state concepts but does not explicitly require browsing or re-verification`);
  }

  if (writeTerms.test(text) && !dryRunTerms.test(text)) {
    warn(`${skillName}: mentions destructive or bulk writes without obvious dry-run/review language`);
  }

  const description = text.match(/^description:\s*(.*)$/m)?.[1]?.trim() ?? '';
  const normalizedDescription = description.toLowerCase();
  descriptions.push({ skillName, description: normalizedDescription });
  descriptionBySkill.set(skillName, normalizedDescription);
}

for (const check of triggerBoundaryChecks) {
  const description = descriptionBySkill.get(check.skillName);
  if (!description) continue;

  for (const term of check.required) {
    if (!description.includes(term)) {
      fail(`${check.skillName}: description must include distinguishing trigger term '${term}'`);
    }
  }

  for (const term of check.banned) {
    if (description.includes(term)) {
      fail(`${check.skillName}: description includes ambiguous trigger phrase '${term}'`);
    }
  }
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

const routerPath = path.join(repoRoot, 'skill-router.json');
try {
  const router = JSON.parse(readText(routerPath));
  const routeBySkill = new Map((router.routes ?? []).map((route) => [route.skill, route]));

  for (const check of routeBoundaryChecks) {
    const route = routeBySkill.get(check.skillName);
    if (!route) continue;

    const intents = (route.intents ?? []).map((intent) => intent.toLowerCase());
    for (const term of check.required) {
      if (!intents.includes(term)) {
        fail(`${check.skillName}: router intents must include distinguishing trigger '${term}'`);
      }
    }

    for (const term of check.banned) {
      if (intents.includes(term)) {
        fail(`${check.skillName}: router intents include ambiguous trigger '${term}'`);
      }
    }
  }
} catch (error) {
  fail(`skill-router.json could not be checked for trigger boundaries: ${error.message}`);
}

if (warnings.length > 0) {
  console.warn(`\n${warnings.length} skill smell warning(s)`);
  if (enforceWarnings) {
    fail(`skill smell warnings are not allowed in strict mode (${warnings.length} warning(s))`);
  }
}

finish(`validated skill smells for ${descriptions.length} skills`);
