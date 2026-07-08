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

For architecture-level details, use [`docs/15-implementation-deep-dive.md`](15-implementation-deep-dive.md). This registry is intentionally compact; the deep-dive note compares storage, retrieval, ingestion, MCP/API, governance, evaluation, security and reusable implementation patterns.

For MCP/API-specific details, use [`docs/17-mcp-api-integration.md`](17-mcp-api-integration.md). It covers wiki-specific MCP resources/tools/prompts, auth, governance, client compatibility and API facade design.

## Implementation families

| Family | Use when | Primary risks |
| --- | --- | --- |
| Full LLM-Wiki application | The user wants a ready-made personal or research knowledge app. | Lock-in, sync semantics, hidden generated state, cloud parser/model exposure. |
| Repo documentation agent | The corpus is a codebase and agents need architecture/module/change maps. | Docs drift, over-writing hand-written ADRs, stale code claims. |
| Review-gated agent memory | Agents should propose knowledge updates but humans approve final writes. | Review backlog, friction, schema mismatch with existing notes. |
| Compiler-first knowledge system | The user wants typed, cited, linted, queryable and exportable compiled wiki artifacts. | More operator complexity; quality depends on schema, review and eval discipline. |
| MCP-native wiki server | Agents need a semantic MCP/API contract over wiki resources and tools. | Tool overreach, weak auth, client compatibility drift, unsafe direct writes. |
| Obsidian/local-first workflow | The user already lives in Markdown and wants human-editable wiki pages. | Weak automation unless skills/hooks are added; sync conflicts. |
| Session-transcript wiki | Agent sessions are the raw source material. | Secrets, tokens and private paths in transcripts; source scope is narrow. |
| Graph-heavy local vault | The user wants broad ingestion, local graph exports and context packs. | Graph complexity can outpace review/provenance quality. |
| Retrieval/GraphRAG framework | Retrieval quality, scale or multi-hop reasoning is the main bottleneck. | Index complexity, opaque retrieval, weaker human-review surface. |
| Custom product/plugin/CLI | The workflow is specific enough that existing tools do not fit. | Building storage, review, security and eval discipline from scratch. |

## Seed registry: LLM-Wiki and repo-wiki implementations

