# LLM-Wiki criticism and mitigation map

> Status: draft
> Scope: practical risk register for the LLM-Wiki pattern: real objections, mitigations, residual risks and routing to skills.
> Source basis: consolidated criticism report supplied to this repository review, plus existing project docs on trust, provenance, evaluation and security.

## Thesis

LLM-Wiki should not be adopted as a faith-based productivity pattern. It should be adopted only when the domain survives a criticism screen:

```text
Does it compress multi-source knowledge?
Does the user need retrieval more than internalization?
Is there a human-owned synthesis boundary?
Is provenance strong enough?
Is there a living maintenance loop?
Is the token/time cost lower than re-discovery?
Is the ingestion surface treated as untrusted input?
Is there an output loop beyond capture?
```

The strongest criticisms are not objections to Markdown or agents in general. They are objections to **unreviewed compilation of knowledge**: smoothing, context poisoning, cognitive debt, drift, stale derived knowledge and governance failure.

## Risk map

| # | Class | Problem | Solo severity | Team severity | Solvability |
|---:|---|---|---|---|---|
| 1 | Epistemic | Consensus smoothing / docile compiler | high | high | solvable with schema and adversarial rules |
| 2 | Epistemic | Context poisoning / organized misinformation | high | critical | partial |
| 3 | Epistemic | Iterative summary degradation misnamed as model collapse | medium | medium | mostly solvable |
| 4 | Cognitive | Loss of generation effect / cognitive debt | medium-high | medium | partial, requires discipline |
| 5 | Cognitive | Complexity beyond comprehension | medium | high | partial |
| 6 | Operational | Drift: cross-links and pages silently stale | high | high | solvable but recurring cost |
| 7 | Operational | Scale ceiling: index, lint and long-context limits | medium | high | solvable with staged retrieval |
| 8 | Operational | Negative value on greppable corpora | high | medium | solvable with scoping and measurement |
| 9 | Operational | Structured data in flat Markdown | low-medium | medium | solvable with hybrid schema/index |
| 10 | Economic | Token burn and opaque long-run cost | medium | high | partial |
| 11 | Architectural | “This is just RAG / not novel” | low | low | terminological |
| 12 | Architectural | Wiki as second-order information hop | medium | medium | solvable with hybrid trust/verify policy |
| 13 | Strategic | Obsolescence from long context or provider memory | low | low | hedge with portable data |
| 14 | Organizational | Intent loss, permissions, governance, staleness outside workflow | n/a | critical | partial |
| 15 | Security | Prompt injection through ingested content | medium | high | partial, permissions matter |
| 16 | Meta | Benchmark vacuum | medium | high | open |
| 17 | Meta | Novelty decay / fun to build, boring to use | high | high | solvable only with output loop |

## Class I. Epistemic problems

### 1. Consensus smoothing

**Problem.** An ungoverned compiler tends to produce an accurate-looking encyclopedia written in a generic consensus voice. It may erase the user's intellectual tensions, minority positions and personal epistemic structure. This is especially dangerous for philosophy, research writing, strategy and any domain where the value lies in the user's own framing.

**Failure signal.** Pages are polished, accurate-sounding and useless. They summarize sources chronologically, do not name opposing positions, do not surface tensions and could have been written by a competent stranger.

**Mitigation.** Add governance directives to schemas, skills and `AGENTS.md`:

```text
extraction over summary
antagonist rule
friction point
mandatory linking
claim type: extracted | inferred | ambiguous
```

For high-value synthesis, use adversarial compilation:

```text
plaintiff: find support
defendant: find counter-evidence
judge: synthesize only from immutable evidence
```

**Residual risk.** The schema is human epistemology encoded as instructions. A generic out-of-the-box LLM-Wiki will still tend toward consensus smoothing.

**Route to skills.** `llm-wiki-critique-audit`, `llm-wiki-provenance`, `llm-wiki-claim-anchors`, `llm-wiki-trust-audit`.

### 2. Context poisoning / organized misinformation

**Problem.** A bad summary in a wiki can become trusted context for later answers. In plain RAG, a hallucination may be a one-off answer. In LLM-Wiki, a mistaken derived page can become an official-looking source for future queries and spread across links.

**Failure signal.** Generated pages are used as evidence for other generated pages; verified/reviewed pages have no raw-source support; query answers cite wiki pages without checking raw evidence when the trust model requires verification.

