import fs from 'node:fs';
import path from 'node:path';
import { parseFrontmatter, stripFrontmatter } from './lib/frontmatter.mjs';
import { failFactory, listSkillNames, repoRoot, readText } from './lib/repo.mjs';

const { fail, finish } = failFactory();
const skillsDir = path.join(repoRoot, 'skills');
const namePattern = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const semverPattern = /^\d+\.\d+\.\d+(?:[-+][0-9A-Za-z.-]+)?$/;
const requiredFrontmatterFields = ['name', 'description', 'license', 'compatibility'];
const recommendedBodyHeadings = ['Goal', 'Procedure', 'Output', 'Safety gates'];
const routingDescriptionVerbs = new Set([
  'answer',
  'audit',
  'build',
  'compare',
  'compile',
  'configure',
  'convert',
  'create',
  'decide',
  'define',
  'design',
  'diagnose',
  'execute',
  'explain',
  'export',
  'extract',
  'find',
  'generate',
  'harden',
  'help',
  'insert',
  'inspect',
  'install',
  'map',
  'plan',
  'prepare',
  'preview',
  'produce',
  're-check',
  'recover',
  'refactor',
  'review',
  'run',
  'select',
  'sort',
]);
const warnings = [];

function warn(message) {
  warnings.push(message);
  console.warn(`! ${message}`);
}

function getHeadings(markdown) {
  return new Set(
    markdown
      .split(/\r?\n/)
      .map((line) => line.match(/^#{1,6}\s+(.+?)\s*#*\s*$/)?.[1]?.trim())
      .filter(Boolean),
  );
}

function hasHeading(headings, expected) {
  const normalizedExpected = expected.toLowerCase();
  return [...headings].some((heading) => heading.toLowerCase() === normalizedExpected);
}

if (!fs.existsSync(skillsDir)) {
  fail('skills/ directory is missing');
  finish('validated 0 skills');
}

const skillNames = listSkillNames();

if (skillNames.length === 0) {
  fail('skills/ directory is empty');
}

const seenFrontmatterNames = new Set();

for (const skillName of skillNames) {
  const skillPath = path.join(skillsDir, skillName, 'SKILL.md');

  if (!fs.existsSync(skillPath)) {
    fail(`${skillName}: missing SKILL.md`);
    continue;
  }

  const text = readText(skillPath);
  const parsed = parseFrontmatter(text);
  if (!parsed) {
    fail(`${skillName}: missing YAML frontmatter`);
    continue;
  }

  if (parsed.malformedLine) {
    fail(`${skillName}: malformed frontmatter line '${parsed.malformedLine}'`);
    continue;
  }

  const frontmatter = parsed.fields;

  for (const field of requiredFrontmatterFields) {
    if (!frontmatter[field] || typeof frontmatter[field] !== 'string') {
      fail(`${skillName}: missing frontmatter field '${field}'`);
    }
  }

  if (frontmatter.name !== skillName) {
    fail(`${skillName}: frontmatter name must match directory name`);
  }

  if (!namePattern.test(frontmatter.name ?? '')) {
    fail(`${skillName}: invalid name '${frontmatter.name}'`);
  }

  if (seenFrontmatterNames.has(frontmatter.name)) {
    fail(`${skillName}: duplicate frontmatter name '${frontmatter.name}'`);
  }
  seenFrontmatterNames.add(frontmatter.name);

  if ((frontmatter.description ?? '').length > 1024) {
    fail(`${skillName}: description exceeds 1024 characters`);
  }

  if ((frontmatter.description ?? '').length < 40) {
    fail(`${skillName}: description is too short to be useful for agent routing`);
  }

  const firstDescriptionWord = (frontmatter.description ?? '')
    .trim()
    .split(/\s+/)[0]
    ?.toLowerCase()
    .replace(/[^\w-]+$/g, '');
  if (!routingDescriptionVerbs.has(firstDescriptionWord)) {
    fail(`${skillName}: description must start with a routing verb, got '${firstDescriptionWord || '(empty)'}'`);
  }

  if (frontmatter.license !== 'MIT') {
    fail(`${skillName}: license must be MIT`);
  }

  if (!frontmatter.compatibility || frontmatter.compatibility.length < 20) {
    fail(`${skillName}: compatibility must describe the target agent/runtime constraints`);
  }

  if (!frontmatter.metadata || typeof frontmatter.metadata !== 'object') {
    fail(`${skillName}: missing metadata object`);
  } else {
    if (!frontmatter.metadata.author) {
      fail(`${skillName}: missing metadata.author`);
    }

    if (!frontmatter.metadata.version) {
      fail(`${skillName}: missing metadata.version`);
    } else if (!semverPattern.test(frontmatter.metadata.version)) {
      fail(`${skillName}: metadata.version must be semver-like, got '${frontmatter.metadata.version}'`);
    }

    if (frontmatter.metadata.deprecated === 'true') {
      if (!frontmatter.metadata.replaced_by) {
        fail(`${skillName}: deprecated skills must declare metadata.replaced_by`);
      } else if (!skillNames.includes(frontmatter.metadata.replaced_by)) {
        fail(`${skillName}: metadata.replaced_by references missing skill '${frontmatter.metadata.replaced_by}'`);
      }
    } else if (frontmatter.metadata.replaced_by) {
      fail(`${skillName}: metadata.replaced_by is only valid when metadata.deprecated is true`);
    }
  }

  const body = stripFrontmatter(text);
  if (!body.match(/^#\s+.+/m)) {
    fail(`${skillName}: missing H1 title after frontmatter`);
  }

  if (frontmatter.metadata?.deprecated === 'true') {
    if (!body.includes(frontmatter.metadata.replaced_by)) {
      fail(`${skillName}: deprecated skill body must name replacement '${frontmatter.metadata.replaced_by}'`);
    }
  }

  const headings = getHeadings(body);
  for (const heading of recommendedBodyHeadings) {
    if (!hasHeading(headings, heading)) {
      warn(`${skillName}: missing recommended section '## ${heading}'`);
    }
  }
}

if (warnings.length > 0) {
  console.warn(`\n${warnings.length} advisory warning(s)`);
}

finish(`validated ${skillNames.length} skills`);
