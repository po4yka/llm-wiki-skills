# LLM-Wiki knowledge base index

> Status: draft
> Scope: navigation map for this repository's LLM-Wiki documentation and skills.

## Thesis

LLM-Wiki is best understood as a **compiled knowledge layer** between immutable raw sources and agent/user queries. It is not a replacement for search or RAG; it is a durable, human-readable layer that makes repeated research compound.

## Reading paths

### Fast path: first run

1. [`quickstart.md`](quickstart.md)
2. [`skill-router.md`](skill-router.md)
3. [`07-skills-overview.md`](07-skills-overview.md)

### Fast path: personal workflow

1. [`01-llm-wiki-canon.md`](01-llm-wiki-canon.md)
2. [`12-evidence-and-faq.md`](12-evidence-and-faq.md)
3. [`02-architecture.md`](02-architecture.md)
4. [`04-anti-slop-and-trust.md`](04-anti-slop-and-trust.md)
5. [`06-implementation-playbook.md`](06-implementation-playbook.md)
6. [`07-skills-overview.md`](07-skills-overview.md)

### Builder path: tool or plugin

1. [`01-llm-wiki-canon.md`](01-llm-wiki-canon.md)
2. [`12-evidence-and-faq.md`](12-evidence-and-faq.md)
3. [`05-tooling-landscape.md`](05-tooling-landscape.md)
4. [`04-anti-slop-and-trust.md`](04-anti-slop-and-trust.md)
5. [`08-evaluation-and-metrics.md`](08-evaluation-and-metrics.md)
6. [`09-references.md`](09-references.md)
7. [`domain-pack-schema.md`](domain-pack-schema.md)
8. [`release-policy.md`](release-policy.md)

### Reviewer path: risk and trust

1. [`12-evidence-and-faq.md`](12-evidence-and-faq.md)
2. [`04-anti-slop-and-trust.md`](04-anti-slop-and-trust.md)
3. [`08-evaluation-and-metrics.md`](08-evaluation-and-metrics.md)
4. [`domain-pack-schema.md`](domain-pack-schema.md)
5. [`security/skill-supply-chain.md`](security/skill-supply-chain.md)
6. [`provenance/claim-anchors.md`](provenance/claim-anchors.md)

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
| [`10-skill-system-roadmap.md`](10-skill-system-roadmap.md) | Product roadmap for the Agent Skills distribution pack. |
| [`11-use-case-skill-catalog.md`](11-use-case-skill-catalog.md) | Catalog of advanced use-case skills. |
| [`12-evidence-and-faq.md`](12-evidence-and-faq.md) | Evidence-backed arguments and FAQ answers for adoption questions. |
| [`domain-pack-schema.md`](domain-pack-schema.md) | Core `type` and domain `domain_type` schema contract. |
| [`quickstart.md`](quickstart.md) | Ten-minute first-run guide. |
| [`skill-router.md`](skill-router.md) | Decision tree for choosing the right skill. |
| [`skills-catalog.md`](skills-catalog.md) | Human-readable skill catalog generated from package metadata. |
| [`release-policy.md`](release-policy.md) | Versioning and release rules. |
| [`provenance/claim-anchors.md`](provenance/claim-anchors.md) | Claim-level provenance convention. |
| [`security/skill-supply-chain.md`](security/skill-supply-chain.md) | Security review guide for installing and authoring skills. |
| [`agents/README.md`](agents/README.md) | Adapter docs for Claude Code, Codex, Cursor and OpenCode. |
| [`operations/daily.md`](operations/daily.md) | Daily living-wiki checklist. |

## Core vocabulary

- **Raw source**: immutable source material: articles, transcripts, PDFs, web captures, images or datasets.
- **Wiki page**: generated or curated Markdown page that summarizes, links or synthesizes raw sources.
- **Schema layer**: `AGENTS.md`, `CLAUDE.md`, skills, schemas and conventions that define how agents work with the wiki.
- **Bookkeeping**: links, frontmatter, indexes, logs, status fields, deduplication and lint reports.
- **Human synthesis**: the part of knowledge work that must remain explicitly reviewed by a human.
- **Compiled knowledge**: the persistent result of repeated ingestion and synthesis, rather than query-time retrieval only.

## Repository design stance

The default target is a local-first, git-versioned vault. Heavy retrieval and graph infrastructure is treated as an upgrade path, not as day-one scaffolding.
