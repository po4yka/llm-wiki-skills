---
name: llm-wiki-design
description: Design a custom LLM-Wiki implementation, CLI, Obsidian plugin, repo-docs agent, team workflow, or product architecture. Use when the user wants to build their own system and needs data model, retrieval tier, provenance, storage, sync, review, agent integration, or MVP planning.
license: MIT
compatibility: Designed for Agent Skills-compatible coding agents. Browse official docs for current dependencies before recommending concrete libraries or APIs.
metadata:
  author: po4yka
  version: "1.0.0"
  install_scope: self-contained
---

# LLM-Wiki Design

## Goal

Design a custom LLM-Wiki system that starts thin, stays inspectable and has explicit trust controls.

## When to use

- The user wants to build their own LLM-Wiki implementation, CLI, Obsidian plugin, repo-docs agent, or team workflow rather than adopt an existing tool.
- A product decision is needed on data model, retrieval tier, provenance, storage, sync, review or agent integration before any code is written.
- The user asks for an MVP plan, architecture sketch, or build-vs-buy justification for a wiki/knowledge-base system.
- Do not use this skill to answer questions from an already-built wiki (route to a query skill instead) or to pick between existing off-the-shelf tools (route to `llm-wiki-choose`).

## Inputs

- Product/workflow goal.
- User type: personal, team, company, plugin, CLI, SaaS, research tool.
- Corpus type and scale.
- Local-first/privacy constraints.
- Target agents and editors.
- Required integrations.

## Procedure

### 1. Frame the build-vs-buy reason

Custom build is justified when at least one is true:

- claim-level provenance is required;
- existing tools do not preserve human edits;
- local-first/offline operation is mandatory;
- team governance or permission model is specific;
- product UX is the main differentiator;
- corpus shape is unusual;
- integration with a workflow/repo/editor is central.

If none apply, recommend `llm-wiki-choose` again and prefer a ready-made path.

### 2. Define the domain model

Start with:

```text
raw source -> source page -> entity/concept/comparison/synthesis/query pages
```

Define page types, lifecycle states, source hashes, claim types, review gates and protected sections.

### 3. Pick retrieval tier

Use the smallest sufficient tier:

| Tier | Use when |
| --- | --- |
| index + grep | first 50-100 sources or strong filenames/wikilinks |
| hybrid lexical + semantic | conceptual recall fails or corpus grows |
| graph-aware retrieval | relationships, provenance and multi-hop questions dominate |
| custom storage | product requirements demand concurrency, permissions or scale |

### 4. Design ingest pipeline

Prefer two-step ingest:

1. analyze source into structured claims/entities/concepts without writing final pages;
2. generate or patch wiki pages from the analysis;
3. run lint and review.

Add confidence and rejection feedback before adding complex graph UI.

### 5. Design write safety

Specify:

- raw source immutability;
- git/PR/dry-run workflow;
- protected human sections;
- schema validation;
- low-confidence staging;
- rollback;
- prompt-injection defense;
- sensitive data policy.

### 6. Plan MVP

A good MVP usually includes:

- Markdown output;
- source preservation;
- `index.md` and `log.md`;
- one ingest command;
- one query command;
- one lint report;
- git diff review;
- frontmatter schema;
- no vector DB until there is a measured retrieval problem.

## Output

```markdown
## Product/workflow thesis

## Build-vs-buy justification

## Architecture

## Data model

## Ingest/query/lint flows

## Trust model

## Storage and retrieval choices

## MVP milestones

## Risks

## Open questions
```

## Safety gates

- Do not start with graph visualization as the core deliverable.
- Do not hide generated memory in a black box if users need trust.
- Do not recommend current dependency versions or licenses without browsing.
- Do not design direct-write team systems without review ownership.
