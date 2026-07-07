# Additional adoption Q&A playbook

> Scope: additional questions that commonly appear after the first LLM-Wiki explanation: start-small path, governance, cost, ROI, migration, ownership, mistakes, vendor lock-in, RAG/search boundaries, multi-agent use, access control and long-term durability.
> Audience: agents using this skill pack, maintainers writing adoption docs, and reviewers evaluating rollout readiness.

## How to use this playbook

Use this document after `docs/20-adoption-objections.md` when the user has already accepted the basic idea but still needs practical adoption answers.

Answer style:

- validate the concern;
- state the safe default;
- distinguish personal, team and product workflows;
- give a minimal next step;
- route to a more specific skill when needed.

## Quick routing table

| User asks | First answer | Then route to |
|---|---|---|
| Where should I start? | Start with a reversible pilot, not a full migration. | `llm-wiki-setup`, `llm-wiki-benchmark-suite` |
| When should I not use it? | Do not use it when the corpus is tiny, unreviewed or has no output loop. | `llm-wiki-eval` |
| Who owns the wiki? | Assign explicit owners for raw, wiki, schema, security and review. | `llm-wiki-team-rollout` |
| Who reviews agent changes? | Agent writes drafts/reports; humans promote trusted pages. | `llm-wiki-trust-audit` |
| How expensive is it? | Start with Markdown/git/search; add models/retrieval only when metrics justify it. | `llm-wiki-local-first-stack` |
| How do I prove ROI? | Compare with-wiki vs without-wiki on real questions and outputs. | `llm-wiki-eval`, `llm-wiki-benchmark-suite` |
| Does it replace Confluence/Notion/RAG? | Usually no; it can complement them as a compiled knowledge layer. | `llm-wiki-choose` |
| How do we migrate safely? | Inventory first, dry-run plan second, staged migration third. | `llm-wiki-doctor`, `llm-wiki-migration-planner` |
| What if the agent is wrong? | Treat generated pages as drafts until sourced, reviewed and linted. | `llm-wiki-provenance`, `wiki-lint` |
| How do we avoid lock-in? | Keep Markdown/JSON/YAML as source of truth; indexes are rebuildable. | `llm-wiki-archive` |
| Can multiple agents use it? | Yes, if instructions, page schema and write permissions are explicit. | `llm-wiki-agent-memory-bridge` |
| What goes into AGENTS.md vs wiki? | Instructions stay tiny; domain knowledge lives in wiki pages. | `llm-wiki-agent-memory-bridge` |

## 1. "Where should I start?"

### Core answer

Start with a small, reversible pilot. Do not begin by migrating everything or building heavy retrieval infrastructure.

Recommended first pilot:

```text
20-50 sources
10-20 real questions
1 domain
1 owner
weekly lint
2-4 weeks
```

### Good formulation

> Start where context reconstruction is already painful: a research topic, codebase, onboarding area or recurring decision domain. Do not migrate the whole company wiki. Create a small `raw/` and `wiki/`, answer real questions from it, and measure whether the answers improve.

### Minimum viable stack

```text
Markdown + git + AGENTS.md/CLAUDE.md pointer + index.md + log.md + ripgrep + skills
```

Add Obsidian, hybrid retrieval, embeddings or MCP only after the pilot exposes a concrete need.

## 2. "When should I not use LLM-Wiki?"

### Core answer

Do not recommend LLM-Wiki when the maintenance loop will not run.

Avoid adoption when:

- the corpus is tiny and search already works;
- users will not review generated knowledge;
- the team wants a fully automatic truth engine;
- knowledge changes faster than anyone will refresh it;
- sensitive data cannot be safely classified or isolated;
- there is no output beyond collecting notes;
- the team will ignore lint reports;
- ownership is unclear.

### Good formulation

> LLM-Wiki is valuable when knowledge compounds. If nobody reads, reviews, files back good answers or acts on lint reports, it becomes a better-organized dump, not a living wiki.

## 3. "Is this just another knowledge-base project that will decay?"

### Core answer

It will decay unless maintenance is designed as a loop and assigned to roles. The difference is that agents can lower the cost of bookkeeping, but they do not remove the need for ownership.

Decay signals:

- `index.md` is stale;
- new good answers stay in chat;
- `log.md` has no recent entries;
- `status: draft` pages never get reviewed;
- users stop trusting pages;
- stale claims are not refreshed;
- nobody owns lint reports.

Healthy loop:

```text
capture -> triage -> ingest -> query -> file-back -> lint -> review -> refresh
```

## 4. "Who owns the wiki?"

### Core answer

Ownership must be explicit. Otherwise the wiki becomes nobody's responsibility.

Suggested ownership model:

