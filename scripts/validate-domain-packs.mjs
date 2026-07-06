import fs from 'node:fs';
import path from 'node:path';
import { failFactory, listSkillNames, repoRoot, readText } from './lib/repo.mjs';

const { fail, finish } = failFactory();
const namePattern = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const domainPacksDir = path.join(repoRoot, 'domain-packs');
const coreSchemaPath = path.join(repoRoot, 'templates', 'schemas', 'page.schema.json');
const requiredHeadings = ['## Core page types', '## Domain types'];

function readJson(filePath) {
  try {
    return JSON.parse(readText(filePath));
  } catch (error) {
    fail(`${path.relative(repoRoot, filePath)} is not valid JSON: ${error.message}`);
    return null;
  }
}

const coreSchema = readJson(coreSchemaPath);
const coreTypes = new Set(coreSchema?.properties?.type?.enum ?? []);
const skillNames = new Set(listSkillNames());

if (!fs.existsSync(domainPacksDir)) {
  fail('domain-packs/ directory is missing');
  finish('validated domain packs');
}

const packDirs = fs
  .readdirSync(domainPacksDir, { withFileTypes: true })
  .filter((entry) => entry.isDirectory())
  .map((entry) => entry.name)
  .sort();

for (const packName of packDirs) {
  const packDir = path.join(domainPacksDir, packName);
  const relPackDir = path.relative(repoRoot, packDir);
  const packPath = path.join(packDir, 'pack.md');
  const overlayPath = path.join(packDir, 'schema.overlay.json');

  if (!namePattern.test(packName)) {
    fail(`${relPackDir}: invalid domain pack directory name`);
  }

  if (!fs.existsSync(packPath)) {
    fail(`${relPackDir}: missing pack.md`);
    continue;
  }

  if (!fs.existsSync(overlayPath)) {
    fail(`${relPackDir}: missing schema.overlay.json`);
    continue;
  }

  const packText = readText(packPath);
  for (const heading of requiredHeadings) {
    if (!packText.includes(heading)) {
      fail(`${path.relative(repoRoot, packPath)}: missing '${heading}' section`);
    }
  }

  const overlay = readJson(overlayPath);
  if (!overlay) continue;

  if (overlay.name !== packName) {
    fail(`${path.relative(repoRoot, overlayPath)}: name must match directory '${packName}'`);
  }

  if (overlay.$schema !== '../../templates/schemas/domain-pack.schema.json') {
    fail(`${path.relative(repoRoot, overlayPath)}: unexpected $schema`);
  }

  if (!Array.isArray(overlay.core_types) || overlay.core_types.length === 0) {
    fail(`${path.relative(repoRoot, overlayPath)}: core_types must be a non-empty array`);
  } else {
    for (const coreType of overlay.core_types) {
      if (!coreTypes.has(coreType)) {
        fail(`${path.relative(repoRoot, overlayPath)}: core_types contains non-core type '${coreType}'`);
      }
    }
  }

  const mappings = overlay.domain_type_mappings;
  if (!mappings || typeof mappings !== 'object' || Array.isArray(mappings)) {
    fail(`${path.relative(repoRoot, overlayPath)}: domain_type_mappings must be an object`);
  } else {
    for (const [domainType, coreType] of Object.entries(mappings)) {
      if (!namePattern.test(domainType)) {
        fail(`${path.relative(repoRoot, overlayPath)}: invalid domain_type '${domainType}'`);
      }

      if (coreTypes.has(domainType)) {
        fail(`${path.relative(repoRoot, overlayPath)}: domain_type '${domainType}' duplicates a core type; use core type directly`);
      }

      if (!coreTypes.has(coreType)) {
        fail(`${path.relative(repoRoot, overlayPath)}: domain_type '${domainType}' maps to non-core type '${coreType}'`);
      }
    }
  }

  for (const tag of overlay.recommended_tags ?? []) {
    if (!namePattern.test(tag)) {
      fail(`${path.relative(repoRoot, overlayPath)}: invalid recommended tag '${tag}'`);
    }
  }

  for (const skillName of overlay.recommended_skills ?? []) {
    if (!skillNames.has(skillName)) {
      fail(`${path.relative(repoRoot, overlayPath)}: recommended skill '${skillName}' does not exist`);
    }
  }
}

finish(`validated ${packDirs.length} domain packs against ${coreTypes.size} core page types`);
