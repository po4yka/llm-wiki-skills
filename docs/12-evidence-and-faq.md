# Evidence-backed FAQ for LLM-Wiki

> Status: draft
> Scope: аргументы, сравнительные данные и честные оговорки для ответов пользователям, которые спрашивают «зачем LLM-Wiki», «что я получу», «есть ли доказательства», «как поддерживать живой wiki» и «нужен ли Obsidian».
> Current as of: 2026-07-06

## How to use this document

This document is a **talking-points and evidence map**, not a proof that every LLM-Wiki implementation will work for every user.

When answering a user:

1. Start with the user's actual pain.
2. Use one concise thesis.
3. Distinguish direct LLM-Wiki evidence from adjacent evidence.
4. State failure modes and when not to use the pattern.
5. Route to a concrete next skill.

## One-sentence answer

LLM-Wiki is useful when the user repeatedly loses context across research, codebases, documents or decisions, because it turns raw sources into a persistent, inspectable, agent-readable knowledge layer that can be searched, linted, updated and reused.

## The honest evidence hierarchy

| Evidence level | What it supports | Strength | Caveat |
|---|---|---|---|
| Direct LLM-Wiki benchmark | Wiki-structured retrieval can outperform strong RAG/GraphRAG baselines on multi-hop and structured queries. | Promising | Early research; not proof for every personal second-brain workflow. |
| GraphRAG / global RAG research | Precomputed structure helps with corpus-level/global questions where naive chunk retrieval struggles. | Strong adjacent evidence | GraphRAG is not the same as human-readable Markdown LLM-Wiki. |
| Long-term memory research | Persistent structured memory beats full-context or naive RAG in long multi-session settings. | Strong adjacent evidence | Often conversational memory, not domain wiki. |
| Context engineering research | Context is finite; dumping everything into the prompt degrades reliability; just-in-time file/context navigation is valuable. | Strong mechanism evidence | Does not prescribe LLM-Wiki specifically. |
| OpenWiki / wiki memory ecosystem | Major agent tooling ecosystems are converging on wiki memory for repo docs and durable agent context. | Market/practice signal | Product maturity changes quickly. |
| Local experience metrics | Retrieval hit rate, answer reuse, review backlog and output beyond vault show whether it works for this user. | Most decision-relevant | Requires measurement after adoption. |

## Why is this needed?

Use this answer when the user asks: **«Зачем это нужно?»**

LLM-Wiki solves a compounding problem, not a storage problem. Users already have sources: notes, docs, chats, PRs, PDFs, bookmarks, transcripts, meeting notes and code. The problem is that raw sources do not automatically become reusable knowledge.

The bottleneck is bookkeeping:

- remembering what exists;
- linking related pages;
- refreshing stale summaries;
- preserving decision context;
- turning good chat answers into durable pages;
- finding contradictions;
- separating raw evidence from human synthesis.

Traditional human-maintained wikis decay because maintenance is tedious. LLM-Wiki makes that maintenance cheap enough to run continuously, while keeping the result as inspectable Markdown under git.

### Good formulation

> You do not need LLM-Wiki because Markdown is magical. You need it if your knowledge work keeps paying the same context-reconstruction tax. LLM-Wiki turns that tax into reusable infrastructure.

### Bad formulation

> LLM-Wiki is better than all RAG and all note-taking systems.

Do not say that. LLM-Wiki is a pattern with a clear fit, not a universal replacement.

## What benefits should a user expect?

Use this answer when the user asks: **«Какие преимущества я получу?»**

### Personal workflow benefits

| Benefit | What changes | How to measure |
|---|---|---|
| Faster context recovery | The user can restart a topic from `wiki/index.md`, query pages and decision logs. | Time to answer «where did I stop?» |
| Better reuse of research | Good answers are saved into `wiki/queries/` or `wiki/synthesis/`. | Answer reuse rate. |
| Cross-domain links | Agent lint can find old related pages the user forgot. | Surprise rate in random-page review. |
| Less chat exhaust | Useful chat outputs become durable pages. | % of useful answers filed back. |
| Safer AI assistance | Raw sources, provenance and review states make generated knowledge auditable. | Provenance coverage and review backlog. |

