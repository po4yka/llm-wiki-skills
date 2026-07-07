import path from 'node:path';
import { failFactory, listFiles, repoRoot, readText } from './lib/repo.mjs';
import { assertSameList, readCanonicalVocabularies } from './lib/canonical-vocabularies.mjs';

const { fail, finish } = failFactory();

const canonical = readCanonicalVocabularies();
const claimSupport = canonical.claim_support;
const claimSupportPipe = claimSupport.join('|');
const claimSupportCsv = claimSupport.join(', ');

function assertIncludes(relPath, needle, message = `${relPath}: missing '${needle}'`) {
  const text = readText(path.join(repoRoot, relPath));
  if (!text.includes(needle)) fail(message);
}

function assertNotIncludes(relPath, needle, message = `${relPath}: must not include '${needle}'`) {
  const text = readText(path.join(repoRoot, relPath));
  if (text.includes(needle)) fail(message);
}

function assertFilesEqual(leftRel, rightRel) {
  const left = readText(path.join(repoRoot, leftRel));
  const right = readText(path.join(repoRoot, rightRel));
  if (left !== right) {
    fail(`${rightRel}: drifted from canonical ${leftRel}`);
  }
}

const pageSchema = JSON.parse(readText(path.join(repoRoot, 'templates/schemas/page.schema.json')));
const claimMixKeys = Object.keys(pageSchema.properties?.claim_mix?.properties ?? {}).sort();
const expectedClaimMixKeys = [...claimSupport].sort();
assertSameList(fail, 'templates/schemas/page.schema.json', 'claim_mix keys', claimMixKeys, expectedClaimMixKeys);
assertSameList(fail, 'templates/schemas/page.schema.json', 'type enum', pageSchema.properties?.type?.enum ?? [], canonical.core_page_types);
assertSameList(fail, 'templates/schemas/page.schema.json', 'status enum', pageSchema.properties?.status?.enum ?? [], canonical.page_statuses);

const domainPackSchema = JSON.parse(readText(path.join(repoRoot, 'templates/schemas/domain-pack.schema.json')));
assertSameList(fail, 'templates/schemas/domain-pack.schema.json', 'core_types item enum', domainPackSchema.properties?.core_types?.items?.enum ?? [], canonical.core_page_types);
assertSameList(
  fail,
  'templates/schemas/domain-pack.schema.json',
  'domain_type_mappings enum',
  domainPackSchema.properties?.domain_type_mappings?.patternProperties?.['^[a-z0-9]+(?:-[a-z0-9]+)*$']?.enum ?? [],
  canonical.core_page_types,
);

for (const relPath of [
  'AGENTS.md',
  'templates/schemas/taxonomy.md',
  'docs/provenance/claim-anchors.md',
  'skills/llm-wiki-claim-anchors/references/docs/provenance/claim-anchors.md',
]) {
  const text = readText(path.join(repoRoot, relPath));
  for (const label of claimSupport) {
    if (!text.includes(label)) {
      fail(`${relPath}: missing canonical claim-support label '${label}'`);
    }
  }
}

for (const relPath of [
  'scripts/validate-claim-anchors.mjs',
  'skills/llm-wiki-claim-anchors/scripts/validate-claim-anchors.mjs',
]) {
  assertIncludes(relPath, claimSupportPipe, `${relPath}: validator must accept ${claimSupportPipe}`);
}

const markdownAndYamlFiles = listFiles(repoRoot, (_abs, rel) => {
  return /\.(md|ya?ml|json|mjs)$/.test(rel) && !rel.startsWith('dist/') && !rel.startsWith('.tmp/');
});

for (const absPath of markdownAndYamlFiles) {
  const relPath = path.relative(repoRoot, absPath).split(path.sep).join('/');
  if (relPath === 'scripts/validate-schema-drift.mjs') continue;
  const text = readText(absPath);

  if (/^claim type: extracted \| inferred \| ambiguous\s*$/m.test(text)) {
    fail(`${relPath}: uses obsolete three-label claim-support taxonomy`);
  }

  if (text.includes('source-backed|wiki-backed|inferred|missing|conflicting')) {
    fail(`${relPath}: uses obsolete claim support_level labels; use ${claimSupportPipe}`);
  }
}

