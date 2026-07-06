# Codebase docs domain pack

## Jobs

- Give coding agents a map of the repository.
- Preserve architecture and module decisions.
- Keep `AGENTS.md` and `CLAUDE.md` short with pointers to wiki pages.
- Maintain docs through PR review.

## Core page types

Use stable `type` values from `templates/schemas/page.schema.json`:

- `source`
- `entity`
- `concept`
- `synthesis`
- `query`
- `report`

## Domain types

Use `domain_type` for specialization. The source of truth is `schema.overlay.json`.

| domain_type | core `type` | Use when |
|---|---|---|
| `decision` | `synthesis` | An ADR-like page captures architecture/product rationale. |
| `module` | `entity` | A package, service, subsystem or module needs a stable page. |
| `how-to` | `synthesis` | A procedural repo workflow should be reusable by agents. |

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
