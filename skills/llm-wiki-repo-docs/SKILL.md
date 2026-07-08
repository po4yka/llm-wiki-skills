---
name: llm-wiki-repo-docs
description: Build or maintain an LLM-Wiki for codebase documentation. Use when the user wants agent-readable repo docs, architecture maps, module pages, ADR links, OpenWiki-style output, or AGENTS.md/CLAUDE.md pointer patterns for Claude Code, Codex, Cursor, or other coding agents.
license: MIT
compatibility: Designed for Agent Skills-compatible coding agents. Requires repository filesystem access; PR-based writes are recommended for team repos.
metadata:
  author: po4yka
  version: "1.0.0"
  install_scope: self-contained
---

# LLM-Wiki Repo Docs

## Goal

Create or improve a repository LLM-Wiki that helps coding agents understand and modify the codebase safely.

## When to use

- The user asks for an LLM-Wiki, agent-readable repo docs, or architecture maps for a codebase.
- Setting up or refreshing `AGENTS.md`/`CLAUDE.md` pointer patterns for Claude Code, Codex, Cursor, or similar coding agents.
- Module/package maps or ADR links have gone stale after a major refactor and need a maintenance pass.
- Preparing OpenWiki-style repo documentation for a team repo where changes should land via PR.

## Inputs

- Repository path.
- Existing docs, README, ADRs, package manifests and project instructions.
- Target agent(s).
- Desired mode: plan, apply, or PR-ready changes.

## Procedure

### 1. Inspect repository shape

Identify:

- languages and package managers;
- major modules/services/packages;
- tests and build commands;
- existing docs and ADRs;
- current `AGENTS.md`/`CLAUDE.md`;
- generated docs folders that should not be edited.

### 2. Choose output location

Use one of:

```text
wiki/          general LLM-Wiki docs
openwiki/      OpenWiki-style repo docs
_docs/wiki/    if project docs live under docs
```

Do not mix repo docs with personal second-brain material.

### 3. Generate repo wiki map

Create or update pages for:

- architecture overview;
- module/package index;
- data flow;
- build/test/deploy map;
- common change workflows;
- conventions and gotchas;
- ADR/decision history;
- agent entrypoints.

### 4. Use pointer pattern

Keep `AGENTS.md`/`CLAUDE.md` short. Add pointers to wiki pages instead of embedding large docs.

Example:

```markdown
For architecture and module maps, read `wiki/index.md` first.
```

### 5. Add maintenance loop

Recommend:

- `wiki-lint` after major refactors;
- scheduled docs health check;
- PR-based documentation updates;
- CODEOWNERS for important domains;
- stale markers for generated architecture pages.

## Output

```markdown
## Repo docs summary

## Pages created or proposed

## Instruction-file updates

## Architecture gaps

## Maintenance plan

## Next skill
```

## Safety gates

- Do not claim code behavior without checking source files.
- Do not overwrite hand-written ADRs.
- Do not put secrets or internal URLs in broadly readable docs.
- Do not generate direct commits to team repos when PR workflow is expected.
- Re-verify architecture and module descriptions against current source files before publishing pages, since generated maps drift quickly after refactors.
