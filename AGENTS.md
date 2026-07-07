# AGENTS.md

This repository is an **Agent Skills distribution pack** for LLM-Wiki users.

## Repository role

Treat this repo as a package of portable skills for coding agents, plus supporting documentation and templates.

- `skills/` contains installable Agent Skills.
- `skills.sh.json` groups skills for skills.sh-style discovery.
- `docs/` contains conceptual and operational reference material.
- `templates/` contains starter files for downstream LLM-Wiki vaults.

## Agent Skills compatibility

Every skill directory must contain a `SKILL.md` file with YAML frontmatter.

Required fields:

```yaml
---
name: directory-name
description: What the skill does and when to use it.
---
```

Rules:

1. `name` must match the parent directory.
2. Use lowercase letters, numbers and hyphens only.
3. Put long background material in `references/`, not in the main `SKILL.md`.
4. Keep `description` trigger-oriented: mention the user intents that should activate the skill.
5. Keep skills procedural. Do not turn them into hidden domain encyclopedias.
6. Skills that require current information must instruct the agent to browse and cite fresh sources.

## Language policy

- Agent-facing procedures, skill instructions, schemas and prompts should be written in clear English.
- Conceptual docs may include Russian when they are meant for the repository owner or Russian-speaking users.
- Keep filenames stable, lowercase and hyphenated.

## Editing policy

Prefer small, reviewable changes. When adding or modifying a document:

1. Preserve the document's purpose and scope.
2. Keep cross-links updated.
3. Do not introduce exact maturity metrics, star counts, release dates or pricing unless they are re-verified in the same change.
4. Mark volatile claims as `verify-before-use` or move them to `docs/09-references.md`.
5. Never silently convert Obsidian-style `[[wikilinks]]` in templates into Markdown links.

## Knowledge safety

This repo distinguishes between four claim types:

- `extracted`: directly stated in a source.
- `inferred`: reasoned from sources.
- `ambiguous`: plausible but unresolved.
- `synthesis`: editorial conclusion.

When a document makes a recommendation, name the trade-off and the failure mode. Do not present a workflow as production-grade merely because it is elegant.

## Preferred structure for new skills

```text
skills/<skill-name>/
  SKILL.md
  references/        # optional focused reference docs
  scripts/           # optional deterministic helpers
  assets/            # optional templates or examples
```

Use this `SKILL.md` skeleton:

```markdown
---
name: <skill-name>
description: <specific trigger-rich description>
license: MIT
compatibility: Designed for Agent Skills-compatible coding agents. Add concrete requirements only when necessary.
metadata:
  author: po4yka
  version: "0.1.0"
---

# <Title>

## Goal

## When to use

## Inputs

## Procedure

## Output

## Safety gates
```

## PR checklist

- [ ] Each new skill has valid frontmatter and the `name` matches the directory.
- [ ] `skills.sh.json`, `skill-router.json` and `docs/07-skills-overview.md` include any new top-level skill.
- [ ] New volatile facts are sourced or explicitly marked for re-verification.
- [ ] Skills remain procedural and do not become hidden domain knowledge dumps.
- [ ] Templates are safe for local-first, git-based use.
