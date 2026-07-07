import fs from 'node:fs';
import path from 'node:path';
import { failFactory, listSkillNames, repoRoot, readText } from './lib/repo.mjs';

const { fail, finish } = failFactory();
const routerPath = path.join(repoRoot, 'skill-router.json');
const allowedRisk = new Set(['none', 'low', 'medium', 'high']);
const skillNames = new Set(listSkillNames());

if (!fs.existsSync(routerPath)) {
  fail('skill-router.json is missing');
  finish('validated skill router');
}

let router;
try {
  router = JSON.parse(readText(routerPath));
} catch (error) {
  fail(`skill-router.json is not valid JSON: ${error.message}`);
  finish('validated skill router');
}

if (router.$schema !== './templates/schemas/skill-router.schema.json') {
  fail('skill-router.json must reference ./templates/schemas/skill-router.schema.json');
}

const routeSkills = new Set();

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

  if (routeSkills.has(route.skill)) {
    fail(`${prefix}: duplicate route for skill '${route.skill}'`);
  }
  routeSkills.add(route.skill);

  if (!Array.isArray(route.intents) || route.intents.length === 0) {
    fail(`${prefix}: intents must be a non-empty array`);
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

finish(`validated ${routeSkills.size} skill router entries against ${skillNames.size} skills`);
