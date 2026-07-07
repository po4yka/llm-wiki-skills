import fs from 'node:fs';
import path from 'node:path';
import { buildDistributionCatalog } from './lib/skill-catalog.mjs';
import { repoRoot } from './lib/repo.mjs';

const catalog = buildDistributionCatalog();

const outDir = path.join(repoRoot, 'dist');
fs.mkdirSync(outDir, { recursive: true });
fs.writeFileSync(path.join(outDir, 'skills-catalog.json'), `${JSON.stringify(catalog, null, 2)}\n`);

console.log(`✓ generated dist/skills-catalog.json with ${catalog.skill_count} skills`);
