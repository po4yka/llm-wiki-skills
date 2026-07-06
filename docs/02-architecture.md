# Architecture

> Status: draft
> Scope: concrete local-first architecture for an LLM-Wiki vault.

## Thesis

Start with Markdown, git, `rg`, an index and explicit review states. Add heavier retrieval only when the wiki outgrows the context map.

## Recommended vault layout

```text
vault/
  raw/
    sources/             # immutable text captures, PDFs, transcripts
    assets/              # screenshots, images, diagrams, audio exports
  wiki/
    index.md             # content map; read first
    log.md               # append-only activity log
    sources/             # one page per source
    entities/            # people, orgs, products, projects, places
    concepts/            # reusable abstractions and mechanisms
    comparisons/         # trade-off matrices and landscape reviews
    synthesis/           # reviewed higher-level conclusions
    queries/             # durable answers worth saving
  inbox/                 # append-only capture; agent triages later
  _meta/
    schemas/             # JSON Schema or equivalent frontmatter contracts
    taxonomy.md          # allowed tags, types and facets
  _agent/
    drafts/              # low-confidence generated pages
    reports/             # lint and triage reports
  AGENTS.md
  CLAUDE.md
```

## Ownership boundaries

| Area | Agent rights | Human responsibility |
|---|---|---|
| `raw/` | Read only | Capture, retention, deletion decisions |
| `inbox/` | Read and propose triage | Decide what is worth keeping |
| `wiki/sources/` | Create/update summaries | Check important claims |
| `wiki/entities/` and `wiki/concepts/` | Maintain links and extracted claims | Approve synthesis and framing |
| `wiki/synthesis/` | Draft proposals | Own the final interpretation |
| `_agent/reports/` | Write freely | Review periodically |
| `_meta/` | Propose schema changes | Approve schema changes |

## Page types

| Type | Folder | Purpose |
|---|---|---|
| `source` | `wiki/sources/` | Summary of one raw source with provenance. |
| `entity` | `wiki/entities/` | Accumulated facts about a person, org, product or project. |
| `concept` | `wiki/concepts/` | Reusable mechanism or idea. |
| `comparison` | `wiki/comparisons/` | Structured trade-off analysis. |
| `synthesis` | `wiki/synthesis/` | Higher-level reviewed conclusion. |
| `query` | `wiki/queries/` | Saved answer from a research session. |
| `report` | `_agent/reports/` | Lint, triage or audit output. |

## Frontmatter contract

Use explicit lifecycle and provenance fields. Keep it boring and machine-checkable.

```yaml
id: "20260706-example-page"
title: "Example page"
type: concept
status: draft                  # draft|reviewed|verified|stale|archived
created: 2026-07-06
updated: 2026-07-06
source_paths:
  - raw/sources/example.md
source_urls: []
source_hashes: []
ai_generated: true
ai_model: ""
ai_confidence: 0.0             # 0.0-1.0; do not default to 0.5
claim_mix:
  extracted: 0.0
  inferred: 0.0
  ambiguous: 0.0
review_required: true
last_linted: null
stale_after: null
tags: []
```

## Lifecycle

```text
inbox -> draft -> reviewed -> verified
              \-> stale -> archived
```

- `draft`: generated or newly captured, not yet trusted.
- `reviewed`: a human reviewed structure and important claims.
- `verified`: key claims are anchored to sources and recently checked.
- `stale`: time-sensitive claims need refresh.
- `archived`: retained for history but not active guidance.

## Source model

A wiki page should never be the sole source of truth for a factual claim. At minimum, maintain source-level backlinks. For high-impact knowledge, use claim-level anchors.

Recommended source page sections:

```markdown
# Source title

## Source metadata

## Abstract

## Key extracted claims

## Entities

## Concepts

## Contradictions or tensions

## Open questions

## Links created
```

## Index model

`wiki/index.md` is not a table of contents generated from the filesystem. It is a semantic map.

Each line should tell the agent why a page matters:

```markdown
- [[concepts/context-engineering]] — just-in-time selection of working context for agents.
- [[comparisons/llm-wiki-vs-rag]] — explains when compiled wiki beats query-time retrieval.
```

## Log model

`wiki/log.md` is append-only. It should be greppable by date and operation:

```markdown
## [2026-07-06] lint | weekly wiki health check

- Reports: _agent/reports/2026-07-06-lint.md
- Broken links: 3
- Orphans: 7
- Claims requiring review: 5
```

## Retrieval tiers

| Scale | Default retrieval | Upgrade trigger |
|---|---|---|
| 0-100 sources | `index.md` + `rg` | Index no longer fits comfortably in context. |
| 100-1000 sources | hybrid lexical + semantic search | Conceptual recall fails with exact search. |
| 1000+ sources | graph-aware hybrid retrieval | Cross-domain linking and provenance audit matter. |

## Git policy

- Every agent write should be reviewable as a diff.
- Bulk edits require dry-run output first.
- Schema migrations should happen on a branch.
- Do not sync mutable vector indexes through cloud-sync folders.
- Prefer reconstructable indexes from content hashes.
