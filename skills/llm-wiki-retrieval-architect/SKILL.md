---
name: llm-wiki-retrieval-architect
description: Design the retrieval/indexing layer for an LLM-Wiki. Use when the user asks about lexical search, SQLite FTS, BM25, hybrid retrieval, vector DBs, GraphRAG, Qdrant, LanceDB, Chroma, Weaviate, Milvus, pgvector, LlamaIndex, Haystack, rerankers, metadata filters, MCP retrieval, or when `rg`/index.md no longer retrieves enough context.
license: MIT
compatibility: Designed for Agent Skills-compatible coding agents. Browse official docs before recommending current install commands, provider behavior, licenses, API behavior or specific package versions.
metadata:
  author: po4yka
  version: "0.2.0"
  install_scope: self-contained
---

# LLM-Wiki Retrieval Architect

## Goal

Choose the smallest retrieval tier that solves the user's measured retrieval failure while preserving inspectable Markdown, provenance, access filters and rebuildable indexes.

Use `references/docs/16-retrieval-architecture.md` as the reference playbook for detailed technology comparisons, metadata schema, GraphRAG lane design, evaluation gates, security controls and source URLs to re-check.

## Inputs

- Corpus size and source types.
- Current folder structure and wiki page schema.
- Query examples that failed.
- Privacy/local-first requirements.
- Latency, cost and deployment constraints.
- Existing tools: `rg`, SQLite, vector DB, GraphRAG, LlamaIndex, Haystack, MCP.
- Team/tenant/security requirements.
- Evaluation set or recent real questions, if available.

## Procedure

### 1. Diagnose the retrieval failure

Classify the failure:

| Failure | Meaning | Typical fix |
|---|---|---|
| lexical miss | Keywords differ but concept is the same. | Add dense retrieval or query expansion. |
| exact-token miss | IDs, filenames, names or code symbols are missed. | Improve lexical/FTS lane; do not rely on dense-only search. |
| stale index | Search misses newly added or changed pages. | Fix rebuild/watch/CI triggers. |
| poor metadata | Results cannot filter by source, status, sensitivity or date. | Add required metadata fields and query-time filters. |
| poor ranking | Relevant result exists in top 20-100 but not top 5. | Add reranker. |
| thin context | Retrieved chunk is relevant but too small to answer. | Add parent-child or contextual retrieval. |
| synthesis miss | Individual pages are found but no cross-page answer exists. | Add synthesis pages or graph lane. |
| multi-hop miss | Relationships across entities/concepts are not traversed. | Add graph-aware retrieval or GraphRAG lane. |
| provenance miss | The result is plausible but unsupported by raw sources. | Add citation metadata and claim-support checks. |
| permission miss | Retrieval can expose restricted content. | Stop and fix filters/security before tuning relevance. |

Do not add infrastructure until a real retrieval failure is identified.

### 2. Pick the retrieval tier

Use progressive retrieval:

| Tier | Use when | Typical tools |
|---|---|---|
| 0. Map + grep | Small/medium wiki with good names, indexes and wikilinks. | `index.md`, `log.md`, `rg`, `fd`, backlinks. |
| 1. Local lexical index | Exact search must be faster, ranked or scoped. | SQLite FTS5, Tantivy, Pagefind for static exports, OpenSearch/Elasticsearch when hosted. |
| 2. Hybrid semantic search | Conceptual search fails or users ask natural-language questions. | BM25/FTS + embeddings; LanceDB, Qdrant, Chroma, Weaviate, Milvus, pgvector. |
| 3. Reranked retrieval | Top-k contains signal but order is poor. | Cross-encoders, Jina/Cohere rerankers, ColBERT/late-interaction rerankers. |
| 4. Parent/context retrieval | Small chunks retrieve well but answer context is incomplete. | Parent-document retrieval, contextual retrieval, recursive retrieval. |
| 5. Graph-aware retrieval | Multi-hop, relationship-heavy or corpus-level questions dominate. | Wikilink/entity graph, Microsoft GraphRAG, LightRAG, HippoRAG, RAPTOR, LlamaIndex property graph, Neo4j/Kuzu. |
| 6. Product storage | Multi-user permissions, concurrency, tenancy or scale dominate. | Qdrant, Weaviate, Milvus, OpenSearch, Postgres + pgvector, object storage and queues. |

Default recommendation: **hybrid retrieval + metadata filters + reranker**. GraphRAG is a specialized lane for global/relationship-heavy questions, not the universal default.

### 3. Choose by deployment archetype

| Situation | Default recommendation |
|---|---|
| Personal/local-first wiki | `rg` + SQLite FTS5 + local embeddings; upgrade to LanceDB or local pgvector if needed. |
| Obsidian-style Markdown vault | Wikilinks/backlinks + FTS; add graph-native retrieval before vector DB if links are strong. |
| Repo-docs CI | Git/module maps + static search/Pagefind + optional hybrid preview index. |
| Hosted team wiki | Qdrant or Weaviate hybrid retrieval with payload/tenant filters and reranker. |
| Existing enterprise search stack | OpenSearch hybrid if pure OSS matters; Elasticsearch only if licensing is already acceptable. |
| App-data-heavy product | Postgres + pgvector when SQL joins, transactional metadata and app ACLs dominate. |
| Very large vector collection | Milvus if the team owns the operational complexity. |
| Corpus-level synthesis | Hybrid default plus graph/GraphRAG lane for selected query classes. |

