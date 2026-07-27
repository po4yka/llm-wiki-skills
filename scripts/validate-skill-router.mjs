import fs from 'node:fs';
import path from 'node:path';
import { failFactory, listSkillNames, repoRoot, readText } from './lib/repo.mjs';
import { chooseSkill, normalizeIntent } from './lib/skill-router-eval.mjs';
import { readCatalogModel } from './lib/skill-catalog.mjs';
import { validateTopLevelSchemaContract } from './lib/schema-contract.mjs';

const { fail, finish } = failFactory();
const routerPath = path.join(repoRoot, 'skill-router.json');
const routerSchemaPath = path.join(repoRoot, 'templates', 'schemas', 'skill-router.schema.json');
const routerEvalPath = path.join(repoRoot, 'benchmarks', 'router-eval.json');
const allowedRisk = new Set(['none', 'low', 'medium', 'high']);
const skillNames = new Set(listSkillNames());
const { skills: skillRecords } = readCatalogModel();
const deprecatedSkills = new Set(skillRecords.filter((skill) => skill.deprecated).map((skill) => skill.name));
const activeSkills = skillRecords.filter((skill) => !skill.deprecated).map((skill) => skill.name);

if (!fs.existsSync(routerPath)) {
  fail('skill-router.json is missing');
  finish('validated skill router');
}

let router;
let routerSchema;
try {
  router = JSON.parse(readText(routerPath));
  routerSchema = JSON.parse(readText(routerSchemaPath));
} catch (error) {
  fail(`skill router or schema is not valid JSON: ${error.message}`);
  finish('validated skill router');
}

for (const error of validateTopLevelSchemaContract(router, routerSchema, 'skill-router.json')) {
  fail(error);
}

if (router.$schema !== './templates/schemas/skill-router.schema.json') {
  fail('skill-router.json must reference ./templates/schemas/skill-router.schema.json');
}

const routeSkills = new Set();
const intentOwners = new Map();

for (const entrypoint of router.default_entrypoints ?? []) {
  if (!skillNames.has(entrypoint)) {
    fail(`default_entrypoints references missing skill '${entrypoint}'`);
  }
}

for (const [index, route] of (router.routes ?? []).entries()) {
  const prefix = `routes[${index}]`;

  if (!skillNames.has(route.skill)) {
    fail(`${prefix}: skill '${route.skill}' does not exist`);
  }

  if (deprecatedSkills.has(route.skill)) {
    fail(`${prefix}: deprecated skill '${route.skill}' must not be a primary router route`);
  }

  if (routeSkills.has(route.skill)) {
    fail(`${prefix}: duplicate route for skill '${route.skill}'`);
  }
  routeSkills.add(route.skill);

  if (!Array.isArray(route.intents) || route.intents.length === 0) {
    fail(`${prefix}: intents must be a non-empty array`);
  } else {
    for (const intent of route.intents) {
      const normalizedIntent = normalizeIntent(intent);
      const owner = intentOwners.get(normalizedIntent);
      if (owner && owner !== route.skill) {
        fail(`${prefix}: intent '${intent}' duplicates route '${owner}' after normalization`);
      }
      intentOwners.set(normalizedIntent, route.skill);
    }
  }

  if (route.not_for !== undefined && !Array.isArray(route.not_for)) {
    fail(`${prefix}: not_for must be an array when present`);
  }

  if (!allowedRisk.has(route.write_risk)) {
    fail(`${prefix}: invalid write_risk '${route.write_risk}'`);
  }

  if (typeof route.requires_web !== 'boolean') {
    fail(`${prefix}: requires_web must be boolean`);
  }

  if (!route.default_mode || typeof route.default_mode !== 'string') {
    fail(`${prefix}: default_mode must be a non-empty string`);
  }

  for (const dep of route.depends_on ?? []) {
    if (!skillNames.has(dep)) {
      fail(`${prefix}: depends_on references missing skill '${dep}'`);
    }
  }

  for (const next of route.next ?? []) {
    if (!skillNames.has(next)) {
      fail(`${prefix}: next references missing skill '${next}'`);
    }
  }
}

const highRiskWithoutSafeMode = [...(router.routes ?? [])].filter((route) => {
  if (!['medium', 'high'].includes(route.write_risk)) return false;
  return !/(report|dry|plan|propose|proposal|review|patch|pr|analyze|options)/i.test(route.default_mode);
});

for (const route of highRiskWithoutSafeMode) {
  fail(`route '${route.skill}' has ${route.write_risk} write_risk but default_mode '${route.default_mode}' is not obviously review-gated`);
}

if (!fs.existsSync(routerEvalPath)) {
  fail('benchmarks/router-eval.json is missing');
} else {
  let routerEval;
  try {
    routerEval = JSON.parse(readText(routerEvalPath));
  } catch (error) {
    fail(`benchmarks/router-eval.json is not valid JSON: ${error.message}`);
  }

  if (routerEval) {
    if (!Array.isArray(routerEval.cases) || routerEval.cases.length === 0) {
      fail('benchmarks/router-eval.json: cases must be a non-empty array');
    }

    const coveredSkills = new Set();

    for (const [index, testCase] of (routerEval.cases ?? []).entries()) {
      const prefix = `router-eval cases[${index}]`;

      if (!testCase.utterance || typeof testCase.utterance !== 'string') {
        fail(`${prefix}: utterance must be a non-empty string`);
        continue;
      }

      if (!skillNames.has(testCase.expected_skill)) {
        fail(`${prefix}: expected_skill '${testCase.expected_skill}' does not exist`);
        continue;
      }

      coveredSkills.add(testCase.expected_skill);

      const winner = chooseSkill(testCase.utterance, router.routes ?? []);
      if (!winner || winner.skill !== testCase.expected_skill) {
        fail(`${prefix}: expected ${testCase.expected_skill}, got ${winner?.skill ?? '(none)'} for '${testCase.utterance}'`);
      } else if (winner.score <= 0) {
        fail(`${prefix}: expected ${testCase.expected_skill}, but winning score was not positive`);
      }
    }

    for (const skillName of activeSkills) {
      if (!coveredSkills.has(skillName)) {
        fail(`${skillName}: missing router eval case in benchmarks/router-eval.json`);
      }
    }
  }
}

finish(`validated ${routeSkills.size} skill router entries against ${skillNames.size} skills`);