| Area | Owner | Responsibility |
|---|---|---|
| `raw/` | Source owner / capture owner | Decide what can be captured and retained. |
| `wiki/` drafts | Agent + curator | Generate and organize draft pages. |
| Reviewed/verified pages | Domain owner | Promote, reject or correct claims. |
| `AGENTS.md` / `CLAUDE.md` | Tooling owner | Keep instructions small and safe. |
| Schemas/policies | Knowledge/platform owner | Maintain page types, metadata and review rules. |
| Sensitive data | Security/privacy owner | Approve data classes and model boundaries. |

### Good formulation

> The agent can be the librarian, but it should not be the accountable owner of truth. Humans own promotion to reviewed or verified knowledge.

## 5. "Who reviews agent changes?"

### Core answer

Not every generated change needs the same review. Use risk-based gates.

| Change type | Review default |
|---|---|
| Inbox triage | Low-risk; batch review. |
| Draft source summary | Spot-check or domain-owner review. |
| Entity/concept page update | Review if confidence is low or claims are important. |
| Verified/public/policy page | Mandatory human review / CODEOWNERS. |
| Sensitive-source handling | Security/privacy review. |
| Deletion or merge | Dry-run report first. |

### Good formulation

> Agent changes should move through states. Drafts can be cheap; verified pages must be reviewed. The answer is not “review everything” or “trust everything”, but risk-based promotion.

## 6. "How much time will maintenance take?"

### Core answer

The practical target is a small recurring routine, not daily manual wiki gardening.

Suggested cadence:

| Cadence | Work |
|---|---|
| Daily or ad hoc | Capture quickly; no filing decisions. |
| Weekly | Triage inbox, ingest high-value sources, run lint, review top issues. |
| Monthly | Evaluate usefulness, refresh stale pages, merge duplicates. |
| Quarterly | Review taxonomy, archive dead areas, sample random pages. |

For personal use, start with 30-60 minutes weekly. For a team, start with a named curator rotation and a weekly batched review.

## 7. "How expensive is it?"

### Core answer

The cheapest version is files and search. Cost grows with ingestion volume, cloud models, embeddings, reranking and automation.

Cost tiers:

| Tier | Stack | Cost shape |
|---|---|---|
| Minimal | Markdown + git + ripgrep + skills | Mostly time cost. |
| Local-first | Local embeddings/search/local models | Hardware/setup cost; lower data-exposure risk. |
| Cloud-assisted | Cloud LLMs for ingest/query/lint | Usage cost; needs data policy. |
| Team/production | CI, review workflows, retrieval indexes, access control | Platform and governance cost. |

### Good formulation

> Do not buy infrastructure before the pilot. First prove that the wiki answers real questions. Then spend money only where the bottleneck appears: ingestion, retrieval, review or access control.

## 8. "How do I prove ROI to a team or manager?"

### Core answer

Use a with-wiki vs without-wiki pilot on real questions. Do not use number of pages as success.

Measure:

- time to answer real recurring questions;
- retrieval hit rate;
- answer reuse rate;
- number of stale or unsupported claims found;
- onboarding questions answered from wiki;
- decision pages with source links;
- reduction in repeated explanations to agents;
- output beyond the vault: reports, PRs, decisions, onboarding docs.

### Good formulation

> The business case is not “we created 500 pages”. It is “we answered these recurring questions faster, with sources, and reused the result instead of rebuilding context again.”

## 9. "Will it replace Confluence, Notion, SharePoint or Google Docs?"

### Core answer

Usually no. LLM-Wiki can complement existing tools.

| Existing tool | Possible role |
|---|---|
| Confluence / Notion | Capture or human authoring surface. |
| Google Docs / Office | Raw source documents. |
| SharePoint / Drive | Storage/source repository with access controls. |
| GitHub docs | Repo-docs surface and review workflow. |
| LLM-Wiki | Compiled, source-aware, agent-readable synthesis layer. |

### Good formulation

> Do not force a tool replacement during adoption. Treat existing docs as sources first. If LLM-Wiki proves useful, decide later which pages should become primary.

## 10. "Will it replace RAG or search?"

### Core answer

No. The healthy default is hybrid.

```text
LLM-Wiki = durable synthesis, maps, decision memory, review states
Search/RAG = finding relevant pages and raw evidence
Graph/global retrieval = large-corpus or cross-document questions
```

Use LLM-Wiki when answers should improve over time and become reusable. Use search/RAG when the user needs fresh lookup over raw material.

## 11. "How do we migrate without breaking everything?"

### Core answer

Use staged migration. Do not move everything at once.

Safe migration path:

