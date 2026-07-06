# Monthly LLM-Wiki operations

## Goal

Measure whether the wiki is useful and prune visible decay.

## Checklist

- [ ] Run `llm-wiki-eval` on one domain or recent work.
- [ ] Check retrieval hit rate and answer reuse rate.
- [ ] Refresh or mark stale pages.
- [ ] Merge or archive low-value duplicates.
- [ ] Review taxonomy drift.
- [ ] Check whether infrastructure is justified by actual bottlenecks.

## Agent prompt

```text
Use llm-wiki-eval for the last 30 days. Produce a report with a continue, improve or redesign recommendation.
```
