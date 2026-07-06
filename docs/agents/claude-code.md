# Claude Code adapter

## Install

```bash
npx skills add po4yka/llm-wiki-skills --skill '*' -a claude-code
```

## Recommended project files

- `AGENTS.md` for vendor-neutral instructions.
- `CLAUDE.md` for Claude Code boot instructions and vault map.
- `wiki/index.md` as the first read for domain context.

## First prompt

```text
Read AGENTS.md, CLAUDE.md and wiki/index.md. Then use llm-wiki-doctor to diagnose this vault in report-only mode.
```

## Safety notes

- Keep `CLAUDE.md` short and pointer-based.
- Use git branches for migrations.
- Do not load the whole vault into context.
- Use `rg` and focused file reads.
- Use `wiki-lint` after bulk changes.
