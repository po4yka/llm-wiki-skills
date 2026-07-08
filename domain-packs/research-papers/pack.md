# Research papers domain pack

## Jobs

- Preserve papers as raw sources.
- Extract methods, claims, datasets and limitations.
- Compare papers across a research question.
- Maintain literature review synthesis.

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
| `paper` | `source` | One paper or preprint is preserved and summarized. |
| `method` | `concept` | A reusable method, architecture or algorithm recurs across papers. |
| `dataset` | `entity` | A dataset, benchmark or corpus needs accumulated facts. |

## Tags

- `paper`
- `method`
- `benchmark`
- `dataset`
- `limitation`
- `open-question`

## Recommended skills

```text
wiki-ingest -> llm-wiki-provenance -> wiki-query -> llm-wiki-eval
```

## Stale policy

- Paper summaries: stable.
- Literature review synthesis: 90 days.
- Benchmark landscape: 30-60 days.
