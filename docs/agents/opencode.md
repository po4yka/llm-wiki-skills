# OpenCode adapter

## Install

```bash
npx skills add po4yka/llm-wiki-skills --skill '*' -a opencode
```

## Recommended use

OpenCode is a good target for portable repo workflows:

- `llm-wiki-choose` for solution selection;
- `llm-wiki-repo-docs` for codebase docs;
- `wiki-query` for asking from an existing wiki;
- `llm-wiki-security-review` for write/data boundaries.

## First prompt

```text
Use llm-wiki-orient to explain how this repository can use LLM-Wiki, then use llm-wiki-choose to recommend the smallest safe setup.
```

## Safety notes

- Use report-only mode before applying changes.
- Keep generated pages in draft state.
- Preserve raw sources and human-owned synthesis.
