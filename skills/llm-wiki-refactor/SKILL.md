---
name: llm-wiki-refactor
description: Refactor an existing document set, docs folder, research archive, Obsidian vault, repository documentation, or messy note collection into an LLM-Wiki structure. Use for migration planning, dry-run organization, frontmatter normalization, raw/wiki separation, link repair, and review-safe restructuring.
license: MIT
compatibility: Designed for Agent Skills-compatible coding agents. Requires filesystem access; git or a backup is required before applying changes.
metadata:
  author: po4yka
  version: "0.1.0"
  install_scope: self-contained
---

# LLM-Wiki Refactor

## Goal

Reorganize existing documents into a safe LLM-Wiki without losing provenance, breaking links, or overwriting human synthesis.

## Inputs

- Existing docs/vault/repository path.
- Desired target: personal vault, repo wiki, team knowledge base or product prototype.
- Whether changes should be dry-run only or applied.
- Existing conventions: folders, tags, frontmatter, wikilinks, docs generator.

## Procedure

### 1. Preflight

Before applying changes:

- confirm git or backup exists;
- identify generated vs human-authored content;
- identify sensitive data;
- detect Obsidian wikilinks and attachments;
- find existing indexes, READMEs, ADRs, changelogs and source folders.

If no backup/git exists, produce a migration plan only.

### 2. Inventory

Produce counts by file type and rough category:

- raw sources;
- source summaries;
- entity/concept pages;
- project docs;
- decisions/ADRs;
- query-like notes;
- assets;
- unknown or mixed files.

### 3. Propose target mapping

Default mapping:

```text
original raw documents -> raw/sources/
images/media/assets    -> raw/assets/
source summaries       -> wiki/sources/
people/orgs/tools      -> wiki/entities/
mechanisms/ideas       -> wiki/concepts/
trade-off docs         -> wiki/comparisons/
reviewed conclusions   -> wiki/synthesis/
chat/research answers  -> wiki/queries/
```

### 4. Create a dry-run plan

Do not move files immediately. Produce:

```markdown
## Migration plan

| Current path | Proposed path | Page type | Confidence | Notes |
|---|---|---|---:|---|
```

Flag low-confidence moves and protected pages.

### 5. Apply in batches only when approved

When the user approves apply mode:

- create a branch;
- move files in small batches;
- preserve links and attachments;
- add or normalize frontmatter;
- create `wiki/index.md` and `wiki/log.md` if missing;
- run `wiki-lint` after each batch.

### 6. Preserve human synthesis

Detect and preserve sections such as:

- `## My synthesis`
- `## Opinion`
- `## Notes to self`
- `<!-- human-owned:start -->`

Do not rewrite these sections. Add protected markers if useful.

## Output

```markdown
## Refactor summary

## Inventory

## Proposed structure

## Migration table

## High-risk items

## Commands or file operations

## Post-migration lint findings
```

## Safety gates

- No deletion without explicit confirmation.
- No apply mode without git or backup.
- No silent conversion of wikilinks to Markdown links.
- No flattening of raw sources into summaries.
- No bulk frontmatter migration without dry-run.
