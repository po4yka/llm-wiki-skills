---
name: llm-wiki-source-refresh
description: Re-check stale or time-sensitive LLM-Wiki sources and create refresh reports or review patches. Use when stale_after is reached, current ecosystem facts may have changed, links are dead, or wiki pages need source freshness review.
license: MIT
compatibility: Designed for Agent Skills-compatible coding agents with web browsing for current sources. Requires write access only for report or patch mode.
metadata:
  author: po4yka
  version: "0.1.0"
---

# LLM-Wiki Source Refresh

## Goal

Refresh stale source-backed claims without silently rewriting truth.

## Inputs

- Target pages, source pages or lint report.
- `stale_after`, `updated`, `source_urls` and `source_paths` fields.
- Desired mode: report-only, patch proposal or approved patch.

## Procedure

### 1. Identify stale targets

Find pages where:

- `stale_after` is in the past;
- source URLs no longer resolve;
- current ecosystem/tool claims are older than the user's freshness window;
- `wiki-lint` reported stale or unsupported claims.

### 2. Re-check sources

For current external claims, browse and cite fresh primary sources. For local sources, compare file hashes when available.

### 3. Classify change

Use:

| Status | Meaning |
|---|---|
| unchanged | Existing claim still appears supported. |
| updated | Source changed but conclusion remains close. |
| contradicted | Fresh source conflicts with wiki claim. |
| missing | Source unavailable or evidence not found. |
| needs-human | Interpretation requires review. |

### 4. Create refresh report

Use `templates/reports/source-refresh-report.md` when available.

### 5. Propose patches

Only propose patches by default. Mark contradicted or missing evidence for human review.

## Output

```markdown
## Source refresh summary

## Pages checked

## Fresh sources used

## Claims unchanged

## Claims updated

## Claims contradicted or missing

## Proposed patches

## Review required
```

## Safety gates

- Always browse for current external facts.
- Do not silently rewrite verified pages.
- Do not treat generated summaries as fresh sources.
- Do not auto-resolve contradictions.
- Do not refresh sensitive sources through external services without approval.
