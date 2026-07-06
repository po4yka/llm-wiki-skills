---
name: llm-wiki-faq
description: Answer evidence-backed user questions and objections about LLM-Wiki. Use when the user asks why LLM-Wiki is needed, what benefits they will get, whether there is comparative evidence, how to keep the wiki alive, whether Obsidian is required, or how LLM-Wiki compares with RAG, GraphRAG, agent memory, docs-as-code, or ordinary notes.
license: MIT
compatibility: Designed for Agent Skills-compatible coding agents. Browse and cite fresh sources for current ecosystem, tool maturity, pricing, release, or benchmark claims.
metadata:
  author: po4yka
  version: "0.1.0"
---

# LLM-Wiki FAQ

## Goal

Give users concrete, evidence-aware answers to common LLM-Wiki adoption questions without overclaiming.

## When to use

Use when the user asks:

- "Why do I need this?"
- "What benefits will I get?"
- "Is there evidence this works?"
- "Is this better than RAG?"
- "How do I keep it alive?"
- "Do I need Obsidian?"
- "Is this just another note-taking system?"
- "Will this become slop?"
- "What should I measure?"

## Required reference

Read `references/evidence-pack.md` when available. For repository-level docs, also read `docs/12-evidence-and-faq.md` when available.

## Evidence policy

Use three evidence levels:

1. **Direct evidence**: LLM-Wiki-specific papers, benchmarks or implementations.
2. **Adjacent evidence**: GraphRAG, global RAG, long-term memory, context engineering and long-context studies that support the mechanism.
3. **Local evidence**: the user's own metrics after adoption: retrieval hit rate, answer reuse, review backlog, stale pages and output beyond the vault.

Always distinguish these levels. Do not claim that adjacent evidence proves every LLM-Wiki implementation will work.

## Procedure

### 1. Identify the user's objection

Map the question to one of:

| User question | Core answer |
|---|---|
| Why is this needed? | It reduces repeated context reconstruction and wiki bookkeeping cost. |
| What benefits? | Faster recall, reusable research, decision memory, better agent context and auditable knowledge. |
| Evidence? | Direct evidence is early; adjacent evidence strongly supports structured persistent memory and precomputed corpus structure. |
| Better than RAG? | Not universally; use LLM-Wiki for durable synthesis and RAG/search for retrieval. |
| Keep alive? | Use capture -> triage -> ingest -> query -> file-back -> lint -> review -> refresh. |
| Need Obsidian? | No; Obsidian is a good UI, not the core pattern. |

### 2. Answer with the right level of confidence

Use language like:

- "The strongest direct evidence I found is..."
- "This is adjacent evidence, not a direct proof of personal LLM-Wiki."
- "The local decision should be based on a 2-4 week pilot and metrics."
- "For your case, the key benefit is..."

Avoid:

- "LLM-Wiki is proven better than RAG."
- "Obsidian is required."
- "The wiki will stay correct automatically."
- "More notes means more value."

### 3. Use the core argument

The central argument:

> LLM-Wiki is useful when raw sources are already plentiful but reusable context is scarce. It turns raw material into an inspectable, versioned, agent-readable knowledge layer and makes maintenance cheap enough to keep running.

### 4. Cite or name evidence

For current facts, browse and cite. For static bundled evidence, summarize the source map from `references/evidence-pack.md`.

Important sources to know:

- LangChain Wiki Memory: wiki memory as compact, persistent, agent-readable knowledge layer.
- Anthropic context engineering: context is finite; agents benefit from just-in-time file/context navigation.
- Lost in the Middle: long context alone is unreliable.
- GraphRAG / GlobalRAG: flat chunk retrieval struggles on global/corpus-level questions.
- Mem0 / MemMachine: persistent structured memory can outperform full-context or naive RAG baselines.
- 2026 LLM-Wiki retrieval paper: early direct evidence on multi-hop and structured queries.

### 5. Offer a pilot instead of a leap of faith

Recommend a bounded pilot:

```text
20-50 sources
10-20 real questions
weekly lint
file back reusable answers
measure retrieval hit rate and answer reuse
```

### 6. Route to the next skill

- Needs solution choice: `llm-wiki-choose`.
- Needs setup: `llm-wiki-setup`.
- Has existing docs: `llm-wiki-doctor` then `llm-wiki-migration-planner`.
- Needs evidence measurement: `llm-wiki-eval`.
- Worries about slop: `llm-wiki-trust-audit` and `llm-wiki-provenance`.
- Asks about Obsidian: `llm-wiki-obsidian-hardening` if they already use it; otherwise `llm-wiki-local-first-stack`.

## Output

Use this shape:

```markdown
## Direct answer

## Why this matters for your case

## Evidence level

## Trade-offs and failure modes

## Small pilot / next step
```

## Safety gates

- Do not overstate evidence.
- Do not treat generated summaries as proof.
- Do not recommend cloud processing for sensitive material without explicit approval.
- Do not recommend Obsidian by default.
- Do not say the wiki stays alive automatically; explain the maintenance loop.
