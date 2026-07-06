import fs from 'node:fs';
import path from 'node:path';
import { listFiles, repoRelative, repoRoot, readText } from './lib/repo.mjs';

const targetArg = process.argv[2] ?? '.';
const target = path.resolve(repoRoot, targetArg);
const patterns = {
  email: /[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}/g,
  phone: /\+?[0-9][0-9 .()\-]{7,}[0-9]/g,
  secret_like: /\b(api[_-]?key|token|secret|password|bearer)[:=][^\s)]+/gi,
  internal_url: /https?:\/\/(localhost|127\.0\.0\.1|[^/\s)]+\.internal)(\/[^\s)]*)?/gi,
};

if (!target.startsWith(repoRoot) || !fs.existsSync(target)) {
  console.error(`Invalid target: ${targetArg}`);
  process.exit(1);
}

const files = fs.statSync(target).isDirectory()
  ? listFiles(target, (_abs, rel) => /\.(md|txt|json|ya?ml)$/i.test(rel))
  : [target];

const findings = [];

for (const file of files) {
  const text = readText(file);
  const lines = text.split(/\r?\n/);
  lines.forEach((line, index) => {
    for (const [kind, pattern] of Object.entries(patterns)) {
      pattern.lastIndex = 0;
      if (pattern.test(line)) {
        findings.push({ file: repoRelative(file), line: index + 1, kind });
      }
    }
  });
}

if (findings.length === 0) {
  console.log('✓ no redaction candidates found');
  process.exit(0);
}

console.log('# Redaction preview');
console.log('');
for (const finding of findings) {
  console.log(`- ${finding.file}:${finding.line} — ${finding.kind}`);
}
console.log('');
console.log('Preview only: no files were changed. Review before publishing or external model use.');