**Mitigation.** Use:

- immutable `raw/` as ground truth;
- claim-level provenance;
- source hashes and source paths;
- status lifecycle: `draft -> reviewed -> verified -> stale -> archived`;
- trust/verify policy per domain;
- lint spot-checks against raw sources;
- git diff review for agent writes.

**Residual risk.** Compile-time mistakes can live between lint passes. For teams, the risk is misinformation with the authority of official documentation.

**Route to skills.** `llm-wiki-trust-audit`, `llm-wiki-provenance`, `llm-wiki-claim-anchors`, `wiki-lint`, `llm-wiki-conflict-resolver`.

### 3. Iterative summary degradation

**Problem.** Critics often call this “model collapse,” but the local wiki failure is more precise: repeated LLM rewriting of summaries can homogenize style, lose terse details and amplify early mistakes. It is not the same mechanism as training models on synthetic data.

**Mitigation.** Do not rewrite summary-of-summary. Re-derive from raw sources, keep raw immutable, monitor page bloat and density, and require git diffs for repeated rewrites.

**Residual risk.** Style drift and loss of terseness are real even without model training collapse.

**Route to skills.** `wiki-lint`, `llm-wiki-source-refresh`, `llm-wiki-provenance`.

## Class II. Cognitive problems

### 4. Loss of generation effect / cognitive debt

**Problem.** The act of writing, filing, summarizing and linking can be where human understanding forms. If the agent does all of it, the user may get a beautiful wiki and less ownership of the knowledge.

**Failure signal.** The user produces many smart Markdown files but few decisions, essays, shipped features or remembered insights. The user cannot explain the content they “processed.” Capture grows while retrieval/output stays flat.

**Mitigation.** Separate bookkeeping from knowledge ownership:

```text
agent-owned: links, frontmatter, MOCs, dedup, lint, source extraction
human-owned: My synthesis, decisions, final framing, promotion to reviewed/verified
```

Use explicit sections:

```markdown
## Source quote / extracted claims

## Agent notes

<!-- human-owned:start -->
## My synthesis
<!-- human-owned:end -->
```

Use LLMs after reading, not as a replacement for first reading in domains where internalization matters.

**Residual risk.** This is not solvable by tooling in domains where the goal is the user's own understanding.

**Route to skills.** `llm-wiki-critique-audit`, `llm-wiki-interview`, `llm-wiki-eval`.

### 5. Complexity beyond comprehension

**Problem.** Agents can help users build a knowledge system more complex than the user can understand. The wiki may pass local checks while the overall system becomes too large to reason about.

**Mitigation.** Use bounded domains, small `index.md` contracts, per-domain wikis, metrics for orphans/link density/stale pages and explicit split points when the domain map no longer fits.

**Residual risk.** For teams, no single person may hold the whole map. Degradation may be detected only by symptoms.

**Route to skills.** `llm-wiki-doctor`, `wiki-lint`, `llm-wiki-eval`, `llm-wiki-domain-pack`.

## Class III. Operational problems

### 6. Drift

**Problem.** The most common production failure is not dramatic corruption. It is slow entropy: cross-links not updated, stale pages not flagged, decisions not propagated and old pages quietly becoming wrong.

**Mitigation.** Split ingest from reconciliation. Run scheduled lint, post-hoc cross-linking, source refresh and stale-page review. Track:

- orphan rate;
- average `last_linted` age;
- number of stale pages;
- pages with missing provenance;
- pages with no inbound links;
- unresolved contradiction queue.

**Residual risk.** Lint costs tokens and attention. If the lint loop costs more than rediscovery, the domain is a bad fit.

**Route to skills.** `wiki-lint`, `llm-wiki-source-refresh`, `llm-wiki-conflict-resolver`.

### 7. Scale ceiling

**Problem.** `index.md` works only while the domain map is small enough to load. Contradiction checks can become expensive. Long context windows do not remove the need for curation.

**Mitigation.** Use staged architecture:

```text
index.md + rg -> SQLite FTS / local lexical -> hybrid semantic -> graph-aware retrieval -> product storage
```

Use incremental lint over changed pages and 1-hop neighbors, random global sampling and domain clustering.

**Residual risk.** At 10k+ pages, the project becomes a real retrieval system. “Zero infrastructure” stops being honest.

