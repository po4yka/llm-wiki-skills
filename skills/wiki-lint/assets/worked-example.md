# Worked example: final lint report

The final report merges the `scripts/wiki-lint-core.mjs` draft with the
judgement-only and contradiction checks, and is saved as
`_agent/reports/2026-07-08-lint.md`:

````markdown
# Wiki lint report: 2026-07-08

## Summary

- pages scanned: 12
- findings: 6 (critical: 1, high: 2, medium: 1, low: 1, judgement: 1)

## Critical issues

- [critical] wiki/concepts/agent-memory.md: ai_confidence 0.55 < 0.7 without review_required: true

## High-priority review queue

- [high] wiki/sources/vendor-post.md: verified page past stale_after (2026-05-01)
- [high] wiki/entities/tool-x.md: broken wikilink [[tool-x-benchmarks]]

## Broken links

- [high] wiki/entities/tool-x.md: broken wikilink [[tool-x-benchmarks]]

## Orphans

- [medium] wiki/concepts/spare-note.md: not referenced by any page or wiki/index.md

## Provenance gaps

- none found

## Stale pages

- [high] wiki/sources/vendor-post.md: verified page past stale_after (2026-05-01)

## Contradictions

- wiki/entities/tool-x.md describes Tool X as local-first; wiki/comparisons/stacks.md lists it as cloud-only. Both cited; not auto-resolved.

## Taxonomy drift

- [low] wiki/concepts/spare-note.md: tag 'notes' not in _meta/taxonomy.md

## Suggested patches

- Demote wiki/sources/vendor-post.md to status: stale pending source refresh.
- Fix or remove the [[tool-x-benchmarks]] link.

## Metrics

- type source: 5
- type concept: 4
- type entity: 3
- trust findings: 3
````

## Invariants shown

- The contradiction is reported with evidence, not auto-resolved.
- Patches are proposed, not applied.
- Mechanical findings keep the `[severity] path: message` shape produced by the script.
