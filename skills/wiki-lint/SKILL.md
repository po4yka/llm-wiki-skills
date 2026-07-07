---
name: wiki-lint
description: Run structural and trust health checks for an LLM-Wiki vault. Use for broken links, orphan pages, missing provenance, stale claims, contradiction reports, taxonomy drift, protected-section edits, and review queue generation.
license: MIT
compatibility: Designed for Agent Skills-compatible coding agents. Requires filesystem access to a Markdown LLM-Wiki vault; git history improves protected-section and agent-edit checks.
metadata:
  author: po4yka
  version: "0.2.0"
  install_scope: self-contained
---

# Wiki Lint

## Goal

Detect structural decay, provenance gaps, stale claims and contradictions without silently rewriting truth.

## Inputs

- `wiki/index.md`
- `wiki/log.md`
- all `wiki/**/*.md` pages
- `_meta/taxonomy.md`
- `_meta/schemas/*`
- optional git history

## Write permissions

Allowed:

- create reports under `_agent/reports/`;
- append to `wiki/log.md` when a report is created;
- propose patches;
- fix trivial broken links only when the user explicitly asks for apply mode.

Not allowed by default:

- resolve contradictions;
- rewrite synthesis pages;
- mark pages verified;
- delete pages;
- bulk-normalize frontmatter without a dry run.

## Procedure

### 1. Inventory

Collect total pages by type and status, pages missing required frontmatter, pages changed since last lint and pages without source backlinks.

### 2. Link checks

Report broken wikilinks, orphan pages, pages with no outbound links, duplicate titles, near-duplicate page slugs and pages missing from `wiki/index.md` but likely important.

### 3. Provenance checks

Report factual pages without `source_paths` or `source_urls`, high-confidence claims with no source reference, `reviewed`/`verified` pages with missing provenance, stale source hashes when available and generated pages that cite only other generated pages.

### 4. Trust checks

Report:

- `ai_confidence < 0.70` without `review_required: true`;
- `review_required: false` on draft pages;
- `verified` pages past `stale_after`;
- protected human sections changed by recent agent commits;
- ambiguous claims outside review queues.

### 5. Contradiction checks

Look for tensions such as incompatible tool maturity claims, local-first vs cloud-only descriptions, stale landscape claims contradicting newer source pages, lifecycle status conflicts or incompatible defaults.

Report contradictions with evidence. Do not auto-resolve them.

### 6. Taxonomy checks

Compare tags and page types against `_meta/taxonomy.md`. Report unknown tags, spelling variants, unused tags, overbroad tags and page type drift.

### 7. Report

Create a report like:

```markdown
# Wiki lint report: YYYY-MM-DD

## Summary

## Critical issues

## High-priority review queue

## Broken links

## Orphans

## Provenance gaps

## Stale pages

## Contradictions

## Taxonomy drift

## Suggested patches

## Metrics
```

Append to `wiki/log.md` if the report is saved.

## Severity levels

| Severity | Meaning | Action |
|---|---|---|
| critical | could corrupt trust or delete human work | stop and review |
| high | important provenance or contradiction issue | review soon |
| medium | structural decay | schedule cleanup |
| low | cosmetic or taxonomy cleanup | batch later |
