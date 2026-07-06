# Expected repo docs plan contract

## Repo docs summary

The plan should propose a small agent-readable wiki for a codebase without bloating `AGENTS.md`.

## Required pages or proposals

- `wiki/index.md`
- architecture overview
- module or package map
- build/test/deploy map
- common change workflows
- ADR/decision links

## Instruction-file expectation

`AGENTS.md` or `CLAUDE.md` should use pointer pattern:

```markdown
For architecture and module maps, read `wiki/index.md` first.
```

## Safety expectation

Do not overwrite hand-written ADRs. Prefer PR-based changes for team repositories.
