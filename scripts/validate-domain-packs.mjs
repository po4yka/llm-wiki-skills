import fs from 'node:fs';
import path from 'node:path';
import { failFactory, listSkillNames, repoRoot, readText } from './lib/repo.mjs';
import { canonicalList } from './lib/canonical-vocabularies.mjs';
import { validateTopLevelSchemaContract } from './lib/schema-contract.mjs';

const { fail, finish } = failFactory();
const namePattern = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const domainPacksDir = path.join(repoRoot, 'domain-packs');
const coreSchemaPath = path.join(repoRoot, 'templates', 'schemas', 'page.schema.json');
const overlaySchemaPath = path.join(repoRoot, 'templates', 'schemas', 'domain-pack.schema.json');
const profileSchemaPath = path.join(repoRoot, 'templates', 'schemas', 'domain-pack-profile.schema.json');
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
const overlaySchema = readJson(overlaySchemaPath);
const profileSchema = readJson(profileSchemaPath);
const coreTypes = new Set(coreSchema?.properties?.type?.enum ?? []);
const canonicalCoreTypes = canonicalList('core_page_types');
const requiredProfileFields = new Set(profileSchema?.required ?? []);
const allowedProfileFields = new Set(Object.keys(profileSchema?.properties ?? {}));
const skillNames = new Set(listSkillNames());
let profileCount = 0;

if ([...coreTypes].join('|') !== canonicalCoreTypes.join('|')) {
  fail('templates/schemas/page.schema.json: core type enum drifted from templates/schemas/canonical-vocabularies.json');
}

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
  const profilePath = path.join(packDir, 'profile.json');

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
  const overlayRelPath = path.relative(repoRoot, overlayPath);

  for (const error of validateTopLevelSchemaContract(overlay, overlaySchema, overlayRelPath)) {
    fail(error);
  }

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

  if (fs.existsSync(profilePath)) {
    profileCount += 1;
    const profile = readJson(profilePath);
    if (!profile) continue;
    const profileRelPath = path.relative(repoRoot, profilePath);

    for (const field of requiredProfileFields) {
      if (!Object.hasOwn(profile, field)) {
        fail(`${profileRelPath}: missing required profile field '${field}' from templates/schemas/domain-pack-profile.schema.json`);
      }
    }

    for (const field of Object.keys(profile)) {
      if (!allowedProfileFields.has(field)) {
        fail(`${profileRelPath}: unsupported profile field '${field}' according to templates/schemas/domain-pack-profile.schema.json`);
      }
    }

    if (profile.name !== packName) {
      fail(`${profileRelPath}: name must match directory '${packName}'`);
    }

    if (!profile.copy_to || typeof profile.copy_to !== 'string') {
      fail(`${profileRelPath}: copy_to must be a non-empty string`);
    }

    for (const skillName of profile.recommended_workflow ?? []) {
      if (!skillNames.has(skillName)) {
        fail(`${profileRelPath}: recommended_workflow references missing skill '${skillName}'`);
      }
    }

    for (const item of profile.templates ?? []) {
      const source = item?.source;
      const target = item?.target;
      if (!source || !target) {
        fail(`${profileRelPath}: every templates item must include source and target`);
        continue;
      }

      if (source.includes('..') || path.isAbsolute(source)) {
        fail(`${profileRelPath}: template source '${source}' must be repository-relative`);
        continue;
      }

      if (!fs.existsSync(path.join(packDir, source)) && !fs.existsSync(path.join(repoRoot, source))) {
        fail(`${profileRelPath}: template source '${source}' does not exist`);
      }
    }
  }
}

finish(`validated ${packDirs.length} domain packs, ${profileCount} apply profiles and ${coreTypes.size} core page types`);
