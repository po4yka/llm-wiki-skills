import fs from 'node:fs';
import path from 'node:path';
import { failFactory, repoRoot } from './lib/repo.mjs';

const { fail, finish } = failFactory();
const requiredPaths = [
  'examples/README.md',
  'examples/minimal-vault/AGENTS.md',
  'examples/minimal-vault/CLAUDE.md',
  'examples/minimal-vault/raw/sources/example-source.md',
  'examples/minimal-vault/wiki/index.md',
  'examples/minimal-vault/wiki/log.md',
  'examples/provenance-gaps/wiki/concepts/unsupported-claims.md',
  'examples/claim-anchors/wiki/concepts/supported-claims.md',
  'examples/contradiction-case/wiki/concepts/retrieval-defaults.md',
  'examples/repo-docs-project/AGENTS.md',
  'docs/quickstart.md',
  'docs/skill-router.md',
];

for (const relPath of requiredPaths) {
  if (!fs.existsSync(path.join(repoRoot, relPath))) {
    fail(`missing required example or onboarding file: ${relPath}`);
  }
}

finish(`validated ${requiredPaths.length} example and onboarding files`);
