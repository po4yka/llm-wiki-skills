import fs from 'node:fs';
import path from 'node:path';
import { parseFrontmatter } from './frontmatter.mjs';
import { readText } from './repo.mjs';

export const installScopes = new Set(['self-contained', 'pack-install-only']);

const repoRootRefPattern = /`((?:docs|templates|scripts|benchmarks|domain-packs|policies|examples)\/[^`\n]+)`/g;
const proseRepoRootRefPattern = /\b(?:use|read|see|start from|validate with|run|copy|open)\s+(?:the\s+)?((?:docs|templates|scripts|benchmarks|domain-packs|policies|examples)\/[^\s`),.;]+)/gi;
const npmRunPattern = /`?npm run [^`\n]+`?/g;
const nodeScriptPattern = /\bnode\s+(scripts\/[^\s`]+)/g;
const localRefPattern = /`((?:references|scripts|assets)\/[^`\n]+)`/g;

export function getInstallScope(frontmatter) {
  return frontmatter.metadata?.install_scope ?? null;
}

function normalizeLocalReference(rawReference) {
  return rawReference.replace(/\/\*\*$/, '').replace(/\/\*$/, '');
}

function localReferenceExists(skillRoot, rawReference) {
  const relPath = normalizeLocalReference(rawReference);
  return fs.existsSync(path.join(skillRoot, relPath));
}

export function validateSkillSelfContainment(skillRoot) {
  const skillPath = path.join(skillRoot, 'SKILL.md');
  const text = readText(skillPath);
  const parsed = parseFrontmatter(text);
  const skillName = path.basename(skillRoot);
  const errors = [];

  if (!parsed || parsed.malformedLine) {
    errors.push(`${skillName}: cannot validate install contract because SKILL.md frontmatter is invalid`);
    return errors;
  }

  const scope = getInstallScope(parsed.fields);
  if (!installScopes.has(scope)) {
    errors.push(`${skillName}: metadata.install_scope must be one of ${[...installScopes].join(', ')}`);
    return errors;
  }

  if (scope === 'pack-install-only') {
    const compatibility = parsed.fields.compatibility ?? '';
    if (!/full (?:repository|repo|pack)|pack install|pack-install/i.test(compatibility)) {
      errors.push(`${skillName}: pack-install-only skills must explain the full-pack requirement in compatibility`);
    }
    return errors;
  }

  for (const match of text.matchAll(repoRootRefPattern)) {
    errors.push(`${skillName}: SKILL.md references repository-root file '${match[1]}' instead of a file inside the skill directory`);
  }

  for (const match of text.matchAll(proseRepoRootRefPattern)) {
    errors.push(`${skillName}: SKILL.md references repository-root file '${match[1]}' instead of a file inside the skill directory`);
  }

  for (const match of text.matchAll(npmRunPattern)) {
    errors.push(`${skillName}: SKILL.md advertises package.json command '${match[0]}' that is not shipped with a single-skill install`);
  }

  for (const match of text.matchAll(nodeScriptPattern)) {
    if (!localReferenceExists(skillRoot, match[1])) {
      errors.push(`${skillName}: SKILL.md advertises missing local script '${match[1]}'`);
    }
  }

  for (const match of text.matchAll(localRefPattern)) {
    if (!localReferenceExists(skillRoot, match[1])) {
      errors.push(`${skillName}: SKILL.md references missing local file '${match[1]}'`);
    }
  }

  return errors;
}
