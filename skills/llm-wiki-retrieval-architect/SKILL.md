---
name: llm-wiki-retrieval-architect
description: Design the retrieval/indexing layer for an LLM-Wiki. Use when the user asks about vector DBs, hybrid search, GraphRAG, Qdrant, LanceDB, SQLite FTS, LlamaIndex, Haystack, rerankers, metadata filters, or when `rg`/index.md no longer retrieves enough context.
license: MIT
compatibility: Designed for Agent Skills-compatible coding agents. Browse official docs before recommending current install commands, provider behavior or specific package versions.
metadata:
  author: po4yka
  version: "0.1.0"
---

# LLM-Wiki Retrieval Architect

## Goal

Choose the smallest retrieval tier that solves the user's measured retrieval failure while preserving inspectable Markdown, provenance and rebuildable indexes.

## Inputs

- Corpus size and source types.
- Current folder structure and wiki page schema.
- Query examples that failed.
- Privacy/local-first requirements.
- Latency, cost and deployment constraints.
- Existing tools: `rg`, SQLite, vector DB, GraphRAG, LlamaIndex, Haystack, MCP.

## Procedure

### 1. Diagnose the retrieval failure

Classify the failure:

| Failure | Meaning |
|---|---|
| lexical miss | Keywords differ but concept is the same. |
| stale index | Search misses newly added or changed pages. |
| poor metadata | Results cannot filter by source, status, sensitivity or date. |
| synthesis miss | Individual pages are found but no cross-page answer exists. |
| multi-hop miss | Relationships across entities/concepts are not traversed. |
| provenance miss | The result is plausible but unsupported by raw sources. |
| permission miss | Retrieval can expose content that should be restricted. |

Do not add a vector database until a real failure is identified.

### 2. Pick the retrieval tier

Use this tiering:

| Tier | Use when | Typical tools |
|---|---|---|
| 0. Map + grep | Small/medium wiki with good names, indexes and wikilinks. | `index.md`, `log.md`, `rg`, `fd`, backlinks. |
| 1. Local lexical index | Exact search must be faster or scoped. | SQLite FTS5, Tantivy, Lucene, Elasticsearch/OpenSearch. |
| 2. Hybrid semantic search | Conceptual search fails. | LanceDB, Qdrant, Chroma, Weaviate, Milvus, pgvector; BM25 + embeddings. |
| 3. Reranked retrieval | Top-k contains signal but order is poor. | Cross-encoders, Cohere/Jina rerankers, ColBERT/RAGatouille. |
| 4. Graph-aware retrieval | Multi-hop, relationship-heavy or corpus-level questions dominate. | Microsoft GraphRAG, LightRAG, HippoRAG, RAPTOR-style hierarchy, LlamaIndex property graph, Neo4j/Kuzu. |
| 5. Product storage | Multi-user permissions, concurrency or scale dominate. | Postgres + pgvector, Qdrant/Weaviate/Milvus, Elasticsearch/OpenSearch, object storage, queues. |

### 3. Define index contracts

For every index, define:

```yaml
index_name: ""
source_of_truth: raw|wiki|both
rebuild_command: ""
input_paths: []
output_paths: []
embedding_model: ""
chunking_policy: ""
metadata_fields: []
access_filters: []
refresh_trigger: manual|pre-commit|scheduled|watch
```

Indexes must be reconstructable unless the user explicitly chooses database-first storage.

### 4. Design metadata filters

At minimum support:

- `source_id`;
- `source_path`;
- `page_path`;
- `page_type`;
- `status`;
- `review_required`;
- `sensitivity`;
- `owner`;
- `created_at`;
- `updated_at`;
- `stale_after`;
- `model_policy`;
- `confidence`.

### 5. Decide graph strategy

Use graph extraction only when the wiki already has stable page types or entity/concept signals.

Graph edges should include:

```yaml
from: ""
to: ""
edge_type: cites|mentions|defines|contradicts|depends_on|similar_to|derived_from
evidence: []
confidence: 0.0
created_by: human|agent
```

Do not use graph visualization as proof of knowledge quality.

### 6. Plan evaluation

Measure before and after:

- recall@k;
- MRR or nDCG;
- query hit/miss labels;
- source-support rate;
- latency;
- cost per query;
- index rebuild time;
- permission-filter failures.

Hand off to `llm-wiki-eval-tooling` for formal eval design.

## Output

```markdown
## Retrieval diagnosis

## Recommended tier

## Technology choices

| Component | Choice | Why | Rebuild policy | Risks |
|---|---|---|---|---|

## Metadata and access filters

## Index rebuild plan

## Query evaluation plan

## Upgrade triggers

## Next skill
```

## Safety gates

- Do not make the vector index the source of truth.
- Do not expose sensitive pages through unfiltered semantic search.
- Do not recommend cloud embeddings for sensitive material without explicit approval.
- Do not hide chunking, embedding model or rebuild policy.
- Do not claim GraphRAG is necessary when search failures are lexical or schema-related.
