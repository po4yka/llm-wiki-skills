---
name: llm-wiki-domain-pack
description: Generate domain-specific LLM-Wiki templates, taxonomies, page types, stale policies, capture rules, and review gates. Use for research papers, codebase docs, startup research, trading research, personal second brain, team onboarding, competitive intelligence, or other specialized domains.
license: MIT
compatibility: Designed for Agent Skills-compatible coding agents. Requires write access only when creating templates or updating _meta files.
metadata:
  author: po4yka
  version: "0.1.0"
---

# LLM-Wiki Domain Pack

## Goal

Create a domain-specific starter pack that adapts the generic LLM-Wiki pattern to a concrete knowledge domain.

## Inputs

- Domain name and purpose.
- User type: personal, team, product, research, company.
- Corpus types and capture channels.
- Required page types and workflows.
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

### 2. Choose page types

Start from core types:

```text
source, entity, concept, comparison, synthesis, query, report
```

Add domain-specific types only when necessary, such as:

- `paper`;
- `experiment`;
- `strategy`;
- `decision`;
- `competitor`;
- `incident`;
- `customer-question`.

### 3. Create taxonomy

Define:

- allowed tags;
- entity classes;
- source classes;
- status/stale rules;
- claim types;
- review gates;
- capture channels.

### 4. Create templates

Produce templates for important page types with frontmatter and protected human synthesis sections.

### 5. Add skills guidance

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

## Page types

## Taxonomy

## Templates

## Capture and review policy

## Initial workflow
```

## Safety gates

- Do not create excessive page types before real use.
- Do not encode current volatile facts as taxonomy.
- Do not remove generic lifecycle states.
- Do not make domain templates look verified by default.
