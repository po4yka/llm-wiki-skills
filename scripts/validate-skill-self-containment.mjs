import path from 'node:path';
import { failFactory, listSkillNames, repoRoot } from './lib/repo.mjs';
import { validateSkillSelfContainment } from './lib/skill-self-containment.mjs';

const { fail, finish } = failFactory();

for (const skillName of listSkillNames()) {
  const skillRoot = path.join(repoRoot, 'skills', skillName);
  for (const error of validateSkillSelfContainment(skillRoot)) {
    fail(error);
  }
}

finish(`validated single-skill install contract for ${listSkillNames().length} skills`);

