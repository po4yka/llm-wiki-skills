---
name: llm-wiki-ecosystem-registry
description: Build or refresh a current registry of LLM-Wiki implementations and adjacent open-source frameworks. Use when the user asks what projects exist, which technologies are missing, how OpenWiki/nashsu/vouch/RepoAgent compare, or which ready-made implementation to evaluate.
license: MIT
compatibility: Designed for Agent Skills-compatible coding agents. Requires browsing official upstream sources before making current maturity, release, license, pricing or compatibility claims.
metadata:
  author: po4yka
  version: "1.0.0"
  install_scope: self-contained
---

# LLM-Wiki Ecosystem Registry

## Goal

Give the user a current, evidence-backed map of LLM-Wiki implementations and adjacent frameworks, then route them to the right next skill or adoption path.

## When to use

- The user asks what LLM-Wiki projects or adjacent frameworks exist.
- The user wants to compare named tools (for example OpenWiki, nashsu/llm_wiki, vouch, RepoAgent, GraphRAG stacks).
- The user asks which technology is missing from their current setup or which ready-made implementation to evaluate.
- The user needs a routing recommendation between a full application, a repo-doc agent, a review-gated memory system, or a custom build.
- The registry docs (`references/docs/13-ecosystem-matrix.md`) look stale and need a refresh.

## Inputs

- User use case: personal wiki, research corpus, code repo, team/company knowledge, product build.
- Constraints: local-first, cloud allowed, git required, Obsidian required, review gates, MCP, CI/CD.
- Candidate tools if already named.
- Desired output: short recommendation, detailed comparison, or registry update.

## Procedure

### 1. Re-check current facts

Browse official upstream sources before giving current claims about:

- repository activity, releases, stars, forks or issues;
- license;
- install path;
- supported model providers;
- local/cloud modes;
- output format and storage;
- MCP/API/Agent Skills support;
- review/provenance features.

Mark any unverified item as `verify-before-use`.

### 2. Classify each candidate

Use these families:

| Family | Examples | Use when |
| --- | --- | --- |
| Full LLM-Wiki application | `nashsu/llm_wiki`, desktop/vault apps | The user wants ready-made personal/research wiki UX. |
| Repo documentation agent | `langchain-ai/openwiki`, `OpenBMB/RepoAgent` | The corpus is a codebase and coding agents need architecture/module maps. |
| Review-gated agent memory | `vouchdev/vouch` | Agents should propose knowledge updates and humans approve durable writes. |
| Obsidian/local-first workflow | Obsidian plugins, Markdown/git setups | Human reading/editing of Markdown is central. |
| Compiler-first knowledge system | `atomicstrata/llm-wiki-compiler`, smaller compiler projects | The user wants typed, cited, linted and exportable compiled wiki artifacts. |
| Session-transcript wiki | `Pratiyush/llm-wiki` | Agent session logs are the main raw sources. |
| Graph-heavy local vault | `swarmclawai/swarmvault` | Broad ingestion, graph exports, context packs and agent handoff dominate. |
| Retrieval/GraphRAG framework | Microsoft GraphRAG, LightRAG, HippoRAG, LlamaIndex/Haystack/Qdrant stacks | Retrieval quality, scale or multi-hop reasoning is the bottleneck. |
| Custom implementation | CLI, plugin, product build | Trust, UX, provenance, integration or data constraints are specific. |

### 3. Score fit

Score 1-5 across:

- use-case fit;
- local-first/data ownership;
- setup effort;
- maintenance burden;
- provenance/review controls;
- retrieval maturity;
- agent/MCP integration;
- portability/export;
- license/commercial risk;
- reversibility/lock-in.

### 4. Compare against the repository docs

Use:

- `references/docs/13-ecosystem-matrix.md` as the seed registry;
- `references/docs/14-technology-stack.md` as the stack reference;
- `references/docs/15-implementation-deep-dive.md` for architecture-level implementation lessons and project deep dives.

If the user needs implementation-level analysis, invoke or route to `llm-wiki-implementation-deep-dive` rather than answering only from this registry.

If a current answer finds a new project or changed project status, recommend updating those docs rather than hiding the information in a chat response.

### 5. Recommend one path

Do not present every tool as equivalent.

Use this routing:

| Situation | Primary recommendation |
| --- | --- |
| Code repository docs for agents | OpenWiki-style repo docs or RepoAgent-style code documentation. |
| Personal local-first wiki | Minimal Markdown/git/Obsidian stack first; consider full desktop LLM-Wiki app if the user wants UI. |
| Team knowledge with trust requirements | Git/PR workflow or Vouch-style review-gated memory. |
| Large retrieval-heavy corpus | Hybrid retrieval or GraphRAG layer with wiki pages as the reviewed surface. |
| Product build | Custom architecture using `llm-wiki-design`, `llm-wiki-implementation-deep-dive`, `llm-wiki-retrieval-architect`, `llm-wiki-mcp-integration` and `llm-wiki-eval-tooling`. |

## Output

```markdown
## Ecosystem recommendation

## Current-source checks

| Project | Source checked | Status | Notes |
|---|---|---|---|

## Comparison

| Option | Fit | Setup effort | Data ownership | Review/provenance | Agent integration | Lock-in risk | Notes |
|---|---:|---:|---:|---:|---:|---:|---|

## Primary path

## Fallback

## Risks

## Next skill
```

## Safety gates

- Do not recommend a project based only on memory.
- Do not claim an experimental repository is production-ready without evidence.
- Do not treat adjacent RAG/GraphRAG frameworks as complete LLM-Wiki implementations.
- Do not recommend cloud ingestion for sensitive data without explicit user acceptance.
- Do not hide tool uncertainty; mark it as `verify-before-use`.
