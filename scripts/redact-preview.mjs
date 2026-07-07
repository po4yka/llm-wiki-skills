import fs from 'node:fs';
import path from 'node:path';
import { listFiles, repoRelative, repoRoot, readText } from './lib/repo.mjs';

const args = process.argv.slice(2);
const jsonMode = args.includes('--json');
const failOnFindings = args.includes('--fail-on-findings');
const targetArg = args.find((arg) => !arg.startsWith('--')) ?? '.';
const target = path.resolve(repoRoot, targetArg);
const patterns = {
  email: /[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}/g,
  phone: /\+?[0-9][0-9 .()\-]{7,}[0-9]/g,
  secret_like: /\b(api[_-]?key|token|secret|password|bearer)[:=][^\s)]+/gi,
  internal_url: /https?:\/\/(localhost|127\.0\.0\.1|[^/\s)]+\.internal)(\/[^\s)]*)?/gi,
};

if (args.includes('--help') || args.includes('-h')) {
  console.log(`Usage: node scripts/redact-preview.mjs [--json] [--fail-on-findings] [path]

Preview potential sensitive content without changing files.

Findings include categories and line numbers only; matched values are not printed.
`);
  process.exit(0);
}

if (!target.startsWith(repoRoot) || !fs.existsSync(target)) {
  console.error(`Invalid target: ${targetArg}`);
  process.exit(2);
}

const files = fs.statSync(target).isDirectory()
  ? listFiles(target, (_abs, rel) => /\.(md|txt|json|ya?ml)$/i.test(rel))
  : [target];

const findings = [];

for (const file of files) {
  const text = readText(file);
  const lines = text.split(/\r?\n/);
  let inFrontmatter = false;

  lines.forEach((line, index) => {
    if (index === 0 && line.trim() === '---') {
      inFrontmatter = true;
      return;
    }

    if (inFrontmatter && line.trim() === '---') {
      inFrontmatter = false;
      return;
    }

    if (inFrontmatter) {
      const sensitiveMeta = line.match(/^(privacy|classification):\s*(sensitive|regulated|confidential|private)\b/i);
      if (sensitiveMeta) {
        findings.push({ file: repoRelative(file), line: index + 1, kind: 'sensitive_metadata' });
      }
    }

    for (const [kind, pattern] of Object.entries(patterns)) {
      pattern.lastIndex = 0;
      if (pattern.test(line)) {
        findings.push({ file: repoRelative(file), line: index + 1, kind });
      }
    }
  });
}

if (jsonMode) {
  console.log(JSON.stringify({ target: repoRelative(target), finding_count: findings.length, findings }, null, 2));
} else if (findings.length === 0) {
  console.log('✓ no redaction candidates found');
} else {
  console.log('# Redaction preview');
  console.log('');
  for (const finding of findings) {
    console.log(`- ${finding.file}:${finding.line} — ${finding.kind}`);
  }
  console.log('');
  console.log('Preview only: no files were changed. Review before publishing or external model use.');
}

if (findings.length > 0 && failOnFindings) {
  process.exit(1);
}
