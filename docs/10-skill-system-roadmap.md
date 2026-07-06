# LLM-Wiki skill system roadmap

> Status: draft
> Scope: product direction for this repository as an installable Agent Skills pack.

## Thesis

This repository should become a distribution-ready skill system for coding agents that support LLM-Wiki users across the full lifecycle:

```text
learn -> choose -> set up -> migrate -> operate -> audit -> evolve
```

The target user is not only someone who already has a vault. The target user may be deciding whether LLM-Wiki is useful, choosing a tool, migrating a messy document set, or building a product.

## Distribution target

Use `vercel-labs/skills` / `skills.sh` style distribution:

```bash
npx skills add po4yka/llm-wiki-skills --list
npx skills add po4yka/llm-wiki-skills --skill '*' -a claude-code
npx skills add po4yka/llm-wiki-skills --skill llm-wiki-choose -a codex
npx skills use po4yka/llm-wiki-skills --skill llm-wiki-orient --agent claude-code
```

Each skill lives in `skills/<skill-name>/SKILL.md` and has valid Agent Skills frontmatter.

## Skill families

### 1. Orientation and education

Goal: explain LLM-Wiki without hype.

Current skill:

- `llm-wiki-orient`

Covers:

- raw/wiki/schema model;
- difference from RAG, GraphRAG and agent memory;
- solution families;
- safety boundary: automate bookkeeping, not belief.

### 2. Solution selection

Goal: help the user choose ready-made vs custom.

Current skill:

- `llm-wiki-choose`

Covers:

- needs interview;
- solution routing;
- build-vs-buy;
- local-first/privacy constraints;
- agent compatibility;
- re-verification of current tool status.

### 3. Setup and connection

Goal: turn a decision into a working environment.

Current skill:

- `llm-wiki-setup`

Covers:

- `npx skills` installation;
- Claude Code/Codex/Cursor/OpenCode skill install targets;
- raw/wiki/schema folder setup;
- templates;
- git/dry-run/write-safety defaults.

### 4. Migration and refactoring

Goal: organize existing material into an LLM-Wiki.

Current skill:

- `llm-wiki-refactor`

Covers:

- inventory;
- dry-run migration plan;
- raw/wiki separation;
- page type mapping;
- frontmatter normalization;
- link and attachment preservation.

### 5. Current ecosystem radar

Goal: keep recommendations fresh.

Current skill:

- `llm-wiki-news-radar`

Covers:

- fresh web search;
- papers;
- releases;
- standards;
- tool status;
- major ecosystem shifts;
- explicit citations and dates.

### 6. Custom implementation

Goal: design a custom CLI, plugin, repo agent or product.

Current skill:

- `llm-wiki-design`

Covers:

- build-vs-buy justification;
- data model;
- ingest/query/lint flows;
- retrieval tiers;
- provenance;
- write safety;
- MVP planning.

### 7. Capture pipelines

Goal: get knowledge into the system with low friction.

Current skill:

- `llm-wiki-capture-pipeline`

Covers:

- web clips;
- PDFs;
- voice;
- chat exports;
- Telegram/email/GitHub streams;
- durable event logs;
- inbox-first automation.

### 8. Team rollout

Goal: use LLM-Wiki as team/company knowledge infrastructure.

Current skill:

- `llm-wiki-team-rollout`

Covers:

- onboarding;
- bus factor;
- agent context;
- ADR/decision history;
- PR-based writes;
- CODEOWNERS;
- permissions;
- review queues.

### 9. Operation

Goal: run the wiki day to day.

Current skills:

- `wiki-triage`
- `wiki-ingest`
- `wiki-query`
- `wiki-lint`

Covers:

- inbox sorting;
- trusted source ingestion;
- grounded querying;
- lint and health reports.

### 10. Trust and anti-slop

Goal: prevent organized misinformation.

Current skill:

- `llm-wiki-trust-audit`

Covers:

- provenance;
- review states;
- human synthesis boundaries;
- low-confidence staging;
- prompt-injection defense;
- write safety.

## Future skill ideas

These are candidates, not commitments:

| Skill | Purpose |
|---|---|
| `llm-wiki-benchmark` | Measure retrieval hit rate, answer reuse and review backlog. |
| `llm-wiki-claim-provenance` | Add claim-level source anchors and audit unsupported claims. |
| `llm-wiki-repo-docs` | Specialize LLM-Wiki for codebase documentation and AGENTS.md/CLAUDE.md pointer patterns. |
| `llm-wiki-obsidian-hardening` | Harden an Obsidian vault for agent writes, wikilinks, attachments and frontmatter. |
| `llm-wiki-qmd-upgrade` | Add qmd or hybrid retrieval when `index.md` is no longer enough. |
| `llm-wiki-github-action` | Configure scheduled lint/ingest/update PRs. |
| `llm-wiki-domain-pack` | Generate domain-specific page types and taxonomies. |
| `llm-wiki-interview` | Interview the user to extract tacit knowledge into draft pages. |

## Product principles

1. Keep skills small and triggerable.
2. Put volatile facts behind browsing skills, not static docs.
3. Prefer Markdown, git and reviewable diffs.
4. Preserve raw sources.
5. Protect human synthesis.
6. Make trust controls visible before retrieval upgrades.
7. Support multiple coding agents through the Agent Skills format.
