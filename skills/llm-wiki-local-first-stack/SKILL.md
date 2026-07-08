---
name: llm-wiki-local-first-stack
description: Design a local-first LLM-Wiki stack. Use when the user wants Markdown, git, Obsidian, ripgrep, local embeddings, qmd-style retrieval, SQLite/FTS/vector indexes, local LLMs, offline operation, or safe sync without cloud lock-in; route retrieval/index layer design to llm-wiki-retrieval-architect.
license: MIT
compatibility: Designed for Agent Skills-compatible coding agents. Browse current package docs before recommending concrete install commands or versions.
metadata:
  author: po4yka
  version: "1.0.0"
  install_scope: self-contained
---

# LLM-Wiki Local-First Stack

## Goal

Help the user choose and configure a durable local-first LLM-Wiki stack with the least necessary infrastructure.

## When to use

- The user wants their LLM-Wiki to run offline or with minimal cloud dependency.
- The user asks whether they need a vector database, graph store, or SQLite/FTS index yet.
- The user is deciding between Markdown+git+rg and a heavier retrieval or product storage layer.
- The user wants a sync strategy for a vault shared across multiple devices without breaking index files.
- The user needs a model policy split between local-only and cloud-assisted tasks for privacy reasons.

## Inputs

- Corpus size and growth rate.
- Privacy/offline requirements.
- Existing tools: Obsidian, git, qmd, SQLite, vector DB, local LLMs.
- Target machine constraints.
- Desired agent integration.

## Procedure

### 1. Start with the minimum viable stack

Default:

```text
Markdown + git + index.md + log.md + rg + Agent Skills
```

Do not add vector databases or graph stores unless symptoms justify them.

### 2. Choose retrieval tier

| Tier | Use when |
| --- | --- |
| `index.md` + `rg` | Early and medium vaults with good titles and wikilinks. |
| hybrid local search | Exact search misses conceptual matches. |
| graph-aware retrieval | Relationship and multi-hop questions dominate. |
| product storage | Concurrency, permissions or scale require it. |

### 3. Decide storage policy

Prefer:

- Markdown as source of truth;
- SQLite/FTS for local indexes;
- reconstructable vector indexes;
- content hashes for incremental rebuild;
- git for text and manifest files;
- per-device generated indexes.

Avoid syncing mutable DB/index files unless the user has a tested sync strategy.

### 4. Decide model policy

Classify tasks:

- local-only ingest for sensitive sources;
- cloud-assisted query for public material;
- cheap model for triage;
- stronger model for synthesis;
- local embeddings/reranking when privacy matters.

Hand off to `llm-wiki-model-policy` for detailed policy.

### 5. Produce setup plan

Include:

- folder structure;
- agent instructions;
- retrieval tier;
- index/cache policy;
- backup/sync plan;
- upgrade triggers.

## Output

```markdown
## Local-first recommendation

## Minimal stack

## Retrieval tier

## Storage and sync policy

## Model policy

## Setup steps

## Upgrade triggers
```

## Safety gates

- Do not recommend syncing non-mergeable index files without warning.
- Do not make cloud services mandatory for local-first users.
- Browse before giving current install commands.
- Keep raw sources portable and human-readable where possible.
