---
name: llm-wiki-archive
description: Prepare an LLM-Wiki for long-term durability and archival. Use when the user wants a wiki to remain readable in 5-10+ years, export opaque stores, preserve raw sources, rebuild indexes, vendor key references, or create an archive manifest.
license: MIT
compatibility: Designed for Agent Skills-compatible coding agents. Requires read access to the wiki; write access is optional for archive manifests and snapshots.
metadata:
  author: po4yka
  version: "1.0.0"
  install_scope: self-contained
---

# LLM-Wiki Archive

## Goal

Make an LLM-Wiki durable, portable and reconstructable over long time horizons.

## When to use

- The user wants a wiki to remain readable and rebuildable 5-10+ years from now, without depending on today's tooling.
- The user is exporting a vault to a git tag, zip/tarball, static export, offline drive, or public archive.
- The user needs to know whether an opaque store (vector DB, generated index) is safe to treat as source of truth or must be excluded/rebuilt.
- The user wants an `ARCHIVE.md` manifest documenting what's included, what's excluded, and how to rebuild indexes from Markdown/raw sources.
- The user is auditing portability risks such as external links without local copies, attachments outside the vault, or unsupported formats.

## Inputs

- Vault/repository path.
- Desired archive target: git tag, zip/tarball, static export, offline drive, public archive.
- Retention and privacy constraints.
- Existing generated indexes or databases.

## Procedure

### 1. Identify source of truth

Classify artifacts:

| Artifact | Archive role |
| --- | --- |
| Markdown files | Primary human-readable source. |
| raw sources/assets | Primary evidence. |
| schemas/taxonomy | Rebuild instructions. |
| generated indexes | Rebuildable cache. |
| vector DBs | Usually exclude or export manifest only. |
| logs/reports | Audit history. |

### 2. Check portability

Look for:

- opaque databases as only source of truth;
- external links without local copy or citation;
- attachments outside the vault;
- unsupported file formats;
- generated pages without source references;
- missing schema files.

### 3. Create archive manifest

Recommended `ARCHIVE.md` sections:

```markdown
# Archive manifest

## Snapshot date

## Included folders

## Excluded generated caches

## How to read

## How to rebuild indexes

## Known gaps

## Integrity checks
```

### 4. Add integrity metadata

Generate or recommend hashes for raw sources, important pages and exported bundles.

### 5. Define rebuild steps

Document how to recreate search indexes, vector stores, generated reports and site output from Markdown/raw sources.

## Output

```markdown
## Archive summary

## Source-of-truth map

## Portability risks

## Manifest created or proposed

## Rebuild instructions

## Integrity checks
```

## Safety gates

- Do not archive secrets or sensitive material into broadly shared bundles.
- Do not treat generated indexes as irreplaceable source of truth.
- Do not delete external copies while creating an archive.
- Do not rely on proprietary exports without Markdown/raw fallback.
- Treat manifest creation as report-only by default: propose the `ARCHIVE.md` draft and the include/exclude lists for review before writing anything to disk.
- Re-verify integrity hashes against the live vault before citing an older archive snapshot as current.