1. Read-only inventory with `llm-wiki-doctor`.
2. Dry-run mapping with `llm-wiki-migration-planner`.
3. Pick one domain or folder.
4. Preserve original paths or keep source backlinks.
5. Generate drafts, not verified pages.
6. Review and promote only useful pages.
7. Leave existing tools running until the wiki proves value.

### Good formulation

> Migration should be reversible. The first goal is not a perfect taxonomy; it is a small area where people can ask better questions and trust the answer path.

## 12. "What if the agent makes mistakes?"

### Core answer

Assume it will. Design the workflow so mistakes are visible, reversible and not promoted silently.

Controls:

- raw sources are immutable;
- generated pages default to `draft`;
- low confidence triggers `review_required`;
- verified/public pages require human review;
- agent changes go through git diff or review reports;
- lint checks unsupported/stale/contradictory claims;
- deletions and bulk edits require dry-run plans.

## 13. "How do we handle duplicates, contradictions and outdated pages?"

### Core answer

Do not hide them. Use lint reports and conflict resolution.

| Issue | Default handling |
|---|---|
| Duplicate pages | Propose merge candidates; do not auto-delete. |
| Contradictory claims | Create conflict report with source links. |
| Outdated pages | Mark `stale`; refresh source-backed claims. |
| Unsupported claims | Add provenance gap report. |
| Orphans | Link, merge, archive or intentionally keep. |

Route contradictions to `llm-wiki-conflict-resolver` and provenance gaps to `llm-wiki-provenance`.

## 14. "How do permissions and access control work?"

### Core answer

Do not rely on obscurity. A searchable wiki can surface information that used to be hidden by friction.

Rules:

- classify sources before ingestion;
- separate public/internal/confidential/restricted material;
- do not put every source in one repo if access differs;
- enforce model boundaries per data class;
- maintain redacted publishable subsets;
- give agents least-privilege access;
- log exports and public publishing decisions.

If permissions cannot be modeled safely, do not centralize the corpus yet.

## 15. "Can we use cloud models, or must everything be local?"

### Core answer

Choose per data class and task. Local-first is a strong default for sensitive data, but public material can often use cloud models if policy allows.

| Situation | Default |
|---|---|
| Public sources | Cloud or local. |
| Internal docs | Approved provider or local. |
| Confidential/customer data | Prefer local or approved private deployment. |
| Restricted/regulated records | Explicit approval; often local-only or no-model. |
| Secrets | Never ingest. |

Route to `llm-wiki-model-policy` for a formal policy.

## 16. "Can multiple agents use the same wiki?"

### Core answer

Yes, if the wiki has stable schemas and write boundaries.

Required boundaries:

- keep `AGENTS.md` / `CLAUDE.md` small and explicit;
- document which agent may write which area;
- use page schemas and status fields;
- prevent agents from following instructions embedded in source notes;
- use review gates for verified/public pages;
- prefer append-only logs for automation.

Without these boundaries, multi-agent editing can create conflicting conventions and silent corruption.

## 17. "What goes into AGENTS.md / CLAUDE.md, what goes into wiki, and what goes into skills?"

### Core answer

Use this split:

| Layer | Put here | Do not put here |
|---|---|---|
| `AGENTS.md` / `CLAUDE.md` | Short boot instructions, paths, safety rules, pointers. | Long domain knowledge or large workflows. |
| Skills | Procedures: how to ingest, query, lint, migrate, audit. | Source-backed domain facts. |
| Wiki pages | Domain knowledge, source summaries, entities, concepts, decisions. | Tool-specific operational secrets. |
| Raw sources | Original evidence. | Generated conclusions as source of truth. |
| Agent memory | Temporary preferences or project-local operational hints. | Reviewed domain knowledge that should be inspectable. |

## 18. "How do we avoid vendor lock-in?"

### Core answer

Keep the source of truth boring and portable.

Rules:

- Markdown for pages;
- YAML/JSON for schemas;
- git history for changes;
- raw sources preserved separately;
- generated indexes can be rebuilt;
- vector databases are caches, not the source of truth;
- avoid proprietary-only page formats for verified knowledge;
- keep export/publish paths documented.

Good formulation:

> The wiki should survive the current agent, plugin or vector database. If a tool disappears, you should still have readable Markdown, raw sources and rebuildable indexes.

## 19. "What happens when source links rot or upstream documents change?"

### Core answer

Treat sources as evidence that can age.

Controls:

- store source URL and capture timestamp;
- store content hash when possible;
- preserve local raw copy when licensing/policy allows;
- add `stale_after` for time-sensitive pages;
- run source refresh reports;
- mark changed upstream sources for re-ingest;
- distinguish historical claims from current-state claims.

## 20. "How do we keep personal opinion separate from source-backed knowledge?"

### Core answer

Separate sections and status.

Recommended sections:

