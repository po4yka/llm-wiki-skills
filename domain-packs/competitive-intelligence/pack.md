# Competitive intelligence domain pack

## Jobs

- Monitor external sources and competitors.
- Track claims by source and date.
- Refresh volatile facts.
- Produce concise landscape updates.

## Core page types

Use stable `type` values from `templates/schemas/page.schema.json`:

- `source`
- `entity`
- `comparison`
- `synthesis`
- `query`

## Domain types

Use `domain_type` for specialization. The source of truth is `schema.overlay.json`.

| domain_type | core `type` | Use when |
| --- | --- | --- |
| `competitor` | `entity` | A company, product or project needs accumulated competitive facts. |
| `product` | `entity` | A product surface needs its own source-backed page. |
| `claim` | `source` | A single external claim or signal should be preserved with provenance. |
| `signal` | `source` | A launch, pricing, hiring or market signal should be refreshed later. |

## Tags

- `competitive-intelligence`
- `competitor`
- `signal`
- `pricing`
- `launch`
- `source-refresh`
- `confidence-low`

## Recommended skills

```text
llm-wiki-news-radar -> llm-wiki-source-refresh -> llm-wiki-provenance -> llm-wiki-conflict-resolver
```

## Stale policy

- Launch/pricing/headcount/current-status claims: 7-30 days.
- Strategy synthesis: 30 days.
- Historical source pages: stable unless source disappears.
