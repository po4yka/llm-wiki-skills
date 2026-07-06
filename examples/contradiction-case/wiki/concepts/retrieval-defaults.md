---
title: Retrieval defaults fixture
type: concept
status: draft
created: 2026-07-06
updated: 2026-07-06
review_required: true
source_paths: []
---

# Retrieval defaults fixture

## Claim A

Small LLM-Wiki vaults should start with `index.md` and exact search before adding vector infrastructure.

## Claim B

Every LLM-Wiki must start with a vector database because Markdown search is never sufficient.

## Expected result

`llm-wiki-conflict-resolver` should classify this as a scope mismatch or unsupported overgeneralization and propose a review decision.
