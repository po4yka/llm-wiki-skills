# LLM-Wiki technology stack reference

> Status: draft
> Current as of: 2026-07-07
> Scope: concrete technology choices for retrieval, ingestion, MCP integration, evaluation, security, publishing and archiving.

## Stack principle

Start with the smallest inspectable stack that solves the user's real bottleneck:

```text
Markdown + git + index.md + log.md + rg + Agent Skills
```

Add infrastructure only when a measured failure mode appears.

For retrieval-specific architecture, use [`docs/16-retrieval-architecture.md`](16-retrieval-architecture.md). It expands the retrieval decision tree into a detailed hybrid/GraphRAG/local-first/hosted reference architecture with metadata schema, evaluation gates and security controls.

For MCP/API integration, use [`docs/17-mcp-api-integration.md`](17-mcp-api-integration.md). It defines a semantic `wiki://` resource model, read/proposal/admin tool boundaries, REST/OpenAPI facade, auth/governance model, client compatibility guidance, audit logging and security test checklist.

For evaluation methodology, use [`docs/18-evaluation-methodology.md`](18-evaluation-methodology.md). It defines layered retrieval, grounding, usefulness, operational-health and security metrics, with-wiki experiments, human calibration, scorecards and CI gates.

For security threat modeling, use [`docs/19-security-threat-model.md`](19-security-threat-model.md). It defines trust boundaries, STRIDE/LINDDUN mappings, LLM-specific threat classes, security scorecards, red-team scenarios, CI gates and incident response.

For ingestion pipeline architecture, use [`docs/20-ingestion-pipelines.md`](20-ingestion-pipelines.md). It defines source taxonomy, pipeline archetypes, tool selection, manifests, chunk schemas, fidelity gates, sync/dedupe and ingestion rollout.

For publishing/export architecture, use [`docs/21-publishing-export.md`](21-publishing-export.md). It defines export profiles, human/agent/API/graph/archive outputs, `llms.txt` bundles, redaction pipelines, export manifests, checksums, release gates and rollback artifacts.

## Reference architecture

```text
raw/
  sources/      immutable source files
  manifests/    hashes, provenance, extraction metadata
  extracted/    parser outputs, normalized Markdown/JSON/chunks
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
api/
  MCP resources/tools/prompts, REST/OpenAPI facade, auth and audit contracts
evals/
  versioned datasets, qrels, promptfoo configs, scorecards and CI reports
security/
  threat model, scorecards, red-team fixtures, redaction reports and incident playbooks
exports/
  profile-driven static sites, agent bundles, API/graph exports, manifests, checksums and archives
```

Indexes and exports are rebuildable artifacts. Markdown and raw sources remain the durable source of truth unless the product has a clear reason to choose a database-first model.

## Retrieval decision tree

| Symptom | Add | Example technologies | Notes |
|---|---|---|---|
| The corpus is small and filenames/page titles are strong. | No new infrastructure. | `rg`, `fd`, `find`, `index.md`, wikilinks. | Prefer this for the first 50-100 sources. |
| Exact search must be ranked, scoped or faster. | Local lexical index. | SQLite FTS5, Tantivy, Pagefind for static exports, OpenSearch/Elasticsearch for hosted search. | Keep lexical search even after adding embeddings. |
| Exact search misses obvious conceptual matches. | Hybrid lexical/semantic retrieval. | BM25/FTS + embeddings; LanceDB, Chroma, Qdrant, Weaviate, Milvus, pgvector. | Default serious retrieval tier for most LLM-Wiki systems. |
| Top-k has signal but poor ordering. | Reranking. | Cross-encoders, Jina/Cohere rerankers, ColBERT/late-interaction rerankers. | Rerank 20-100 candidates before context packing. |
| Chunks retrieve well but lack surrounding context. | Parent-child or contextual retrieval. | LangChain parent docs, LlamaIndex recursive retrieval, contextual chunk augmentation. | Useful for long pages and ambiguous chunks. |
| Metadata filters matter. | Vector DB or search engine with query-time filters. | Qdrant, pgvector, Weaviate, Milvus, OpenSearch/Elasticsearch, Meilisearch. | Filter by source type, review state, sensitivity, tenant, owner, stale date and publication state. |
| Multi-hop and relationship questions dominate. | Graph-aware retrieval lane. | Wikilink/entity graph first; Microsoft GraphRAG, LightRAG, HippoRAG, RAPTOR, LlamaIndex property graph later. | Keep graph edges explainable and source-backed. |
| The workflow needs multiple agent steps and review gates. | Agent orchestration. | LangGraph, Haystack pipelines, LlamaIndex Workflows, Semantic Kernel, AutoGen, CrewAI. | Use explicit state, retries, human review and audit logs. |
| The wiki must be available to many clients. | MCP/API layer. | MCP SDKs, local MCP server, HTTP API, CLI. | Start read-only; add reviewed writes later. |

