# llm-wiki-skills

Structured documentation and Claude Code skill specs for building a local-first, git-based LLM-Wiki / second-brain workflow.

This repository treats **LLM-Wiki** as a data-layer pattern:

```text
raw/  ->  wiki/  ->  AGENTS.md / CLAUDE.md / skills
```

The core idea is not to replace retrieval with notes. The core idea is to let an LLM compile raw sources into a persistent, human-readable, git-versioned wiki, while retrieval remains a tool for navigation and verification.

## What is included

| Path | Purpose |
|---|---|
| [`docs/00-index.md`](docs/00-index.md) | Reading map for the document set |
| [`docs/01-llm-wiki-canon.md`](docs/01-llm-wiki-canon.md) | Canonical model: layers, operations, invariants |
| [`docs/02-architecture.md`](docs/02-architecture.md) | Suggested vault architecture, metadata and lifecycle |
| [`docs/03-second-brain-methodology.md`](docs/03-second-brain-methodology.md) | How second-brain methods change in the LLM era |
| [`docs/04-anti-slop-and-trust.md`](docs/04-anti-slop-and-trust.md) | Safety boundary, provenance and anti-slop controls |
| [`docs/05-tooling-landscape.md`](docs/05-tooling-landscape.md) | Tooling landscape: Claude Code, Obsidian, OpenWiki, qmd, GraphRAG |
| [`docs/06-implementation-playbook.md`](docs/06-implementation-playbook.md) | Phased implementation plan for personal, team and product use |
| [`docs/07-skills-overview.md`](docs/07-skills-overview.md) | How the included skills fit together |
| [`docs/08-evaluation-and-metrics.md`](docs/08-evaluation-and-metrics.md) | Operational metrics and review checklists |
| [`docs/09-references.md`](docs/09-references.md) | Source map and re-verification list |
| [`skills/`](skills/) | Claude Code style skill specs for wiki operations |
| [`templates/`](templates/) | Starter AGENTS/CLAUDE files, wiki files and schema |

## Recommended start

1. Read [`docs/00-index.md`](docs/00-index.md).
2. Copy the relevant `skills/*/SKILL.md` files into your Claude Code skills location or adapt them to your agent runtime.
3. Initialize a vault using the structure in [`docs/02-architecture.md`](docs/02-architecture.md).
4. Use `wiki-triage` for inbox material, `wiki-ingest` for trusted sources, `wiki-query` for research answers and `wiki-lint` for periodic health checks.

## Safety principle

Automate **bookkeeping**, not belief.

The agent may maintain links, frontmatter, indexes, logs, drafts, MOCs, deduplication candidates and lint reports. Human review remains responsible for synthesis, acceptance of ambiguous claims and promotion from draft to reviewed/verified knowledge.

## Status

Draft knowledge base. The documents are intentionally source-aware but not a benchmarked implementation. Treat volatile landscape claims as prompts for re-verification before making product or dependency decisions.
