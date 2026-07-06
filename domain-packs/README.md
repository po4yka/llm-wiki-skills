# Domain packs

Domain packs adapt the generic LLM-Wiki pattern to concrete use cases without changing the core page schema.

For the full contract, read [`../docs/domain-pack-schema.md`](../docs/domain-pack-schema.md).

## Schema rule

Core `type` values stay stable:

```text
source, entity, concept, comparison, synthesis, query, report
```

Domain-specific page classes use `domain_type` and must be declared in each pack's `schema.overlay.json`.

Example:

```yaml
type: synthesis
domain_type: decision
domain_pack: codebase-docs
```

Validate all packs with:

```bash
npm run validate:domain-packs
```

## Packs

| Pack | Use case | Overlay |
|---|---|---|
| `personal-second-brain` | Personal research, notes and durable synthesis. | `personal-second-brain/schema.overlay.json` |
| `codebase-docs` | Agent-readable repository documentation. | `codebase-docs/schema.overlay.json` |
| `research-papers` | Literature review and paper synthesis. | `research-papers/schema.overlay.json` |
| `team-onboarding` | Team knowledge, onboarding and bus factor reduction. | `team-onboarding/schema.overlay.json` |
| `startup-market-research` | Market maps, competitors, insights and strategy. | `startup-market-research/schema.overlay.json` |
| `competitive-intelligence` | External landscape tracking and source refresh. | `competitive-intelligence/schema.overlay.json` |

Use `llm-wiki-domain-pack` to customize these packs for a user's domain.
