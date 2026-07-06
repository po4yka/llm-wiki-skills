# wiki-lint

Use this skill for periodic health checks of an LLM-Wiki vault.

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

Collect:

- total pages by type;
- pages by status;
- pages missing required frontmatter;
- pages changed since last lint;
- pages without source backlinks.

### 2. Link checks

Report:

- broken wikilinks;
- orphan pages with zero inbound links;
- pages with no outbound links;
- duplicate titles;
- near-duplicate page slugs;
- pages missing from `wiki/index.md` but likely important.

### 3. Provenance checks

Report:

- factual pages without `source_paths` or `source_urls`;
- high-confidence claims with no source reference;
- `status: reviewed` or `verified` pages with missing provenance;
- stale source hashes when available;
- generated pages that cite only other generated pages.

### 4. Trust checks

Report:

- `ai_confidence < 0.70` without `review_required: true`;
- `review_required: false` on draft pages;
- `verified` pages past `stale_after`;
- protected human sections changed by recent agent commits;
- ambiguous claims outside review queues.

### 5. Contradiction checks

Look for tensions such as:

- one concept page says a tool is local-first while another says cloud-only;
- stale landscape claims contradict newer source pages;
- lifecycle status conflicts with page content;
- two pages recommend incompatible defaults.

Contradictions should be reported with evidence. Do not auto-resolve.

### 6. Taxonomy checks

Compare tags and types against `_meta/taxonomy.md`.

Report:

- unknown tags;
- spelling variants;
- unused tags;
- overbroad tags;
- page type drift.

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

Append to `wiki/log.md`:

```markdown
## [YYYY-MM-DD] lint | wiki health check

- Report: _agent/reports/YYYY-MM-DD-lint.md
- Critical issues:
- Review queue:
```

## Severity levels

| Severity | Meaning | Action |
|---|---|---|
| critical | could corrupt trust or delete human work | stop and review |
| high | important provenance or contradiction issue | review soon |
| medium | structural decay | schedule cleanup |
| low | cosmetic or taxonomy cleanup | batch later |

## Quality checklist

- [ ] Report created.
- [ ] No truth conflict silently resolved.
- [ ] Protected sections checked.
- [ ] Provenance gaps surfaced.
- [ ] Review queue prioritized.
- [ ] `log.md` appended if the report was saved.