### Team benefits

| Benefit | What changes | How to measure |
|---|---|---|
| Onboarding | New people and agents start from maintained maps rather than folklore. | Onboarding questions answered from wiki. |
| Bus factor reduction | Decisions and tacit knowledge survive people leaving. | Decision pages with evidence. |
| Better coding agents | Agents find architecture, module maps and conventions without bloating `AGENTS.md`. | Fewer context-related coding mistakes. |
| Documentation freshness | Scheduled lint/update PRs keep docs closer to the code. | Stale page count and docs PR cadence. |
| Decision provenance | «Why did we do this?» gets a traceable answer. | ADR/decision coverage. |

## Is there evidence that it works better than other approaches?

Use this answer when the user asks: **«Есть доказательные/сравнительные данные?»**

### Short answer

There is early direct evidence for LLM-Wiki-style retrieval, plus stronger adjacent evidence from GraphRAG, global RAG, long-term memory and context-engineering research. The honest position is: **the mechanisms are well-supported; the full personal-LLM-Wiki pattern still needs more public benchmarks.**

### Direct LLM-Wiki evidence

The 2026 paper **“Retrieval as Reasoning: Self-Evolving Agent-Native Retrieval via LLM-Wiki”** reports that LLM-Wiki outperforms seven baselines, including HippoRAG 2, LightRAG and GraphRAG, with **2.0–8.1 F1 point gains over the strongest graph-based baseline** on HotpotQA, MuSiQue and 2WikiMultiHopQA, and also performs best overall on AuthTrace.

How to use this claim:

- Good: “There is early benchmark evidence that wiki-structured retrieval can beat strong graph/RAG baselines on multi-hop and structured queries.”
- Bad: “This proves my personal Obsidian LLM-Wiki will beat every RAG system.”

Source: https://arxiv.org/abs/2605.25480

### GraphRAG and global-RAG evidence

GraphRAG research supports the core idea that precomputing structure helps with questions over an entire corpus. The Microsoft GraphRAG paper states that naive RAG struggles with global questions such as “What are the main themes in the dataset?” and reports substantial improvements in comprehensiveness and diversity over a naive RAG baseline on global sensemaking questions over roughly million-token datasets.

Source: https://arxiv.org/abs/2404.16130

GlobalQA / GlobalRAG is another adjacent signal. The paper reports that existing RAG methods perform poorly on corpus-level tasks such as counting, sorting, extrema and top-k extraction; its GlobalRAG framework achieved **6.63 F1** versus the strongest baseline's **1.51 F1** on Qwen2.5-14B.

Source: https://arxiv.org/abs/2510.26205

How to use these claims:

- LLM-Wiki is not GraphRAG.
- But both support the same mechanism: when users ask global/cross-document questions, flat chunk retrieval is often not enough.

### Memory evidence

Mem0 reports that persistent memory outperforms six baseline categories on LOCOMO, including RAG variants and full-context approaches, with **26% relative improvement** in the LLM-as-a-Judge metric over OpenAI memory and **91% lower p95 latency** plus **over 90% token-cost savings** versus full-context processing.

Source: https://arxiv.org/abs/2504.19413

MemMachine is a 2026 memory system that argues for preserving ground-truth episodes and reducing lossy extraction; it reports strong results on LoCoMo, LongMemEvalS and multi-hop retrieval tasks. This supports an important LLM-Wiki safety idea: keep raw sources/episodes and build structured views on top, rather than trusting summaries alone.

Source: https://arxiv.org/abs/2604.04853

### Context-engineering evidence

Long context is not a free replacement for a wiki. “Lost in the Middle” shows that model performance can degrade when relevant information is placed in the middle of long contexts, even for explicitly long-context models.

Source: https://arxiv.org/abs/2307.03172

Anthropic's context-engineering guidance argues that context is finite and should be treated as a scarce resource; it describes just-in-time context patterns where agents keep lightweight identifiers such as file paths, stored queries and web links, then load data through tools when needed. It also says Claude Code uses `CLAUDE.md` up front plus glob/grep-style navigation at runtime.

