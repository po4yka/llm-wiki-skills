# References and re-verification map

> Status: draft
> Scope: source families behind this documentation and claims that should be re-verified before product decisions.
> Current as of: 2026-07-07

## Source families

This document set synthesizes:

- the consolidated LLM-Wiki / second-brain reference document supplied for this work;
- Andrej Karpathy's LLM-Wiki idea file;
- wiki memory and OpenWiki discussions from the LangChain ecosystem;
- Claude Code / AGENTS.md / Skills style schema-layer practices;
- GraphRAG and graph-memory ideas;
- Obsidian and local-first knowledge-base practice;
- implementation lessons from local-first LLM-Wiki-like projects;
- general docs-as-code and review-gate practices.

## Canonical pattern sources

- Andrej Karpathy, `llm-wiki.md` idea file.
- LangChain, wiki memory / OpenWiki posts and repository.
- AGENTS.md open format.
- Claude Code documentation on project memory, instructions and skills.

## Related technical families

- RAG and hybrid retrieval.
- GraphRAG and graph-based retrieval.
- Agent memory systems such as file-based memory, graph memory and vector-backed memory.
- Obsidian-style local Markdown vaults.
- Docs-as-code workflows using git, schema validation and review gates.

## Implementation references to inspect before adopting

These are useful as patterns, not as guaranteed dependencies:

- OpenWiki-style repo documentation agents.
- Local-first Obsidian / LLM-Wiki tools.
- qmd-style hybrid local retrieval.
- SQLite + FTS / sqlite-vec style local indexes.
- LanceDB or other embedded vector stores for larger systems.
- Graph-based memory projects for confidence-typed relationships.

## Claims to re-verify before decisions

Do not make product or architecture decisions from stale landscape facts. Re-check:

- repository activity and maintenance status;
- license compatibility;
- provider support and local-inference support;
- release stability;
- issue backlog and data-loss reports;
- whether a project preserves manual edits;
- whether it provides provenance beyond source-level summaries;
- whether it supports incremental hashing and safe rollback;
- whether it stores data in human-readable Markdown or a black-box database.

## Volatile claims policy

Avoid exact star counts, recent release dates and pricing in durable docs unless the same PR includes a fresh verification note.

Use this wording when unsure:

```markdown
> verify-before-use: This project appears relevant, but current maturity and maintenance status must be checked before adoption.
```

## Suggested source note template

```markdown
# Source: <title>

## Bibliographic data

- URL:
- Author / org:
- Date published:
- Date captured:
- Captured by:

## Why this source matters

## Extracted claims

## Inferred implications

## Ambiguities

## Pages updated
```

## Open research gaps

The most valuable unresolved areas for LLM-Wiki tooling:

1. Claim-level provenance that is usable in Markdown.
2. Review UX for low-confidence generated knowledge.
3. Safe reconciliation without summary drift.
4. Benchmarks for long-term knowledge-base quality.
5. Tooling that preserves human edits by default.
6. Reliable evaluation of retrieval hit rate and downstream reuse.
