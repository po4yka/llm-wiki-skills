# LLM-Wiki evidence pack

> Purpose: compact evidence and talking points for the `llm-wiki-faq` skill.
> Current as of: 2026-07-06

## Core stance

LLM-Wiki is not proven to be universally better than RAG, Obsidian, GraphRAG, agent memory, or docs-as-code. The correct claim is narrower:

> LLM-Wiki is a strong pattern when users need durable, inspectable, reusable domain knowledge that agents can maintain over time, especially when recurring queries require synthesis across sources rather than one-shot chunk retrieval.

## Evidence hierarchy

### 1. Direct LLM-Wiki evidence

**Retrieval as Reasoning: Self-Evolving Agent-Native Retrieval via LLM-Wiki** reports that LLM-Wiki outperforms several graph/RAG baselines on multi-hop and structured-query benchmarks.

> verify-before-use: Re-open the paper before quoting exact F1, accuracy, dataset or baseline numbers. This skill intentionally avoids carrying repeated exact benchmark figures.

Use carefully:

- It supports wiki-structured retrieval for multi-hop and structured queries.
- It does not prove that any personal Obsidian vault will outperform every RAG system.

Source: https://arxiv.org/abs/2605.25480

### 2. Wiki memory ecosystem evidence

LangChain describes wiki memory as an emerging pattern where an agent turns raw source data into a compact, persistent, agent-readable knowledge layer. It explicitly distinguishes this from basic RAG: RAG usually retrieves raw chunks at query time, while a wiki precomputes and maintains higher-level synthesis.

Source: https://www.langchain.com/blog/wiki-memory

OpenWiki applies the pattern to codebases. Its argument: coding agents write better code when they understand where key logic lives, how files connect and which patterns the repo expects; docs are hard to keep current, so OpenWiki creates and updates a repo wiki and connects it via instruction-file pointers.

Source: https://www.langchain.com/blog/introducing-openwiki-an-open-source-agent-for-repo-documentation

### 3. GraphRAG and global-RAG evidence

GraphRAG shows that naive RAG struggles with global questions over a corpus, such as identifying themes across a dataset. It reports substantial improvements over naive RAG in comprehensiveness and diversity for global sensemaking questions over roughly million-token datasets.

Source: https://arxiv.org/abs/2404.16130

GlobalQA / GlobalRAG shows that many RAG methods perform poorly on corpus-level tasks such as counting, sorting, extrema and top-k extraction, while a global-retrieval strategy improves corpus-level question answering.

Source: https://arxiv.org/abs/2510.26205

### 4. Long-term memory evidence

Mem0 reports persistent memory improvements over multiple baseline categories, including RAG variants and full-context processing, with better judge-rated quality and lower latency/cost than full-context processing.

Source: https://arxiv.org/abs/2504.19413

MemMachine argues for preserving ground-truth episodes and reducing lossy extraction. It reports strong accuracy-efficiency tradeoffs on LoCoMo, LongMemEvalS and noisy multi-hop retrieval.

Source: https://arxiv.org/abs/2604.04853

Infini Memory treats memory as topic-structured documents and reports 64.7% overall score on MemoryAgentBench. This is adjacent evidence for topic documents as a maintainable memory substrate.

Source: https://arxiv.org/abs/2606.10677

### 5. Context engineering evidence

Lost in the Middle shows that long-context models do not reliably use information equally across long inputs; performance often degrades when relevant information is in the middle of the context.

Source: https://arxiv.org/abs/2307.03172

Anthropic's context-engineering guidance says context is finite and should be curated. It describes just-in-time context where agents maintain lightweight identifiers such as file paths, stored queries and web links, then load data at runtime through tools. Claude Code is described as using `CLAUDE.md` up front plus glob/grep-style navigation.

Source: https://www.anthropic.com/engineering/effective-context-engineering-for-ai-agents

## Standard answers

### Why is this needed?

Because the user's bottleneck is often not storage but reusable context. LLM-Wiki turns raw material into a persistent, inspectable, agent-readable layer and makes the maintenance work cheap enough to repeat.

### What benefits will I get?

Expected benefits:

- faster context recovery;
- reusable research and saved answers;
- better cross-document synthesis;
- decision memory;
- better context for coding agents;
- visible trust gaps through lint/provenance/review states.

Measure benefits through retrieval hit rate, answer reuse, read/write ratio, stale page count, review backlog and output beyond the vault.

### Is there proof?

Answer with nuance:

