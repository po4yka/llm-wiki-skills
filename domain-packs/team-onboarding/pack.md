# Team onboarding domain pack

## Jobs

- Reduce onboarding time.
- Preserve team conventions and decision history.
- Make bus-factor knowledge inspectable.
- Route agents to the right repo docs and owners.

## Core page types

Use stable `type` values from `templates/schemas/page.schema.json`:

- `source`
- `entity`
- `concept`
- `synthesis`
- `query`
- `report`

## Domain types

Use `domain_type` for specialization. The source of truth is `schema.overlay.json`.

| domain_type | core `type` | Use when |
| --- | --- | --- |
| `decision` | `synthesis` | Team rationale or ADR-like history must be preserved. |
| `onboarding` | `synthesis` | A curated learning path or onboarding map is needed. |
| `runbook` | `synthesis` | A repeated operational workflow should be reusable. |
| `faq` | `query` | A recurring question should become durable team memory. |

## Tags

- `onboarding`
- `owner`
- `runbook`
- `decision`
- `team-convention`
- `review-required`

## Recommended skills

```text
llm-wiki-team-rollout -> llm-wiki-interview -> llm-wiki-adr-memory -> wiki-lint
```

## Stale policy

- Onboarding guides: 60 days.
- Runbooks: 30 days.
- Owner maps: 30 days.
