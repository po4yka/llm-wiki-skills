---
name: llm-wiki-claim-anchors
description: Insert deterministic claim and source anchor IDs after evidence has been inspected. Use when the user wants stable claim IDs, source anchor IDs, support-label formatting, anchor validation, or reproducible claim references; route missing-evidence investigation to llm-wiki-provenance.
license: MIT
compatibility: Designed for Agent Skills-compatible coding agents. Requires read access to wiki/raw sources; write access is optional for patch mode.
metadata:
  author: po4yka
  version: "0.1.0"
---

# LLM-Wiki Claim Anchors

## Goal

Add stable, auditable claim and source anchors to important wiki pages.

## Inputs

- Target wiki pages or folders.
- Raw sources or source pages.
- Desired mode: report-only or patch.
- Existing provenance conventions if present.

## Procedure

### 1. Read the convention

Use `references/docs/provenance/claim-anchors.md` when available.

Default format:

```markdown
- Claim text. ^claim-YYYYMMDD-001
  - Support: extracted
  - Source: `raw/sources/example.md` ^src-YYYYMMDD-001
```

### 2. Select claims

Prioritize:

- high-impact recommendations;
- current-state claims;
- claims used in synthesis;
- claims marked verified/reviewed;
- claims found by `llm-wiki-provenance`.

### 3. Classify support

Use:

```text
extracted | inferred | ambiguous | synthesis | unsupported | conflicting
```

Do not upgrade unsupported claims to inferred just to make the page look complete.

### 4. Add anchors

In patch mode:

- preserve wording unless the user asks for edits;
- add claim anchors near the claim;
- add source anchors near supporting source references;
- avoid changing human-owned synthesis except to add explicit provenance notes when approved.

### 5. Validate

Run or recommend:

```bash
node scripts/validate-claim-anchors.mjs <wiki-or-file-path>
```

### 6. Report gaps

Create or update a provenance report for unsupported, ambiguous or conflicting claims.

## Output

```markdown
## Claim anchor summary

## Pages inspected

## Anchors added or proposed

## Unsupported claims

## Ambiguous or conflicting claims

## Validation result

## Review required
```

## Safety gates

- Do not fabricate source anchors.
- Do not edit the meaning of a claim while adding anchors.
- Do not mark claims verified.
- Do not expose sensitive source excerpts unnecessarily.
- Do not add anchors to human-owned sections without approval.