**Route to skills.** `llm-wiki-retrieval-architect`, `llm-wiki-eval-tooling`, `wiki-lint`.

### 8. Negative value on greppable corpora

**Problem.** LLM-Wiki can be worse than grep when the corpus is already small, precise and greppable. Mirrors of code files or configs may add a second-order page that must still be verified against the original.

**Mitigation.** Use the compression rule:

> LLM-Wiki is useful when a page compresses and connects facts scattered across many sources.

For codebases, prefer concise maps, ADRs and “how to change X” pages over one wiki page per file. Measure token cost/query against grep or direct code search before scaling.

**Residual risk.** There is no perfect pre-adoption detector. Pilot metrics decide.

**Route to skills.** `llm-wiki-benchmark-suite`, `llm-wiki-repo-docs`, `llm-wiki-eval`.

### 9. Structured data in flat Markdown

**Problem.** Markdown is durable and reviewable, but weak for task-like or database-like queries: blockers, ownership, metrics, status, epics and permissions.

**Mitigation.** Keep Markdown as the durable human surface and add structured overlays where needed:

- YAML frontmatter;
- SQLite FTS / query indexes;
- Dataview/Bases-like views;
- structured DB as source for task/metric data with Markdown rendered as a view.

**Residual risk.** Two representations create sync cost.

**Route to skills.** `llm-wiki-retrieval-architect`, `llm-wiki-domain-pack`, `llm-wiki-design`.

## Class IV. Economic problems

### 10. Token burn and opaque cost

**Problem.** Ingest, lint, source refresh and contradiction checks can burn many tokens. Subscription rate limits can hide cost but not eliminate it.

**Mitigation.** Use:

- cheap/local models for extraction;
- stronger models only for synthesis;
- deterministic scripts for validation/routing;
- content hashes to avoid recompilation;
- incremental lint;
- cost/query measurement;
- stop thresholds when wiki cost exceeds rediscovery cost.

**Residual risk.** Long-term public cost data is sparse. Every serious deployment should collect local metrics.

**Route to skills.** `llm-wiki-eval`, `llm-wiki-benchmark-suite`, `llm-wiki-model-policy`.

## Class V. Architectural objections

### 11. “This is just RAG”

**Problem.** Many LLM-Wiki workflows are RAG-shaped: retrieve relevant information and answer. The novelty claim can be overstated.

**Mitigation.** Use precise terminology:

- RAG retrieves at query time;
- LLM-Wiki also has a write/maintenance loop;
- the corpus is a compiled, human-readable artifact;
- good answers are filed back;
- lint/reconciliation is part of the pattern.

**Residual risk.** Novelty is not the reason to use it. Fit and measured value are.

**Route to skills.** `llm-wiki-faq`, `llm-wiki-choose`.

### 12. Wiki as second-order information hop

**Problem.** A wiki page may become an unnecessary extra hop between the agent and the original source. If the page must always be verified, it can cost more than reading raw sources.

**Mitigation.** Use a domain-level trust policy:

```text
trusted wiki pages for reviewed synthesis
verify-against-source for high-risk or current claims
direct raw/search for exact facts
```

**Residual risk.** Derived pages can drift between refreshes.

**Route to skills.** `llm-wiki-provenance`, `llm-wiki-source-refresh`, `llm-wiki-retrieval-architect`.

### 13. Obsolescence from long context or platform memory

**Problem.** Larger context windows, provider memory or future weight updates may reduce the need for user-owned wiki infrastructure.

**Mitigation.** Invest in portable data and schema, not brittle glue:

```text
Markdown + raw sources + JSON/YAML schemas + git history
```

Treat indexes, MCP wrappers and retrieval glue as replaceable.

**Residual risk.** Custom infrastructure has a short half-life. The durable asset is the corpus and governance model.

**Route to skills.** `llm-wiki-archive`, `llm-wiki-agent-memory-bridge`, `llm-wiki-local-first-stack`.

## Class VI. Organizational problems

### 14. Intent loss, permissions and governance

**Problem.** Teams fail when wiki maintenance is outside the real workflow, no owner reviews agent writes, business changes happen in Slack/meetings/CRM rather than git, and derived pages mix permissions from multiple source scopes.

**Mitigation.** Require:

