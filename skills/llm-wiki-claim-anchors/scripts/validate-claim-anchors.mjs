import fs from 'node:fs';
import path from 'node:path';

const cwd = process.cwd();
const errors = [];
const claimIds = new Map();
const sourceIds = new Map();
const claimPattern = /\^(claim-[0-9]{8}-[0-9]{3,})\b/g;
const sourcePattern = /\^(src-[0-9]{8}-[0-9]{3,})\b/g;
const supportPattern = /Support:\s*(extracted|inferred|ambiguous|synthesis|unsupported|conflicting)/i;
const ignoreNextPattern = /^\s*<!--\s*claim-anchor-validator:\s*ignore-next\s*-->\s*$/i;
const ignoreFilePattern = /^\s*<!--\s*claim-anchor-validator:\s*ignore-file\s*-->\s*$/i;

const args = process.argv.slice(2);
const help = args.includes('--help') || args.includes('-h');

if (help) {
  console.log(`Usage: node scripts/validate-claim-anchors.mjs [paths...]

Validates real Markdown claim/source anchors while ignoring fenced code blocks.

Default paths: entire repository.
Ignored directories: .git, node_modules, dist.

Anchor formats:
  ^claim-YYYYMMDD-NNN
  ^src-YYYYMMDD-NNN

Each claim anchor must be followed within the next three lines by:
  Support: extracted|inferred|ambiguous|synthesis|unsupported|conflicting

Escape hatches:
  <!-- claim-anchor-validator: ignore-file -->
  <!-- claim-anchor-validator: ignore-next -->
`);
  process.exit(0);
}

const roots = args.length > 0 ? args : ['.'];

function fail(message) {
  errors.push(message);
  console.error(`✗ ${message}`);
}

function finish(successMessage) {
  if (errors.length > 0) {
    console.error(`\n${errors.length} validation error(s)`);
    process.exit(1);
  }

  console.log(`✓ ${successMessage}`);
}

function toPosix(filePath) {
  return filePath.split(path.sep).join('/');
}

function displayPath(absPath) {
  return toPosix(path.relative(cwd, absPath));
}

function readText(absPath) {
  return fs.readFileSync(absPath, 'utf8');
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

function markdownFilesForRoot(rootArg) {
  const absRoot = path.resolve(rootArg);

  if (!fs.existsSync(absRoot)) {
    fail(`path does not exist: ${rootArg}`);
    return [];
  }

  const stat = fs.statSync(absRoot);

  if (stat.isFile()) {
    return absRoot.endsWith('.md') ? [absRoot] : [];
  }

  if (!stat.isDirectory()) {
    return [];
  }

  return listFiles(absRoot, (_abs, rel) => rel.endsWith('.md'));
}

function stripFencedCodeBlocksPreservingLines(text) {
  const lines = text.split(/\r?\n/);
  let inFence = false;
  let fenceMarker = null;

  return lines.map((line) => {
    const fence = line.match(/^\s*(```+|~~~+)/);

    if (fence) {
      const marker = fence[1][0];

      if (!inFence) {
        inFence = true;
        fenceMarker = marker;
        return '';
      }

      if (marker === fenceMarker) {
        inFence = false;
        fenceMarker = null;
        return '';
      }
    }

    return inFence ? '' : line;
  });
}

const fileSet = new Set();
for (const root of roots) {
  for (const file of markdownFilesForRoot(root)) {
    fileSet.add(file);
  }
}

const files = [...fileSet].sort((a, b) => displayPath(a).localeCompare(displayPath(b)));
let ignoredFiles = 0;
let ignoredNextLines = 0;

for (const filePath of files) {
  const rel = displayPath(filePath);
  const text = readText(filePath);
  const lines = stripFencedCodeBlocksPreservingLines(text);

  if (lines.some((line) => ignoreFilePattern.test(line))) {
    ignoredFiles += 1;
    continue;
  }

  let ignoreNext = false;

  lines.forEach((line, index) => {
    if (ignoreNextPattern.test(line)) {
      ignoreNext = true;
      ignoredNextLines += 1;
      return;
    }

    if (ignoreNext) {
      ignoreNext = false;
      return;
    }

    for (const match of line.matchAll(claimPattern)) {
      const id = match[1];
      const previous = claimIds.get(id);
      if (previous) {
        fail(`${rel}:${index + 1}: duplicate claim anchor '${id}' already used at ${previous}`);
      } else {
        claimIds.set(id, `${rel}:${index + 1}`);
      }

      const window = lines.slice(index, Math.min(lines.length, index + 4)).join('\n');
      if (!supportPattern.test(window)) {
        fail(`${rel}:${index + 1}: claim anchor '${id}' must be followed within three lines by a Support: extracted|inferred|ambiguous|synthesis|unsupported|conflicting line`);
      }
    }

    for (const match of line.matchAll(sourcePattern)) {
      const id = match[1];
      const previous = sourceIds.get(id);
      if (previous) {
        fail(`${rel}:${index + 1}: duplicate source anchor '${id}' already used at ${previous}`);
      } else {
        sourceIds.set(id, `${rel}:${index + 1}`);
      }
    }
  });
}

finish(`validated ${claimIds.size} claim anchors and ${sourceIds.size} source anchors across ${files.length} Markdown files (${ignoredFiles} ignored files, ${ignoredNextLines} ignored next-line directives)`);
