---
name: llm-wiki-implementation-deep-dive
description: Compare concrete open-source LLM-Wiki implementations at architecture depth. Use when the user asks for implementation deep dives, production readiness, architecture patterns, or what to copy from OpenWiki, nashsu/llm_wiki, Vouch, RepoAgent, llm-wiki-compiler, SwarmVault, Obsidian plugins, or session-transcript wikis.
license: MIT
compatibility: Designed for Agent Skills-compatible coding agents. Browse official upstream sources before making current maturity, release, license, activity, compatibility or production-readiness claims.
metadata:
  author: po4yka
  version: "1.0.0"
  install_scope: self-contained
---

# LLM-Wiki Implementation Deep Dive

## Goal

Produce an implementation-level comparison of existing open-source LLM-Wiki systems and extract reusable architecture patterns for a user's adoption plan or custom build.

## When to use

- The user asks for an implementation deep dive, architecture comparison, or "what to copy from" for OpenWiki, `nashsu/llm_wiki`, Vouch, RepoAgent, `llm-wiki-compiler`, SwarmVault, Obsidian LLM-Wiki plugins, or session-transcript wikis.
- The user is deciding between a repo-docs generator, a full local-first desktop wiki, a review-gated agent-memory system, a compiler-first system, an Obsidian-native workflow, or a session-transcript wiki archetype.
- The user wants production-readiness or licensing guidance before embedding one of these projects.
- The user maintains `llm-wiki-skills` and wants the ecosystem/stack/deep-dive reference docs refreshed with newly re-verified facts.

## Inputs

- User use case: repo docs, personal local-first wiki, governed team wiki, product/reference implementation, Obsidian workflow, session-transcript wiki.
- Candidate projects if named.
- Required comparison dimensions.
- Sensitivity/privacy constraints.
- Whether the user wants recommendation, design patterns, or PR/documentation updates.

## Procedure

### 1. Re-check current upstream facts

Before making current claims, browse official upstream sources for each named project:

- README and docs;
- release/activity/issue signals;
- license;
- install path;
- storage layout;
- retrieval/indexing implementation;
- MCP/API surfaces;
- review/provenance model;
- security and eval docs.

If you cannot verify a current fact, mark it `verify-before-use`.

### 2. Classify the project archetype

Use these archetypes:

| Archetype | Examples | Primary fit |
| --- | --- | --- |
| Repo-docs generator | `langchain-ai/openwiki`, `OpenBMB/RepoAgent` | Codebase documentation and coding-agent context. |
| Full local-first desktop wiki | `nashsu/llm_wiki` | Personal/local knowledge operating system. |
| Review-gated agent memory | `vouchdev/vouch` | Team or governed knowledge where agents propose and humans approve. |
| Compiler-first knowledge system | `atomicstrata/llm-wiki-compiler`, smaller compiler projects | Typed, cited, linted, queryable compiled wiki artifacts. |
| Obsidian-native workflow | `green-dalii/obsidian-llm-wiki`, other Obsidian plugins | Vault-native human editing and graph-aware retrieval. |
| Session-transcript wiki | `Pratiyush/llm-wiki` | Agent session history as raw source material. |
| Graph-heavy local vault | `swarmclawai/swarmvault` | Broad ingestion, graph export, context packs and agent handoff. |

### 3. Compare implementation dimensions

Create a matrix with these columns:

```markdown
| Project | Archetype | License | Maturity | Storage | Retrieval | Ingestion | MCP/API | Review/provenance | Eval/security | Best idea to adopt | Risks |
|---|---|---|---|---|---|---|---|---|---|---|---|
```

Use `references/docs/15-implementation-deep-dive.md` as a baseline, then refresh facts with browsing.

### 4. Extract architectural lessons

Look for these patterns:

- pointer pattern instead of prompt stuffing;
- raw/wiki/state separation;
- durable plain-file storage with rebuildable indexes;
- review-gated durable writes;
- claim-level or paragraph-level evidence;
- progressive retrieval tiers;
- read-only MCP before proposal-write MCP;
- AST/code-structure analysis for repo docs;
- graph-native retrieval for Obsidian vaults;
- session transcript ingestion;
- AI-readable exports such as `llms.txt`, JSONL, JSON-LD and GraphML;
- eval/lint/security gates.

### 5. Recommend an adoption path

Route by use case:

| Use case | Default path |
| --- | --- |
| Code repository docs | OpenWiki-style generated docs, pointer pattern, scheduled PRs; add RepoAgent-style AST analysis only if needed. |
| Personal local-first wiki | Minimal Markdown/git/Obsidian first; full desktop app if UX matters; hybrid search only after measured misses. |
| Governed team/company wiki | Vouch-style proposal/approval boundary plus compiler-first typed pages and metadata-filtered retrieval. |
| Product/reference implementation | Combine compiler, governance, retrieval, MCP, eval, security and export subsystems explicitly. |
| Obsidian-only workflow | Use graph-native retrieval and protected human sections before adding databases. |
| Agent-session memory | Treat transcripts as raw sources and add redaction before persistence. |

### 6. Identify repository updates

If the user is maintaining `llm-wiki-skills`, propose or implement updates to:

- `references/docs/13-ecosystem-matrix.md` for registry changes;
- `references/docs/14-technology-stack.md` for stack choices;
- `references/docs/15-implementation-deep-dive.md` for architecture-level findings;
- related skills such as `llm-wiki-ecosystem-registry`, `llm-wiki-retrieval-architect`, `llm-wiki-mcp-integration`, `llm-wiki-security-review`, and `llm-wiki-eval-tooling`.

## Output

```markdown
## Implementation recommendation

## Current-source checks

| Project | Sources checked | Freshness/status | Notes |
|---|---|---|---|

## Architecture comparison

| Project | Archetype | Storage | Retrieval | MCP/API | Review/provenance | Best idea to adopt | Risk |
|---|---|---|---|---|---|---|---|

## Deep dives

### Project name

- Architecture:
- Storage/data model:
- Retrieval:
- Ingestion:
- MCP/API:
- Review/provenance:
- Eval/security:
- Strengths:
- Weaknesses:
- What to copy:

## Recommended stack for the user's case

## Gaps and next research

## Repository updates
```

## Safety gates

- Do not claim a project is production-ready based only on stars or README language.
- Do not recommend GPL-licensed code for proprietary embedding without noting license risk.
- Do not treat repo-docs generators as general personal wiki systems.
- Do not treat broad ingestion as proof of trustworthy knowledge; review/provenance still matter.
- Do not recommend direct-write MCP tools until read-only tools, filters and review gates are tested.
- Do not route sensitive raw sources through cloud parsers/models without explicit policy approval.