| Project | Family | What to verify | Fit signal | Avoid when |
| --- | --- | --- | --- | --- |
| `langchain-ai/openwiki` | Repo documentation agent | License, supported providers, generated output, PR/GitHub Action behavior, instruction-file edits. | The user wants `openwiki/` repo docs and `AGENTS.md`/`CLAUDE.md` pointers for coding agents. | Personal second-brain or non-code corpora are the primary target. |
| `nashsu/llm_wiki` | Full desktop LLM-Wiki application | License, release activity, local/cloud model settings, API/MCP permissions, vector/search storage. | The user wants an app with desktop UI, graph, review, hybrid search, local API/MCP and Obsidian-compatible files. | The user requires a minimal CLI/git-only workflow or strict team PR review. |
| `vouchdev/vouch` | Review-gated agent memory / knowledge base | Claim model, MCP/CLI surface, review workflow, storage layout, integration adapters. | Agents should capture/propose knowledge while humans approve durable writes. | The user wants fully automatic wiki generation without human review. |
| `OpenBMB/RepoAgent` | Repository-level documentation generator | Language coverage, model configuration, hook behavior, generated docs path, maintenance status. | The user wants code documentation generation from AST/change tracking rather than a general wiki. | The user needs claim-level provenance and human-reviewed wiki pages. |
| `atomicstrata/llm-wiki-compiler` | Compiler-first knowledge system | Activity, package maturity, schema/eval behavior, MCP tools, OKF/export support. | The user wants a general-purpose knowledge compiler with typed pages, citations, lint/eval and exports. | The user needs a polished GUI or strict human approval boundary out of the box. |
| `microsoft/llmwiki` | MCP/editor-integrated wiki | VS Code integration, MCP auto-registration, storage model, license and maturity. | The user wants a VS Code-centered self-maintaining wiki with MCP registration. | The user needs a headless/server-first wiki or strict governance-first writes. |
| `geronimo-iia/llm-wiki` | MCP-native git-backed wiki engine | Tool surface, license, storage layout, git integration, graph behavior, write safety. | The user wants a headless git-backed wiki engine with many MCP tools. | The user needs desktop UX or a minimal read-only server. |
| `flsteven87/llm-wiki-mcp` | MCP-native local Markdown wiki | Alpha status, exact tools, local write semantics, security posture and schema behavior. | Useful as a compact Karpathy-style MCP wiki server pattern. | Do not recommend as production default without fresh verification. |
| `lelantvaris/llm-wiki-mcp` | MCP-native Markdown wiki server | URI abstraction, Docker/HTTP deployment, auth, write model and license. | Useful for a URI-agnostic wiki server and optional HTTP deploy pattern. | The user needs strict review-gated governance by default. |
| `ProfessionalWiki/mediawiki-mcp-server` | Existing wiki platform MCP wrapper | Supported MediaWiki operations, auth, write safety and deployment assumptions. | The user already has MediaWiki and wants MCP access. | The user wants local Markdown/git source of truth. |
| `langchain-ai/mcpdoc` | Documentation-to-MCP server | Input format, `llms.txt` support, client compatibility and update workflow. | The user wants documentation exposed through MCP rather than a full wiki authoring system. | The user needs proposal-write wiki maintenance. |
| `green-dalii/obsidian-llm-wiki` | Obsidian-native workflow | Plugin status, Obsidian API compatibility, local/cloud model use, vault write policy. | The user wants LLM-Wiki behavior inside an Obsidian vault. | The target is team repo docs or CI-managed docs. |
| `swarmclawai/swarmvault` | Graph-heavy local vault | License, ingestion surface, MCP behavior, graph/export formats, approval-bundle semantics. | The user values broad ingestion, graph exports, context packs and agent handoff. | The user wants the strictest claim-level approval gate or a minimal setup. |
| `lucasastorian/llmwiki` | MCP-driven local/hosted wiki | Storage abstraction, hosted mode, MCP workflow, OCR/parser settings, review policy. | The user wants a local/hosted product architecture pattern around MCP-driven wiki writing. | Governance must be Vouch-style by default. |
| `Pratiyush/llm-wiki` | Session-transcript wiki | Supported agent transcript formats, redaction, exports, MCP tools, graph viewer status. | The user's main raw sources are Claude Code, Codex, Cursor, Copilot or Gemini sessions. | The primary corpus is heterogeneous documents rather than session history. |
| `ussumant/llm-wiki-compiler`, `nvk/llm-wiki`, `ddsyasas/llm-wiki`, other small projects | Experimental or smaller implementations | Whether the repository is active, installable, documented and compatible with current agents. | Useful for design comparison and implementation ideas. | Do not recommend as a production default without fresh verification. |

## Adjacent framework registry