## Ingestion decision tree

| Source type / symptom | First choice | Upgrade when | Notes |
|---|---|---|---|
| Native PDF, Office, HTML, EPUB | Docling | MarkItDown for lightweight Markdown; Unstructured/Tika when connector breadth dominates. | Prefer structure/layout/provenance over plain text. |
| Simple local file conversion | MarkItDown | Docling when tables/layout/page anchors matter. | Good for fast Markdown-first local workflows. |
| Complex PDFs, tables and page layout | Docling | PaddleOCR or Marker for scan/table/formula-heavy cases. | Sample fidelity before trusting outputs. |
| Scanned documents | OCRmyPDF + downstream parser | Tesseract/PaddleOCR/Marker for harder OCR/layout. | Keep page anchors and OCR metadata. |
| Web pages | Playwright + Readability | ArchiveBox/SingleFile when durable provenance matters. | Cite archived snapshot, not only extracted text. |
| Audio/video | Whisper or faster-whisper; yt-dlp where lawful | Add diarization/speaker metadata only when useful. | Preserve timestamp anchors. |
| Code repositories | tree-sitter, ast-grep, language servers, RepoAgent/OpenWiki-style scanners | Semantic code indexing only after module maps and docs are insufficient. | Chunk by syntax/symbol, not arbitrary tokens. |
| Email/chat exports | mail-parser, Notmuch, platform exports | Custom connector/API when approved. | Preserve thread/message/attachment links. |
| Tabular/structured data | DuckDB, pandas, CSV/Parquet readers | dlt/Airbyte when connectors/sync matter. | Preserve schema, query and row-group provenance. |
| Production volume | Queue/worker ETL | Connector platform and observability. | Add retries, idempotency, dead-letter queue and metrics. |

Recommended ingestion artifacts:

| Artifact | Purpose |
|---|---|
| `raw/manifests/<source_id>.yaml` | Source identity, hash, sensitivity, parser version, extraction status and review state. |
| `raw/extracted/<source_id>/` | Rebuildable parser outputs such as Markdown, JSON and chunks. |
| `wiki/sources/<source_id>.md` | Human-readable source page with warnings, provenance and links to derived pages. |
| `templates/source-manifest.yaml` | Source manifest schema starter. |
| `templates/ingestion-pipeline-profile.yaml` | Source routing, tool choice, quality gates and security policy starter. |
| `templates/ingestion-fidelity-suite.yaml` | Golden corpus and conversion/provenance eval starter. |
| `templates/llm-wiki-ingestion.github-actions.yml` | CI workflow starter for manifests, fidelity, scans and retrieval smoke tests. |

Security defaults for ingestion:

- quarantine untrusted sources before parsing;
- sandbox parser/OCR/ASR workers;
- prevent parser workers from accessing repository write credentials and model/provider secrets;
- record source hashes and extraction metadata;
- scan extracted text before indexing or export;
- classify source sensitivity before production retrieval;
- create source manifests before synthesis pages;
- preserve page, timestamp, message, row and symbol anchors where relevant.

## MCP integration pattern

Expose stable wiki operations as a semantic API, not as raw filesystem access:

