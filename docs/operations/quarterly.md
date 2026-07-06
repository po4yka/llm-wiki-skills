# Quarterly LLM-Wiki operations

## Goal

Keep the knowledge base small enough to trust and useful enough to return to.

## Checklist

- [ ] Open 20 random wiki pages and score usefulness.
- [ ] Review top domains and archive inactive areas.
- [ ] Audit claim-level provenance for high-impact pages.
- [ ] Refresh domain packs and taxonomy.
- [ ] Review installed skills and run `llm-wiki-skill-doctor`.
- [ ] Review release/update policy for the skills pack.

## Agent prompt

```text
Use llm-wiki-eval and llm-wiki-trust-audit for a quarterly review. Produce a prioritized improvement plan.
```