- Direct LLM-Wiki benchmark evidence exists but is early.
- Adjacent evidence from GraphRAG/global-RAG/memory/context-engineering strongly supports the mechanisms.
- The user's own pilot metrics should decide whether adoption is worth it.

### Is it better than RAG?

Not universally. Use this comparison:

| Need | Better default |
|---|---|
| one-shot factual lookup | RAG/search |
| durable synthesis and reuse | LLM-Wiki |
| global/corpus-level questions | wiki/GraphRAG/global-RAG style structure |
| human audit and git history | Markdown LLM-Wiki |
| high-volume machine retrieval | RAG/GraphRAG as primary infra |

### How do I keep it alive?

Run the loop:

```text
capture -> triage -> ingest -> query -> file-back -> lint -> review -> refresh
```

The two most important habits:

1. Save good answers back into the wiki.
2. Run lint and review stale/unsupported/contradictory claims.

### Do I need Obsidian?

No. Obsidian is a good UI, not a requirement.

Use Obsidian when the user wants a human-friendly local Markdown vault with backlinks, graph view, manual editing, mobile capture and existing note-taking habits.

Do not require Obsidian for repo docs, team docs-as-code, or users who want a minimal stack:

```text
Markdown + git + ripgrep + AGENTS.md/CLAUDE.md + skills
```

## Adoption objection answers

### I am not a developer. How do I work with this?

Do not make git literacy a prerequisite. Recommend a user-facing capture surface and hide repository mechanics behind an agent or maintainer workflow.

Good answer:

> You can add knowledge through a browser, Obsidian, a form, Telegram/email or a Confluence-style surface. The agent/maintainer layer can turn that into `raw/`, `wiki/`, provenance and review states. Git/PRs are useful for history and trust, but they do not need to be your daily interface.

### Confluence only needs a browser. Why should I create MRs and sync branches?

Agree with the objection. If every small contribution requires manual branch sync and PR/MR discipline, the rollout is badly designed.

Good answer:

> Capture should be as easy as Confluence. PR/MR review should be reserved for promotion to trusted, public, regulated or CODEOWNERS-owned knowledge. Ordinary additions should go through an append-only inbox, browser edit, form or bot, then be batched into review by the agent.

### Will tokens be enough as the wiki grows?

Good answer:

> Yes, if the agent does not paste the whole wiki into the prompt. It should read a small instruction pointer, then `wiki/index.md`, then search and open only relevant pages. Raw sources are loaded only when verification is required. Token explosion is a design smell, not a reason to abandon the pattern.

### Is this knowledge for agents or humans?

Good answer:

> Both. Agents need stable paths, frontmatter, links and indexes. Humans need readable pages, source links, review status and visible uncertainty. If humans cannot read and challenge the page, it is not documentation; it is an opaque agent cache.

### What about LLM slop?

Generated text is not automatically knowledge. It becomes trusted only after source anchoring and review.

Controls:

- raw sources preserved;
- provenance links;
- `status: draft|reviewed|verified|stale|archived`;
- `review_required` and confidence fields;
- protected human synthesis sections;
- lint for unsupported/stale/contradictory claims.

### What content can I upload, and how do I handle sensitive data?

Almost any knowledge-bearing material can be captured, but it must be classified first.

| Data class | Default handling |
|---|---|
| Public | Normal wiki flow; cloud or local models if policy permits. |
| Internal | Private storage and model policy required. |
| Confidential | Prefer local or approved private provider; redact before cloud. |
| Restricted / regulated | Do not ingest by default; explicit approval, minimization and retention rules. |
| Secrets | Never ingest; rotate if captured. |

Route to privacy/security/model-policy skills when the user mentions sensitive data, customer data, PII, credentials, retention, provider boundaries or publishing.

## Failure modes to disclose

- Wiki grows but is not read.
- Generated pages look official but lack provenance.
- Human synthesis is overwritten.
- Lint reports are ignored.
- Review backlog becomes invisible.
- The user collects notes instead of producing outputs.
- The corpus is too small to justify the workflow.
- Sensitive material is routed to cloud models without a policy.
- Non-developers are forced into git/PR/MR workflow for ordinary capture.
- The entire wiki is pasted into model context instead of being navigated.

## Pilot recommendation

For skeptical users, propose a pilot:

```text
20-50 sources
10-20 real questions
1-2 weeks of capture + ingest
weekly lint
answer file-back
measure retrieval hit rate and reuse
```

Success is not more notes. Success is fewer repeated context-reconstruction sessions and more useful outputs.
