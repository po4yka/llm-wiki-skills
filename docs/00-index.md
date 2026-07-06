# LLM-Wiki knowledge base index

> Status: draft
> Scope: navigation map for this repository's LLM-Wiki documentation and skills.

## Thesis

LLM-Wiki is best understood as a **compiled knowledge layer** between immutable raw sources and agent/user queries. It is not a replacement for search or RAG; it is a durable, human-readable layer that makes repeated research compound.

## Reading paths

### Fast path: personal workflow

1. [`01-llm-wiki-canon.md`](01-llm-wiki-canon.md)
2. [`02-architecture.md`](02-architecture.md)
3. [`04-anti-slop-and-trust.md`](04-anti-slop-and-trust.md)
4. [`06-implementation-playbook.md`](06-implementation-playbook.md)
5. [`07-skills-overview.md`](07-skills-overview.md)

### Builder path: tool or plugin

1. [`01-llm-wiki-canon.md`](01-llm-wiki-canon.md)
2. [`05-tooling-landscape.md`](05-tooling-landscape.md)
3. [`04-anti-slop-and-trust.md`](04-anti-slop-and-trust.md)
4. [`08-evaluation-and-metrics.md`](08-evaluation-and-metrics.md)
5. [`09-references.md`](09-references.md)

### Reviewer path: risk and trust

1. [`04-anti-slop-and-trust.md`](04-anti-slop-and-trust.md)
2. [`08-evaluation-and-metrics.md`](08-evaluation-and-metrics.md)
3. [`03-second-brain-methodology.md`](03-second-brain-methodology.md)

## Document map

| Document | Role |
|---|---|
| [`01-llm-wiki-canon.md`](01-llm-wiki-canon.md) | Defines the pattern: raw/wiki/schema, index/log, ingest/query/lint. |
| [`02-architecture.md`](02-architecture.md) | Gives a concrete vault layout, metadata model and lifecycle. |
| [`03-second-brain-methodology.md`](03-second-brain-methodology.md) | Separates useful second-brain methods from methods that become brittle under automation. |
| [`04-anti-slop-and-trust.md`](04-anti-slop-and-trust.md) | Describes the failure modes that decide whether the wiki becomes useful or becomes organized misinformation. |
| [`05-tooling-landscape.md`](05-tooling-landscape.md) | Places LLM-Wiki among RAG, GraphRAG, OpenWiki, Claude Code, Obsidian and local retrieval tools. |
| [`06-implementation-playbook.md`](06-implementation-playbook.md) | Turns the theory into phases and operating rules. |
| [`07-skills-overview.md`](07-skills-overview.md) | Explains the provided `skills/*/SKILL.md` procedures. |
| [`08-evaluation-and-metrics.md`](08-evaluation-and-metrics.md) | Defines success metrics, lint checks and review gates. |
| [`09-references.md`](09-references.md) | Lists source families and claims that must be re-verified before decisions. |

## Core vocabulary

- **Raw source**: immutable source material: articles, transcripts, PDFs, web captures, images or datasets.
- **Wiki page**: generated or curated Markdown page that summarizes, links or synthesizes raw sources.
- **Schema layer**: `AGENTS.md`, `CLAUDE.md`, skills, schemas and conventions that define how agents work with the wiki.
- **Bookkeeping**: links, frontmatter, indexes, logs, status fields, deduplication and lint reports.
- **Human synthesis**: the part of knowledge work that must remain explicitly reviewed by a human.
- **Compiled knowledge**: the persistent result of repeated ingestion and synthesis, rather than query-time retrieval only.

## Repository design stance

The default target is a local-first, git-versioned vault. Heavy retrieval and graph infrastructure is treated as an upgrade path, not as day-one scaffolding.
