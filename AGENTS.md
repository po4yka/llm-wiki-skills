# AGENTS.md

This repository contains structured documentation and reusable skill specs for LLM-Wiki workflows.

## Repository role

Treat this repo as a **knowledge and procedure repository**, not as an application codebase.

- `docs/` contains conceptual and operational documentation.
- `skills/` contains reusable agent procedures.
- `templates/` contains starter files for downstream vaults.

## Language policy

- Conceptual documentation may be written in Russian.
- Agent-facing procedures, skill instructions, schemas and prompts should be written in clear English.
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

## Preferred structure for new docs

Use this skeleton:

```markdown
# Title

> Status: draft|reviewed|verified
> Scope: one sentence

## Thesis

## Details

## Operational rules

## Failure modes

## Links
```

## PR checklist

- [ ] The change preserves the raw/wiki/schema mental model.
- [ ] New volatile facts are sourced or explicitly marked for re-verification.
- [ ] Skills remain procedural and do not become hidden domain knowledge dumps.
- [ ] Templates are safe for local-first, git-based use.
