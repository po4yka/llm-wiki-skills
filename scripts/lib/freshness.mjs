import path from 'node:path';
import { listFiles, repoRelative, repoRoot, readText } from './repo.mjs';

export const currentAsOfPattern = /^> Current as of: \d{4}-\d{2}-\d{2}$/m;

export function docsRequiringCurrentAsOf() {
  const docsDir = path.join(repoRoot, 'docs');
  return listFiles(docsDir, (_absPath, relPath) => relPath.endsWith('.md'))
    .map((filePath) => {
      const relPath = repoRelative(filePath);
      const text = readText(filePath);
      const numberedCurrentDoc = /^docs\/(?:0[3-9]|1[0-9]|2[0-4])-[^/]+\.md$/.test(relPath);
      const externalReferenceDoc = /https?:\/\//.test(text);
      const explicitRefreshDoc = /Source to re-check|verify-before-use|current project\/tool claims/i.test(text);

      return {
        filePath,
        relPath,
        required: numberedCurrentDoc || externalReferenceDoc || explicitRefreshDoc,
      };
    })
    .filter((doc) => doc.required);
}
