import path from 'node:path';
import { failFactory, listFiles, repoRelative, repoRoot, readText } from './lib/repo.mjs';
import { canonicalList } from './lib/canonical-vocabularies.mjs';

const { fail, finish } = failFactory();
const packageJson = JSON.parse(readText(path.join(repoRoot, 'package.json')));
const claimSupportLabels = canonicalList('claim_support');

function assertIncludes(filePath, needle, message) {
  const text = readText(path.join(repoRoot, filePath));
  if (!text.includes(needle)) fail(message ?? `${filePath}: missing ${needle}`);
}

function assertNotIncludes(filePath, needle, message) {
  const text = readText(path.join(repoRoot, filePath));
  if (text.includes(needle)) fail(message ?? `${filePath}: must not include ${needle}`);
}

function assertScriptIncludes(scriptName, needle) {
  const script = packageJson.scripts?.[scriptName] ?? '';
  if (!script.includes(needle)) fail(`package.json: script '${scriptName}' must include '${needle}'`);
}

function checkNoUnpinnedTooling() {
  const workflowFiles = listFiles(path.join(repoRoot, '.github', 'workflows'), (_absPath, relPath) => /\.ya?ml$/.test(relPath));
  const workflowTemplateFiles = listFiles(repoRoot, (_absPath, relPath) => {
    if (/^(node_modules|\.git|\.tmp|dist)\//.test(relPath)) return false;
    return /(?:^templates\/|\/references\/templates\/).+\.ya?ml$/.test(relPath);
  });
  const packageScriptsText = Object.values(packageJson.scripts ?? {}).join('\n');
  const bannedPatterns = [
    /npx\s+--yes\s+(?!skills@1\.5\.15\b|markdownlint-cli2@0\.23\.0\b|promptfoo@0\.121\.17\b)[^\s"'`]+/g,
    /go install [^\s]+@latest/g,
    /pip install(?: --upgrade)? zizmor(?!==1\.26\.1\b)/g,
    /\b[\w@./-]+@latest\b/g,
    /skills@latest/g,
  ];

  for (const filePath of [...workflowFiles, ...workflowTemplateFiles]) {
    const relPath = repoRelative(filePath);
    const text = readText(filePath);

    for (const pattern of bannedPatterns) {
      for (const match of text.matchAll(pattern)) {
        fail(`${relPath}: unpinned external tooling '${match[0]}'`);
      }
    }
  }

  for (const pattern of bannedPatterns) {
    for (const match of packageScriptsText.matchAll(pattern)) {
      fail(`package.json scripts: unpinned external tooling '${match[0]}'`);
    }
  }
}

function checkAgentsRulesAreExecutable() {
  assertScriptIncludes('validate', 'validate:quality-policy');
  assertScriptIncludes('validate:quality-policy', 'scripts/validate-quality-policy.mjs');

  const textFiles = listFiles(repoRoot, (_absPath, relPath) => {
    if (/^(node_modules|\.git|\.tmp|dist)\//.test(relPath)) return false;
    return /\.(md|ya?ml|json|mjs)$/.test(relPath);
  });

  for (const filePath of textFiles) {
    const relPath = repoRelative(filePath);
    const text = readText(filePath);
    const volatileMetric = /exact (?:F1|accuracy|benchmark|score|metric)|\b\d+(?:\.\d+)?%\b.*\b(F1|accuracy|improvement|uplift|gain)\b/i;

    if (volatileMetric.test(text) && !text.includes('verify-before-use')) {
      fail(`${relPath}: volatile benchmark or metric claim must include verify-before-use`);
    }
  }

  const templateFiles = listFiles(path.join(repoRoot, 'templates'), (_absPath, relPath) => /\.(md|ya?ml|yaml|json)$/.test(relPath));
  const templatesContainWikilinks = templateFiles.some((filePath) => /\[\[[^\]]+\]\]/.test(readText(filePath)));
  if (!templatesContainWikilinks) {
    fail('templates/: AGENTS.md protects wikilinks, but no template fixture contains an Obsidian wikilink');
  }

  assertIncludes('templates/wiki/human-synthesis-atom.md', '[[sources/source-title#section]]', 'templates/wiki/human-synthesis-atom.md: must keep a wikilink fixture for AGENTS.md wikilink preservation');
  assertNotIncludes('templates/wiki/human-synthesis-atom.md', '(sources/source-title#section)', 'templates/wiki/human-synthesis-atom.md: wikilink fixture must not be converted to Markdown link');
}

function checkClaimSupportPolicy() {
  for (const label of claimSupportLabels) {
    assertIncludes('AGENTS.md', `\`${label}\``, `AGENTS.md: missing claim-support label '${label}'`);
    assertIncludes('templates/schemas/taxonomy.md', `\`${label}\``, `templates/schemas/taxonomy.md: missing claim-support label '${label}'`);
  }
}

function checkWorkflowPolicy() {
  const ci = readText(path.join(repoRoot, '.github', 'workflows', 'ci.yml'));
  const release = readText(path.join(repoRoot, '.github', 'workflows', 'release.yml'));
  const nightly = readText(path.join(repoRoot, '.github', 'workflows', 'nightly.yml'));
  const policy = readText(path.join(repoRoot, 'docs', 'security', 'ci-severity-policy.md'));
  const releaseRequired = [
    ['npm run validate', /run: npm run validate\b/],
    ['npm run smoke:skills', /run: npm run smoke:skills\b/],
    ['npm run check:skill-versions -- --strict', /npm run check:skill-versions -- --strict/],
    ['actionlint', /go install github\.com\/rhysd\/actionlint\/cmd\/actionlint@v1\.7\.12/],
    ['gitleaks', /go install github\.com\/gitleaks\/gitleaks\/v8\/cmd\/gitleaks@v8\.30\.1/],
  ];

  for (const [label, pattern] of releaseRequired) {
    if (!pattern.test(release)) fail(`.github/workflows/release.yml: release policy requires ${label}`);
  }

  if (!/Run markdownlint[\s\S]*?continue-on-error:\s+true/.test(ci)) {
    fail('.github/workflows/ci.yml: markdownlint advisory status must be explicit');
  }

  if (!/Run zizmor workflow audit[\s\S]*?continue-on-error:\s+true/.test(ci)) {
    fail('.github/workflows/ci.yml: zizmor advisory status must be explicit');
  }

  assertIncludes('.github/workflows/nightly.yml', "cron: '0 5 * * *'", '.github/workflows/nightly.yml: Nightly checks must run nightly, not weekly');
  assertNotIncludes('.github/workflows/nightly.yml', 'continue-on-error: true', '.github/workflows/nightly.yml: nightly smoke checks must not be advisory');

  if (!policy.includes('| gitleaks | workflow job | advisory until baseline is clean | fail |')) {
    fail('docs/security/ci-severity-policy.md: gitleaks release severity must be documented as fail');
  }

  if (!policy.includes('| markdownlint | workflow job | advisory | advisory |')) {
    fail('docs/security/ci-severity-policy.md: markdownlint advisory status must remain explicit');
  }

  if (!ci.includes('go install github.com/rhysd/actionlint/cmd/actionlint@v1.7.12')) {
    fail('.github/workflows/ci.yml: actionlint version must be pinned');
  }
}

checkNoUnpinnedTooling();
checkAgentsRulesAreExecutable();
checkClaimSupportPolicy();
checkWorkflowPolicy();

finish('validated quality policy guardrails');
