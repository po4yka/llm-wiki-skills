---
name: llm-wiki-migration-planner
description: Create a no-write migration plan for turning existing notes, docs, Obsidian vaults, Notion exports, research archives, or repository documentation into an LLM-Wiki. Use when the user wants a dry-run plan before moving or editing files; route applying the approved plan to llm-wiki-refactor.
license: MIT
compatibility: Designed for Agent Skills-compatible coding agents. Requires read access only; applying the plan should be delegated to llm-wiki-refactor.
metadata:
  author: po4yka
  version: "0.1.1"
  install_scope: self-contained
---

# LLM-Wiki Migration Planner

## Goal

Produce a safe, reviewable migration plan without changing the user's files.

## Inputs

- Current document root.
- Desired target: personal vault, repo wiki, team wiki, research corpus, or product prototype.
- Existing constraints: Obsidian, Notion export, docs generator, git, privacy, attachments.

## Procedure

### 1. Confirm dry-run mode

State that this skill produces a plan only. Do not move, rename, delete, normalize frontmatter, or rewrite links.

### 2. Identify migration profile

Classify the source:

| Profile | Notes |
|---|---|
| Obsidian vault | Preserve wikilinks, aliases and attachments. |
| Repository docs | Preserve README/ADR/docs generator conventions. |
| Notion export | Normalize nested pages and attachment paths. |
| Readwise/Omnivore export | Treat exports as raw sources first. |
| Chat exports | Separate raw conversation from reusable query pages. |
| Research PDFs | Preserve PDFs in raw/assets or raw/sources. |
| Company docs | Require PR-based write model and permissions. |

### 3. Inventory and classify

For each candidate file, infer:

- current path;
- likely page type;
- whether it is raw, wiki, synthesis, query, asset, or mixed;
- confidence;
- migration risk;
- proposed target path.

### 4. Build mapping table

Use this table:

```markdown
| Current path | Proposed path | Type | Confidence | Risk | Notes |
|---|---|---|---:|---|---|
```

Use confidence values conservatively. Low-confidence rows should require human review.

### 5. Design phases

Split the migration into batches:

1. create scaffold;
2. preserve raw sources and assets;
3. move source summaries;
4. create or update index/log;
5. normalize frontmatter;
6. repair links;
7. run lint and trust audit.

### 6. Produce apply instructions

Give exact next steps for `llm-wiki-refactor`, but do not execute them.

## Output

```markdown
## Migration thesis

## Source profile

## Target structure

## Migration table

## High-risk files

## Phased plan

## Required approvals

## Next skill
```

## Safety gates

- No file writes.
- No deletion recommendations without a separate archive/backup option.
- Do not convert Obsidian wikilinks to Markdown links unless explicitly requested.
- Do not collapse raw sources into summaries.
- Do not propose cloud ingestion for sensitive material without explicit approval.
