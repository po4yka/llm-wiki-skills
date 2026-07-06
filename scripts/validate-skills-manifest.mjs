import fs from 'node:fs';
import path from 'node:path';
import { failFactory, listSkillNames, repoRoot, readText } from './lib/repo.mjs';

const { fail, finish } = failFactory();
const namePattern = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const skills = listSkillNames();
const skillSet = new Set(skills);
const manifestPath = path.join(repoRoot, 'skills.sh.json');
const readmePath = path.join(repoRoot, 'README.md');

function sorted(values) {
  return [...values].sort((a, b) => a.localeCompare(b));
}

function diff(expected, actual) {
  const actualSet = new Set(actual);
  return expected.filter((value) => !actualSet.has(value));
}

if (!fs.existsSync(manifestPath)) {
  fail('skills.sh.json is missing');
  finish('validated manifest');
}

let manifest;
try {
  manifest = JSON.parse(readText(manifestPath));
} catch (error) {
  fail(`skills.sh.json is not valid JSON: ${error.message}`);
  finish('validated manifest');
}

if (manifest.$schema !== 'https://skills.sh/schemas/skills.sh.schema.json') {
  fail('skills.sh.json must use https://skills.sh/schemas/skills.sh.schema.json as $schema');
}

if (!Array.isArray(manifest.groupings) || manifest.groupings.length === 0) {
  fail('skills.sh.json must contain a non-empty groupings array');
}

const groupedSkills = [];
const groupTitles = new Set();
const skillToGroup = new Map();

for (const [index, group] of (manifest.groupings ?? []).entries()) {
  const groupLabel = `groupings[${index}]`;

  if (!group.title || typeof group.title !== 'string') {
    fail(`${groupLabel}: missing title`);
  } else if (groupTitles.has(group.title)) {
    fail(`${groupLabel}: duplicate title '${group.title}'`);
  } else {
    groupTitles.add(group.title);
  }

  if (!group.description || typeof group.description !== 'string') {
    fail(`${groupLabel}: missing description`);
  }

  if (!Array.isArray(group.skills) || group.skills.length === 0) {
    fail(`${groupLabel}: skills must be a non-empty array`);
    continue;
  }

  for (const skillName of group.skills) {
    groupedSkills.push(skillName);

    if (!namePattern.test(skillName)) {
      fail(`${groupLabel}: invalid skill name '${skillName}'`);
    }

    if (!skillSet.has(skillName)) {
      fail(`${groupLabel}: references missing skill '${skillName}'`);
    }

    if (skillToGroup.has(skillName)) {
      fail(`${skillName}: listed in both '${skillToGroup.get(skillName)}' and '${group.title}'`);
    } else {
      skillToGroup.set(skillName, group.title);
    }
  }
}

for (const missing of diff(skills, groupedSkills)) {
  fail(`${missing}: not listed in skills.sh.json groupings`);
}

if (!fs.existsSync(readmePath)) {
  fail('README.md is missing');
  finish('validated manifest');
}

const readme = readText(readmePath);
const readmeSkillLinks = [...readme.matchAll(/\]\(skills\/([^/)]+)\/SKILL\.md\)/g)].map((match) => match[1]);
const readmeSkillSet = new Set(readmeSkillLinks);

for (const skillName of readmeSkillLinks) {
  if (!skillSet.has(skillName)) {
    fail(`README.md references missing skill '${skillName}'`);
  }
}

for (const skillName of skills) {
  if (!readmeSkillSet.has(skillName)) {
    fail(`${skillName}: missing from README.md skill catalog`);
  }
}

for (const skillName of sorted(readmeSkillSet)) {
  const count = readmeSkillLinks.filter((entry) => entry === skillName).length;
  if (count > 1) {
    fail(`README.md references '${skillName}' ${count} times`);
  }
}

finish(`validated ${skills.length} manifest skills`);
