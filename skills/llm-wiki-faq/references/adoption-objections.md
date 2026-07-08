# Adoption objections reference

> Purpose: compact reference for `llm-wiki-faq` when users ask about non-developer workflows, Confluence/browser convenience, token growth, human-readable knowledge, LLM slop, or sensitive data.

## Non-developer workflow

Do not tell non-developers they must use git, sync branches or manage PRs/MRs. Explain that LLM-Wiki is a pattern, while git is only one implementation/control layer.

Recommended answer:

> You can work with LLM-Wiki through a browser, Obsidian, a form, Telegram/email, Confluence export, or ask-only chat. The agent/maintainer layer can translate that capture into `raw/`, `wiki/`, provenance and review states. Git/PRs are for history, rollback and trust gates, not necessarily the daily UI.

Default workflow:

```text
capture in easiest UI -> agent triage -> review queue -> human-readable wiki -> lint/refresh
```

## Confluence / PR / branch-sync objection

This objection is valid. If every knowledge addition requires manual MR/PR and branch sync, contribution will collapse.

Separate capture from governance:

```text
capture should be as easy as Confluence
promotion to trusted knowledge may use review gates
```

Use four write modes:

| Mode | Use for |
| --- | --- |
| Append-only inbox | Ordinary capture by anyone. |
| Browser edit | Low-risk draft docs. |
| Batch review | Agent-created weekly review reports or one PR. |
| PR/MR gate | Verified/public/policy pages and CODEOWNERS areas. |

Good answer:

> Confluence optimizes for browser-first editing; git optimizes for history, diff, rollback and review. A good LLM-Wiki should not force every contributor into git. Use browser-first capture for ordinary knowledge and reserve PR/MR review for pages that become official, verified or public.

## Token growth

Answer:

> Token limits are handled by navigation, not by pasting the whole wiki into the prompt. The agent reads a short `AGENTS.md`/`CLAUDE.md` pointer, then `wiki/index.md`, then searches and opens only relevant pages. Raw sources are loaded only when verification is needed.

Rules:

- Keep instruction files tiny.
- Keep `index.md` concise.
- Never dump the entire wiki into context.
- Use `rg`/BM25/vector/rerank when the wiki grows.
- Add page summaries, metadata filters and domain indexes for larger corpora.
- Treat token explosion as a design smell.

## Agent knowledge or human documentation?

Answer:

> It should be both. Agents need stable files, frontmatter, page types, indexes and links. Humans need readable prose, source links, review status and visible uncertainty. If humans cannot read and challenge the page, the wiki has become an opaque agent cache.

Anti-slop controls:

- raw sources preserved;
- provenance links;
- `status: draft|reviewed|verified|stale|archived`;
- `review_required` and confidence fields;
- protected `## Human synthesis` sections;
- lint for unsupported, stale and contradictory claims;
- human promotion from draft to reviewed/verified.

Do not say: "the agent wrote it, so it is knowledge." Say: "agent output becomes knowledge only after source anchoring and review."

## Content and sensitive data

Suitable content:

- public articles and web clips;
- PDFs, Office docs and papers;
- meeting notes and transcripts;
- chats, support tickets, email and channel exports;
- codebase docs, PRs, issues and ADRs;
- images/audio/video plus transcripts or captions;
- personal reflections, kept separate from source-backed facts.

Data classes:

| Class | Default handling |
| --- | --- |
| Public | Cloud or local models allowed if policy permits. |
| Internal | Private storage and model policy required. |
| Confidential | Prefer local or approved private provider; redact before cloud. |
| Restricted / regulated | Do not ingest by default; use explicit approval and retention rules. |
| Secrets | Never ingest; rotate if captured. |

Minimal sensitive frontmatter:

```yaml
data_class: public|internal|confidential|restricted|secret
model_boundary: local_only|approved_cloud|no_model
review_required: true
redaction_required: true
retention: keep|review_30d|delete_after_90d
source_contains_pii: true|false
```

Route sensitive-data concerns to `llm-wiki-privacy-redactor`, `llm-wiki-model-policy`, `llm-wiki-threat-model` and `llm-wiki-security-review`.
