import fs from 'node:fs';
import path from 'node:path';

const repoRoot = process.cwd();
const skillsDir = path.join(repoRoot, 'skills');
const namePattern = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

function fail(message) {
  console.error(`✗ ${message}`);
  process.exitCode = 1;
}

function parseFrontmatter(filePath) {
  const text = fs.readFileSync(filePath, 'utf8');
  const match = text.match(/^---\n([\s\S]*?)\n---\n/);
  if (!match) return null;

  const fields = {};
  for (const line of match[1].split('\n')) {
    const field = line.match(/^([a-zA-Z0-9_-]+):\s*(.*)$/);
    if (field) {
      fields[field[1]] = field[2].replace(/^['"]|['"]$/g, '').trim();
    }
  }
  return fields;
}

if (!fs.existsSync(skillsDir)) {
  fail('skills/ directory is missing');
  process.exit();
}

const skillNames = fs
  .readdirSync(skillsDir, { withFileTypes: true })
  .filter((entry) => entry.isDirectory())
  .map((entry) => entry.name)
  .sort();

for (const skillName of skillNames) {
  const skillPath = path.join(skillsDir, skillName, 'SKILL.md');

  if (!fs.existsSync(skillPath)) {
    fail(`${skillName}: missing SKILL.md`);
    continue;
  }

  const frontmatter = parseFrontmatter(skillPath);
  if (!frontmatter) {
    fail(`${skillName}: missing YAML frontmatter`);
    continue;
  }

  if (frontmatter.name !== skillName) {
    fail(`${skillName}: frontmatter name must match directory name`);
  }

  if (!namePattern.test(frontmatter.name ?? '')) {
    fail(`${skillName}: invalid name '${frontmatter.name}'`);
  }

  if (!frontmatter.description || frontmatter.description.length === 0) {
    fail(`${skillName}: missing description`);
  }

  if ((frontmatter.description ?? '').length > 1024) {
    fail(`${skillName}: description exceeds 1024 characters`);
  }
}

const groupingPath = path.join(repoRoot, 'skills.sh.json');
if (fs.existsSync(groupingPath)) {
  const grouping = JSON.parse(fs.readFileSync(groupingPath, 'utf8'));
  const groupedSkills = new Set(
    (grouping.groupings ?? []).flatMap((group) => group.skills ?? []),
  );

  for (const skillName of skillNames) {
    if (!groupedSkills.has(skillName)) {
      fail(`${skillName}: not listed in skills.sh.json groupings`);
    }
  }

  for (const grouped of groupedSkills) {
    if (!skillNames.includes(grouped)) {
      fail(`skills.sh.json references missing skill '${grouped}'`);
    }
  }
}

if (process.exitCode) {
  process.exit(process.exitCode);
}

console.log(`✓ validated ${skillNames.length} skills`);