| Layer | Projects/frameworks | Use in LLM-Wiki |
| --- | --- | --- |
| Agent orchestration | LangGraph, LangChain agents, LlamaIndex Workflows/Agents, Haystack pipelines, AutoGen, CrewAI, Semantic Kernel | Coordinate ingest, query, review, lint, scheduled maintenance and human-in-the-loop workflows. |
| MCP integration | MCP SDKs, FastMCP-style servers, local MCP servers, MCP Inspector, MCP registry/server-card metadata | Expose wiki resources and tools to Claude Code, ChatGPT, Cursor, Codex, VS Code, GitHub Copilot and other clients without bespoke glue. |
| Retrieval | `rg`, SQLite FTS5, Tantivy, Elasticsearch/OpenSearch, Qdrant, LanceDB, Chroma, Weaviate, Milvus, pgvector | Search wiki pages and raw sources; add semantic/hybrid retrieval only when simple search fails. |
| Graph retrieval | Microsoft GraphRAG, LightRAG, HippoRAG, RAPTOR-style hierarchical retrieval, LlamaIndex property graph indexes | Handle corpus-level, relationship-heavy and multi-hop questions. |
| Ingestion/conversion | MarkItDown, Docling, Unstructured, Apache Tika, Pandoc, OCRmyPDF, Tesseract, PaddleOCR, Whisper/faster-whisper, Playwright/Readability, tree-sitter | Normalize raw sources into Markdown, manifests and source pages before wiki synthesis. |
| Evaluation | Ragas, promptfoo, DeepEval, TruLens, LangSmith evals, Phoenix/Arize, custom lint reports | Measure retrieval quality, answer faithfulness, prompt regressions, red-team behavior and wiki usefulness. |
| Security | gitleaks, detect-secrets, trufflehog, Semgrep, CodeQL, OSV Scanner, Dependabot, pip-audit, Microsoft Presidio, garak, promptfoo red-team | Detect secrets/PII, prompt injection, dependency risks and unsafe generated write paths. |
| Publishing/API | MkDocs Material, Docusaurus, VitePress, Quartz, Astro/Starlight, Pagefind, `llms.txt`, JSONL, JSON-LD, GraphML, OpenAPI, MCP Apps | Publish human-readable, agent-readable and API-consumable subsets with explicit allowlists and redaction reports. |

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

### Prefer MCP/API-first design when

- multiple agent clients need the same wiki context;
- a local/hosted product must expose a stable semantic contract;
- cloud/autonomous clients need a read-only search/fetch surface;
- governance requires proposal-write and admin tools to be separated;
- CI or external services need a REST/OpenAPI facade.

## Minimum comparison table

When answering “which tool should I use?”, produce at least:

| Option | Fit | Setup effort | Data ownership | Provenance/review | Retrieval maturity | Agent integration | Lock-in risk | Notes |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | --- |

For implementation-level comparison, use this extended table:

| Project | Archetype | License | Maturity | Storage | Retrieval | Ingestion | MCP/API | Review/provenance | Eval/security | Best idea to adopt | Risks |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |

Do not list every project equally. Recommend one primary path and one fallback.

## Evidence discipline

Use these labels:

- `verified-current`: checked official source during the current answer.
- `verify-before-use`: known project/category but not freshly checked.
- `experimental`: useful idea, not a production default.
- `adjacent`: supports retrieval/memory/orchestration, but is not itself an LLM-Wiki.

## Sources to re-check

Seed URLs:

- <https://github.com/langchain-ai/openwiki>
- <https://github.com/nashsu/llm_wiki>
- <https://github.com/vouchdev/vouch>
- <https://github.com/OpenBMB/RepoAgent>
- <https://github.com/atomicstrata/llm-wiki-compiler>
- <https://github.com/microsoft/llmwiki>
- <https://github.com/geronimo-iia/llm-wiki>
- <https://github.com/flsteven87/llm-wiki-mcp>
- <https://github.com/lelantvaris/llm-wiki-mcp>
- <https://github.com/ProfessionalWiki/mediawiki-mcp-server>
- <https://github.com/langchain-ai/mcpdoc>
- <https://github.com/swarmclawai/swarmvault>
- <https://github.com/green-dalii/obsidian-llm-wiki>
- <https://github.com/lucasastorian/llmwiki>
- <https://github.com/Pratiyush/llm-wiki>
- <https://github.com/microsoft/graphrag>
- <https://modelcontextprotocol.io/docs/getting-started/intro>
- <https://modelcontextprotocol.io/specification/2025-11-25>
- <https://modelcontextprotocol.io/docs/tutorials/security/security_best_practices>
- <https://docs.langchain.com/oss/python/langgraph/overview>
- <https://haystack.deepset.ai/overview/intro>
- <https://developers.llamaindex.ai/python/framework/>
- <https://qdrant.tech/documentation/>
- <https://github.com/microsoft/markitdown>
- <https://github.com/docling-project/docling>
- <https://github.com/Unstructured-IO/unstructured>
- <https://docs.ragas.io/>
- <https://www.promptfoo.dev/docs/intro/>
