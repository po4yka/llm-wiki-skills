---
name: llm-wiki-orient
description: Explain the LLM-Wiki pattern, its raw/wiki/schema architecture, how it differs from RAG, GraphRAG and agent memory, and what ready-made solution families exist. Use when the user asks what LLM-Wiki is, whether it is worth adopting, what OpenWiki/wiki memory means, or how the ecosystem fits together.
license: MIT
compatibility: Designed for Agent Skills-compatible coding agents. For current ecosystem claims, browse and cite fresh sources.
metadata:
  author: po4yka
  version: "0.1.0"
---

# LLM-Wiki Orient

## Goal

Give the user a clear, non-hype explanation of LLM-Wiki and route them to the next useful skill.

## When to use

Use when the user asks:

- "What is LLM-Wiki?"
- "How is this different from RAG?"
- "What tools exist?"
- "Is this useful for my notes/team/repo?"
- "Explain OpenWiki/wiki memory/compiled knowledge."

## Procedure

### 1. Identify the user's frame

Infer or ask for the minimum needed context:

- personal second brain, team/company knowledge, repository documentation, research corpus, or product build;
- local-first requirement;
- target agent: Claude Code, Codex, Cursor, OpenCode or other;
- existing documents or empty start;
- sensitivity/privacy level.

If the user only wants a general explanation, do not interrogate them.

### 2. Explain the pattern

Use this mental model:

```text
raw/     immutable source material
wiki/    LLM-compiled, human-readable Markdown knowledge layer
schema/  AGENTS.md, CLAUDE.md, skills, schemas and conventions
```

Emphasize:

- LLM-Wiki is a compiled knowledge layer, not just a note app.
- Raw sources stay preserved.
- The wiki is reviewable Markdown.
- Skills define procedures over the wiki.
- `index.md` and `log.md` make the wiki navigable and auditable.

### 3. Compare to neighboring patterns

Explain briefly:

| Pattern | Difference |
|---|---|
| RAG | Retrieves chunks at query time. LLM-Wiki pre-compiles durable pages and still may use search. |
| GraphRAG | Builds graph-aware retrieval structures. LLM-Wiki makes human-readable Markdown the primary artifact. |
| Agent memory | Often black-box or agent-owned. LLM-Wiki is inspectable, git-versioned and user-owned. |
| CLAUDE.md / AGENTS.md | Schema/instruction layer, not the whole knowledge base. |
| Skills | Operators that perform tasks over the wiki. |

### 4. Present solution families

Use current browsing for volatile facts. The stable categories are:

- repo-documentation agents such as OpenWiki-style tools;
- Obsidian/local-first Markdown workflows;
- hybrid search add-ons such as qmd-style local retrieval;
- graph/RAG systems when machine retrieval is primary;
- custom CLI/plugin/product builds;
- team PR-based wiki maintenance workflows.

### 5. State the trust boundary

Say clearly:

> Automate bookkeeping, not belief.

The agent can maintain links, indexes, summaries, metadata, triage reports and lint reports. Human review should own final synthesis, ambiguous claims and promotion to verified knowledge.

### 6. Route to next skill

Recommend one next skill:

- choose a solution: `llm-wiki-choose`;
- install/configure: `llm-wiki-setup`;
- migrate existing docs: `llm-wiki-refactor`;
- build custom: `llm-wiki-design`;
- get current news: `llm-wiki-news-radar`;
- operate an existing vault: `wiki-triage`, `wiki-ingest`, `wiki-query`, `wiki-lint`.

## Output

Use this shape:

```markdown
## What LLM-Wiki is

## What it is not

## Main solution families

## Fit for your case

## Recommended next step
```

## Safety gates

- Do not present generated summaries as verified truth.
- Do not recommend a specific external tool using stale maturity facts.
- Browse for current project status, releases, pricing, compatibility or maintenance claims.
