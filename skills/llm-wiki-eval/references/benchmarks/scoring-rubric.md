# LLM-Wiki pilot scoring rubric

Score each answer 0-2 per dimension.

| Dimension | 0 | 1 | 2 |
|---|---|---|---|
| Correctness | wrong or unsupported | partly correct | correct and well-supported |
| Provenance | no source support | page-level support | claim/source-level support |
| Completeness | misses core issue | partial | answers the actual question |
| Time-to-context | no improvement | modest improvement | clear context recovery |
| Reusability | one-off | maybe reusable | saved or clearly reusable |
| Actionability | vague | some next step | clear next action |

## Decision thresholds

| Average score | Decision |
|---:|---|
| 0.0-0.9 | Pause or redesign. |
| 1.0-1.4 | Continue only with targeted fixes. |
| 1.5-1.7 | Continue pilot and improve provenance/retrieval. |
| 1.8-2.0 | Expand usage. |

## Required metrics

- retrieval hit rate;
- answer reuse rate;
- review backlog;
- stale verified pages;
- unsupported high-impact claims;
- output beyond vault.
