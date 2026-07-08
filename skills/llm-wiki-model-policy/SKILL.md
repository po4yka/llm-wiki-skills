---
name: llm-wiki-model-policy
description: Define model and data-use policy for LLM-Wiki workflows. Use when the user asks which models/providers can process which sources, what must stay local, how to split cheap/heavy models, or how to record model provenance in wiki frontmatter.
license: MIT
compatibility: Designed for Agent Skills-compatible coding agents. Browse current provider docs before making current retention, privacy, pricing, or API claims.
metadata:
  author: po4yka
  version: "1.0.0"
  install_scope: self-contained
---

# LLM-Wiki Model Policy

## Goal

Create a practical model/data policy for ingest, query, lint, capture and publication workflows.

## When to use

- The user asks which models or providers are allowed to process a given wiki source or folder.
- The user wants to decide what must stay local-only versus what can go to a cloud model.
- The user is setting up or revising the cheap/local vs. heavy/cloud model split across ingest, triage, synthesis, query, lint and embedding tasks.
- The user asks how to record model provenance (which model produced a page) in wiki frontmatter.
- The user needs escalation rules for low-confidence outputs or sensitive raw sources before publication.

## Inputs

- Data sensitivity and domain.
- Current model providers and local models.
- Tasks: triage, ingest, query, synthesis, lint, embedding, reranking.
- Privacy, legal, cost and latency constraints.

## Procedure

### 1. Classify data

Use:

```text
public | internal | sensitive | regulated | unknown
```

Map folders and capture channels to these classes.

### 2. Classify tasks

Separate:

- capture cleanup;
- triage;
- source extraction;
- synthesis;
- query answering;
- linting;
- embeddings;
- reranking;
- publishing.

### 3. Assign model tiers

Create a matrix:

| Data class | Task | Allowed model/provider | Local required | Notes |
| --- | --- | --- | --- | --- |

Use local-only defaults for sensitive or unknown material unless the user explicitly approves another policy.

### 4. Record provenance

Recommend frontmatter fields:

```yaml
ai_model: ""
agent_version: ""
ai_confidence: 0.0
processed_at: YYYY-MM-DD
model_policy: local-only|cloud-allowed|redacted-cloud|unknown
```

### 5. Define escalation rules

Examples:

- cheap/local model for triage;
- stronger model for synthesis;
- human review for low confidence;
- no cloud for sensitive raw sources;
- redact before cloud when allowed.

### 6. Re-verify current provider claims

Browse official provider docs for current retention, privacy, pricing, model availability and API behavior when those facts matter.

## Output

```markdown
## Model policy summary

## Data classes

## Task/model matrix

## Local-only boundaries

## Frontmatter requirements

## Escalation rules

## Claims to re-verify
```

## Safety gates

- Do not assume provider privacy or retention rules from memory.
- Do not route sensitive data to cloud models without explicit approval.
- Do not hide model provenance for generated pages.
- Do not optimize cost at the expense of trust boundaries.
