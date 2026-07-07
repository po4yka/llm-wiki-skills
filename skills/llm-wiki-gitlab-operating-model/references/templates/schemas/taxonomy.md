# Taxonomy

> Purpose: controlled vocabulary for an LLM-Wiki vault.
> Canonical machine-readable source: `templates/schemas/canonical-vocabularies.json`.

## Core page types

Core `type` values are intentionally stable and shared across all domain packs.

- `source`
- `entity`
- `concept`
- `comparison`
- `synthesis`
- `query`
- `report`

## Domain page types

Domain packs must not extend the core `type` enum directly. Use `domain_type` for specialization and map every domain type back to one core type.

Examples:

| domain_type | core type |
|---|---|
| `decision` | `synthesis` |
| `module` | `entity` |
| `paper` | `source` |
| `competitor` | `entity` |
| `runbook` | `synthesis` |
| `signal` | `source` |

## Status values

- `draft`
- `reviewed`
- `verified`
- `stale`
- `archived`

## Claim types

- `extracted`
- `inferred`
- `ambiguous`
- `synthesis`
- `unsupported`
- `conflicting`

Use this same set for `claim_mix`, claim-anchor `Support:` lines and provenance reports. Do not substitute older labels such as `source-backed`, `wiki-backed` or `missing` in claim-support fields; those may be answer-evaluation labels, but they are not the claim-support taxonomy.

## Suggested top-level tags

- `llm-wiki`
- `second-brain`
- `retrieval`
- `provenance`
- `anti-slop`
- `tooling`
- `methodology`
- `implementation`
- `evaluation`

## Tag rules

- Prefer stable concepts over fleeting project names.
- Do not create near-synonyms without adding an alias note.
- Use page type and status fields instead of tags for lifecycle state.
- Use `domain_type` instead of tags when a domain-specific page class needs templates, stale policy or validation.
