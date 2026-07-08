---
name: llm-wiki-choose
description: Help a user choose between ready-made LLM-Wiki tools, a local-first workflow, a team rollout, retrieval/GraphRAG systems, or a custom implementation. Use when the user asks what solution fits their needs, whether to use OpenWiki/Obsidian/qmd/GraphRAG, or whether to build their own.
license: MIT
compatibility: Designed for Agent Skills-compatible coding agents. Browse and cite fresh sources before making current tool recommendations.
metadata:
  author: po4yka
  version: "1.0.0"
  install_scope: self-contained
---

# LLM-Wiki Choose

## Goal

Interview the user enough to recommend a practical path: adopt a ready-made solution, assemble a local-first workflow, roll out a team process, or build a custom LLM-Wiki.

## When to use

- The user asks which LLM-Wiki approach fits: a ready-made tool, a local-first git workflow, a team rollout, a retrieval/GraphRAG system, or a custom build.
- The user explicitly asks whether OpenWiki, Obsidian, qmd, or a GraphRAG system suits their case.
- The user is comparing infrastructure options before committing to an architecture or before starting `llm-wiki-paf-adoption`.
- The user is still skeptical whether an LLM-Wiki is worth building at all.

## Inputs

- User type (individual, team, company, product builder) and corpus type/scale.
- Privacy tier (public, internal, sensitive, regulated) and update/freshness needs.
- Preferred coding agent and existing tooling (Obsidian, GitHub, qmd, vector DB, GraphRAG, OpenWiki, custom scripts).
- Write tolerance (read-only advisory, PR-based writes, direct writes) and infrastructure/maintenance budget.

## Procedure

### 1. Gather requirements

Ask only the questions that materially change the recommendation. Cover:

- user type: individual, team, company, product builder;
- corpus: code repo, research papers, docs folder, Obsidian vault, chat exports, web clips, PDFs, media transcripts;
- scale: rough number of sources/pages;
- update frequency and freshness needs;
- privacy: public, internal, sensitive, regulated;
- preferred agent: Claude Code, Codex, Cursor, OpenCode, GitHub Copilot, other;
- local-first and git requirements;
- write tolerance: read-only advisory, PR-based writes, direct writes;
- existing tools: Obsidian, GitHub, qmd, vector DB, GraphRAG, OpenWiki, custom scripts;
- budget for infrastructure and maintenance.

If the user already provided these facts, do not ask again.

### 2. Classify the case

Use this routing:

| Case | Default recommendation |
| --- | --- |
| Small personal vault, local-first | Markdown + git + agent skills + `rg`; add qmd later. |
| Code repository docs | OpenWiki-style repo wiki or custom docs-as-code workflow. |
| Existing Obsidian vault | Refactor in place with protected human sections and lint gates. |
| Team/company knowledge | PR-based agent writes, CODEOWNERS, permissions, lint reports. |
| Large retrieval-heavy corpus | Hybrid search or graph/RAG system, with wiki as compiled surface if human review matters. |
| Product/plugin idea | Custom architecture with provenance, staged review and safe writes from day one. |

### 3. Answer adoption objections before tool choice

If the user is still asking whether LLM-Wiki is worth it, invoke or summarize `llm-wiki-faq` before recommending tools.

Use the evidence hierarchy:

```text
direct LLM-Wiki evidence -> adjacent RAG/memory/context evidence -> local pilot metrics
```

Do not claim that adjacent GraphRAG/memory evidence proves every LLM-Wiki workflow will work.

### 4. Decide whether Obsidian is needed

Obsidian is optional.

Recommend Obsidian when:

- the user already uses it;
- human reading/editing of Markdown is central;
- backlinks, graph view and local note UX matter;
- the workflow is personal or research-heavy.

Do not require Obsidian when:

- the target is repository documentation;
- the team already uses docs-as-code and pull requests;
- the user wants minimal CLI/git workflow;
- the user only needs agent-readable context.

### 5. Re-verify current external options

Before recommending a current tool, browse and cite:

- official docs or repository README;
- recent commits/releases/issues when maturity matters;
- license;
- local/cloud inference support;
- output format and data portability;
- provenance/review features;
- install path and supported agents.

### 6. Score options

Score 1-5 across:

- fit to use case;
- local-first/data ownership;
- setup effort;
- maintenance burden;
- provenance/trust controls;
- agent compatibility;
- scaling path;
- reversibility/lock-in.

### 7. Recommend one path

Give a primary recommendation and one fallback. Avoid listing every possible tool as equal.

Use this output:

```markdown
## Recommendation

## Why this fits

## Evidence level

## Alternatives considered

| Option | Fit | Setup effort | Trust controls | Notes |
|---|---:|---:|---:|---|

## Setup plan

## Risks and review gates

## Next skill to run
```

## Decision rules

- Prefer a thin local-first workflow before adding databases.
- Prefer ready-made tools for repo documentation and demos.
- Prefer custom implementation only when trust, provenance, scale, UX or integration needs justify it.
- Prefer PR-based writes for teams.
- Do not recommend current project maturity from memory; browse.
- For skeptical users, recommend a 20-50 source pilot and `llm-wiki-eval` rather than a big migration.

## Output

A short markdown report following the section 7 template: `Recommendation`, `Why this fits`, `Evidence level`, an `Alternatives considered` table (Option / Fit / Setup effort / Trust controls / Notes), `Setup plan`, `Risks and review gates`, and `Next skill to run`.

## Safety gates

- Stop before suggesting cloud ingestion for sensitive material unless the user explicitly accepts it.
- Do not recommend direct-write agents for team knowledge without review gates.
- Mark uncertain tool claims as `verify-before-use`.
- Do not make Obsidian mandatory unless the user's workflow actually benefits from it.
