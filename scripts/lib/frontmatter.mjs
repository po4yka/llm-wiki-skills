export function unquote(value) {
  return String(value ?? '')
    .trim()
    .replace(/^['"]|['"]$/g, '')
    .trim();
}

function stripYamlComment(line) {
  let quote = null;

  for (let index = 0; index < line.length; index += 1) {
    const char = line[index];
    const previous = line[index - 1];

    if ((char === '"' || char === "'") && previous !== '\\') {
      quote = quote === char ? null : quote ?? char;
      continue;
    }

    if (char === '#' && !quote && /\s/.test(previous ?? '') && (line[index + 1] === undefined || /\s/.test(line[index + 1]))) {
      return line.slice(0, index);
    }
  }

  return line;
}

export function parseFrontmatter(text) {
  const match = text.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n/);
  if (!match) return null;

  const fields = {};
  let currentObjectKey = null;

  for (const rawLine of match[1].split(/\r?\n/)) {
    const line = stripYamlComment(rawLine).replace(/\s+$/, '');
    if (!line.trim()) continue;

    const nested = line.match(/^\s{2}([a-zA-Z0-9_-]+):\s*(.*)$/);
    if (nested && currentObjectKey && typeof fields[currentObjectKey] === 'object') {
      fields[currentObjectKey][nested[1]] = unquote(nested[2]);
      continue;
    }

    const topLevel = line.match(/^([a-zA-Z0-9_-]+):\s*(.*)$/);
    if (topLevel) {
      const [, key, rawValue] = topLevel;
      if (rawValue === '') {
        fields[key] = {};
        currentObjectKey = key;
      } else {
        fields[key] = unquote(rawValue);
        currentObjectKey = null;
      }
      continue;
    }

    return { fields, malformedLine: rawLine };
  }

  return { fields, malformedLine: null };
}

export function stripFrontmatter(text) {
  return text.replace(/^---\r?\n[\s\S]*?\r?\n---\r?\n/, '');
}
