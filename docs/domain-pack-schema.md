# Domain pack schema consistency

> Status: draft
> Scope: how domain packs extend LLM-Wiki without changing the stable core page schema.

## Thesis

Domain packs should specialize workflows without changing the shared meaning of `type`.

Use this split:

```yaml
type: synthesis              # stable core type
domain_type: decision        # domain-specific specialization
domain_pack: codebase-docs   # overlay that defines the specialization
```

## Why this matters

The core schema powers generic skills such as `wiki-ingest`, `wiki-query`, `wiki-lint`, `llm-wiki-provenance` and `llm-wiki-eval`. If every domain adds new `type` values, those skills must learn every domain taxonomy before they can perform basic operations.

Keeping `type` stable gives agents predictable behavior. `domain_type` gives users domain vocabulary.

## Core type contract

The shared `type` enum is:

```text
source, entity, concept, comparison, synthesis, query, report
```

These values describe agent behavior and storage expectations.

| Core type | Generic meaning |
| --- | --- |
| `source` | A page grounded in one or more raw sources. |
| `entity` | A person, org, product, project, dataset or module-like thing. |
| `concept` | A reusable idea, method, mechanism or abstraction. |
| `comparison` | A structured comparison across options or entities. |
| `synthesis` | A reviewed or draft conclusion across sources. |
| `query` | A saved question/answer or reusable research result. |
| `report` | A generated audit, lint, eval or operational report. |

## Domain overlay contract

Every pack under `domain-packs/<name>/` must include:

```text
domain-packs/<name>/
  pack.md
  schema.overlay.json
```

`schema.overlay.json` maps each domain-specific type to a core type:

```json
{
  "$schema": "../../templates/schemas/domain-pack.schema.json",
  "name": "codebase-docs",
  "version": "0.1.0",
  "core_types": ["source", "entity", "concept", "comparison", "synthesis", "query", "report"],
  "domain_type_mappings": {
    "decision": "synthesis",
    "module": "entity",
    "how-to": "synthesis"
  },
  "recommended_tags": ["architecture", "module", "tests"],
  "stale_policy": {
    "module-map": "30 days or after major refactor"
  },
  "recommended_skills": ["llm-wiki-repo-docs", "wiki-lint"]
}
```

## Validation

Run:

```bash
npm run validate:domain-packs
```

This checks that:

- every domain pack has `pack.md` and `schema.overlay.json`;
- the overlay name matches its folder;
- `core_types` values come from the shared page schema;
- every `domain_type` maps to one core type;
- `domain_type` does not duplicate a core type;
- recommended tags are normalized;
- recommended skills exist.

`npm run validate` includes this check.

## Adding a new domain type

1. Choose the closest core type.
2. Add the domain type to `domain_type_mappings`.
3. Document it in `pack.md` under `## Domain types`.
4. Add or update templates that set both `type` and `domain_type`.
5. Run `npm run validate:domain-packs`.

## Anti-patterns

- Adding `decision`, `paper`, `runbook` or `competitor` directly to the global `type` enum.
- Using tags to represent lifecycle state or page class.
- Creating domain types without templates, stale policy or review rules.
- Letting generated domain pages default to `verified`.