| MCP/API surface | Examples | Default mode |
|---|---|---|
| Resources | `wiki://manifest`, `wiki://index`, `wiki://page/{space}/{slug}`, history/lint/graph resources | Read-only |
| Read tools | `search_wiki`, `read_page`, `read_source_manifest`, `graph_neighborhood`, `run_lint`, `explain_retrieval` | Enabled first |
| Proposal-write tools | `draft_page_patch`, `propose_new_page`, `propose_link_fix`, `create_pr_from_proposal` | Disabled until review model exists |
| Admin tools | `rebuild_index`, `rescan_sources`, `export_subset`, `approve_proposal`, `publish_export` | Disabled unless explicitly configured |
| Prompts | `answer_from_wiki`, `ingest_source`, `triage_inbox`, `audit_claims`, `review_proposal` | Must preserve source/provenance discipline |
| REST/OpenAPI facade | `/manifest`, `/search`, `/pages/{space}/{slug}`, `/proposals`, `/approvals/{id}` | Optional compatibility layer |

Security defaults:

- bind local servers to `127.0.0.1`;
- require auth for remote HTTP APIs;
- avoid unauthenticated remote MCP servers;
- default cloud/autonomous clients to allowlisted read-only tools;
- separate read tools from proposal-write and admin tools;
- disable direct raw-source mutation;
- make write tools produce patches rather than direct edits;
- log sensitive reads and all proposals/admin actions;
- enforce tenant, sensitivity, review-state and publication filters before retrieval;
- treat all source/wiki content as untrusted data, not instructions.

## Evaluation stack

Evaluation is a layered system, not a single score:

| Evaluation layer | Question | Metric/tooling |
|---|---|---|
| Ingestion fidelity | Did conversion preserve text, structure and anchors? | parser success, text coverage, heading/table preservation, timestamp coverage, thread integrity. |
| Provenance completeness | Can every chunk trace back to source? | source hash coverage, manifest coverage, chunk anchor coverage, duplicate chunk rate. |
| Retrieval | Did retrieval find the right pages/passages? | recall@k, MRR, nDCG, qrels, manual hit/miss labels, pytrec_eval, Ragas context precision/recall. |
| Grounding | Is the answer supported by sources? | citation coverage, unsupported-claim rate, source-support labels, Ragas/DeepEval faithfulness, TruLens groundedness, custom claim audit. |
| Answer quality | Does the answer solve the task? | human rubric, pairwise preference, model-graded rubric, correctness/completeness/actionability. |
| Wiki usefulness | Does the wiki reduce work? | retrieval hit rate, answer reuse, read/write ratio, output beyond vault, context reconstruction avoided. |
| Publishing/export | Is the exported artifact scoped, cited and safe? | export profile validity, redaction findings, broken links, citation coverage, search-index leakage, checksum coverage. |
| Prompt/model regression | Did behavior change after prompt/model edits? | promptfoo matrix tests, LangSmith evals, DeepEval tests, snapshot tests. |
| Security | Can malicious sources or prompts bypass policy? | promptfoo red-team, garak, malicious-source fixtures, indirect prompt-injection checks, PII/private-data canaries. |
| Operational health | Is the wiki alive and trusted? | `wiki-lint`, stale-page counts, orphan pages, broken links, review backlog, provenance coverage. |
| MCP/API safety | Is agent access safely bounded? | read-only allowlist test, proposal-only write test, denied direct-write test, audit event check, cross-tenant filter test. |

Recommended eval artifacts:

| Artifact | Purpose |
|---|---|
| `evals/retrieval-eval-set.yaml` | Versioned questions, qrels, required pages/sources and risk tiers. |
| `evals/ingestion/ingestion-fidelity-suite.yaml` | Versioned golden corpus for parser/conversion/provenance checks. |
| `evals/promptfooconfig.yaml` | Prompt/RAG regression and rubric checks. |
| `evals/redteam.yaml` | Indirect prompt injection, private-data and canary security tests. |
| `eval-results/eval-scorecard.yaml` | Multi-layer scorecard for CI, nightly jobs and release review. |
| Human calibration queue | Monthly reviewer sample for judge/rubric calibration. |

## Security and data boundary stack

