# LLM-Wiki ecosystem matrix

> Status: draft
> Current as of: 2026-07-06
> Scope: concrete open-source implementations, adjacent frameworks, and decision criteria for choosing an LLM-Wiki stack.

## How to use this document

Use this document as a **seed registry**, not as a permanent maturity claim.

Before recommending a tool to a user, re-check:

1. official README or docs;
2. recent commits, releases and issues;
3. license and data-use implications;
4. supported model providers and local/cloud modes;
5. storage format and export path;
6. review/provenance controls;
7. whether it still matches the user's use case.

## Implementation families

| Family | Use when | Primary risks |
|---|---|---|
| Full LLM-Wiki application | The user wants a ready-made personal or research knowledge app. | Lock-in, sync semantics, hidden generated state, cloud parser/model exposure. |
| Repo documentation agent | The corpus is a codebase and agents need architecture/module/change maps. | Docs drift, over-writing hand-written ADRs, stale code claims. |
| Review-gated agent memory | Agents should propose knowledge updates but humans approve final writes. | Review backlog, friction, schema mismatch with existing notes. |
| Obsidian/local-first workflow | The user already lives in Markdown and wants human-editable wiki pages. | Weak automation unless skills/hooks are added; sync conflicts. |
| Retrieval/GraphRAG framework | Retrieval quality, scale or multi-hop reasoning is the main bottleneck. | Index complexity, opaque retrieval, weaker human-review surface. |
| Custom product/plugin/CLI | The workflow is specific enough that existing tools do not fit. | Building storage, review, security and eval discipline from scratch. |

## Seed registry: LLM-Wiki and repo-wiki implementations

| Project | Family | What to verify | Fit signal | Avoid when |
|---|---|---|---|---|
| `langchain-ai/openwiki` | Repo documentation agent | License, supported providers, generated output, PR/GitHub Action behavior, instruction-file edits. | The user wants `openwiki/` repo docs and `AGENTS.md`/`CLAUDE.md` pointers for coding agents. | Personal second-brain or non-code corpora are the primary target. |
| `nashsu/llm_wiki` | Full desktop LLM-Wiki application | License, release activity, local/cloud model settings, API/MCP permissions, vector/search storage. | The user wants an app with desktop UI, graph, review, hybrid search, local API/MCP and Obsidian-compatible files. | The user requires a minimal CLI/git-only workflow or strict team PR review. |
| `vouchdev/vouch` | Review-gated agent memory / knowledge base | Claim model, MCP/CLI surface, review workflow, storage layout, integration adapters. | Agents should capture/propose knowledge while humans approve every durable write. | The user wants fully automatic wiki generation without human review. |
| `OpenBMB/RepoAgent` | Repository-level documentation generator | Language coverage, model configuration, hook behavior, generated docs path, maintenance status. | The user wants code documentation generation from AST/change tracking rather than a general wiki. | The user needs claim-level provenance and human-reviewed wiki pages. |
| `green-dalii/obsidian-llm-wiki` | Obsidian-native workflow | Plugin status, Obsidian API compatibility, local/cloud model use, vault write policy. | The user wants LLM-Wiki behavior inside an Obsidian vault. | The target is team repo docs or CI-managed docs. |
| `atomicstrata/llm-wiki-compiler`, `ussumant/llm-wiki-compiler`, `Pratiyush/llm-wiki`, `nvk/llm-wiki`, `ddsyasas/llm-wiki`, `swarmclawai/swarmvault` | Experimental or smaller implementations | Whether the repository is active, installable, documented and compatible with current agents. | Useful for design comparison and implementation ideas. | Do not recommend as a production default without fresh verification. |

## Adjacent framework registry

