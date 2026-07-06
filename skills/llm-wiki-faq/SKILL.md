---
name: llm-wiki-faq
description: Answer evidence-backed user questions and objections about LLM-Wiki. Use when the user asks why LLM-Wiki is needed, what benefits they will get, whether there is comparative evidence, how to keep the wiki alive, whether Obsidian is required, whether non-developers can use it, whether PR/MR workflows are too heavy, whether tokens will be enough, whether docs are for humans or agents, or how to handle sensitive data.
license: MIT
compatibility: Designed for Agent Skills-compatible coding agents. Browse and cite fresh sources for current ecosystem, tool maturity, pricing, release, or benchmark claims.
metadata:
  author: po4yka
  version: "0.1.1"
---

# LLM-Wiki FAQ

## Goal

Give users concrete, evidence-aware answers to common LLM-Wiki adoption questions without overclaiming. Prefer practical operating models over hype.

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
- "I am not a developer; how would I use this?"
- "Why should I deal with PRs/MRs when Confluence only needs a browser?"
- "Will the wiki fit in the model context as it grows?"
- "Is this knowledge for agents or humans?"
- "What content can I upload, and what about sensitive data?"

## Required references

Read these when available:

1. `references/evidence-pack.md` for evidence-backed adoption arguments.
2. `references/adoption-objections.md` for non-developer, Confluence/browser, token, human-readable, slop and sensitive-data objections.
3. Repository-level docs:
   - `docs/12-evidence-and-faq.md`
   - `docs/20-adoption-objections.md`

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
| Not a developer? | Use browser/Obsidian/form/chat capture; git/PRs can be hidden behind agent and maintainer workflows. |
| Confluence is easier? | Capture should be as easy as Confluence; PR/MR review is only for trusted/published/verified knowledge. |
| Tokens enough? | Do not paste the whole wiki; load `index.md`, search, and open relevant pages progressively. |
| Agents or humans? | Both; Markdown must stay human-readable, source-backed and reviewable, not an opaque agent cache. |
| Sensitive content? | Classify data first; route public/internal/confidential/restricted/secrets through different storage/model policies. |

### 2. Answer with the right level of confidence

Use language like:

- "The strongest direct evidence I found is..."
- "This is adjacent evidence, not a direct proof of personal LLM-Wiki."
- "The local decision should be based on a 2-4 week pilot and metrics."
- "For your case, the key benefit is..."
- "This objection is valid; the workflow should be designed to avoid that friction."

Avoid:

- "LLM-Wiki is proven better than RAG."
- "Obsidian is required."
- "The wiki will stay correct automatically."
- "More notes means more value."
- "Everyone must use git and PRs."
- "Token limits do not matter."
- "Generated summaries are documentation quality by default."
- "It is safe to upload everything."

### 3. Use the core argument

The central argument:

> LLM-Wiki is useful when raw sources are already plentiful but reusable context is scarce. It turns raw material into an inspectable, versioned, agent-readable knowledge layer and makes maintenance cheap enough to keep running.

### 4. Handle non-developer and browser-first objections

For non-developers, recommend a low-friction surface first:

```text
browser/form/chat/Obsidian/Confluence capture -> agent triage -> review queue -> wiki pages
```

Do not make git literacy a prerequisite. Explain that git gives history, rollback and review, while the daily UI can be browser-first.

For Confluence comparisons:

- agree that browser editing is easier;
- separate capture from governance;
- suggest append-only inbox or browser editing for ordinary contributions;
- reserve PR/MR gates for verified, public, regulated or CODEOWNERS-owned pages;
- suggest batch review PRs instead of one PR per note.

### 5. Handle token-growth concerns

Explain progressive context loading:

```text
small instruction pointer -> concise wiki index -> search -> selected pages -> raw evidence only when needed
```

If the proposed workflow requires loading the entire wiki into every prompt, call it a context-dump anti-pattern and route to `llm-wiki-retrieval-architect`.

### 6. Handle human-readable / slop concerns

State that the wiki is for both humans and agents. Trust comes from:

- preserved raw sources;
- provenance links;
- `status: draft|reviewed|verified|stale|archived`;
- `review_required` and confidence fields;
- protected human synthesis sections;
- lint for unsupported, stale and contradictory claims;
- human promotion from draft to reviewed/verified.

Do not treat generated text as official documentation until it is source-anchored and reviewed.

### 7. Handle content and sensitive-data concerns

Classify before ingesting:

| Data class | Default stance |
|---|---|
| Public | Normal wiki flow; cloud models allowed if policy permits. |
| Internal | Private repo/storage and model policy. |
| Confidential | Prefer local or approved private provider; redact before cloud. |
| Restricted / regulated | Do not ingest by default; explicit approval, minimization and retention rules. |
| Secrets | Never ingest; rotate if captured. |

Route to `llm-wiki-privacy-redactor`, `llm-wiki-model-policy`, `llm-wiki-threat-model` or `llm-wiki-security-review` when the user mentions PII, secrets, regulated records, customer data, credentials or provider boundaries.

### 8. Cite or name evidence

For current facts, browse and cite. For static bundled evidence, summarize the source map from `references/evidence-pack.md`.

Important sources to know:

- LangChain Wiki Memory: wiki memory as compact, persistent, agent-readable knowledge layer.
- Anthropic context engineering: context is finite; agents benefit from just-in-time file/context navigation.
- Lost in the Middle: long context alone is unreliable.
- GraphRAG / GlobalRAG: flat chunk retrieval struggles on global/corpus-level questions.
- Mem0 / MemMachine: persistent structured memory can outperform full-context or naive RAG baselines.
- 2026 LLM-Wiki retrieval paper: early direct evidence on multi-hop and structured queries.

### 9. Offer a pilot instead of a leap of faith

Recommend a bounded pilot:

```text
20-50 sources
10-20 real questions
weekly lint
file back reusable answers
measure retrieval hit rate and answer reuse
```

### 10. Route to the next skill

- Needs solution choice: `llm-wiki-choose`.
- Needs setup: `llm-wiki-setup`.
- Has existing docs: `llm-wiki-doctor` then `llm-wiki-migration-planner`.
- Needs evidence measurement: `llm-wiki-eval`.
- Worries about slop: `llm-wiki-trust-audit` and `llm-wiki-provenance`.
- Asks about Obsidian: `llm-wiki-obsidian-hardening` if they already use it; otherwise `llm-wiki-local-first-stack`.
- Asks about token growth: `llm-wiki-retrieval-architect`.
- Asks about team/browser workflow: `llm-wiki-team-rollout` and `llm-wiki-github-action`.
- Asks about sensitive data: `llm-wiki-privacy-redactor`, `llm-wiki-model-policy`, `llm-wiki-threat-model`, `llm-wiki-security-review`.

## Output

Use this shape:

```markdown
## Direct answer

## Why this matters for your case

## Evidence level

## Trade-offs and failure modes

## Practical workflow / next step
```

## Safety gates

- Do not overstate evidence.
- Do not treat generated summaries as proof.
- Do not recommend cloud processing for sensitive material without explicit approval.
- Do not recommend Obsidian by default.
- Do not say the wiki stays alive automatically; explain the maintenance loop.
- Do not make git/PR/MR knowledge a prerequisite for non-developer users.
- Do not solve token concerns by suggesting larger context windows alone.
- Do not call generated pages "documentation" unless they are readable, source-backed and reviewable.
- Do not ingest secrets.