| Risk | Tools/controls |
|---|---|
| Secret leakage | GitHub secret scanning/push protection, gitleaks, detect-secrets, trufflehog, pre-commit hooks, CI gates. |
| PII/private-data exposure | Microsoft Presidio, scrubadub, custom regex/classifiers, redaction manifests, retention policy. |
| Dependency/supply-chain risk | OSV Scanner, Dependabot, GitHub dependency review, npm audit, pip-audit, lockfile review. |
| Unsafe code/config | Semgrep, CodeQL, shellcheck, actionlint, pinned GitHub Actions, minimal workflow permissions. |
| Parser exploitation | Parser sandboxing, file-type allowlists, size limits, no parser secrets, CVE review, temporary output isolation. |
| Prompt injection | promptfoo red-team, garak, malicious PDFs/web clips/chat exports, strict instruction hierarchy, staged public/private workflows. |
| RAG poisoning | reviewed-only retrieval, source hashes, provenance, contradiction checks, quarantined states, metadata filters. |
| Unsafe writes | dry-run patches, git diffs, CODEOWNERS, branch protection, protected human sections, proposal-only agents. |
| Cloud data exposure | model policy matrix, local-only labels, redaction-before-cloud, provider retention verification. |
| MCP/API exposure | localhost binding, origin validation, OAuth/API-key scopes, read/propose/admin split, audit logs, no token passthrough. |
| Export/log/trace leakage | export allowlists, redaction reports, private-by-default traces, bounded prompt/source logging, retention policy. |

Recommended security artifacts:

| Artifact | Purpose |
|---|---|
| `docs/19-security-threat-model.md` | Canonical architecture threat model and control baseline. |
| `templates/security-scorecard.yaml` | Review checklist and status report. |
| `templates/mcp-security-profile.yaml` | MCP/API security contract for tool classes, auth, retrieval filters and audit. |
| `templates/promptfoo-llm-wiki-redteam.yaml` | RAG/MCP/agent red-team starter. |
| `templates/llm-wiki-security.github-actions.yml` | CI security workflow starter. |
| `policies/redaction-retention-policy.md` | Data handling, redaction, export and trace-retention template. |
| `policies/review-incident-response.md` | Review gates and incident response template. |

## Publishing and export stack

Publish through explicit export profiles rather than copying the whole wiki.

| Target | Tools/formats | Controls |
|---|---|---|
| Human static site | MkDocs Material, Docusaurus, VitePress, Quartz, Astro/Starlight | Publish allowlist, redaction report, broken-link check, citation report. |
| Agent-readable corpus | `llms.txt`, `llms-full.txt`, JSONL, per-page Markdown/TXT, Markdown bundle | Include provenance, status and refresh metadata; exclude private/raw restricted pages. |
| Searchable site | Pagefind, FlexSearch, Lunr, Algolia DocSearch when appropriate | Build search after filtering/redaction; do not index private/raw restricted pages. |
| Graph export | JSON-LD, RDF/Turtle, Mermaid, GraphML, GraphViz DOT, Cytoscape JSON | Include edge provenance and confidence; redact sensitive nodes. |
| API export | OpenAPI, MCP server manifest/profile, server-card metadata when stable | Keep read-only public surface separate from governed write surface. |
| Archive | git tag, WARC for web captures, checksum manifest, release artifact | Store source manifests, schema version and export profile with sensitivity-aware access. |

Recommended export artifacts:

| Artifact | Purpose |
|---|---|
| `docs/21-publishing-export.md` | Canonical publishing/export architecture and control baseline. |
| `templates/export-profile.yaml` | Export profile for audience, include/exclude rules, outputs and gates. |
| `templates/export-manifest.yaml` | Auditable export record with inputs, outputs, counts, reports, checksums and approvals. |
| `templates/agent-export-bundle.yaml` | `llms.txt`, `llms-full.txt`, per-page Markdown/TXT and JSONL bundle profile. |
| `templates/static-site-export-profile.yaml` | Static-site build/search/link/citation profile. |
| `templates/llm-wiki-publish.github-actions.yml` | CI workflow starter for profile validation, build, redaction, checksums and publication. |

Publishing sequence:

