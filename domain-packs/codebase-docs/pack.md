# Codebase docs domain pack

## Jobs

- Give coding agents a map of the repository.
- Preserve architecture and module decisions.
- Keep `AGENTS.md` and `CLAUDE.md` short with pointers to wiki pages.
- Maintain docs through PR review.

## Page types

- `source`
- `entity`
- `concept`
- `decision`
- `module`
- `how-to`

## Tags

- `architecture`
- `module`
- `tests`
- `build`
- `adr`
- `convention`

## Recommended skills

```text
llm-wiki-repo-docs -> llm-wiki-adr-memory -> llm-wiki-github-action -> wiki-lint
```

## Stale policy

- Module maps: 30 days or after major refactor.
- ADRs: stale only when assumptions change.
- Build/test commands: 30 days.
