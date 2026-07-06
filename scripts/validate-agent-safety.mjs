import path from 'node:path';
import { failFactory, listFiles, listSkillNames, repoRelative, repoRoot, readText } from './lib/repo.mjs';

const { fail, finish } = failFactory();
const negationPattern = /\b(do not|don't|avoid|never|not allowed|should not|must not|without explicit approval|requires explicit approval|human review remains responsible)\b/i;
const safetyRules = [
  {
    id: 'direct-push-main',
    pattern: /\b(git\s+push\b.*\bmain\b|direct push(?:es)? to [`']?main[`']?|push(?:es)? directly to [`']?main[`']?)\b/i,
    message: 'appears to allow direct pushes to main',
  },
  {
    id: 'auto-merge',
    pattern: /\b(auto[- ]?merge|merge automatically|automatically merge)\b/i,
    message: 'appears to allow automatic merging',
  },
  {
    id: 'bypass-review',
    pattern: /\b(bypass|skip|disable|ignore)\b.*\b(review|approval|human)\b/i,
    message: 'appears to bypass review or approval',
  },
  {
    id: 'private-external-model',
    pattern: /\b(send|upload|share|export)\b.*\b(private|sensitive|secret)\b.*\b(external model|cloud model|third[- ]party|vendor)\b/i,
    message: 'appears to allow private content egress to an external model or vendor',
  },
  {
    id: 'destructive-no-review',
    pattern: /\b(delete|overwrite|rewrite|purge)\b.*\b(without|no)\b.*\b(review|confirmation|approval)\b/i,
    message: 'appears to allow destructive changes without review',
  },
];

function isNegated(line) {
  return negationPattern.test(line);
}

for (const skillName of listSkillNames()) {
  const skillPath = path.join(repoRoot, 'skills', skillName, 'SKILL.md');
  const text = readText(skillPath);
  const lines = text.split(/\r?\n/);

  if (!/^##\s+Safety gates\s*$/im.test(text)) {
    fail(`${repoRelative(skillPath)}: missing explicit Safety gates section`);
  }

  lines.forEach((line, index) => {
    for (const rule of safetyRules) {
      if (rule.pattern.test(line) && !isNegated(line)) {
        fail(`${repoRelative(skillPath)}:${index + 1}: ${rule.message} (${rule.id})`);
      }
    }
  });
}

const workflowFiles = listFiles(path.join(repoRoot, '.github', 'workflows'), (_absPath, relPath) => /\.ya?ml$/.test(relPath));

for (const workflowPath of workflowFiles) {
  const relPath = repoRelative(workflowPath);
  const text = readText(workflowPath);

  if (/pull_request_target\s*:/i.test(text)) {
    fail(`${relPath}: pull_request_target is not allowed for this repository`);
  }

  if (/permissions:\s*write-all/i.test(text)) {
    fail(`${relPath}: permissions: write-all is not allowed`);
  }

  if (/contents:\s*write/i.test(text) && relPath !== '.github/workflows/release.yml') {
    fail(`${relPath}: contents: write is only allowed in release.yml`);
  }
}

finish(`validated agent safety boundaries for ${listSkillNames().length} skills and ${workflowFiles.length} workflow files`);
