# Adoption objection playbook

> Scope: concrete answer patterns for non-developers, browser-first teams, token-growth concerns, human-readable documentation, LLM slop, and sensitive content boundaries.
> Audience: agents using this skill pack, maintainers writing user-facing docs, and reviewers evaluating whether an LLM-Wiki rollout is practical.

## How to use this playbook

When a user raises one of these objections, do **not** answer with ideology. Answer with a practical operating model, trade-offs, and the lowest-friction next step.

Useful response shape:

```markdown
## Direct answer
## What changes in your workflow
## Trade-offs
## Recommended setup
## Safety / review rules
```

## 1. "I am not a developer. How do I work with this wiki?"

### Core answer

A non-developer should not be asked to run git commands, manage branches, or understand repository internals. LLM-Wiki is a knowledge pattern, not a requirement to become an engineer.

The non-developer workflow should be:

```text
capture in the easiest UI -> agent triage -> review queue -> human-friendly wiki pages -> periodic lint/refresh
```

### Good formulation

> You do not need to become a developer. The developer-shaped part of LLM-Wiki is the storage and audit layer. Your daily workflow can be browser, Obsidian, email, Telegram, a form, or a shared docs UI. The agent and maintainer workflow can translate that into `raw/`, `wiki/`, provenance and review states.

### Practical modes

| Mode | User experience | Good for | Trade-off |
| --- | --- | --- | --- |
| Browser-first capture | Add a note/source through a form, issue template, GitHub web editor, CMS, or Confluence-style page. | Non-developers and teams. | Needs an agent/maintainer loop behind it. |
| Obsidian / Markdown app | Edit/read Markdown locally with backlinks and search. | Personal second brain, research. | Another app to learn. |
| Managed docs-as-code | User writes in a simple UI; agent opens review PRs. | Teams that need audit/history. | PR/MR must be hidden from casual contributors. |
| Read-only consumer | User only asks questions and reads generated pages. | Executives, support, onboarding. | Someone else must own curation. |

### Recommended non-developer setup

Start with one of these:

1. **Browser capture + weekly review**: simple form or issue template writes to `inbox/`; agent triages; owner reviews weekly.
2. **Obsidian if they already like notes**: Obsidian is the human reading/editing surface; git can be managed by a plugin or maintainer.
3. **Confluence/Notion as capture surface**: export or sync selected pages into `raw/`; LLM-Wiki compiles a reviewed Markdown layer separately.
4. **Ask-only mode**: no editing at all; user asks questions, agent answers with source links and files reusable answers back for review.

## 2. "Creating MRs/PRs and syncing branches is inconvenient. In Confluence I only need a browser."

### Core answer

This objection is valid. If every small knowledge addition requires manual branch sync and MR discipline, most users will stop contributing.

LLM-Wiki should separate **capture friction** from **governance friction**:

```text
capture should be as easy as Confluence
promotion to trusted knowledge may use review gates
```

### Four write modes

| Write mode | Who uses it | What happens | When to use |
| --- | --- | --- | --- |
| Append-only inbox | Everyone | Raw notes/sources go to `inbox/` or `raw/` immediately. | Default for capture. |
| Browser edit | Contributors | Edit a draft page through GitHub web UI, CMS, Obsidian Sync, or docs portal. | Low-risk docs. |
| Batch review | Curator + agent | Agent groups changes into weekly review reports or one PR. | Knowledge maintenance. |
| PR/MR gate | Owners/CODEOWNERS | Verified pages, policy pages and public docs require review. | High-trust or regulated content. |

### Good formulation

> Confluence optimizes for low-friction editing; git optimizes for history, diff, rollback and review. A usable LLM-Wiki should not force every contributor into git. Use browser-first capture for ordinary knowledge and reserve PR/MR review for pages that become official, verified or public.

### Concrete mitigation patterns

- Use an `inbox/` page, web form, issue template, chat bot or Confluence export as the capture UI.
- Let the agent create batched review PRs instead of one PR per note.
- Keep one integration branch maintained by automation; do not make casual contributors sync branches.
- Use CODEOWNERS only for trusted/verified areas, not raw capture.
- Allow draft pages to be browser-edited; promote to `reviewed`/`verified` only after review.
- For teams already on Confluence, treat Confluence as **source/capture** and LLM-Wiki as **compiled, auditable knowledge layer**, at least during pilot.

### When Confluence may be better

Use Confluence or a similar browser-native system as the primary authoring surface when:

- most contributors are non-technical;
- knowledge changes are mostly short operational updates;
- formal git review would block contributions;
- source-level provenance is less important than easy editing.

Use LLM-Wiki when:

- agents need durable context;
- answers must cite source material;
- stale/unsupported/contradictory knowledge must be linted;
- decision history and rollback matter;
- repeated synthesis is more important than ad-hoc page editing.

## 3. "Will I have enough tokens as the wiki grows?"

### Core answer

Yes, if the wiki is used as a **navigable knowledge layer**, not pasted into the prompt. No, if the agent tries to load every page every time.

LLM-Wiki scales by progressive context loading:

```text
small map first -> search relevant pages -> open only needed pages -> cite raw sources when required
```

### Token budget principle

| Layer | Should it fit in prompt? | Purpose |
| --- | ---: | --- |
| `AGENTS.md` / `CLAUDE.md` pointer | Yes, tiny | Tell agent where the wiki is and how to use it. |
| `wiki/index.md` | Usually yes | Map of pages/categories; keep concise. |
| Candidate pages | Only selected pages | Actual context for the current question. |
| Raw sources | Only when verifying | Evidence, not default context. |
| Entire wiki | No | Search/browse, never dump. |

### Practical answer

