# Worked example: answer and file back

## Input

Question: "What does a living LLM-Wiki need to stay healthy?"

## Output: answer (chat)

A living LLM-Wiki needs preserved raw sources, reviewable summaries, file-back
of reusable answers, periodic lint checks, and separation between extracted
claims and inferred synthesis (`extracted` from
`raw/sources/example-source.md`).

## Output: filed-back page

`wiki/queries/2026-07-08-living-wiki-health.md`:

````markdown
---
title: What a living LLM-Wiki needs to stay healthy
type: query
status: draft
created: 2026-07-08
updated: 2026-07-08
source_paths:
  - raw/sources/example-source.md
ai_generated: true
review_required: true
---

# What a living LLM-Wiki needs to stay healthy

## Answer

- Preserved raw sources. (`extracted`)
- Reviewable summaries. (`extracted`)
- File-back of reusable answers. (`extracted`)
- Periodic lint checks. (`extracted`)
- Separation of extracted claims from inferred synthesis. (`inferred`)

## Evidence used

- `raw/sources/example-source.md`
````

## Invariants shown

- The answer distinguishes `extracted` from `inferred` support.
- The filed page is a draft with `review_required: true`.
- The answer never claims generated pages are verified.
