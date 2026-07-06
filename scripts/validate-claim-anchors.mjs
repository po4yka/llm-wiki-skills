import { failFactory, listMarkdownFiles, repoRelative, readText } from './lib/repo.mjs';

const { fail, finish } = failFactory();
const claimIds = new Map();
const sourceIds = new Map();
const claimPattern = /\^(claim-[0-9]{8}-[0-9]{3,})\b/g;
const sourcePattern = /\^(src-[0-9]{8}-[0-9]{3,})\b/g;
const supportPattern = /Support:\s*(extracted|inferred|ambiguous|unsupported|conflicting)/i;

for (const filePath of listMarkdownFiles()) {
  const rel = repoRelative(filePath);
  const text = readText(filePath);
  const lines = text.split(/\r?\n/);

  lines.forEach((line, index) => {
    for (const match of line.matchAll(claimPattern)) {
      const id = match[1];
      const previous = claimIds.get(id);
      if (previous) {
        fail(`${rel}:${index + 1}: duplicate claim anchor '${id}' already used at ${previous}`);
      } else {
        claimIds.set(id, `${rel}:${index + 1}`);
      }

      const window = lines.slice(index, Math.min(lines.length, index + 4)).join('\n');
      if (!supportPattern.test(window)) {
        fail(`${rel}:${index + 1}: claim anchor '${id}' must be followed by a Support: extracted|inferred|ambiguous|unsupported|conflicting line`);
      }
    }

    for (const match of line.matchAll(sourcePattern)) {
      const id = match[1];
      const previous = sourceIds.get(id);
      if (previous) {
        fail(`${rel}:${index + 1}: duplicate source anchor '${id}' already used at ${previous}`);
      } else {
        sourceIds.set(id, `${rel}:${index + 1}`);
      }
    }
  });
}

finish(`validated ${claimIds.size} claim anchors and ${sourceIds.size} source anchors`);
