import fs from 'node:fs';
import path from 'node:path';
import { parseFrontmatter } from './lib/frontmatter.mjs';
import { listSkillNames, repoRoot, readText } from './lib/repo.mjs';

const skills = [];

for (const skillName of listSkillNames()) {
  const filePath = path.join(repoRoot, 'skills', skillName, 'SKILL.md');
  const parsed = parseFrontmatter(readText(filePath));

  if (!parsed || parsed.malformedLine) {
    console.error(`Cannot parse frontmatter for ${skillName}`);
    process.exit(1);
  }

  skills.push({
    name: parsed.fields.name,
    description: parsed.fields.description,
    license: parsed.fields.license,
    compatibility: parsed.fields.compatibility,
    author: parsed.fields.metadata?.author,
    version: parsed.fields.metadata?.version,
    path: `skills/${skillName}/SKILL.md`,
  });
}

const manifest = JSON.parse(readText(path.join(repoRoot, 'skills.sh.json')));
const catalog = {
  generated_at: new Date().toISOString(),
  repository: 'po4yka/llm-wiki-skills',
  schema: manifest.$schema,
  skill_count: skills.length,
  groupings: manifest.groupings,
  skills,
};

const outDir = path.join(repoRoot, 'dist');
fs.mkdirSync(outDir, { recursive: true });
fs.writeFileSync(path.join(outDir, 'skills-catalog.json'), `${JSON.stringify(catalog, null, 2)}\n`);

console.log(`✓ generated dist/skills-catalog.json with ${skills.length} skills`);
