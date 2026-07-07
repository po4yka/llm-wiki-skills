# Additional adoption Q&A reference

> Purpose: compact reference for `llm-wiki-faq` when adoption questions go beyond the initial FAQ: start-small path, cost, ROI, ownership, review, migration, RAG/tool boundaries, vendor lock-in and multi-agent governance.

## Fast answers

| User asks | Answer |
|---|---|
| Where should I start? | Run a small reversible pilot: one domain, 20-50 sources, 10-20 real questions, weekly lint, 2-4 weeks. |
| When should I not use it? | Avoid it when the corpus is tiny, nobody will review generated pages, or there is no output loop beyond collecting notes. |
| Is this another KB that will decay? | It will decay unless capture, file-back, lint, review and refresh are assigned as a loop. |
| Who owns the wiki? | Humans own truth and promotion; agents own bookkeeping and draft organization. |
| Who reviews agent changes? | Use risk-based gates: cheap drafts, mandatory review for verified/public/policy/sensitive pages. |
| How much time does it take? | Start with ad hoc capture plus 30-60 minutes weekly for triage/lint/review; teams need a curator rotation. |
| How expensive is it? | Start with Markdown/git/search. Pay for cloud models, retrieval or CI only after pilot metrics show the bottleneck. |
| How do I prove ROI? | Compare with-wiki vs without-wiki answers on real questions; measure reuse, time saved, provenance and outputs. |
| Does it replace Confluence/Notion? | Usually no. Existing tools can be capture surfaces; LLM-Wiki can be the compiled source-aware layer. |
| Does it replace RAG/search? | No. Use LLM-Wiki for durable synthesis and search/RAG for finding pages/raw evidence. |
| How do we migrate safely? | Inventory, dry-run mapping, one domain, drafts first, reversible changes. |
| What if the agent is wrong? | Assume it will be; use immutable raw sources, draft status, provenance, lint, diff review and dry-runs. |
| How do we handle duplicates/conflicts/stale pages? | Do not auto-delete or auto-resolve; create merge/conflict/stale reports and route to review. |
| How do permissions work? | Classify sources, split access domains, use least-privilege agents, and keep redacted publishable subsets. |
| Local or cloud? | Decide per data class: public can be cloud/local; sensitive defaults to local or approved private provider. |
| Can multiple agents use it? | Yes, with stable schemas, explicit write boundaries and review gates. |
| What goes into AGENTS.md vs wiki vs skills? | Instructions in AGENTS/CLAUDE, procedures in skills, domain knowledge in wiki, evidence in raw sources. |
| How avoid lock-in? | Keep Markdown/JSON/YAML/git/raw files as source of truth; indexes and vector DBs are rebuildable caches. |
| What about link rot? | Store URLs, capture timestamps, hashes, local copies when allowed, stale dates and refresh reports. |
| What if nobody reads it? | Stop expanding; fix query/file-back/digest/output loops before adding more sources. |

## Ownership model

| Area | Human owner |
|---|---|
| Raw sources | Source/capture owner. |
| Draft wiki pages | Curator plus agent. |
| Reviewed/verified pages | Domain owner. |
| Instruction files | Tooling owner. |
| Schemas/policies | Knowledge/platform owner. |
| Sensitive data | Security/privacy owner. |

## Recommended pilot

```text
one domain
20-50 sources
10-20 real questions
2-4 weeks
weekly lint
file back useful answers
measure time-to-answer, retrieval hit rate, answer reuse and output beyond the vault
```

## Risk-based review gates

| Change | Review |
|---|---|
| Inbox triage | Batch review. |
| Draft source summary | Spot-check. |
| Entity/concept update | Review if low confidence or high impact. |
| Verified/public/policy page | Mandatory human review / CODEOWNERS. |
| Sensitive-source handling | Security/privacy review. |
| Bulk edit/delete | Dry-run report first. |

## Layer boundaries

| Layer | Put here |
|---|---|
| `AGENTS.md` / `CLAUDE.md` | Small boot instructions, paths, safety rules, pointers. |
| Skills | Procedures: ingest, query, lint, migrate, audit. |
| Wiki pages | Domain knowledge, decisions, source summaries, concepts, entities. |
| Raw sources | Original evidence and captures. |
| Agent memory | Temporary preferences or project-local operational hints. |
