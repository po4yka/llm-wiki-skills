# Personal second brain domain pack

## Jobs

- Capture ideas and sources quickly.
- Preserve raw sources.
- Turn recurring questions into reusable pages.
- Protect human synthesis.

## Core page types

Use stable `type` values from `templates/schemas/page.schema.json`:

- `source`
- `concept`
- `entity`
- `query`
- `synthesis`

## Domain types

Use `domain_type` for specialization. The source of truth is `schema.overlay.json`.

| domain_type | core `type` | Use when |
|---|---|---|
| `evergreen-note` | `concept` | A durable idea or mechanism should accumulate over time. |
| `moc` | `synthesis` | A map-of-content page or domain overview is being curated. |
| `daily-note` | `query` | A dated capture/query page should preserve lightweight daily context. |

## Tags

- `personal`
- `research`
- `synthesis`
- `question`
- `evergreen`

## Recommended skills

```text
llm-wiki-capture-pipeline -> wiki-triage -> wiki-ingest -> wiki-query -> wiki-lint -> llm-wiki-eval
```

## Stale policy

- Personal synthesis: no automatic stale date.
- Tool/current claims: 30-90 days.
- Research sources: review during quarterly random-page audit.
