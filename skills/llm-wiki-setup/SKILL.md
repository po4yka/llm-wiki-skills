---
name: llm-wiki-setup
description: Install, configure, and connect a chosen LLM-Wiki workflow. Use for setting up a raw/wiki/schema vault, Agent Skills, coding-agent integration, Obsidian/local-first workflows, hooks, templates, or git review; route a guided first-demo walkthrough to llm-wiki-zero-to-working-wiki.
license: MIT
compatibility: Designed for Agent Skills-compatible coding agents. Requires filesystem access for local setup; may require internet access for installing external tools.
metadata:
  author: po4yka
  version: "1.0.0"
  install_scope: self-contained
---

# LLM-Wiki Setup

## Goal

Turn a chosen LLM-Wiki recommendation into a working setup with safe defaults.

## When to use

- The user has already picked a target vault/architecture and wants it turned into a working setup (directories, templates, skills installed).
- Configuring `AGENTS.md`/`CLAUDE.md`, hooks, or git/PR review policy for an LLM-Wiki workflow.
- Connecting a coding agent (Claude Code, Codex, Cursor, OpenCode) to Agent Skills so `wiki-ingest`/`wiki-query`/`wiki-lint` work.
- Migrating an existing Obsidian vault or repository docs tree into the raw/wiki/schema model.
- Not for a guided first-demo walkthrough with no prior architecture decision — route that to `llm-wiki-zero-to-working-wiki` instead.

## Inputs

- Chosen solution or target architecture.
- Project/vault path.
- Target agent(s): Claude Code, Codex, Cursor, OpenCode, etc.
- Privacy/local-first constraints.
- Existing docs or empty start.

## Procedure

### 1. Confirm the setup target

Identify one target:

- local-first Markdown vault;
- existing Obsidian vault;
- repository documentation wiki;
- qmd/hybrid-search upgrade;
- team PR-based workflow;
- custom product/CLI/plugin.

If the target is an external tool, browse official installation docs before giving commands.

### 2. Preflight

Check or ask for:

- git initialized;
- backup or branch available;
- package managers available;
- agent skill installation target;
- whether writes should be direct, dry-run, or PR-based;
- sensitive material that must not leave the machine.

### 3. Create the vault shape

Default structure:

```text
raw/sources/
raw/assets/
inbox/
wiki/index.md
wiki/log.md
wiki/sources/
wiki/entities/
wiki/concepts/
wiki/comparisons/
wiki/synthesis/
wiki/queries/
_agent/reports/
_meta/schemas/
```

Start `wiki/index.md` and `wiki/log.md` from the bundled `references/templates/wiki/` starters; prefer the target repository's own vault templates when they already exist.

### 4. Install skills

For Agent Skills-compatible agents, use commands like:

```bash
npx skills add po4yka/llm-wiki-skills --skill '*' -a claude-code
npx skills add po4yka/llm-wiki-skills --skill wiki-ingest --skill wiki-query -a codex
```

Use project scope when the skills should be committed with a repo; use global scope when the user wants them across projects.

### 5. Configure instructions

Create or update `AGENTS.md` and `CLAUDE.md`, starting from `references/templates/vault/AGENTS.md` and `references/templates/vault/CLAUDE.md`, keeping:

- raw/wiki/schema model;
- protected human sections;
- prompt-injection defense;
- git/dry-run policy;
- index/log update rules;
- allowed write scope.

### 6. Add safety checks

Recommend, and implement only with approval:

- git branch before migration;
- frontmatter validation;
- dry-run mode for bulk changes;
- pre-write checks for `raw/` and protected sections;
- `wiki-lint` report after setup.

### 7. Verify

Run a tiny end-to-end test:

1. Put one sample source in `raw/sources/` or `inbox/`.
2. Run `wiki-triage` or `wiki-ingest`.
3. Run `wiki-query` against the result.
4. Run `wiki-lint` and inspect the report.

## Output

Deliver the summary in chat; the persisted artifacts are the created vault files and installed skills.

```markdown
## Setup summary

## Files created or changed

## Install commands used

## Safety settings

## Verification result

## Next action
```

## Safety gates

- Do not run remote install scripts without explaining what they do.
- Do not ingest sensitive data into cloud tools without explicit approval.
- Do not enable bulk direct writes before git and backup are confirmed.
- Do not combine setup with large migration unless the user requested it.
