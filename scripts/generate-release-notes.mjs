import fs from 'node:fs';
import path from 'node:path';
import { parseFrontmatter } from './lib/frontmatter.mjs';
import { listSkillNames, repoRoot, readText } from './lib/repo.mjs';

const tag = process.env.GITHUB_REF_NAME ?? process.argv[2] ?? 'unreleased';
const lines = [
  `# Release notes: ${tag}`,
  '',
  '## Package contents',
  '',
  `- Skills: ${listSkillNames().length}`,
  '- Documentation: `docs/`',
  '- Templates and domain packs: `templates/`, `domain-packs/`',
  '- Validation scripts: `scripts/`',
  '',
  '## Skills',
  '',
];

for (const skillName of listSkillNames()) {
  const parsed = parseFrontmatter(readText(path.join(repoRoot, 'skills', skillName, 'SKILL.md')));
  lines.push(`- \`${skillName}\` ${parsed.fields.metadata?.version ?? ''} — ${parsed.fields.description}`);
}

const outDir = path.join(repoRoot, 'dist');
fs.mkdirSync(outDir, { recursive: true });
fs.writeFileSync(path.join(outDir, `release-notes-${tag}.md`), `${lines.join('\n')}\n`);
console.log(`✓ generated dist/release-notes-${tag}.md`);
