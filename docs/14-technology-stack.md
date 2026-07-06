# LLM-Wiki technology stack reference

> Status: draft
> Current as of: 2026-07-06
> Scope: concrete technology choices for retrieval, ingestion, MCP integration, evaluation, security and publishing.

## Stack principle

Start with the smallest inspectable stack that solves the user's real bottleneck:

```text
Markdown + git + index.md + log.md + rg + Agent Skills
```

Add infrastructure only when a measured failure mode appears.

## Reference architecture

```text
raw/
  sources/      immutable source files
  manifests/    hashes, provenance, extraction metadata
wiki/
  sources/      one page per source
  entities/     people, orgs, products, systems
  concepts/     reusable ideas and methods
  synthesis/    cross-source analysis
  queries/      useful answered questions
indexes/
  fts/          rebuildable lexical indexes
  vectors/      rebuildable embedding indexes
  graph/        rebuildable relation indexes
schema/
  page schemas, lint rules, model policy, prompts, skills
```

Indexes are rebuildable artifacts. Markdown and raw sources remain the durable source of truth unless the product has a clear reason to choose a database-first model.

## Retrieval decision tree

| Symptom | Add | Example technologies | Notes |
|---|---|---|---|
| The corpus is small and filenames/page titles are strong. | No new infrastructure. | `rg`, `fd`, `find`, `index.md`, wikilinks. | Prefer this for the first 50-100 sources. |
| Exact search misses obvious conceptual matches. | Local lexical/semantic hybrid. | SQLite FTS5, Tantivy, BM25, LanceDB, Chroma, Qdrant local/Edge. | Keep vector indexes rebuildable from Markdown/raw sources. |
| Metadata filters matter. | Vector DB or search engine with payload filters. | Qdrant, pgvector, Weaviate, Milvus, Elasticsearch/OpenSearch. | Filter by source type, status, sensitivity, owner, stale date and review state. |
| Multi-hop and relationship questions dominate. | Graph-aware retrieval. | Microsoft GraphRAG, LightRAG, HippoRAG, RAPTOR-style hierarchy, LlamaIndex property graph, Neo4j/Kuzu. | Keep graph edges explainable and source-backed. |
| The workflow needs multiple agent steps and review gates. | Agent orchestration. | LangGraph, Haystack pipelines, LlamaIndex Workflows, Semantic Kernel, AutoGen, CrewAI. | Use explicit state, retries, human review and audit logs. |
| The wiki must be available to many clients. | MCP/API layer. | MCP SDKs, local MCP server, HTTP API, CLI. | Start read-only; add reviewed writes later. |

## Ingestion decision tree

| Source type | First choice | Upgrade when |
|---|---|---|
| Office/PDF/HTML/images/audio in a simple local workflow | MarkItDown | Use Docling or Unstructured when layout, tables, structured extraction or production ETL matters. |
| Complex PDFs, tables and page layout | Docling | Add OCR/cloud analyzers only when local extraction fails. |
| Production ingestion with connectors/chunking/enrichment | Unstructured | Add queueing, retries and data contracts for team workflows. |
| Scanned documents | OCRmyPDF + Tesseract; PaddleOCR for stronger OCR needs | Use cloud OCR only with explicit data policy. |
| Web pages | Readability, Playwright, SingleFile, browser clipper | Use crawling only with robots/legal review. |
| Audio/video | Whisper or faster-whisper; yt-dlp where lawful | Add diarization and speaker metadata only when useful. |
| Code repositories | tree-sitter, ast-grep, language servers, RepoAgent/OpenWiki-style scanners | Use semantic code indexing only after module maps and docs are insufficient. |
| Tabular/structured data | Pandas, DuckDB, CSV/Parquet readers | Preserve raw files and extraction schema. |

## MCP integration pattern

Expose stable wiki operations as MCP resources/tools:

