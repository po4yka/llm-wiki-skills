# Worked example: ingest a small trusted source

## Input

`raw/sources/example-source.md`:

````markdown
# Example source

A living LLM-Wiki preserves raw sources, creates reviewable summaries, saves
useful answers back into durable pages and runs periodic lint checks.
````

## Output: generated source page

`wiki/sources/example-source.md`:

````markdown
---
title: Example source
type: source
status: draft
created: 2026-07-08
updated: 2026-07-08
source_paths:
  - raw/sources/example-source.md
ai_generated: true
ai_confidence: 0.62
review_required: true
tags: [llm-wiki]
---

# Example source

## Abstract

Describes the maintenance loop of a living LLM-Wiki: preserved raw sources,
reviewable summaries, answer file-back and periodic lint checks.

## Key extracted claims

- A living LLM-Wiki preserves raw sources. (`extracted`)
- Reusable answers are saved back into durable pages. (`extracted`)
- Periodic lint checks keep the wiki healthy. (`extracted`)

## Entities

- none

## Concepts

- [[living-wiki]] (`inferred`: the source describes the loop without naming it)

## Ambiguities and caveats

- none

## Open questions

- What lint cadence fits this vault?

## Links created

- `wiki/index.md` entry under Sources
````

## Output: ingest summary (chat)

````markdown
## Ingest summary

- Created: `wiki/sources/example-source.md`
- Updated: `wiki/index.md`, `wiki/log.md`
- Needs review: yes
- Ambiguous claims: none
- Suggested next sources: none
````

## Invariants shown

- `raw/sources/example-source.md` remains unchanged.
- The generated page stays `status: draft` with `review_required: true`.
- Claim labels use the shared support vocabulary (`extracted`, `inferred`, ...).
