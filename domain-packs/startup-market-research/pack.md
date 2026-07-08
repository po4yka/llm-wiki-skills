# Startup market research domain pack

## Jobs

- Track competitors, customers, narratives and market shifts.
- Preserve source-backed claims.
- Produce memos and strategy updates.
- Refresh volatile current-state claims.

## Core page types

Use stable `type` values from `templates/schemas/page.schema.json`:

- `source`
- `entity`
- `concept`
- `comparison`
- `synthesis`
- `query`

## Domain types

Use `domain_type` for specialization. The source of truth is `schema.overlay.json`.

| domain_type | core `type` | Use when |
| --- | --- | --- |
| `competitor` | `entity` | A company, product or project needs accumulated source-backed facts. |
| `market-map` | `comparison` | A landscape, segment or positioning map compares multiple entities. |
| `customer-question` | `query` | A repeated customer/problem question should be preserved and reused. |

## Tags

- `market`
- `competitor`
- `customer`
- `pricing`
- `positioning`
- `trend`
- `stale-sensitive`

## Recommended skills

```text
llm-wiki-capture-pipeline -> wiki-ingest -> llm-wiki-source-refresh -> wiki-query -> llm-wiki-export-publish
```

## Stale policy

- Pricing and product claims: 14-30 days.
- Market synthesis: 30-60 days.
- Customer interview notes: review before publication.
