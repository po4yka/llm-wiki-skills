import { createHash } from 'node:crypto';
import { execFileSync } from 'node:child_process';
import { copyFileSync, existsSync, readFileSync, statSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const repoRoot = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const tag = process.argv[2];
const packageJson = JSON.parse(readFileSync(path.join(repoRoot, 'package.json'), 'utf8'));

if (!/^v\d+\.\d+\.\d+$/.test(tag ?? '') || tag.slice(1) !== packageJson.version) {
  console.error(`Release tag must be v${packageJson.version}.`);
  process.exit(2);
}

const distRoot = path.join(repoRoot, 'dist');
const baseName = `llm-wiki-external-starter-${tag}`;
copyFileSync(path.join(repoRoot, 'CHANGELOG.md'), path.join(distRoot, `CHANGELOG-${tag}.md`));

const definitions = [
  ['starter_zip', `${baseName}.zip`, 'application/zip'],
  ['changelog', `CHANGELOG-${tag}.md`, 'text/markdown'],
  ['sbom', `${baseName}.spdx.json`, 'application/spdx+json'],
  ['skills_catalog', 'skills-catalog.json', 'application/json'],
  ['release_notes', `release-notes-${tag}.md`, 'text/markdown'],
];

const artifacts = definitions.map(([type, name, mediaType]) => {
  const filePath = path.join(distRoot, name);
  if (!existsSync(filePath)) throw new Error(`Missing release artifact: dist/${name}`);
  return {
    type,
    name,
    media_type: mediaType,
    size: statSync(filePath).size,
    sha256: createHash('sha256').update(readFileSync(filePath)).digest('hex'),
  };
});

const archive = artifacts[0];
const checksumName = `${baseName}.zip.sha256`;
const checksumPath = path.join(distRoot, checksumName);
writeFileSync(checksumPath, `${archive.sha256}  ${archive.name}\n`);
artifacts.push({
  type: 'checksum',
  name: checksumName,
  media_type: 'text/plain',
  size: statSync(checksumPath).size,
  sha256: createHash('sha256').update(readFileSync(checksumPath)).digest('hex'),
});
writeFileSync(path.join(distRoot, `release-manifest-${tag}.json`), `${JSON.stringify({
  schema_version: 1,
  name: 'LLM-Wiki External Starter',
  version: packageJson.version,
  tag,
  source_commit: process.env.GITHUB_SHA ?? execFileSync('git', ['rev-parse', 'HEAD'], { cwd: repoRoot, encoding: 'utf8' }).trim(),
  artifacts,
}, null, 2)}\n`);

console.log(`✓ generated checksums and release manifest for ${tag}`);
