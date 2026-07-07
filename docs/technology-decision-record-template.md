# Technology decision record template

> Status: draft
> Scope: review-gated decision record for adding retrieval, ingestion, MCP/API, evaluation, security or publishing infrastructure to an LLM-Wiki.

## Why this exists

LLM-Wiki stacks should not grow by shopping-list architecture. Add infrastructure only when a measured bottleneck exists and a rollback plan is clear.

Use this template before adding:

- vector databases;
- hybrid retrieval or GraphRAG;
- MCP/API servers;
- document conversion/OCR pipelines;
- hosted model/provider integrations;
- CI evaluation gates;
- publishing pipelines;
- security scanners that block releases.

## Template

```markdown
# Technology decision: <short title>

---
type: synthesis
domain_type: technology-decision
domain_pack: null
status: draft
created: YYYY-MM-DD
updated: YYYY-MM-DD
review_required: true
source_paths: []
source_urls: []
---

## Decision

## Trigger

What measured failure or user need triggered this decision?

## Baseline

- Current workflow:
- Current metric:
- Current pain:

## Options considered

| Option | Pros | Cons | Risks | Reversibility |
|---|---|---|---|---|

## Expected improvement

| Metric | Baseline | Target | Measurement method |
|---|---:|---:|---|

## Data and security boundaries

## Implementation plan

## Rollback plan

## Owner and review date

## Sources

## Follow-up eval
```

## Rules

1. A technology decision must name a trigger.
2. A technology decision must name a baseline metric, even if approximate.
3. A technology decision must name rollback criteria.
4. A technology decision must not make cloud data movement implicit.
5. A technology decision should be reviewed after the first real usage period.