```markdown
## Source-backed facts
## Generated summary
## Human synthesis
## Open questions
## Provenance
```

Rules:

- agent may draft summaries and links;
- human synthesis is protected;
- opinions are allowed, but labeled;
- source-backed facts need provenance;
- promoted pages must make uncertainty visible.

## 21. "Will this slow people down?"

### Core answer

It will slow people down if capture is heavy or review is over-applied. It helps when capture is cheap and review is risk-based.

Keep friction low by:

- using append-only capture;
- batching reviews;
- making only high-trust pages require approval;
- keeping schemas minimal at first;
- measuring actual reuse;
- pruning low-value workflows.

## 22. "Can we publish from the wiki?"

### Core answer

Yes, but only from a safe, reviewed subset.

Publishing checklist:

- remove private raw sources;
- redact sensitive content;
- verify licenses;
- include source links where allowed;
- exclude draft pages;
- run broken-link and provenance checks;
- generate release notes / what changed;
- keep internal and public subsets separate.

Route to `llm-wiki-export-publish`.

## 23. "What is the minimum policy set before team rollout?"

### Core answer

Do not over-govern the pilot, but define the non-negotiables.

Minimum policies:

1. Data classification.
2. Model/provider boundary.
3. Review states.
4. Who may promote to verified.
5. How to handle secrets.
6. How to delete/archive content.
7. How public export works.
8. How agent writes are reviewed.

## 24. "What if nobody reads it?"

### Core answer

Then stop expanding it and fix retrieval/output loops.

Signals:

- writes grow but reads do not;
- answers do not cite wiki pages;
- users ask the same questions in chat;
- no pages are reused in reports, PRs, onboarding or decisions;
- lint reports are ignored.

Corrective actions:

- add `wiki-query` to everyday workflows;
- file back high-value answers;
- create weekly digest or open-questions report;
- prune low-value areas;
- run a with-wiki vs without-wiki benchmark.

## Compact Russian answer templates

### «С чего начать?»

> Начните не с миграции всего архива, а с маленького пилота: один домен, 20–50 источников, 10–20 реальных вопросов, еженедельный lint и сохранение удачных ответов обратно в wiki. Если через 2–4 недели ответы не стали быстрее, полезнее или проверяемее, не масштабируйте.

### «Когда это не нужно?»

> Не нужно, если корпус маленький, поиск уже справляется, никто не будет ревьюить сгенерированные страницы, нет повторяющихся вопросов или результат не используется вне самой wiki. LLM-Wiki работает, когда знание переиспользуется и компаундится.

### «Кто владелец wiki?»

> Агент может быть библиотекарем, но не владельцем истины. Нужны человеческие владельцы: кто отвечает за источники, кто промоутит страницы до reviewed/verified, кто задаёт схемы, кто отвечает за sensitive data и кто смотрит lint-отчёты.

### «Сколько это стоит?»

> Самая дешёвая версия — Markdown, git, `index.md`, `log.md`, ripgrep и skills. Деньги появляются позже: облачные модели, embeddings, rerank, CI, доступы и поддержка. Сначала докажите пользу пилотом, потом платите за узкое место.

### «Как доказать пользу?»

> Не числом страниц. Измеряйте, насколько быстрее отвечаются реальные повторяющиеся вопросы, как часто ответы опираются на wiki, сколько удачных ответов переиспользуется, сколько stale/unsupported claims найдено, и появились ли внешние результаты: отчёты, PR, onboarding, решения.

### «Это заменит Confluence или Notion?»

> Не обязательно. Часто лучше оставить Confluence/Notion как удобную поверхность ввода, а LLM-Wiki использовать как compiled knowledge layer: агентный, проверяемый, source-aware слой для синтеза и повторного использования.

### «Это заменит RAG?»

> Нет. Нормальная архитектура гибридная: LLM-Wiki хранит долговечный синтез, карты и decision memory, а search/RAG помогает находить релевантные страницы и raw-доказательства.

### «Что если агент ошибётся?»

> Предполагайте, что он ошибётся. Поэтому raw-источники неизменяемы, generated pages начинаются как draft, важные claims получают provenance, verified/public страницы проходят human review, а bulk edits и удаления идут только через dry-run.

### «Как избежать lock-in?»

> Держите source of truth в скучных форматах: Markdown, YAML/JSON, git и raw files. Векторные базы, индексы и MCP/API — это rebuildable cache, а не единственная копия знания.

### «Можно ли нескольким агентам работать с одной wiki?»

> Да, если есть явные границы: короткий AGENTS.md/CLAUDE.md, page schemas, status fields, write permissions, review gates и запрет следовать инструкциям из тела источников. Без этого агенты начнут плодить разные conventions и тихие ошибки.