### 4. Define index contracts

For every index, define:

```yaml
index_name: ""
index_type: lexical|dense|sparse|hybrid|graph|static
source_of_truth: raw|wiki|both
input_paths: []
output_paths: []
embedding_model: ""
sparse_model: "BM25|SPLADE|none"
reranker_model: ""
chunking_policy: heading-aware|parent-child|contextual|fixed-window
metadata_fields: []
access_filters: []
refresh_trigger: manual|pre-commit|scheduled|watch|ci
rebuild_command: ""
index_revision: ""
```

Indexes must be reconstructable unless the user explicitly chooses database-first storage.

### 5. Design metadata filters

At minimum support:

- `doc_id`;
- `chunk_id`;
- `parent_id`;
- `source_uri`;
- `source_type`;
- `page_path`;
- `heading_path`;
- `repo`, `path`, `branch`, `commit_sha` when code/repo docs are involved;
- `review_state`;
- `publication_state`;
- `sensitivity`;
- `tenant_id`;
- `acl_tags`;
- `owner`;
- `created_at`;
- `updated_at`;
- `stale_after`;
- `model_policy`;
- `hash_sha256`;
- `embed_model`;
- `index_revision`.

Critical rule: `tenant_id`, `acl_tags`, `sensitivity`, `review_state` and `publication_state` must be query-time filters, not post-generation cleanup.

Default governed query filter:

```text
tenant_id = current_tenant
AND review_state IN ('reviewed', 'verified')
AND publication_state IN ('internal', 'public')
AND publication_state != 'archived'
AND sensitivity IN allowed_sensitivity_classes
AND source_domain IN allowed_source_domains
```

### 6. Decide chunking and context strategy

Prefer native structure over arbitrary windows:

| Corpus | Chunking rule |
|---|---|
| Markdown/wiki | heading/subheading chunks with parent page references. |
| Long pages | 300-600 token chunks with 10-20% overlap, plus parent expansion. |
| Code/API docs | file + symbol + docstring or endpoint/class/function units. |
| Tables | preserve row/column labels and captions. |
| PDFs | use layout-aware chunks when table/layout fidelity matters. |
| Chat/session logs | session -> task -> turn group; redact before indexing. |

Use contextual retrieval when chunks are semantically ambiguous without surrounding document context. Use parent-child retrieval when small child chunks retrieve well but larger sections answer better.

### 7. Decide graph strategy

Use graph extraction only when the wiki already has stable page types, wikilinks, entities or citations.

Graph edges should include:

```yaml
from: ""
to: ""
edge_type: cites|mentions|defines|contradicts|depends_on|similar_to|derived_from|owned_by|decided_by
source_chunks: []
confidence: 0.0
created_by: human|agent|importer
review_state: draft|reviewed|verified|stale|archived
```

Do not use graph visualization as proof of knowledge quality. Evaluate the graph lane against multi-hop/global query classes.

### 8. Plan evaluation

Measure before and after retrieval changes:

- recall@k;
- MRR;
- nDCG@k;
- query hit/miss labels;
- citation coverage;
- unsupported-claim count;
- source-support rate;
- p50/p95 retrieval latency;
- indexing throughput;
- freshness lag;
- cost per query;
- index rebuild time;
- permission-filter failures;
- sensitive-snippet leakage.

Hand off to `llm-wiki-eval-tooling` for formal eval design and CI gates.

### 9. Review security before rollout

Check:

- PII/secret scanning before indexing;
- source allowlists;
- staging indexes for unreviewed content;
- cross-tenant leakage tests;
- cloud embedding/reranker data policy;
- MCP scopes and local/remote trust boundaries;
- retrieval logs that might store sensitive snippets.

Hand off to `llm-wiki-security-review` when sensitive/team data is involved.

## Output

```markdown
## Retrieval diagnosis

## Recommended tier

## Deployment recommendation

## Technology choices

| Component | Choice | Why | Rebuild policy | Risks |
|---|---|---|---|---|

## Chunking and context strategy

## Metadata and access filters

## Graph/GraphRAG lane

## Index rebuild plan

## Query evaluation plan

## Security review

## Upgrade triggers

## Next skill
```

## Safety gates

- Do not make the vector index the source of truth.
- Do not use dense-only retrieval for corpora full of filenames, IDs, code symbols or proper nouns.
- Do not expose sensitive pages through unfiltered semantic search.
- Do not recommend cloud embeddings/rerankers for sensitive material without explicit approval.
- Do not hide chunking, embedding model, index revision or rebuild policy.
- Do not claim GraphRAG is necessary when failures are lexical, metadata, chunking or ranking problems.
- Do not let draft, rejected, stale or unauthorized content enter production retrieval.
