import fs from 'node:fs';
import path from 'node:path';
import { failFactory, listMarkdownFiles, repoRelative, repoRoot, readText } from './lib/repo.mjs';

const { fail, finish } = failFactory();
const markdownFiles = listMarkdownFiles();

function isExternalLink(value) {
  return /^(https?:|mailto:|tel:|urn:)/i.test(value);
}

function githubSlug(heading) {
  return heading
    .trim()
    .toLowerCase()
    .replace(/<[^>]+>/g, '')
    .replace(/[`*_~]/g, '')
    .replace(/[^\p{L}\p{N}\s-]/gu, '')
    .trim()
    .replace(/\s+/g, '-');
}

function collectAnchors(markdown) {
  const anchors = new Set();

  for (const line of markdown.split(/\r?\n/)) {
    const heading = line.match(/^#{1,6}\s+(.+?)\s*#*\s*$/)?.[1];
    if (heading) {
      anchors.add(githubSlug(heading));
    }
  }

  return anchors;
}

function stripCodeFences(markdown) {
  return markdown.replace(/```[\s\S]*?```/g, '');
}

function normalizeDestination(rawDestination) {
  return rawDestination
    .trim()
    .replace(/^<|>$/g, '')
    .split(/\s+/)[0];
}

for (const filePath of markdownFiles) {
  const markdown = stripCodeFences(readText(filePath));
  const relFile = repoRelative(filePath);
  const linkPattern = /(?<!!)\[[^\]]*\]\(([^)]+)\)/g;

  for (const match of markdown.matchAll(linkPattern)) {
    const rawDestination = normalizeDestination(match[1]);
    if (!rawDestination || isExternalLink(rawDestination)) continue;

    const [rawPathPart, rawAnchorPart] = rawDestination.split('#');
    const decodedPathPart = decodeURIComponent(rawPathPart || '');
    const anchorPart = rawAnchorPart ? decodeURIComponent(rawAnchorPart) : null;

    let targetPath;
    if (!decodedPathPart) {
      targetPath = filePath;
    } else if (decodedPathPart.startsWith('/')) {
      targetPath = path.join(repoRoot, decodedPathPart.slice(1));
    } else {
      targetPath = path.resolve(path.dirname(filePath), decodedPathPart);
    }

    if (!targetPath.startsWith(repoRoot)) {
      fail(`${relFile}: link escapes repository root: ${rawDestination}`);
      continue;
    }

    if (!fs.existsSync(targetPath)) {
      fail(`${relFile}: broken local link '${rawDestination}'`);
      continue;
    }

    if (anchorPart && fs.statSync(targetPath).isFile() && targetPath.endsWith('.md')) {
      const anchors = collectAnchors(readText(targetPath));
      const expectedAnchor = githubSlug(anchorPart);
      if (!anchors.has(expectedAnchor)) {
        fail(`${relFile}: missing anchor '#${anchorPart}' in ${repoRelative(targetPath)}`);
      }
    }
  }
}

finish(`validated local links in ${markdownFiles.length} Markdown files`);