Source: https://www.anthropic.com/engineering/effective-context-engineering-for-ai-agents

LLM-Wiki fits this mechanism: it gives the agent a small map (`index.md`) and a file-based knowledge layer to explore on demand.

### Ecosystem evidence

LangChain's “Wiki Memory” article describes an emerging pattern: agents turn raw source data into a compact, persistent, agent-readable knowledge layer. It distinguishes this from basic RAG because RAG usually retrieves raw chunks at query time, while a wiki precomputes and maintains higher-level synthesis.

Source: https://www.langchain.com/blog/wiki-memory

OpenWiki applies this to codebases: it generates repo documentation, connects it through instruction-file pointers, and can update via GitHub Action from git diffs. This is practical evidence that the pattern is being productized for coding agents.

Source: https://www.langchain.com/blog/introducing-openwiki-an-open-source-agent-for-repo-documentation

## Is LLM-Wiki better than RAG?

Use this answer when the user asks: **«Это лучше RAG?»**

Not always. A better framing:

| Case | Prefer |
|---|---|
| User asks precise factual questions over many raw documents | RAG or hybrid search may be enough. |
| User asks recurring questions where answers should improve over time | LLM-Wiki adds compounding value. |
| User asks global/cross-document questions | Wiki/GraphRAG/global-RAG style structure is often better than naive chunk retrieval. |
| User needs human review and git history | Markdown LLM-Wiki is easier to audit. |
| User needs high-volume machine retrieval only | RAG/GraphRAG may be better primary infrastructure. |

The practical default is hybrid:

```text
LLM-Wiki for durable synthesis and navigation
+ lexical/semantic retrieval for finding relevant pages and raw evidence
+ provenance/lint for trust
```

## How do I maintain a living LLM-Wiki?

Use this answer when the user asks: **«Как поддерживать живой LLM-Wiki?»**

A living wiki needs a loop, not just an initial import.

### Minimum viable loop

```text
capture -> triage -> ingest -> query -> file back -> lint -> review -> refresh
```

### Operational rules

1. **Capture quickly.** Put messy material into `inbox/` or `raw/` without filing decisions.
2. **Preserve raw sources.** Do not let generated summaries replace source evidence.
3. **Ingest in two steps.** Analyze first; write wiki pages second.
4. **File back good answers.** Good chat answers become `wiki/queries/` or `wiki/synthesis/` pages.
5. **Run lint regularly.** Detect broken links, orphan pages, stale pages, unsupported claims and contradictions.
6. **Use review states.** Default generated content to `status: draft` and `review_required: true`.
7. **Refresh time-sensitive pages.** Use `stale_after` and scheduled review.
8. **Measure usefulness.** Track retrieval hit rate, answer reuse, read/write ratio, review backlog and output beyond vault.

### Suggested cadence

| Cadence | Work |
|---|---|
| Daily | Capture and quick triage. |
| Weekly | Ingest important sources, run `wiki-lint`, review high-priority issues. |
| Monthly | Run `llm-wiki-eval`, refresh stale pages, prune or merge low-value pages. |
| Quarterly | Random-page review, archive dead areas, update taxonomy and workflows. |

### Stop conditions

Pause automation if:

- the wiki grows but is not read;
- lint reports are ignored;
- generated pages cannot be traced to sources;
- human synthesis gets overwritten;
- review backlog becomes invisible;
- users stop trusting the wiki.

## Do I need Obsidian?

Use this answer when the user asks: **«Нужно ли мне использовать Obsidian?»**

No. Obsidian is a good reading and editing surface, not a requirement.

### Use Obsidian when

- you already use Obsidian;
- you want a human-friendly local Markdown vault;
- wikilinks/backlinks/graph view help you review the wiki;
- you want mobile capture and manual editing;
- your primary workflow is personal or research-heavy.

### Do not start with Obsidian when

- the main use case is codebase documentation in a GitHub repo;
- the team already lives in docs-as-code, MkDocs, Docusaurus or GitHub;
- you need strict PR-based review and permissions first;
- you only need a small repo wiki for coding agents;
- you do not want another UI.

