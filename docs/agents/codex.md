# Codex adapter

## Install

```bash
npx skills add po4yka/llm-wiki-skills \
  --skill llm-wiki-orient \
  --skill llm-wiki-faq \
  --skill llm-wiki-choose \
  --skill wiki-query \
  -a codex
```

## Recommended use

Codex works well for repository-centered workflows:

- `llm-wiki-repo-docs`
- `llm-wiki-adr-memory`
- `llm-wiki-github-action`
- `wiki-lint`

## First prompt

```text
Use llm-wiki-repo-docs to inspect this repository and propose an agent-readable wiki structure. Do not modify files yet.
```

## Safety notes

- Prefer PR-based changes for team repositories.
- Keep `AGENTS.md` short and use pointers into `wiki/`.
- Do not allow generated docs to bypass review.
