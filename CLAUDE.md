# CLAUDE.md

This repository is an installable Agent Skills pack for LLM-Wiki workflows.

## Before editing

- Read `AGENTS.md`.
- Read `docs/07-skills-overview.md` before modifying anything in `skills/`.
- Read the Agent Skills compatibility rules in `AGENTS.md` before adding a new skill.

## Hard rules

- Every `skills/*/SKILL.md` file must have valid YAML frontmatter with `name` and `description`.
- The `name` field must match the skill directory.
- Do not add unverified current-status claims about external projects.
- Do not turn skill files into long encyclopedic documents; use `references/` for supporting material.
- Do not overwrite human-authored synthesis with generated claims.
- Keep `README.md` focused on installation, skill selection and package orientation.

## Documentation conventions

- English is preferred for reusable skill instructions and templates.
- Russian is acceptable for explanatory docs targeted at the repository owner or Russian-speaking users.
- Use Markdown tables only when they clarify decisions.
- Prefer explicit trade-offs over one-size-fits-all recommendations.

## Safe workflow

1. Inspect the target document.
2. Make the smallest coherent edit.
3. Update cross-links, `skills.sh.json`, `skill-router.json` and `docs/07-skills-overview.md` when skills change.
4. Summarize what changed and what still needs review.

## Repository map

```text
skills/          installable Agent Skills
skills.sh.json   grouping metadata for skill discovery
docs/            conceptual and operational documentation
templates/       starter vault files and schemas
scripts/         optional repository validation helpers
```
