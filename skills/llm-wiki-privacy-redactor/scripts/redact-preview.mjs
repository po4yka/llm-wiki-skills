import fs from 'node:fs';
import path from 'node:path';

const args = process.argv.slice(2);
const jsonMode = args.includes('--json');
const failOnFindings = args.includes('--fail-on-findings');
const cwd = process.cwd();
const defaultPatterns = {
  email: /[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}/g,
  phone: /(?<![0-9])(?!(?:19|20)[0-9]{2}-[0-9]{2}-[0-9]{2}\b)\+?[0-9][0-9 .()\-]{7,}[0-9]/g,
  secret_like: /(?:\b(?:(?:api[_-]?key|token|secret|password)\s*[:=]\s*[^\s)]+|authorization\s*:\s*(?:bearer\s+)?[^\s)]+|bearer\s+[^\s)]+)|-----BEGIN [A-Z0-9 ]*PRIVATE KEY-----)/gi,
  internal_url: /https?:\/\/(localhost|127\.0\.0\.1|[^/\s)]+\.internal)(\/[^\s)]*)?/gi,
};

if (args.includes('--help') || args.includes('-h')) {
  console.log(`Usage: node scripts/redact-preview.mjs [--json] [--fail-on-findings] [--policy path] [path]

Preview potential sensitive content without changing files.

Findings include categories and line numbers only; matched values are not printed.
`);
  process.exit(0);
}

const policyIndexes = args.flatMap((arg, index) => arg === '--policy' ? [index] : []);
if (policyIndexes.length > 1 || (policyIndexes.length === 1 && (!args[policyIndexes[0] + 1] || args[policyIndexes[0] + 1].startsWith('--')))) {
  console.error('Invalid --policy option: expected one file path');
  process.exit(2);
}
const policyValueIndex = policyIndexes.length === 1 ? policyIndexes[0] + 1 : -1;
const policyArg = policyValueIndex >= 0 ? args[policyValueIndex] : '_meta/redaction-policy.yml';
const targetArg = args.find((arg, index) => !arg.startsWith('--') && index !== policyValueIndex) ?? '.';
const target = path.resolve(targetArg);

function toPosix(filePath) {
  return filePath.split(path.sep).join('/');
}

function displayPath(absPath) {
  return toPosix(path.relative(cwd, absPath));
}

function readText(absPath) {
  return fs.readFileSync(absPath, 'utf8');
}

function parsePatterns(policyText) {
  const lines = policyText.split(/\r?\n/);
  const start = lines.findIndex((line) => /^patterns:\s*(?:#.*)?$/.test(line));
  if (start < 0) throw new Error('missing patterns');

  const parsed = {};
  for (const line of lines.slice(start + 1)) {
    if (/^\s*(?:#.*)?$/.test(line)) continue;
    if (!/^ /.test(line)) break;

    const entry = line.match(/^ +([A-Za-z0-9_-]+):\s*("(?:[^"\\]|\\.)*")\s*(?:#.*)?$/);
    if (!entry || Object.hasOwn(parsed, entry[1])) throw new Error('invalid pattern');

    let source = JSON.parse(entry[2]);
    let flags = 'g';
    if (source.startsWith('(?i)')) {
      source = source.slice(4);
      flags += 'i';
    }
    if (!source) throw new Error('empty pattern');
    parsed[entry[1]] = new RegExp(source, flags);
  }

  if (Object.keys(parsed).length === 0) throw new Error('missing patterns');
  return parsed;
}

function loadPatterns() {
  const policyPath = path.resolve(policyArg);
  if (!fs.existsSync(policyPath)) {
    if (policyValueIndex < 0) return defaultPatterns;
    console.error(`Invalid redaction policy: ${policyArg}`);
    process.exit(2);
  }

  try {
    return parsePatterns(readText(policyPath));
  } catch {
    console.error(`Invalid redaction policy: ${policyArg}`);
    process.exit(2);
  }
}

function listFiles(startDir, predicate = () => true) {
  if (!fs.existsSync(startDir)) return [];

  const results = [];
  const stack = [startDir];

  while (stack.length > 0) {
    const current = stack.pop();
    const entries = fs.readdirSync(current, { withFileTypes: true });

    for (const entry of entries) {
      const absPath = path.join(current, entry.name);
      const relPath = displayPath(absPath);

      if (entry.isDirectory()) {
        if (entry.name === 'node_modules' || entry.name === '.git' || entry.name === 'dist') continue;
        stack.push(absPath);
        continue;
      }

      if (entry.isFile() && predicate(absPath, relPath)) {
        results.push(absPath);
      }
    }
  }

  return results.sort((a, b) => displayPath(a).localeCompare(displayPath(b)));
}

if (!fs.existsSync(target)) {
  console.error(`Invalid target: ${targetArg}`);
  process.exit(2);
}

const patterns = loadPatterns();

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
      const sensitiveMeta = line.match(/^(privacy|classification|sensitivity):\s*(internal|sensitive|regulated|unknown|confidential|private)\b/i);
      if (sensitiveMeta) {
        findings.push({ file: displayPath(file), line: index + 1, kind: 'sensitive_metadata' });
      }
    }

    for (const [kind, pattern] of Object.entries(patterns)) {
      pattern.lastIndex = 0;
      if (pattern.test(line)) {
        findings.push({ file: displayPath(file), line: index + 1, kind });
      }
    }
  });
}

if (jsonMode) {
  console.log(JSON.stringify({ target: displayPath(target), finding_count: findings.length, findings }, null, 2));
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
