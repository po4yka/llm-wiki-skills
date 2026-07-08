---
name: llm-wiki-obsidian-hardening
description: Harden an Obsidian vault for coding-agent and LLM-Wiki workflows. Use when the user wants Claude Code, Codex, Cursor, or other agents to edit an Obsidian vault without breaking wikilinks, attachments, frontmatter, sync, or human-owned synthesis.
license: MIT
compatibility: Designed for Agent Skills-compatible coding agents. Requires filesystem access to an Obsidian vault; git or backup is required before write mode.
metadata:
  author: po4yka
  version: "1.0.0"
  install_scope: self-contained
---

# LLM-Wiki Obsidian Hardening

## Goal

Make an Obsidian vault safer for agent-assisted LLM-Wiki work.

## When to use

- Before letting a coding agent edit an Obsidian vault for the first time.
- When wikilinks, embeds, or attachment folders keep breaking after agent edits.
- When setting up `AGENTS.md`/`CLAUDE.md` boundaries for a vault used with LLM-Wiki workflows.
- When a vault syncs via iCloud, Syncthing, or Obsidian Sync and index or WAL files risk corruption.
- Before running bulk edits or migrations across vault notes.

## Inputs

- Obsidian vault path.
- Desired mode: audit-only or apply.
- Sync method if known.
- Existing plugins and conventions if relevant.

## Procedure

### 1. Preflight

Check:

- git or backup exists;
- `.obsidian/` is present;
- attachment folders and embedded files;
- wikilink style;
- frontmatter style;
- existing `AGENTS.md`/`CLAUDE.md`;
- sync tool and local cache/index files;
- re-verify the vault's current file state immediately before applying changes, since sync tools may have modified files since the initial scan.

### 2. Protect Obsidian semantics

Ensure instructions say:

- preserve `[[wikilinks]]` unless user asks otherwise;
- do not rewrite embeds `![[...]]`;
- do not move attachments without link repair;
- do not `cat` the whole vault;
- use `rg` or Obsidian CLI when available;
- preserve comments, aliases and YAML quoting.

### 3. Add LLM-Wiki boundaries

Recommend or add:

```text
raw/
wiki/
inbox/
_meta/
_agent/
```

Add protected section markers around human synthesis when useful.

### 4. Harden writes

Suggest:

- dry-run for bulk edits;
- git branch for migrations;
- frontmatter validation;
- no edits under `raw/`;
- `wiki-lint` after large changes;
- local-only handling for sensitive notes.

### 5. Sync and index policy

Flag dangerous patterns:

- syncing SQLite WAL/SHM files;
- syncing HNSW/vector index files;
- using multiple sync systems on one vault;
- treating generated indexes as source of truth.

Prefer per-device indexes and reconstructable caches.

## Output

```markdown
## Obsidian hardening summary

## Vault risks

## Recommended instruction updates

## Link and attachment policy

## Sync/index policy

## Proposed patches

## Next skill
```

## Safety gates

- Do not alter `.obsidian/` settings without explicit approval.
- Do not rewrite wikilinks to Markdown links.
- Do not move attachments without link repair.
- Do not apply hardening changes without git or backup.
