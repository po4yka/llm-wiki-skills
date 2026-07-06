# Weekly LLM-Wiki operations

## Goal

Keep the wiki healthy enough to trust.

## Checklist

- [ ] Ingest the most important trusted sources.
- [ ] Run `wiki-lint` and save a report.
- [ ] Review broken links, orphan pages and unsupported claims.
- [ ] File back reusable query answers.
- [ ] Refresh pages that reached `stale_after`.
- [ ] Check whether review backlog is growing.

## Agent prompt

```text
Use wiki-lint to create a weekly report under _agent/reports/. Do not resolve contradictions automatically.
```
