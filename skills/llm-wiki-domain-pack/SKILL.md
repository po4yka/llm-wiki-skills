---
name: llm-wiki-domain-pack
description: Generate domain-specific LLM-Wiki templates, taxonomies, domain_type mappings, stale policies, capture rules, and review gates. Use for research papers, codebase docs, startup research, trading research, personal second brain, team onboarding, competitive intelligence, or other specialized domains.
license: MIT
compatibility: Designed for Agent Skills-compatible coding agents. Requires write access only when creating templates or updating _meta files.
metadata:
  author: po4yka
  version: "1.0.0"
  install_scope: self-contained
---

# LLM-Wiki Domain Pack

## Goal

Create a domain-specific starter pack that adapts the generic LLM-Wiki pattern to a concrete knowledge domain while preserving the stable core page schema.

## When to use

- Bootstrapping a new LLM-Wiki install for a specialized corpus (research papers, codebase docs, trading research, competitive intelligence, onboarding) that has no existing domain pack.
- Adding domain-specific `domain_type` mappings, taxonomy, or stale/review policy to a wiki that currently only has the generic core types.
- A user asks for capture rules, review gates, or templates tailored to one domain rather than the generic core schema.
- Not for ingesting a single document or answering a query — use `wiki-ingest` or `wiki-query` for that instead.

## Inputs

- Domain name and purpose.
- User type: personal, team, product, research, company.
- Corpus types and capture channels.
- Required core page types and domain-specific specializations.
- Risk level and review needs.

## Procedure

### 1. Define domain jobs

Ask what the wiki should help produce:

- decisions;
- reports;
- strategies;
- onboarding;
- code changes;
- literature reviews;
- market maps;
- trading theses;
- public documentation.

### 2. Keep core `type` stable

Start from the shared core types:

```text
source, entity, concept, comparison, synthesis, query, report
```

Do **not** add domain-specific values such as `paper`, `decision`, `competitor` or `runbook` directly to `type`. Use `domain_type` instead.

### 3. Map domain types to core types

Add domain-specific types only when necessary and map each one to a stable core type:

| domain_type | core `type` | Example use |
| --- | --- | --- |
| `paper` | `source` | A paper or preprint preserved as a source page. |
| `experiment` | `synthesis` | A reviewed experiment note or result summary. |
| `strategy` | `synthesis` | A strategy memo or durable conclusion. |
| `decision` | `synthesis` | ADR-like decision provenance. |
| `competitor` | `entity` | Company/product/project tracking. |
| `incident` | `report` | Incident review or postmortem. |
| `customer-question` | `query` | Reusable customer/problem question. |

### 4. Create `pack.md`

Every domain pack must include `pack.md`. It is the human-readable contract that explains jobs, stable core page types, domain types, tags, recommended skills and stale policy.

Required sections:

```markdown
# <Domain> domain pack

## Jobs

## Core page types

## Domain types
```

Do not ship only machine-readable JSON; `pack.md` is what humans and agents review first.

### 5. Create `schema.overlay.json`

Every domain pack should include:

```json
{
  "$schema": "../../templates/schemas/domain-pack.schema.json",
  "name": "example-domain",
  "version": "0.1.0",
  "core_types": ["source", "entity", "concept", "synthesis", "query"],
  "domain_type_mappings": {
    "decision": "synthesis"
  },
  "recommended_tags": [],
  "stale_policy": {},
  "recommended_skills": []
}
```

Validate the JSON against the schema if the target repository provides one. In a single-skill install, treat this as a structural review: `name` matches the pack directory, core types stay within the stable enum, and every `domain_type` maps to one core type.

### 6. Create optional `profile.json`

Use `profile.json` when the pack should provide application instructions for downstream vault setup. Validate it against `references/templates/schemas/domain-pack-profile.schema.json` when available, or mirror the same fields in a single-skill install:

```json
{
  "name": "example-domain",
  "version": "0.1.0",
  "copy_to": "_meta/domain-packs/example-domain/",
  "recommended_workflow": ["wiki-ingest", "wiki-lint"],
  "templates": [
    {
      "source": "templates/wiki/concept-page.md",
      "target": "wiki/concepts/concept-template.md"
    }
  ],
  "initial_prompts": [
    "Use llm-wiki-doctor to inspect this vault in report-only mode."
  ]
}
```

Profiles are reviewable instructions, not automatic migrations.

### 7. Create taxonomy

Define:

- allowed tags;
- entity classes;
- source classes;
- domain_type values;
- status/stale rules;
- claim types;
- review gates;
- capture channels.

### 8. Create templates

Produce templates for important domain types with frontmatter that preserves both layers:

```yaml
type: synthesis
domain_type: decision
domain_pack: codebase-docs
status: draft
review_required: true
```

### 9. Add skills guidance

Recommend which skills to use first:

- `llm-wiki-capture-pipeline`;
- `wiki-triage`;
- `wiki-ingest`;
- `wiki-query`;
- `wiki-lint`;
- `llm-wiki-eval`.

## Output

```markdown
## Domain pack summary

## Domain jobs

## Core page types

## Domain type mappings

## Taxonomy

## Templates

## Capture and review policy

## Validation

## Initial workflow
```

## Safety gates

- Do not create excessive page types before real use.
- Do not extend the core `type` enum for one domain; use `domain_type`.
- Do not encode current volatile facts as taxonomy.
- Do not remove generic lifecycle states.
- Do not make domain templates look verified by default.
- Re-verify any pricing, release, version, or other time-sensitive fact against fresh sources before writing it into a template or taxonomy entry.
