---
name: wiki-lint
description: Run structural and trust health checks for an LLM-Wiki vault. Use for broken links, orphan pages, missing provenance, stale claims, contradiction reports, taxonomy drift, protected-section edits, and review queue generation.
license: MIT
compatibility: Designed for Agent Skills-compatible coding agents. Requires filesystem access to a Markdown LLM-Wiki vault; git history improves protected-section and agent-edit checks.
metadata:
  author: po4yka
  version: "1.0.0"
  install_scope: self-contained
---

# Wiki Lint

## Goal

Detect structural decay, provenance gaps, stale claims and contradictions without silently rewriting truth.

## When to use

- The vault needs a structural or trust health check.
- Before large refactors or after bulk ingestion.
- A review queue should be generated from mechanical findings.

A filled final report ships in `assets/worked-example.md`.

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

### 1. Run deterministic checks

```bash
node scripts/wiki-lint-core.mjs <vault-path>
```

The bundled script is read-only and prints a draft report covering the mechanical checks. Do not re-derive these by hand; re-run the script instead:

- inventory: page counts by type/status, missing or malformed required frontmatter;
- links: broken wikilinks and relative links, orphan pages, pages with no outbound links, duplicate titles, near-duplicate slugs;
- provenance: generated or `reviewed`/`verified` factual pages without `source_paths`/`source_urls`, high-confidence pages with no source reference;
- trust: `ai_confidence < 0.70` without `review_required: true`, `review_required: false` on draft pages, `verified` pages past `stale_after`, ambiguous claim support outside review;
- taxonomy: unknown types/statuses, tags missing from `_meta/taxonomy.md`, unused taxonomy tags.

Use `--strict` in CI to fail on critical/high findings.

### 2. Add judgement-only checks

The script cannot see these; check them manually:

- pages changed since the last lint and pages without source backlinks in git history;
- protected human sections changed by recent agent commits;
- stale source hashes when available;
- generated pages that cite only other generated pages;
- pages missing from `wiki/index.md` that are likely important;
- spelling-variant and overbroad tags beyond exact taxonomy mismatches.

### 3. Contradiction checks

Look for tensions such as incompatible tool maturity claims, local-first vs cloud-only descriptions, stale landscape claims contradicting newer source pages, lifecycle status conflicts or incompatible defaults.

Report contradictions with evidence. Do not auto-resolve them.

### 4. Report

Start from the script's draft report, merge in the judgement-only and contradiction findings, and save it as `_agent/reports/YYYY-MM-DD-lint.md`:

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

## Output

A structured lint report saved to `_agent/reports/YYYY-MM-DD-lint.md`, using the section skeleton from step 4 (Summary, Critical issues, High-priority review queue, Broken links, Orphans, Provenance gaps, Stale pages, Contradictions, Taxonomy drift, Suggested patches, Metrics). Each finding names the affected page path and the check that raised it, tagged with a severity from the table below so a reviewer can triage top-down. Saving a report also appends a one-line entry to `wiki/log.md`; no other vault content is modified.

## Severity levels

| Severity | Meaning | Action |
| --- | --- | --- |
| critical | could corrupt trust or delete human work | stop and review |
| high | important provenance or contradiction issue | review soon |
| medium | structural decay | schedule cleanup |
| low | cosmetic or taxonomy cleanup | batch later |

## Safety gates

- Deterministic checks run through `node scripts/wiki-lint-core.mjs` are read-only; the script never edits vault files.
- Contradictions, stale claims and confidence conflicts are reported with evidence, never auto-resolved.
- Trivial broken-link fixes only run in apply mode when the user explicitly asks for it; every other write stays report-only.
- Deleting pages, rewriting synthesis pages, marking pages verified, and bulk frontmatter normalization without a dry run are out of scope for this skill.
- Every saved report is appended as an audit entry to `wiki/log.md`.
