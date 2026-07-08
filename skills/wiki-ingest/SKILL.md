---
name: wiki-ingest
description: Convert trusted raw sources into reviewable LLM-Wiki pages. Use when adding PDFs, articles, transcripts, notes, repository docs, web captures, or other source material into a raw/wiki/schema vault while preserving provenance, ambiguity, links, index updates, and log entries.
license: MIT
compatibility: Designed for Agent Skills-compatible coding agents. Requires filesystem access to a Markdown LLM-Wiki vault; git is recommended for reviewable edits.
metadata:
  author: po4yka
  version: "1.0.0"
  install_scope: self-contained
---

# Wiki Ingest

## Goal

Convert raw source material into reviewable wiki updates while preserving provenance, uncertainty and human-owned synthesis.

## When to use

- A trusted raw source (PDF, article, transcript, notes, repo doc, web capture) should become reviewable wiki pages.
- Sorted inbox material was approved for ingestion after `wiki-triage`.

Route unsorted captures to `wiki-triage` first. A filled input-to-output example ships in `assets/worked-example.md`.

## Inputs

- One or more files under `raw/` or `inbox/`.
- Optional user goal: why the source matters.
- Existing `wiki/index.md` and `wiki/log.md`.
- Existing `AGENTS.md`, `CLAUDE.md` and schemas if present.

## Write permissions

Allowed:

- create/update `wiki/sources/*`;
- create/update `wiki/entities/*`;
- create/update `wiki/concepts/*`;
- create/update `wiki/comparisons/*` when explicitly useful;
- append to `wiki/log.md`;
- update `wiki/index.md`;
- write low-confidence material to `_agent/drafts/` or mark it `review_required: true`.

Not allowed unless explicitly requested:

- edit `raw/` files;
- delete source material;
- overwrite `## My synthesis` or human-owned sections;
- mark generated pages as `verified`;
- perform bulk rewrites unrelated to the source.

## Procedure

### 1. Read the schema layer

Inspect `AGENTS.md`, `CLAUDE.md`, `_meta/taxonomy.md`, `_meta/schemas/*` and `wiki/index.md` when present.

### 2. Analyze before writing

Produce a short analysis plan before editing:

```markdown
## Ingest analysis

- Source path:
- Source type:
- Likely page type:
- Candidate entities:
- Candidate concepts:
- Possible existing pages to update:
- Ambiguities:
- Review risks:
```

### 3. Extract claims

Classify claims using the shared support vocabulary:

- `extracted`: directly present in the source;
- `inferred`: reasoned from the source;
- `ambiguous`: plausible but unresolved, requires human review;
- `synthesis`: editorial conclusion — human-owned, do not generate during ingest;
- `unsupported`: no inspected source currently supports the claim;
- `conflicting`: inspected sources disagree about the claim.

Do not collapse competing claims into a single conclusion. Search the vault for existing pages on the same entities or concepts and re-verify each extracted claim against the raw source before writing it, so newly generated pages do not silently contradict already-verified material.

### 4. Write source page

Recommended source page structure:

```markdown
---
type: source
status: draft
source_paths: []
ai_generated: true
ai_confidence: 0.0
review_required: true
---

# Source title

## Abstract

## Key extracted claims

## Entities

## Concepts

## Inferred implications

## Ambiguities and caveats

## Open questions

## Links created
```

### 5. Update entity and concept pages

When updating existing pages:

- preserve human-owned sections;
- append or patch rather than rewrite entire pages;
- keep source backlinks near the claims they support;
- mark inferred claims explicitly.

### 6. Update navigation

Update `wiki/index.md` only with pages important for navigation.

Append to `wiki/log.md`:

```markdown
## [YYYY-MM-DD] ingest | <source title>

- Raw source: <path>
- Pages created:
- Pages updated:
- Review required:
- Open questions:
```

## Final report

End with:

```markdown
## Ingest summary

- Created:
- Updated:
- Needs review:
- Ambiguous claims:
- Suggested next sources:
```

## Output

Ingestion produces new or updated Markdown pages under `wiki/sources/`, `wiki/entities/`, `wiki/concepts/`, and optionally `wiki/comparisons/`, plus an updated `wiki/index.md` entry and a matching log line in `wiki/log.md`. Each run ends with the `## Ingest summary` report shown above, listing created pages, updated pages, items needing review, and open questions.

## Safety gates

Stop and ask for review if:

- the source conflicts with existing verified pages;
- the source is too large and would require truncation;
- source provenance is missing;
- confidence is low for high-impact claims;
- edits would touch protected human sections.
