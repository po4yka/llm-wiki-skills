# CLAUDE.md

This repository is a documentation-and-skills pack for LLM-Wiki workflows.

## Before editing

- Read `AGENTS.md`.
- Read `docs/00-index.md` when modifying conceptual docs.
- Read `docs/07-skills-overview.md` before modifying anything in `skills/`.

## Hard rules

- Do not overwrite human-authored synthesis with generated claims.
- Do not add unverified current-status claims about external projects.
- Do not turn skill files into long encyclopedic documents; skills should remain operational.
- Keep `README.md` short enough to orient a new reader.

## Documentation conventions

- Russian is acceptable for explanatory docs.
- English is preferred for reusable skill instructions and templates.
- Use Markdown tables only when they clarify decisions.
- Prefer explicit trade-offs over one-size-fits-all recommendations.

## Safe workflow

1. Inspect the target document.
2. Make the smallest coherent edit.
3. Update cross-links.
4. Summarize what changed and what still needs review.

## Repository map

```text
docs/       conceptual and operational documentation
skills/     Claude Code style procedures
templates/  starter vault files and schemas
```
