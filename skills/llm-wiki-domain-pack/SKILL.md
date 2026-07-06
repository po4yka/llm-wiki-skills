---
name: llm-wiki-domain-pack
description: Generate domain-specific LLM-Wiki templates, taxonomies, domain_type mappings, stale policies, capture rules, and review gates. Use for research papers, codebase docs, startup research, trading research, personal second brain, team onboarding, competitive intelligence, or other specialized domains.
license: MIT
compatibility: Designed for Agent Skills-compatible coding agents. Requires write access only when creating templates or updating _meta files.
metadata:
  author: po4yka
  version: "0.2.0"
---

# LLM-Wiki Domain Pack

## Goal

Create a domain-specific starter pack that adapts the generic LLM-Wiki pattern to a concrete knowledge domain while preserving the stable core page schema.

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
|---|---|---|
| `paper` | `source` | A paper or preprint preserved as a source page. |
| `experiment` | `synthesis` | A reviewed experiment note or result summary. |
| `strategy` | `synthesis` | A strategy memo or durable conclusion. |
| `decision` | `synthesis` | ADR-like decision provenance. |
| `competitor` | `entity` | Company/product/project tracking. |
| `incident` | `report` | Incident review or postmortem. |
| `customer-question` | `query` | Reusable customer/problem question. |

### 4. Create `schema.overlay.json`

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

Run or recommend:

```bash
npm run validate:domain-packs
```

### 5. Create taxonomy

Define:

- allowed tags;
- entity classes;
- source classes;
- domain_type values;
- status/stale rules;
- claim types;
- review gates;
- capture channels.

### 6. Create templates

Produce templates for important domain types with frontmatter that preserves both layers:

```yaml
type: synthesis
domain_type: decision
domain_pack: codebase-docs
status: draft
review_required: true
```

### 7. Add skills guidance

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
