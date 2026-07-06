---
name: llm-wiki-news-radar
description: Find and summarize fresh news, releases, papers, repositories, standards, and technologies related to LLM-Wiki, wiki memory, OpenWiki, Agent Skills, agent memory, RAG/GraphRAG, local-first knowledge tools, and coding-agent knowledge workflows. Use when the user asks for latest/current/recent ecosystem updates.
license: MIT
compatibility: Designed for Agent Skills-compatible coding agents with web browsing/search. Must browse and cite fresh sources for current claims.
metadata:
  author: po4yka
  version: "0.1.0"
---

# LLM-Wiki News Radar

## Goal

Produce a current, source-cited ecosystem update for LLM-Wiki and adjacent technologies.

## Mandatory freshness rule

Always browse. Do not answer current-state questions from memory.

Use absolute dates in the answer, especially when the user says latest, recent, today, this week, this month or current.

## Watch areas

Search across:

- LLM-Wiki / wiki memory / OpenWiki;
- LangChain, DeepAgents and related wiki-memory projects;
- Karpathy-style LLM-Wiki discussions;
- Agent Skills, skills.sh, Claude Code, Codex, Cursor, OpenCode;
- Obsidian/local-first knowledge workflows;
- qmd or local hybrid retrieval;
- RAG, GraphRAG, LightRAG, HippoRAG and agent-native retrieval;
- provenance, anti-slop, context poisoning, memory benchmarks;
- arXiv papers and benchmark releases;
- GitHub repos and release notes.

## Procedure

### 1. Set the time window

Infer or ask for the window:

- last 7 days;
- last 30 days;
- last 90 days;
- since a known event;
- general current landscape.

If no window is given, default to the last 90 days plus any major still-relevant baseline sources.

### 2. Search diverse sources

Use at least three source families when possible:

- official docs/blogs/release notes;
- GitHub repositories/releases/issues;
- papers/preprints;
- independent analysis or community discussions.

Prefer primary sources for technical claims.

### 3. Classify findings

Group updates by type:

| Type | Examples |
|---|---|
| `release` | CLI, library, plugin, agent feature, skill format update |
| `paper` | benchmark, architecture, retrieval/memory algorithm |
| `tool` | new repo or major implementation change |
| `standard` | Agent Skills, AGENTS.md, memory/tool interface conventions |
| `risk` | data loss, stale maintenance, privacy, provenance gap |
| `market-signal` | major vendor adoption, large ecosystem shift |

### 4. Evaluate relevance

For each important item, answer:

- What changed?
- Why does it matter for LLM-Wiki users?
- Who should care: personal user, team, product builder, researcher?
- Does it change a previous recommendation?
- What needs verification before adoption?

### 5. Output

```markdown
## Current as of YYYY-MM-DD

## Executive summary

## Major updates

## New or changed tools

## New papers / benchmarks

## Standards and agent ecosystem

## Risks and warnings

## What I would change in an LLM-Wiki setup now

## Sources checked
```

## Citation rules

- Cite every factual current-state claim.
- Do not cite a source for a claim it does not support.
- Do not group all citations at the end.
- Use primary sources for install commands, APIs, release status and licenses.

## Optional file-back

If working inside an LLM-Wiki vault, offer to save the update as:

```text
wiki/queries/YYYY-MM-DD-llm-wiki-news-radar.md
```

Mark it `status: draft` and `stale_after` within 30-90 days.
