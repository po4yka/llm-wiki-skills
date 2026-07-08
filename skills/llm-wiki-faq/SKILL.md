---
name: llm-wiki-faq
description: Explain LLM-Wiki adoption and answer stakeholder objections. Use when the user wants a concise FAQ response, evidence summary, ROI framing, migration answer, or plain-language rebuttal; route adversarial risk registers and bad-fit audits to llm-wiki-critique-audit.
license: MIT
compatibility: Designed for Agent Skills-compatible coding agents. Browse and cite fresh sources for current ecosystem, tool maturity, pricing, release, or benchmark claims.
metadata:
  author: po4yka
  version: "1.0.0"
  install_scope: self-contained
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
- "Where should I start?"
- "When should I not use it?"
- "Who owns or reviews the wiki?"
- "How much time or money will this take?"
- "How do I prove ROI?"
- "Does this replace Confluence, Notion, SharePoint, RAG or search?"
- "How do I migrate safely?"
- "What if the agent is wrong?"
- "How do permissions, vendor lock-in, link rot or multi-agent access work?"
- "What are the strongest arguments against this?"
- "Will this hurt my own understanding?"
- "Will this become a write-only archive?"

## Inputs

- The stakeholder's question or objection, in their own words (e.g. "Is this better than RAG?", "Do I need Obsidian?").
- Context about the target wiki: greenfield vs already migrating, team size, whether git/PR workflows already exist.
- Whether sensitive or regulated data is involved, so the answer can route to `llm-wiki-privacy-redactor` or `llm-wiki-model-policy` when needed.
- Which bundled reference files are available under `references/` (evidence-pack, adoption-objections, additional-adoption-q-and-a, criticism-pack) to ground the answer.

## Required references

Read these when available:

1. `references/evidence-pack.md` for evidence-backed adoption arguments.
2. `references/adoption-objections.md` for non-developer, Confluence/browser, token, human-readable, slop and sensitive-data objections.
3. `references/additional-adoption-q-and-a.md` for start-small, ownership, cost, ROI, migration, RAG/search, lock-in and multi-agent questions.
4. `references/criticism-pack.md` for serious criticism and mitigation answers.
5. Repository-level docs:
   - `references/docs/adoption-objections.md`
   - `references/docs/adoption-q-and-a.md`
   - `references/docs/criticism-and-mitigations.md`

## Evidence policy

Use three evidence levels:

1. **Direct evidence**: LLM-Wiki-specific papers, benchmarks or implementations.
2. **Adjacent evidence**: GraphRAG, global RAG, long-term memory, context engineering and long-context studies that support the mechanism.
3. **Local evidence**: the user's own metrics after adoption: retrieval hit rate, answer reuse, review backlog, stale pages and output beyond the vault.

Always distinguish these levels. Do not claim that adjacent evidence proves every LLM-Wiki implementation will work.

For criticism, also distinguish:

```text
solvable with schema/discipline
partially mitigated with residual risk
not solvable by tooling
```

## Procedure

### 1. Identify the user's objection

Map the question to one of:

| User question | Core answer |
| --- | --- |
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
| Where to start? | Run a small reversible pilot before migrating or building infrastructure. |
| When not to use? | Avoid it when the corpus is tiny, unreviewed, not reused or ownerless. |
| Cost/time? | Start with files/search; add model/retrieval/CI cost only after metrics justify it. |
| ROI? | Compare with-wiki vs without-wiki on real questions and output beyond the vault. |
| Ownership/review? | Agents draft and maintain bookkeeping; humans promote reviewed/verified knowledge. |
| Replace tools? | Usually no; Confluence/Notion can be capture surfaces, RAG/search can remain retrieval. |
| Migration? | Inventory first, dry-run plan second, staged reversible migration third. |
| Agent mistakes? | Assume errors; use raw sources, draft status, provenance, lint, review gates and dry-run. |
| Vendor lock-in? | Keep Markdown/JSON/YAML/git/raw files as source of truth; indexes are caches. |
| Multi-agent use? | Use explicit schemas, write boundaries, least privilege and review gates. |
| Serious criticism? | Run a criticism-first screen: smoothing, poisoning, cognitive debt, drift, cost, injection, benchmark vacuum and write-only archive risk. |

### 2. Answer with the right level of confidence

Use language like:

- "The strongest direct evidence I found is..."
- "This is adjacent evidence, not a direct proof of personal LLM-Wiki."
- "The local decision should be based on a 2-4 week pilot and metrics."
- "For your case, the key benefit is..."
- "This objection is valid; the workflow should be designed to avoid that friction."
- "The safe default is a reversible pilot, not a full migration."
- "This mitigation reduces risk but does not remove it."

Avoid:

- "LLM-Wiki is proven better than RAG."
- "Obsidian is required."
- "The wiki will stay correct automatically."
- "More notes means more value."
- "Everyone must use git and PRs."
- "Token limits do not matter."
- "Generated summaries are documentation quality by default."
- "It is safe to upload everything."
- "This replaces your existing tools immediately."
- "No one needs to own review."
- "The tool solves cognitive ownership."

### 3. Use the core argument

The central argument:

> LLM-Wiki is useful when raw sources are already plentiful but reusable context is scarce. It turns raw material into an inspectable, versioned, agent-readable knowledge layer and makes maintenance cheap enough to keep running.

Add the criticism-aware qualifier:

> It is not useful when it becomes a write-only archive, mirrors greppable sources, replaces human synthesis where internalization matters, or lacks provenance/review owners.

### 4. Handle serious criticisms

Use `references/criticism-pack.md`.

Default pattern:

