import fs from 'node:fs';
import path from 'node:path';
import { failFactory, listFiles, listSkillNames, repoRoot, readText } from './lib/repo.mjs';
import { buildGeneratedMirrors } from './generate-catalog-mirrors.mjs';
import { buildSkillsCatalogMarkdown } from './generate-skills-catalog-md.mjs';

const { fail, finish } = failFactory();
const skills = listSkillNames();

const overviewPath = path.join(repoRoot, 'docs', '07-skills-overview.md');
const routerDocPath = path.join(repoRoot, 'docs', 'skill-router.md');
const indexPath = path.join(repoRoot, 'docs', '00-index.md');
const routerPath = path.join(repoRoot, 'skill-router.json');
const skillsCatalogPath = path.join(repoRoot, 'docs', 'skills-catalog.md');

function mentionsSkill(text, skillName) {
  return new RegExp(`(^|[^a-z0-9-])${skillName}($|[^a-z0-9-])`, 'm').test(text);
}

if (!fs.existsSync(overviewPath)) {
  fail('docs/07-skills-overview.md is missing');
} else {
  const overview = readText(overviewPath);
  for (const skillName of skills) {
    if (!mentionsSkill(overview, skillName)) {
      fail(`${skillName}: not mentioned in docs/07-skills-overview.md`);
    }
  }
}

if (!fs.existsSync(routerDocPath)) {
  fail('docs/skill-router.md is missing');
} else {
  const routerDoc = readText(routerDocPath);
  for (const skillName of skills) {
    if (!mentionsSkill(routerDoc, skillName)) {
      fail(`${skillName}: not mentioned in docs/skill-router.md`);
    }
  }
}

if (!fs.existsSync(routerPath)) {
  fail('skill-router.json is missing');
} else {
  let router = null;
  try {
    router = JSON.parse(readText(routerPath));
  } catch (error) {
    fail(`skill-router.json is not valid JSON: ${error.message}`);
  }

  if (router) {
    const routeSkills = new Set((router.routes ?? []).map((route) => route.skill));

    for (const skillName of skills) {
      if (!routeSkills.has(skillName)) {
        fail(`${skillName}: has no route in skill-router.json`);
      }
    }

    for (const entrypoint of router.default_entrypoints ?? []) {
      if (!routeSkills.has(entrypoint)) {
        fail(`default_entrypoints references '${entrypoint}' which has no route of its own`);
      }
    }

    for (const [index, route] of (router.routes ?? []).entries()) {
      const prefix = `routes[${index}]`;

      for (const dep of route.depends_on ?? []) {
        if (!routeSkills.has(dep)) {
          fail(`${prefix}: depends_on references '${dep}' which has no route of its own`);
        }
      }

      for (const next of route.next ?? []) {
        if (!routeSkills.has(next)) {
          fail(`${prefix}: next references '${next}' which has no route of its own`);
        }
      }
    }
  }
}

if (!fs.existsSync(indexPath)) {
  fail('docs/00-index.md is missing');
} else {
  const index = readText(indexPath);
  const referenced = new Set();

  for (const match of index.matchAll(/\]\(([^)\s]+)\)/g)) {
    const rawTarget = match[1].split('#')[0];
    if (!rawTarget || /^(https?:|mailto:|tel:|urn:)/i.test(rawTarget)) continue;
    referenced.add(path.posix.normalize(rawTarget));
  }

  const docsDir = path.join(repoRoot, 'docs');
  const docFiles = listFiles(docsDir, (_absPath, relPath) => relPath.endsWith('.md'));

  for (const absPath of docFiles) {
    const indexRelative = path.posix.normalize(
      path.relative(path.dirname(indexPath), absPath).split(path.sep).join('/'),
    );
    if (indexRelative === '00-index.md') continue;

    if (!referenced.has(indexRelative)) {
      fail(`docs/${indexRelative}: not referenced from docs/00-index.md`);
    }
  }
}

function expectGenerated(repoPath, expected) {
  const absPath = path.join(repoRoot, repoPath);
  if (!fs.existsSync(absPath)) {
    fail(`${repoPath} is missing`);
    return;
  }

  const actual = readText(absPath);
  if (actual !== expected) {
    fail(`${repoPath} is stale; run npm run catalog:generate`);
  }
}

expectGenerated('docs/skills-catalog.md', buildSkillsCatalogMarkdown());

for (const [repoPath, expected] of buildGeneratedMirrors()) {
  expectGenerated(repoPath, expected);
}

if (fs.existsSync(skillsCatalogPath)) {
  const catalog = readText(skillsCatalogPath);
  for (const skillName of skills) {
    if (!mentionsSkill(catalog, skillName)) {
      fail(`${skillName}: not mentioned in docs/skills-catalog.md`);
    }
  }
}

finish(`validated catalog coverage for ${skills.length} skills`);