- named owner/operator;
- capture where work happens;
- read-only -> flag-only -> PR-write autonomy progression;
- separate wikis by permission scope when needed;
- derived pages inherit maximum sensitivity of sources;
- event-driven ingest for fast-changing domains;
- PR/CODEOWNERS for trusted pages.

**Residual risk.** Permission propagation for derived content is unsolved in the general case.

**Route to skills.** `llm-wiki-team-rollout`, `llm-wiki-company-flow-audit`, `llm-wiki-security-review`, `llm-wiki-threat-model`.

## Class VII. Security

### 15. Prompt injection through ingested content

**Problem.** Web clips, emails, PDFs, chats, GitHub issues and transcripts may contain instructions. If the ingest agent has write or shell access, those instructions can attack the wiki or tooling.

**Mitigation.** Treat sources as data, not commands. Use:

- least-privilege ingest agents;
- no network/shell tools during untrusted ingest unless required;
- write only to staging or draft locations;
- Bash/Edit hooks where available;
- prompt-injection fixtures;
- pinned MCP/server versions;
- git commit before batch operations;
- review before promotion.

**Residual risk.** Prompt rules are not a security boundary. Tool permissions are.

**Route to skills.** `llm-wiki-threat-model`, `llm-wiki-security-review`, `llm-wiki-ingestion-stack`.

## Class VIII. Meta problems

### 16. Benchmark vacuum

**Problem.** Public evidence for the full LLM-Wiki pattern is limited compared with memory/RAG systems that publish benchmark results. Many positive reports are N=1 field reports.

**Mitigation.** Use local evaluation from day one:

- retrieval hit rate;
- answer reuse;
- token cost/query versus baseline;
- reads/writes ratio;
- output beyond the vault;
- drift metrics;
- random-page review.

**Residual risk.** Until independent long-running benchmarks exist, adoption is a mechanism-based bet.

**Route to skills.** `llm-wiki-benchmark-suite`, `llm-wiki-eval`, `llm-wiki-eval-tooling`.

### 17. Novelty decay

**Problem.** LLM-Wiki is fun to build and easy to turn into a write-only archive. Capture can grow while retrieval and output stay near zero.

**Mitigation.** Design the output loop first:

```text
query from every surface
morning/weekly digest
open questions surfaced
saved answers filed back
retrieval hits measured
```

Stop adding capture channels when retrieval hit rate is zero.

**Residual risk.** PKM abandonment base rate is likely high. Treat a pilot as reversible.

**Route to skills.** `llm-wiki-eval`, `wiki-query`, `llm-wiki-capture-pipeline`.

## Domain adoption checklist

Before adopting LLM-Wiki for a domain, answer:

1. Does the wiki compress facts from many sources? If no, use grep/search.
2. Is the goal retrieval or internalization? If internalization, require human synthesis.
3. Is there an anti-smoothing schema: extraction, antagonist, friction, linking?
4. Is lint scheduled and separate from ingest?
5. Is provenance at least source-level, with claim-level for high-impact claims?
6. Is token/time cost measured against baseline?
7. Is the ingestion surface treated as untrusted input?
8. Is there an output loop from day one?
9. Is there a human owner for truth and promotion?
10. Are permission scopes and data boundaries explicit?

## Severity scorecard

Use this when auditing a domain:

| Area | Low risk | High risk |
|---|---|---|
| Compression | Page summarizes many sources | Page mirrors one greppable file |
| Human synthesis | Protected and active | Agent writes final interpretation |
| Provenance | Claim/source anchors | Wiki pages cite wiki pages |
| Drift | Scheduled lint/reconciliation | Ingest-only workflow |
| Cost | Measured cost/query | Unknown recurring token burn |
| Security | Sources treated as untrusted | Captured content can influence tools |
| Team governance | Owner + PR/review gates | No owner, direct writes |
| Output loop | Retrieval hits and deliverables | Capture grows without use |

## Honest positioning

LLM-Wiki is strongest for:

- multi-source synthesis;
- durable research;
- decision memory;
- agent-readable repo or domain maps;
- team onboarding when ownership exists;
- domains where rediscovery is expensive.

LLM-Wiki is weak or risky for:

- tiny greppable corpora;
- domains where the goal is personal internalization;
- fast-changing facts without event-driven refresh;
- team knowledge without owner/review model;
- sensitive mixed-permission data;
- users who enjoy building capture loops more than using outputs.