| Layer | Projects/frameworks | Use in LLM-Wiki |
|---|---|---|
| Agent orchestration | LangGraph, LangChain agents, LlamaIndex Workflows/Agents, Haystack pipelines, AutoGen, CrewAI, Semantic Kernel | Coordinate ingest, query, review, lint, scheduled maintenance and human-in-the-loop workflows. |
| MCP integration | MCP SDKs, FastMCP-style servers, local MCP servers, MCP Inspector | Expose wiki resources and tools to Claude Code, ChatGPT, Cursor, Codex, VS Code and other clients without bespoke glue. |
| Retrieval | `rg`, SQLite FTS5, Tantivy, Elasticsearch/OpenSearch, Qdrant, LanceDB, Chroma, Weaviate, Milvus, pgvector | Search wiki pages and raw sources; add semantic/hybrid retrieval only when simple search fails. |
| Graph retrieval | Microsoft GraphRAG, LightRAG, HippoRAG, RAPTOR-style hierarchical retrieval, LlamaIndex property graph indexes | Handle corpus-level, relationship-heavy and multi-hop questions. |
| Ingestion/conversion | MarkItDown, Docling, Unstructured, Apache Tika, Pandoc, OCRmyPDF, Tesseract, PaddleOCR, Whisper/faster-whisper, Playwright/Readability, tree-sitter | Normalize raw sources into Markdown, manifests and source pages before wiki synthesis. |
| Evaluation | Ragas, promptfoo, DeepEval, TruLens, LangSmith evals, Phoenix/Arize, custom lint reports | Measure retrieval quality, answer faithfulness, prompt regressions, red-team behavior and wiki usefulness. |
| Security | gitleaks, detect-secrets, trufflehog, Semgrep, CodeQL, OSV Scanner, Dependabot, pip-audit, Microsoft Presidio, garak, promptfoo red-team | Detect secrets/PII, prompt injection, dependency risks and unsafe generated write paths. |
| Publishing | MkDocs Material, Docusaurus, VitePress, Quartz, Astro/Starlight, Pagefind, `llms.txt`, JSONL, JSON-LD, GraphML, Mermaid | Publish human-readable and agent-readable subsets with explicit allowlists and redaction reports. |

## Recommendation rules

### Prefer ready-made implementation when

- the user's use case matches the tool's primary corpus;
- install and model configuration are acceptable;
- output is portable Markdown or reviewable git state;
- review/provenance controls are good enough for the user's risk level;
- the user values fast adoption over custom UX.

### Prefer custom stack when

- claim-level provenance is mandatory;
- data must remain local/offline;
- the team needs strict permissions and PR workflow;
- the user needs a product-specific UI or API;
- retrieval/index behavior must be measurable and replaceable;
- existing tools do not preserve human edits safely.

### Prefer retrieval framework over wiki-first workflow when

- machine retrieval is the primary product surface;
- the corpus is large and mostly machine-consumed;
- human-readable Markdown would be a derived view rather than the source of truth;
- access control, latency or throughput dominate the design.

## Minimum comparison table

When answering “which tool should I use?”, produce at least:

| Option | Fit | Setup effort | Data ownership | Provenance/review | Retrieval maturity | Agent integration | Lock-in risk | Notes |
|---|---:|---:|---:|---:|---:|---:|---:|---|

Do not list every project equally. Recommend one primary path and one fallback.

## Evidence discipline

Use these labels:

- `verified-current`: checked official source during the current answer.
- `verify-before-use`: known project/category but not freshly checked.
- `experimental`: useful idea, not a production default.
- `adjacent`: supports retrieval/memory/orchestration, but is not itself an LLM-Wiki.

## Sources to re-check

Seed URLs:

- https://github.com/langchain-ai/openwiki
- https://github.com/nashsu/llm_wiki
- https://github.com/vouchdev/vouch
- https://github.com/OpenBMB/RepoAgent
- https://github.com/microsoft/graphrag
- https://modelcontextprotocol.io/docs/getting-started/intro
- https://docs.langchain.com/oss/python/langgraph/overview
- https://haystack.deepset.ai/overview/intro
- https://developers.llamaindex.ai/python/framework/
- https://qdrant.tech/documentation/
- https://github.com/microsoft/markitdown
- https://github.com/docling-project/docling
- https://github.com/Unstructured-IO/unstructured
- https://docs.ragas.io/
- https://www.promptfoo.dev/docs/intro/