> A growing wiki should reduce token waste, not increase it. The agent starts from a small map, uses search or links to find candidate pages, reads only the relevant pages, and opens raw sources only for verification. If the system needs to paste the whole wiki into every prompt, it is not an LLM-Wiki workflow; it is a context-dump anti-pattern.

### Scaling thresholds

Use these as operational rules, not hard limits:

- **Small wiki**: `index.md` + `ripgrep` is enough.
- **Growing wiki**: keep `index.md` short, split pages by topic/entity/source/query, and add `log.md` for recency.
- **Large wiki**: add hybrid retrieval (`rg`/BM25 + vector + rerank) or a tool such as qmd; keep Markdown as source of truth.
- **Very large/team corpus**: use domain indexes, page summaries, metadata filters, access controls and scheduled lint/eval.

### Failure mode to disclose

If a wiki grows without indexes, metadata, review states and retrieval discipline, token use can explode and answer quality can drop. Growth must be paired with `index.md`, page types, provenance, lint and retrieval.

## 4. "Is this knowledge for agents or for everyone? Can humans read it? What about LLM slop?"

### Core answer

The target artifact should be useful to **both humans and agents**. If humans cannot read and challenge it, it is not a trustworthy LLM-Wiki; it is an opaque agent cache.

### Two audiences, one artifact

| Audience | Needs |
| --- | --- |
| Humans | Clear prose, source links, status fields, decision context, readable navigation, visible uncertainty. |
| Agents | Stable file paths, frontmatter, page types, indexes, backlinks, schemas and retrieval hints. |

### Anti-slop stance

LLM-generated text is not automatically knowledge. A wiki page becomes trustworthy through:

- preserved raw sources;
- provenance links;
- `status: draft|reviewed|verified|stale|archived`;
- `review_required` and confidence fields;
- protected human synthesis sections;
- lint for unsupported claims, contradictions and stale pages;
- human promotion from draft to reviewed/verified.

### Good formulation

> The wiki is for agents and people. Agents maintain the bookkeeping layer: links, indexes, summaries, lint reports, provenance gaps. Humans own acceptance: what is actually believed, what is promoted to verified, and what becomes official documentation.

### Human-readable page contract

A page that humans can trust should answer:

1. What is this page about?
2. What sources support it?
3. What is generated summary versus human synthesis?
4. What is uncertain or stale?
5. What changed recently?
6. Who or what process reviewed it?

### Recommended page sections

```markdown
# Page title

## Summary
## Source-backed facts
## Open questions / uncertainty
## Human synthesis
## Related pages
## Provenance
```

Protected rule: the agent may suggest edits to `## Human synthesis`, but should not overwrite it without explicit instruction.

## 5. "What content can I put there, and what about sensitive data?"

### Core answer

Almost any knowledge-bearing material can be captured, but not all material should go through the same model, storage, sync or sharing path. Classify first, then route.

### Suitable content types

| Content | Common handling |
| --- | --- |
| Articles, bookmarks, public web pages | Save raw capture, summarize into source/concept pages. |
| PDFs, papers, Office docs | Extract text, preserve original, cite page/section anchors when possible. |
| Meeting notes and transcripts | Store as raw; create decisions, action context and summaries. |
| Chats, support tickets, Slack/Telegram/email | Capture selected threads; deduplicate; redact private data. |
| Codebase docs, PRs, issues, ADRs | Compile into architecture, decision and module pages. |
| Images/audio/video | Store asset + transcript/OCR/caption; note extraction confidence. |
| Personal reflections | Keep separate from source-backed facts; protect human synthesis. |

### Data classes and routing

| Class | Examples | Default handling |
| --- | --- | --- |
| Public | Public articles, public docs, open-source repos. | Cloud or local models are acceptable if policy allows. |
| Internal | Team docs, non-public project notes. | Private repo/storage; model policy required. |
| Confidential | Customer data, strategy, finances, private correspondence. | Prefer local models or approved private provider; redact before cloud. |
| Restricted / regulated | PII-heavy exports, health/legal/financial records, credentials-adjacent data. | Do not ingest by default; use explicit approval, minimization and retention rules. |
| Secrets | API keys, passwords, tokens, private keys. | Never ingest; rotate if captured; add secret scanning. |

### Safety rules

- Never put secrets in the wiki.
- Do not send sensitive raw sources to cloud models without explicit approval and policy.
- Redact before export or public publishing.
- Store high-sensitivity raw sources outside git or in encrypted/private storage.
- Use access controls: not every user or agent should see every source.
- Keep raw evidence separate from generated summaries.
- Add retention rules for sensitive captures.
- Run privacy redaction and threat-model skills before broad rollout.

### Minimal frontmatter for sensitive pages

```yaml
data_class: public|internal|confidential|restricted|secret
model_boundary: local_only|approved_cloud|no_model
review_required: true
redaction_required: true
retention: keep|review_30d|delete_after_90d
source_contains_pii: true|false
```

## 6. Fast routing for agents

| User asks | First skill | Then route to |
| --- | --- | --- |
| "I am not a developer" | `llm-wiki-faq` | `llm-wiki-choose`, `llm-wiki-setup` |
| "Confluence is easier" | `llm-wiki-faq` | `llm-wiki-team-rollout`, `llm-wiki-github-action` |
| "Will tokens be enough?" | `llm-wiki-faq` | `llm-wiki-retrieval-architect`, `llm-wiki-eval` |
| "Is this for agents or humans?" | `llm-wiki-faq` | `llm-wiki-trust-audit`, `llm-wiki-provenance` |
| "What about sensitive data?" | `llm-wiki-faq` | `llm-wiki-privacy-redactor`, `llm-wiki-model-policy`, `llm-wiki-threat-model` |