```text
candidate pages -> export profile allowlist -> policy filters -> redaction scan -> link/citation validation -> site/agent/API/graph/archive build -> manifest/checksums -> release/publish
```

## Upgrade triggers

Add complexity only after a concrete trigger:

| Trigger | Upgrade |
|---|---|
| `rg` misses conceptual matches in real query tests. | Add local embeddings or hybrid search. |
| Exact search needs ranking, scoping or speed. | Add SQLite FTS5/Tantivy/Pagefind/OpenSearch. |
| Top-k contains relevant chunks but the order is poor. | Add reranker. |
| Chunks are relevant but too thin for answers. | Add parent-child/contextual retrieval. |
| Cross-page relationship questions fail repeatedly. | Add graph extraction and graph-aware retrieval. |
| Agents need wiki access from multiple clients. | Add read-only MCP/API layer. |
| Non-MCP clients or CI need stable integration. | Add REST/OpenAPI facade. |
| Agents need to suggest wiki edits. | Add proposal-write MCP tools backed by review/PR workflow. |
| Team/enterprise access is needed. | Add OAuth/API gateway, tenant filters, audit logs and CODEOWNERS review. |
| Generated pages accumulate without review. | Add review-gated workflow or Vouch-style proposal loop. |
| Answers lack traceability. | Add claim-level provenance and stricter lint. |
| Ingest fails on layout-heavy documents. | Add Docling/Unstructured/OCR path plus ingestion fidelity tests. |
| Sources include scans, audio, code, email/chat or tables. | Add source-type-specific pipeline profiles and anchors. |
| Ingested sources change over time. | Add source hashes, cursors, tombstones, sync reports and changed-chunk re-embedding. |
| Untrusted documents enter ingestion. | Add parser sandboxing, file allowlists, secret/private-data scans and quarantine states. |
| Remote/local MCP surfaces are enabled. | Add MCP security profile, auth, origin checks, audit logs and red-team tests. |
| Internal users need browsable docs. | Add internal static-site export profile. |
| Public docs are needed. | Add public allowlist, redaction report, citation checks, search-index inspection and release manifest. |
| Agents need website-scale context. | Add scoped `llms.txt`, per-page Markdown/TXT and JSONL agent bundle; enable `llms-full.txt` only by explicit profile. |
| Long-term reproducibility is needed. | Add archive bundle, checksums, release tag, export manifest and rollback artifact. |
| Prompt or model changes break behavior. | Add promptfoo/Ragas/DeepEval CI gates. |
| Evaluation depends only on synthetic questions. | Add reviewed real queries, qrels and human calibration. |
| LLM judges disagree with humans. | Update rubrics, thresholds, calibration set and judge choice. |
| Team adoption begins. | Add CODEOWNERS, branch protection, PR templates, permissions and threat model. |

## Anti-patterns

- Starting with a vector DB before measuring search failure.
- Starting with GraphRAG before hybrid retrieval has failed on multi-hop/global query tests.
- Flattening every source into one text field.
- Creating synthesis pages from unmanifested files.
- Discarding raw sources after conversion.
- Losing page, timestamp, message, row or symbol anchors.
- Exposing raw filesystem access as the main MCP contract.
- Giving cloud/autonomous clients proposal-write or admin tools by default.
- Treating generated summaries as raw evidence.
- Hiding durable domain facts inside agent memory or skills.
- Syncing mutable index databases across devices without conflict strategy.
- Allowing direct-write agents to edit team knowledge without review.
- Publishing a wiki subset without a manifest and redaction pass.
- Publishing by copying the whole `wiki/` directory.
- Treating `llms-full.txt` as safe because it is plain text.
- Reusing an internal static search index in a public site.
- Publishing graph exports without edge provenance or sensitivity filters.
- Archiving only rendered HTML and losing source manifests/checksums.
- Treating note count, graph density or LLM-judge score as sufficient proof of wiki quality.
- Treating `127.0.0.1` as enough without auth/origin/rebinding controls.
- Running parsers with repo write access or model/provider secrets.
- Logging full prompts/sources in shared tracing systems by default.
- Relying on prompt wording as the only defense against prompt injection.