```markdown
## Direct answer

Yes, that criticism is real.

## Where it applies

## Mitigation

## Honest residual risk

## What I would do for your case
```

Key answers:

- Consensus smoothing: use extraction/antagonist/friction/linking rules; residual risk is schema quality.
- Context poisoning: use raw immutability, claim provenance and lint; residual risk exists between lint passes.
- Cognitive debt: automate bookkeeping, not `## My synthesis`; residual risk is not solvable by tooling.
- Drift: schedule lint/reconciliation separate from ingest; residual cost remains.
- Greppable corpora: avoid LLM-Wiki unless it compresses many sources.
- Token burn: measure cost/query against baseline and use model tiering/content hashes.
- Prompt injection: permissions are the boundary, not prompt rules.
- Benchmark vacuum: use local pilot metrics and do not overstate public evidence.
- Novelty decay: build output loop before capture expansion.

### 5. Handle non-developer and browser-first objections

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

### 6. Handle token-growth concerns

Explain progressive context loading:

```text
small instruction pointer -> concise wiki index -> search -> selected pages -> raw evidence only when needed
```

If the proposed workflow requires loading the entire wiki into every prompt, call it a context-dump anti-pattern and route to `llm-wiki-retrieval-architect`.

### 7. Handle human-readable / slop concerns

State that the wiki is for both humans and agents. Trust comes from:

- preserved raw sources;
- provenance links;
- `status: draft|reviewed|verified|stale|archived`;
- `review_required` and confidence fields;
- protected human synthesis sections;
- lint for unsupported, stale and contradictory claims;
- human promotion from draft to reviewed/verified.

Do not treat generated text as official documentation until it is source-anchored and reviewed.

### 8. Handle content and sensitive-data concerns

Classify before ingesting:

| Data class | Default stance |
| --- | --- |
| Public | Normal wiki flow; cloud models allowed if policy permits. |
| Internal | Private repo/storage and model policy. |
| Confidential | Prefer local or approved private provider; redact before cloud. |
| Restricted / regulated | Do not ingest by default; explicit approval, minimization and retention rules. |
| Secrets | Never ingest; rotate if captured. |

Route to `llm-wiki-privacy-redactor`, `llm-wiki-model-policy`, `llm-wiki-threat-model` or `llm-wiki-security-review` when the user mentions PII, secrets, regulated records, customer data, credentials or provider boundaries.

### 9. Handle broader adoption questions

For start-small, cost, ROI, ownership, review, migration, replacement, lock-in and multi-agent questions, use `references/additional-adoption-q-and-a.md`.

Key defaults:

- start with a reversible pilot;
- assign human owners for truth and review;
- keep capture cheap and review risk-based;
- keep existing tools until the wiki proves value;
- use search/RAG as complements, not enemies;
- keep Markdown/raw files as source of truth;
- measure outputs, not page count.

### 10. Cite or name evidence

For current facts, browse and cite. For static bundled evidence, summarize the source map from `references/evidence-pack.md` and criticism map from `references/criticism-pack.md`.

Source map (`verify-before-use`: re-check each source before citing its result as current, and label the evidence level):

- LangChain wiki-memory writeups: position wiki memory as a compact, persistent, agent-readable knowledge layer (adjacent evidence).
- Anthropic context-engineering guidance: context is finite; agents benefit from just-in-time file/context navigation (adjacent evidence).
- "Lost in the Middle": long context alone is unreliable (adjacent evidence).
- GraphRAG / GlobalRAG papers: flat chunk retrieval struggles on global/corpus-level questions (adjacent evidence).
- Mem0 / MemMachine reports: vendor-adjacent benchmarks where persistent structured memory beat full-context or naive RAG baselines; do not present as proof for LLM-Wiki.
- 2026 LLM-Wiki retrieval paper: reported early direct evidence on multi-hop and structured queries; re-verify its scope and status before citing.

### 11. Offer a pilot instead of a leap of faith

Recommend a bounded pilot:

```text
20-50 sources
10-20 real questions
weekly lint
file back reusable answers
measure retrieval hit rate and answer reuse
measure cost/query versus grep/search baseline
run critique audit before scaling
```

### 12. Route to the next skill

- Needs solution choice: `llm-wiki-choose`.
- Needs setup: `llm-wiki-setup`.
- Has existing docs: `llm-wiki-doctor` then `llm-wiki-migration-planner`.
- Needs evidence measurement: `llm-wiki-eval` (including bounded pilot benchmarks).
- Worries about slop or serious objections: `llm-wiki-critique-audit`, `llm-wiki-trust-audit`, `llm-wiki-provenance`.
- Asks about Obsidian: `llm-wiki-obsidian-hardening` if they already use it; otherwise `llm-wiki-local-first-stack`.
- Asks about token growth or RAG/search boundaries: `llm-wiki-retrieval-architect`.
- Asks about team/browser workflow, ownership or review: `llm-wiki-team-rollout` and `llm-wiki-github-action`.
- Asks about sensitive data, permissions or model boundaries: `llm-wiki-privacy-redactor`, `llm-wiki-model-policy`, `llm-wiki-threat-model`, `llm-wiki-security-review`.
- Asks about archive/lock-in/publishing: `llm-wiki-archive` and `llm-wiki-export-publish`.
- Asks about instruction files or multiple agents: `llm-wiki-agent-memory-bridge`.

## Output

Use this shape:

```markdown
## Direct answer

## Why this matters for your case

## Evidence level / operating assumption

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
- Do not claim existing tools must be replaced before a pilot.
- Do not recommend a team rollout without explicit owners and review gates.
- Do not use page count as a success metric.
- Do not hide residual risks after mitigations.
- Do not automate human synthesis when the user is trying to understand or write original work.
