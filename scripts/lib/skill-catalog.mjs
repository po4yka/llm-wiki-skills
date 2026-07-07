import path from 'node:path';
import { parseFrontmatter } from './frontmatter.mjs';
import { listFiles, listSkillNames, repoRoot, readText, repoRelative } from './repo.mjs';

export function readJson(repoPath) {
  return JSON.parse(readText(path.join(repoRoot, repoPath)));
}

export function readSkillRecords() {
  return listSkillNames().map((skillName) => {
    const skillPath = path.join(repoRoot, 'skills', skillName, 'SKILL.md');
    const parsed = parseFrontmatter(readText(skillPath));

    if (!parsed || parsed.malformedLine) {
      throw new Error(`Cannot parse frontmatter for ${skillName}`);
    }

    return {
      name: parsed.fields.name,
      description: parsed.fields.description,
      license: parsed.fields.license,
      compatibility: parsed.fields.compatibility,
      author: parsed.fields.metadata?.author,
      version: parsed.fields.metadata?.version,
      install_scope: parsed.fields.metadata?.install_scope,
      deprecated: parsed.fields.metadata?.deprecated === 'true',
      replaced_by: parsed.fields.metadata?.replaced_by,
      path: `skills/${skillName}/SKILL.md`,
      fields: parsed.fields,
    };
  });
}

export function readCatalogModel() {
  const manifest = readJson('skills.sh.json');
  const router = readJson('skill-router.json');
  const skills = readSkillRecords();
  const skillMap = new Map(skills.map((skill) => [skill.name, skill]));
  const routeMap = new Map((router.routes ?? []).map((route) => [route.skill, route]));

  return {
    manifest,
    router,
    skills,
    skillMap,
    routeMap,
  };
}

export function buildDistributionCatalog({ generatedAt = new Date().toISOString() } = {}) {
  const { manifest, skills } = readCatalogModel();

  return {
    generated_at: generatedAt,
    repository: 'po4yka/llm-wiki-skills',
    schema: manifest.$schema,
    skill_count: skills.length,
    groupings: manifest.groupings,
    skills: skills.map(({ fields: _fields, ...skill }) => skill),
  };
}

export function firstSentence(text) {
  const trimmed = String(text ?? '').replace(/\s+/g, ' ').trim();
  const match = trimmed.match(/^(.+?[.!?])(?:\s|$)/);
  return match ? match[1] : trimmed;
}

export function escapeTableCell(value) {
  return String(value ?? '').replace(/\|/g, '\\|').replace(/\n/g, ' ');
}

export function readDocsRecords() {
  const docsDir = path.join(repoRoot, 'docs');
  return listFiles(docsDir, (_absPath, relPath) => relPath.startsWith('docs/') && relPath.endsWith('.md'))
    .map((absPath) => {
      const relPath = repoRelative(absPath);
      const docsRelative = relPath.slice('docs/'.length);
      const text = readText(absPath);
      const title = text.match(/^#\s+(.+)$/m)?.[1]?.trim() ?? docsRelative;
      const scope = text.match(/^>\s*Scope:\s*(.+)$/m)?.[1]?.trim();
      const currentAsOf = text.match(/^>\s*Current as of:\s*(.+)$/m)?.[1]?.trim();

      return {
        path: docsRelative,
        relPath,
        title,
        scope,
        currentAsOf,
      };
    })
    .sort((a, b) => a.path.localeCompare(b.path));
}