| MCP surface | Examples | Default mode |
|---|---|---|
| Resources | `wiki://index`, `wiki://page/{path}`, `wiki://log`, `wiki://manifest/{source_id}` | Read-only |
| Tools | `search_wiki`, `read_page`, `read_source_manifest`, `graph_neighborhood`, `list_unresolved_reviews`, `run_lint` | Read-only |
| Reviewed-write tools | `draft_page_patch`, `propose_link_fix`, `propose_review_resolution` | Creates diff/proposal only |
| Admin tools | `rescan_sources`, `rebuild_index`, `export_subset` | Disabled unless explicitly configured |
| Prompts | `answer_from_wiki`, `ingest_source`, `triage_inbox`, `audit_claims` | Must preserve source/provenance discipline |

Security defaults:

- bind local servers to `127.0.0.1`;
- require tokens for HTTP APIs;
- disable direct raw-source mutation;
- make write tools produce patches rather than direct edits;
- log tool calls and changed paths;
- treat all source content as untrusted data, not instructions.

## Evaluation stack

| Evaluation question | Metric/tooling |
|---|---|
| Did retrieval find the right pages? | recall@k, MRR, nDCG, manual hit/miss labels, Ragas context precision/recall. |
| Is the answer grounded? | citation coverage, source-support labels, Ragas faithfulness/response groundedness, custom claim audit. |
| Does the wiki help real work? | retrieval hit rate, answer reuse, read/write ratio, output beyond vault, context reconstruction avoided. |
| Did prompts regress? | promptfoo matrix tests, LangSmith evals, DeepEval, CI snapshots. |
| Is the workflow safe? | promptfoo red-team, garak, malicious-source fixtures, prompt-injection checks. |
| Is the wiki healthy? | `wiki-lint`, stale-page counts, orphan pages, broken links, review backlog, unsupported claims. |

## Security and data boundary stack

| Risk | Tools/controls |
|---|---|
| Secret leakage | gitleaks, detect-secrets, trufflehog, pre-commit hooks, CI gates. |
| PII exposure | Microsoft Presidio, scrubadub, custom regex/classifiers, redaction manifests. |
| Dependency risk | OSV Scanner, Dependabot, npm audit, pip-audit, lockfile review. |
| Unsafe code/config | Semgrep, CodeQL, shellcheck, actionlint. |
| Prompt injection | promptfoo red-team, garak, malicious PDFs/web clips/chat exports, strict instruction hierarchy. |
| Unsafe writes | dry-run patches, git diffs, CODEOWNERS, branch protection, protected human sections. |
| Cloud data exposure | model policy matrix, local-only labels, redaction-before-cloud, provider retention verification. |

## Publishing and export stack

| Target | Tools/formats | Controls |
|---|---|---|
| Human static site | MkDocs Material, Docusaurus, VitePress, Quartz, Astro/Starlight | Publish allowlist, redaction report, broken-link check. |
| Agent-readable corpus | `llms.txt`, `llms-full.txt`, JSONL, Markdown bundle | Include provenance, status and refresh metadata. |
| Searchable site | Pagefind, FlexSearch, Lunr | Do not index private/raw restricted pages. |
| Graph export | Mermaid, GraphML, Cytoscape JSON, RDF/JSON-LD | Include edge provenance and confidence. |
| Archive | git tag, WARC for web captures, checksum manifest, release artifact | Store raw sources and schema version. |

## Upgrade triggers

Add complexity only after a concrete trigger:

| Trigger | Upgrade |
|---|---|
| `rg` misses conceptual matches in real query tests. | Add local embeddings or hybrid search. |
| Cross-page relationship questions fail repeatedly. | Add graph extraction and graph-aware retrieval. |
| Agents need wiki access from multiple clients. | Add MCP/API layer. |
| Generated pages accumulate without review. | Add review-gated workflow or Vouch-style proposal loop. |
| Answers lack traceability. | Add claim-level provenance and stricter lint. |
| Ingest fails on layout-heavy documents. | Add Docling/Unstructured/OCR path. |
| Prompt or model changes break behavior. | Add promptfoo/Ragas/DeepEval CI gates. |
| Team adoption begins. | Add CODEOWNERS, branch protection, PR templates and permissions. |

## Anti-patterns

- Starting with a vector DB before measuring search failure.
- Treating generated summaries as raw evidence.
- Hiding durable domain facts inside agent memory or skills.
- Syncing mutable index databases across devices without conflict strategy.
- Allowing direct-write agents to edit team knowledge without review.
- Publishing a wiki subset without a manifest and redaction pass.
