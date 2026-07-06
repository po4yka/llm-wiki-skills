import fs from 'node:fs';
import path from 'node:path';

export const repoRoot = process.cwd();

export function toPosix(filePath) {
  return filePath.split(path.sep).join('/');
}

export function repoRelative(absPath) {
  return toPosix(path.relative(repoRoot, absPath));
}

export function readText(absPath) {
  return fs.readFileSync(absPath, 'utf8');
}

export function exists(absPath) {
  return fs.existsSync(absPath);
}

export function listFiles(startDir, predicate = () => true) {
  if (!fs.existsSync(startDir)) return [];

  const results = [];
  const stack = [startDir];

  while (stack.length > 0) {
    const current = stack.pop();
    const entries = fs.readdirSync(current, { withFileTypes: true });

    for (const entry of entries) {
      const absPath = path.join(current, entry.name);
      const relPath = repoRelative(absPath);

      if (entry.isDirectory()) {
        if (entry.name === 'node_modules' || entry.name === '.git') continue;
        stack.push(absPath);
        continue;
      }

      if (entry.isFile() && predicate(absPath, relPath)) {
        results.push(absPath);
      }
    }
  }

  return results.sort((a, b) => repoRelative(a).localeCompare(repoRelative(b)));
}

export function listMarkdownFiles() {
  return listFiles(repoRoot, (_absPath, relPath) => relPath.endsWith('.md'));
}

export function listSkillNames() {
  const skillsDir = path.join(repoRoot, 'skills');
  if (!fs.existsSync(skillsDir)) return [];

  return fs
    .readdirSync(skillsDir, { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .map((entry) => entry.name)
    .sort();
}

export function failFactory() {
  const errors = [];

  return {
    fail(message) {
      errors.push(message);
      console.error(`✗ ${message}`);
    },
    finish(successMessage) {
      if (errors.length > 0) {
        console.error(`\n${errors.length} validation error(s)`);
        process.exit(1);
      }

      console.log(`✓ ${successMessage}`);
    },
  };
}