### Minimal non-Obsidian stack

```text
Markdown files + git + ripgrep + AGENTS.md/CLAUDE.md + skills
```

This is enough to start. Add Obsidian if the user wants a better human reading/editing surface. Add qmd or hybrid retrieval only when `index.md` and `rg` stop being enough.

## When not to use LLM-Wiki

Do not recommend LLM-Wiki when:

- the corpus is tiny and `rg`/search already works;
- the user will not review generated knowledge;
- the user wants a fully automatic truth engine;
- sensitive material would be sent to cloud models without a policy;
- the knowledge changes too fast for wiki maintenance;
- the user needs only short-term task state;
- there is no output beyond collecting notes.

## Recommended answer templates

### “Зачем мне это?”

> Вам это нужно, если вы снова и снова платите налог на восстановление контекста: перечитываете старые документы, заново объясняете агенту проект, теряете хорошие ответы в чатах и не можете быстро ответить «почему мы так решили». LLM-Wiki превращает сырые источники в живой Markdown-слой, который агент может поддерживать, а человек — проверять.

### “Что я получу?”

> Ожидаемый выигрыш: быстрее возвращаться к темам, переиспользовать прошлые исследования, не терять хорошие ответы, поддерживать decision memory, давать coding agents карту проекта и видеть, где знания устарели или не имеют источников. Это стоит измерять не числом заметок, а retrieval hit rate, reuse rate, review backlog и output beyond vault.

### “Есть доказательства?”

> Прямые benchmark’и именно LLM-Wiki пока ранние, но уже есть работа 2026 года, где LLM-Wiki обходит семь baseline’ов, включая GraphRAG/LightRAG/HippoRAG 2, на multi-hop задачах. Сильнее доказан общий механизм: GraphRAG/global-RAG показывают, что предвычисленная структура помогает на corpus-level вопросах, memory-системы показывают пользу persistent memory, а long-context исследования показывают, что просто загрузить всё в контекст недостаточно.

### “Как поддерживать живым?”

> Нужен цикл: capture → triage → ingest → query → file-back → lint → review → refresh. Самый важный шаг — сохранять хорошие ответы обратно в wiki и регулярно запускать lint, который ищет stale claims, unsupported claims, contradictions и orphan pages.

### “Нужен Obsidian?”

> Нет. Obsidian — хороший интерфейс для человека, но не ядро паттерна. Ядро — Markdown, git, raw/wiki/schema, index/log и skills. Obsidian стоит брать, если вам нужен удобный local-first vault с backlinks и ручным чтением. Для repo docs или команды часто лучше начать с docs-as-code и PR-based workflow.

## Source map

Primary and adjacent sources to re-check before making strong claims:

- Karpathy LLM-Wiki idea: https://gist.github.com/karpathy/442a6bf555914893e9891c11519de94f
- LangChain Wiki Memory: https://www.langchain.com/blog/wiki-memory
- LangChain OpenWiki: https://www.langchain.com/blog/introducing-openwiki-an-open-source-agent-for-repo-documentation
- OpenWiki repository: https://github.com/langchain-ai/openwiki
- Anthropic context engineering: https://www.anthropic.com/engineering/effective-context-engineering-for-ai-agents
- Lost in the Middle: https://arxiv.org/abs/2307.03172
- GraphRAG: https://arxiv.org/abs/2404.16130
- GlobalQA / GlobalRAG: https://arxiv.org/abs/2510.26205
- Mem0: https://arxiv.org/abs/2504.19413
- MemMachine: https://arxiv.org/abs/2604.04853
- Retrieval as Reasoning via LLM-Wiki: https://arxiv.org/abs/2605.25480
- Infini Memory: https://arxiv.org/abs/2606.10677

## Re-verification rules

Re-check before answering with exact current facts about:

- OpenWiki maturity, stars, releases and supported providers;
- Obsidian plugin ecosystem and CLI status;
- qmd installation and capabilities;
- model/provider privacy and retention claims;
- Agent Skills CLI syntax and supported agents;
- new LLM-Wiki papers or benchmark results.