for (const relPath of [
  'docs/20-ingestion-pipelines.md',
  'skills/llm-wiki-ingestion-stack/SKILL.md',
  'skills/llm-wiki-ingestion-stack/references/docs/20-ingestion-pipelines.md',
]) {
  assertNotIncludes(relPath, '```yaml\nsource_id:', `${relPath}: embeds a source-manifest schema copy instead of referencing the canonical template`);
}

assertFilesEqual(
  'templates/source-manifest.yaml',
  'skills/llm-wiki-ingestion-stack/references/templates/source-manifest.yaml',
);
assertFilesEqual('docs/16-retrieval-architecture.md', 'skills/llm-wiki-retrieval-architect/references/docs/16-retrieval-architecture.md');
assertFilesEqual('templates/team-raci-daci.yaml', 'skills/llm-wiki-gitlab-operating-model/references/templates/team-raci-daci.yaml');
assertFilesEqual('templates/schemas/canonical-vocabularies.json', 'skills/llm-wiki-gitlab-operating-model/references/templates/schemas/canonical-vocabularies.json');

// Bundled script copies must not drift from their canonical scripts/ versions.
assertFilesEqual('scripts/validate-claim-anchors.mjs', 'skills/llm-wiki-claim-anchors/scripts/validate-claim-anchors.mjs');
assertFilesEqual('scripts/redact-preview.mjs', 'skills/llm-wiki-privacy-redactor/scripts/redact-preview.mjs');
assertFilesEqual('scripts/wiki-lint-core.mjs', 'skills/wiki-lint/scripts/wiki-lint-core.mjs');
assertFilesEqual('scripts/audit-skills.mjs', 'skills/llm-wiki-skill-doctor/scripts/audit-skills.mjs');
assertFilesEqual('scripts/audit-skills.mjs', 'skills/llm-wiki-skill-compiler/scripts/audit-skills.mjs');

const volatileBenchmarkPatterns = [
  /\b2\.0[-–]8\.1\s+F1\b/i,
  /\b6\.63\s+F1\b/i,
  /\b1\.51\s+F1\b/i,
  /\b26%\s+relative improvement\b/i,
  /\b91%\s+lower\b/i,
  /\bover 90%\s+token-cost savings\b/i,
  /\bseven baselines\b/i,
];

for (const relPath of [
  'docs/12-evidence-and-faq.md',
  'skills/llm-wiki-faq/references/evidence-pack.md',
  'skills/llm-wiki-faq/references/docs/12-evidence-and-faq.md',
]) {
  const text = readText(path.join(repoRoot, relPath));
  for (const pattern of volatileBenchmarkPatterns) {
    if (pattern.test(text)) {
      fail(`${relPath}: repeats exact volatile benchmark figures; use verify-before-use wording`);
    }
  }
  assertIncludes(relPath, 'verify-before-use', `${relPath}: benchmark evidence must carry verify-before-use wording`);
}

const raci = readText(path.join(repoRoot, 'templates/team-raci-daci.yaml'));
const publicExportOwnership = canonical.workflow_ownership.public_agent_export_release;
assertIncludes('templates/team-raci-daci.yaml', 'workflow: public_agent_export_release');
assertIncludes('templates/team-raci-daci.yaml', `responsible: [${publicExportOwnership.responsible.join(', ')}]`);
assertIncludes('templates/team-raci-daci.yaml', `accountable: ${publicExportOwnership.accountable}`);
assertIncludes('templates/team-raci-daci.yaml', `consulted: [${publicExportOwnership.consulted.join(', ')}]`);
assertIncludes('templates/team-raci-daci.yaml', `informed: [${publicExportOwnership.informed.join(', ')}]`);
if (/workflow: public_agent_export_release[\s\S]*responsible: \[[^\]]*\bSME\b/.test(raci)) {
  fail('templates/team-raci-daci.yaml: SME must not be Responsible for public_agent_export_release');
}

const expectedRaciRow = '| Public/agent export release | A | C | C | C | I | C | C | R |';
assertIncludes('docs/22-team-operating-model.md', expectedRaciRow);
assertIncludes('skills/llm-wiki-team-rollout/references/docs/22-team-operating-model.md', expectedRaciRow);

finish(`validated schema drift guards for claim support (${claimSupportCsv}), source manifests, benchmark evidence and RACI`);
