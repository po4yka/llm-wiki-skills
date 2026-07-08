---
name: llm-wiki-provenance
description: Inspect and repair evidence links before adding stable IDs. Use when pages have unsupported claims, generated summaries cite other summaries, raw-source links are missing, support labels are wrong, or the user wants a provenance gap report; route deterministic ID insertion to llm-wiki-claim-anchors.
license: MIT
compatibility: Designed for Agent Skills-compatible coding agents. Requires read access to wiki and raw sources; write access is optional for patch mode.
metadata:
  author: po4yka
  version: "1.0.0"
  install_scope: self-contained
---

# LLM-Wiki Provenance

## Goal

Make important wiki claims traceable to raw sources or clearly mark them as unsupported, inferred, or ambiguous.

## When to use

- A page has claims with no visible link back to `raw/` sources or source pages.
- A generated summary cites another generated summary instead of an original source.
- Support labels (extracted, inferred, synthesis, unsupported) look wrong or are missing.
- The user asks for a provenance gap report before assigning stable IDs.
- Current-state or status claims need re-verified evidence rather than an assumed link.
- Do not use this skill to insert stable IDs; hand that off to `llm-wiki-claim-anchors`.

## Inputs

- Target pages or folders.
- `raw/` and `wiki/` locations.
- Existing source pages, hashes and frontmatter if present.
- Desired mode: report-only or patch.

## Procedure

### 1. Select provenance level

Use the smallest useful level:

| Level | Meaning |
| --- | --- |
| source-level | Page links to the source page or raw source. |
| claim-level | Individual claims link to supporting source sections or anchors. |
| audit-ready | Claims include source path, hash, date, model, confidence and review state. |

### 2. Extract claims

For each target page, identify factual claims, recommendations, current-state statements and synthesis claims.

Classify support:

```text
extracted | inferred | ambiguous | synthesis | unsupported | conflicting
```

Use `extracted` for claims directly stated in inspected sources. Use `synthesis` only for editorial conclusions drawn across sources; keep the source links visible.

### 3. Locate evidence

Search source pages and raw sources. Do not invent evidence. If evidence is not found, mark a gap instead of rewriting the claim.

### 4. Produce provenance patches

In patch mode, add backlinks near claims using the vault's preferred style. Examples:

```markdown
- Claim text. Source: [[sources/source-title#section]]
```

or frontmatter:

```yaml
source_paths:
  - raw/sources/example.md
```

### 5. Create a gap report

Group gaps by severity:

- high-impact unsupported claims;
- generated pages citing generated pages;
- stale current-state claims;
- inferred claims presented as extracted;
- ambiguous claims outside review queues.

## Output

```markdown
## Provenance summary

## Pages inspected

## Claims classified

## Provenance added or proposed

## Unsupported claims

## Conflicts and ambiguities

## Suggested next sources
```

## Safety gates

- Do not fabricate citations or anchors.
- Do not mark unsupported claims as verified.
- Do not silently rewrite claims to fit available evidence.
- Do not expose sensitive source excerpts unnecessarily.
- If evidence conflicts, hand off to `llm-wiki-conflict-resolver`.
