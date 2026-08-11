import fs from 'node:fs';
import path from 'node:path';
import { failFactory, listFiles, repoRelative, repoRoot, readText } from './lib/repo.mjs';

const { fail, finish } = failFactory();
const templateRoot = path.join(repoRoot, 'templates');

function assertIncludes(filePath, needle, message) {
  const text = readText(path.join(repoRoot, filePath));
  if (!text.includes(needle)) fail(message ?? `${filePath}: missing ${needle}`);
}

function assertNotMatch(filePath, pattern, message) {
  const text = readText(path.join(repoRoot, filePath));
  if (pattern.test(text)) fail(message);
}

function assertEqual(leftPath, rightPath) {
  const left = readText(path.join(repoRoot, leftPath));
  const right = readText(path.join(repoRoot, rightPath));
  if (left !== right) fail(`${rightPath}: copied template drifted from ${leftPath}`);
}

const templates = listFiles(templateRoot, (_absPath, relPath) => !relPath.endsWith('.DS_Store')).map(repoRelative);
const referenceFiles = listFiles(repoRoot, (_absPath, relPath) => {
  if (/^(node_modules|\.git|\.tmp|dist|templates)\//.test(relPath)) return false;
  if (/^skills\/[^/]+\/references\/templates\//.test(relPath)) return false;
  return /\.(md|json|ya?ml|mjs)$/.test(relPath);
});
const referenceCorpus = referenceFiles.map((filePath) => readText(filePath)).join('\n');

for (const templatePath of templates) {
  if (!referenceCorpus.includes(templatePath)) {
    fail(`${templatePath}: not referenced by README, docs, scripts or top-level skill instructions`);
  }
}

const copiedTemplates = listFiles(path.join(repoRoot, 'skills'), (_absPath, relPath) => /^skills\/[^/]+\/references\/templates\//.test(relPath));
for (const copiedPath of copiedTemplates) {
  const relCopied = repoRelative(copiedPath);
  const rootTemplate = relCopied.replace(/^skills\/[^/]+\/references\//, '');
  if (!fs.existsSync(path.join(repoRoot, rootTemplate))) {
    fail(`${relCopied}: copied template has no root ${rootTemplate}`);
    continue;
  }

  assertEqual(rootTemplate, relCopied);
}

assertIncludes('templates/llm-wiki-publish.github-actions.yml', 'path: export-artifact/builds/public-site/latest/site', 'templates/llm-wiki-publish.github-actions.yml: Pages publish path must match upload-artifact v4 prefix stripping');
assertNotMatch('templates/llm-wiki-publish.github-actions.yml', /path: export-artifact\/exports\/builds\/public-site\/latest\/site/, 'templates/llm-wiki-publish.github-actions.yml: Pages publish path must not assume exports/ prefix survives artifact download');
assertIncludes(
  'templates/llm-wiki-publish.github-actions.yml',
  'permissions:\n  contents: read\n\njobs:',
  'templates/llm-wiki-publish.github-actions.yml: elevated permissions must not be granted workflow-wide',
);
assertIncludes(
  'templates/llm-wiki-publish.github-actions.yml',
  'name: Download export artifact for security checks',
  'templates/llm-wiki-publish.github-actions.yml: security job must download the artifact it gates',
);
assertIncludes(
  'templates/llm-wiki-publish.github-actions.yml',
  'echo "::error::Replace this fail-closed placeholder with redaction checks over export-artifact."\n          exit 1',
  'templates/llm-wiki-publish.github-actions.yml: placeholder redaction gate must fail closed',
);
assertIncludes(
  'templates/llm-wiki-publish.github-actions.yml',
  'permissions:\n      pages: write\n      id-token: write\n    environment:',
  'templates/llm-wiki-publish.github-actions.yml: Pages and OIDC permissions must be limited to the publish job',
);
assertNotMatch(
  'templates/llm-wiki-publish.github-actions.yml',
  /^\s*(?:echo|printf|bash|sh|eval).*\$\{\{\s*github\.event\.inputs\./m,
  'templates/llm-wiki-publish.github-actions.yml: dispatch input must not be interpolated into shell source',
);
assertIncludes(
  'templates/llm-wiki-publish.github-actions.yml',
  'case "$EXPORT_PROFILE" in\n            public-site) ;;',
  'templates/llm-wiki-publish.github-actions.yml: dispatch profile must use the supported-profile allowlist',
);

for (const workflow of [
  'templates/llm-wiki-evals.github-actions.yml',
  'templates/llm-wiki-ingestion.github-actions.yml',
  'templates/llm-wiki-security.github-actions.yml',
]) {
  assertNotMatch(workflow, /^  schedule:/m, `${workflow}: starter schedules must be commented until the first manual run succeeds`);
}

assertIncludes('templates/llm-wiki-evals.github-actions.yml', 'retrieval-and-grounding:\n    if: github.event_name != \'pull_request\'', 'templates/llm-wiki-evals.github-actions.yml: model-backed retrieval job must not run on pull requests');
assertIncludes('templates/llm-wiki-evals.github-actions.yml', 'promptfoo-quality-and-security:\n    if: github.event_name != \'pull_request\'', 'templates/llm-wiki-evals.github-actions.yml: model-backed promptfoo job must not run on pull requests');
assertIncludes('templates/llm-wiki-security.github-actions.yml', 'llm-redteam:\n    if: github.event_name != \'pull_request\'', 'templates/llm-wiki-security.github-actions.yml: model-backed red-team job must not run on pull requests');

assertIncludes('templates/vault/AGENTS.md', '_meta/   schemas, taxonomy, policies and pack metadata');
assertIncludes('templates/vault/AGENTS.md', '_agent/  reports, drafts and agent-generated working files');
assertNotMatch('templates/vault/AGENTS.md', /^schema\/\s+this file/m, 'templates/vault/AGENTS.md: must not advertise obsolete schema/ layout');
assertIncludes('templates/wiki/human-synthesis-atom.md', 'ai_generated: false', 'templates/wiki/human-synthesis-atom.md: human synthesis starter must not default to ai_generated: true');

assertIncludes('docs/23-gitlab-self-hosted-operating-model.md', '/templates/gitlab-*.yml');
assertIncludes('docs/23-gitlab-self-hosted-operating-model.md', '/templates/gitlab-*.yaml');
assertIncludes('skills/llm-wiki-domain-pack/SKILL.md', 'pack.md');
assertIncludes('skills/llm-wiki-domain-pack/SKILL.md', 'profile.json');
assertIncludes('scripts/validate-domain-packs.mjs', 'domain-pack-profile.schema.json', 'scripts/validate-domain-packs.mjs: must load the profile schema it enforces');

finish(`validated ${templates.length} templates and ${copiedTemplates.length} copied template references`);
