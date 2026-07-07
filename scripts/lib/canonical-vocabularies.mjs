import path from 'node:path';
import { repoRoot, readText } from './repo.mjs';

export const canonicalVocabulariesPath = path.join(repoRoot, 'templates', 'schemas', 'canonical-vocabularies.json');

export function readCanonicalVocabularies() {
  return JSON.parse(readText(canonicalVocabulariesPath));
}

export function canonicalList(name) {
  const vocabularies = readCanonicalVocabularies();
  const value = vocabularies[name];
  if (!Array.isArray(value)) {
    throw new Error(`canonical vocabulary '${name}' is not an array`);
  }
  return value;
}

export function canonicalPipe(name) {
  return canonicalList(name).join('|');
}

export function assertSameList(fail, relPath, label, actual, expected) {
  const actualText = [...actual].join('|');
  const expectedText = [...expected].join('|');
  if (actualText !== expectedText) {
    fail(`${relPath}: ${label} must be ${expected.join(', ')}`);
  }
}
