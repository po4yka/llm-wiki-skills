# PAF Nexus/Cortex mapping for LLM-Wiki adoption

> Scope: answer whether LLM-Wiki mechanics map to Product Architecture Framework (PAF) concepts of Nexus and Cortex, how far that analogy goes, and what first company-level step is practical.
> Current as of: 2026-07-07
> Source to re-check for current PAF wording: <https://productframework.ru/ops/main>

## Short answer

Yes, the mapping is directionally correct, but it is an approximation.

```text
LLM-Wiki knowledge layer  ~=  early technical substrate for a Nexus
Agent skills + workflows  ~=  early technical substrate for a Cortex
```

The important caveat:

> LLM-Wiki is a storage and operating pattern for source-backed, human-readable, agent-maintained context. PAF Nexus/Cortex is a product-management operating model. To become a real Nexus/Cortex, the wiki must be shaped around product/business objects, decision loops, confidence, ownership and company-level governance.

## What PAF says in operational terms

PAF defines Nexus as a living context model for product, business and market decisions. It is not just a document library. It is a structured model of the object being managed: market, product, growth system, operating model or company/portfolio.

PAF defines Cortex as the AI-based operating system for working with Nexus context. It is not just one chatbot. It is a set of rules, agents, prompts, retrieval, integrations and workflows through which product people manipulate Nexus context and make decisions.

## Mapping table

| PAF concept | LLM-Wiki equivalent | Match strength | Missing piece |
| --- | --- | ---: | --- |
| Nexus as shared context model | `raw/` + `wiki/` + index/log + source-backed pages | Strong | Needs PAF-specific node schema and business/product object boundaries. |
| Nexus nodes | Entity/concept/source/decision/market/product pages | Medium | Need typed nodes: segment, competitor, feature, lever, risk, assumption, metric. |
| Context ripeness | provenance coverage, freshness, completeness, review status | Medium | Need explicit ripeness formula per Nexus type. |
| Confidence Point | `confidence`, evidence strength, risk reduction, stage-gate status | Medium | Need product-decision confidence, not only LLM confidence. |
| Feature Bunch | decision/initiative pages generated from current Nexus state | Medium | Need link to Goal Map, mNSM/NPV window and actual delivery loop. |
| Cortex | skills, agents, workflows, retrieval, lint, refresh, integrations | Strong as substrate | Need company-specific rules for who can ask, write, approve and trigger changes. |
| Product Engineer | human owner of product decisions | Weak by default | Need a named role that owns promotion from draft context to decision. |
| Product Ops | owner of Nexus/Cortex process quality | Strong fit | Need someone to maintain schemas, workflows, metrics and adoption. |

## Where the analogy is valid

The analogy is valid when LLM-Wiki is used as:

- a shared context layer, not a personal notebook;
- a living model that updates after new evidence and decisions;
- a source-backed artifact used by humans and agents;
- a decision input for feature, market, growth or portfolio choices;
- a place where confidence, gaps, risks and stale knowledge are visible;
- a substrate for agents/skills that operate on context.

## Where the analogy is too simple

The analogy becomes too simple when:

- the wiki is only a collection of Markdown summaries;
- pages are organized by source rather than by managed product/business objects;
- one person or one narrow team owns all context;
- no company decision cites the wiki;
- no confidence/risk/gap changes are tracked;
- the agent can write summaries but cannot affect decision workflows;
- governance, permissions and review states are missing.

Good answer:

> Yes, LLM-Wiki can be the technical skeleton of Nexus/Cortex, but it is not automatically a Nexus/Cortex. The difference is whether the knowledge layer is wired into company decisions: goals, risks, confidence, feature bunches, ownership and review.

## Practical first company-level step

Do not start with “build Cortex for the company.” Start with one shared Nexus pilot tied to one recurring decision loop.

Recommended minimum:

```text
one object of management
one decision loop
one shared source inbox
one Nexus schema
one weekly decision review
one measurable decision outcome
```

### Recommended pilot: Market Opportunity Nexus

For company-level adoption, the most practical first Nexus is usually a **Market Opportunity Nexus** for one strategic market/segment, not a personal or single-team product notebook.

Why market first:

- it is naturally cross-functional: product, marketing, sales, support, strategy and leadership all have evidence;
- it reduces duplicate discovery work across teams;
- it is less tied to one team's current backlog;
- it can affect product, growth and portfolio decisions;
- it creates a common external context before arguing about solutions.

Use a Product Nexus first when:

- the company has one product and the pain is product decisions, not market ambiguity;
- the team already has market clarity but product knowledge is fragmented;
- coding agents need repo/product context immediately;
- the pilot must be close to delivery to get buy-in.

Avoid starting with Company/Portfolio Nexus unless leadership is already committed. It is too broad for a first pilot.

## Market Opportunity Nexus: minimum schema

```text
nexus/market/<segment>/
  index.md
  log.md
  nodes/
    segments/
    customers/
    jobs-to-be-done/
    pains/
    alternatives/
    competitors/
    trends/
    channels/
    pricing/
    risks/
    assumptions/
    opportunities/
    decisions/
  sources/
  queries/
  reviews/
```

Minimum node fields:

```yaml
type: nexus_node
nexus_type: market
object: <segment-or-market>
node_type: segment|customer|job|pain|competitor|trend|risk|assumption|opportunity|decision
status: draft|reviewed|verified|stale|archived
owner: <role-or-team>
data_class: public|internal|confidential|restricted
source_count: 0
last_evidence_at: YYYY-MM-DD
stale_after: YYYY-MM-DD
confidence_point: 0-100
ripeness: 0-100
review_required: true|false
decision_links: []
```

## How to make it shared, not personal

A company Nexus is not defined by where files live. It is defined by shared object, shared access and shared decision use.

Rules:

1. **Object is company-relevant.** Use a market segment, product line, growth system or business unit, not a personal research topic.
2. **Sources come from multiple functions.** Include sales calls, support tickets, analytics, product research, competitive intel and strategy notes.
3. **One schema, many contributors.** Everyone can capture; only owners promote to reviewed/verified.
4. **Browser-first capture.** Contributors should not need git. Use forms, issues, docs pages, chat bots or existing systems as capture surfaces.
5. **Decision citations required.** Feature bunches, bets, strategy notes or experiments should cite Nexus pages.
6. **Review is role-based.** Product/Growth/Marketing/Sales/Security owners review different node types.
7. **Personal synthesis is labeled.** Keep human interpretation visible and separate from source-backed facts.

## Minimal Cortex for the pilot

The first Cortex is not a big platform. It is a set of repeatable agent workflows over the Nexus.

Minimum Cortex workflows:

| Workflow | What it does | Skill fit |
| --- | --- | --- |
| Capture triage | Sort new sources into Nexus nodes. | `wiki-triage`, `llm-wiki-channel-capture` |
| Source ingest | Turn evidence into source-backed nodes. | `wiki-ingest` |
| Decision query | Answer decision questions with source links. | `wiki-query` |
| Gap/risk report | Find missing context before a decision. | `wiki-lint`, `llm-wiki-provenance` |
| Confidence update | Explain why confidence increased/decreased. | `llm-wiki-eval`, `llm-wiki-benchmark-suite` |
| Decision file-back | Save useful answers and decisions into the Nexus. | `wiki-query`, `llm-wiki-adr-memory` |

Minimum operating cadence:

```text
weekly: ingest new evidence -> update gaps/risks -> answer one decision question -> file decision back -> update confidence/ripeness
monthly: evaluate whether decisions cite Nexus and whether stale/unsupported claims are falling
```

## How to verify it affects decisions

Do not measure page count. Measure decision influence.

### Decision-influence metrics

| Metric | Good sign | Bad sign |
| --- | --- | --- |
| Decision citation rate | Decisions cite Nexus pages and sources. | Decisions ignore the Nexus. |
| Confidence movement | New evidence changes confidence up/down. | Confidence never changes. |
| Gap closure rate | Open questions become answered or killed. | Gaps accumulate silently. |
| Time-to-context | People answer “what do we know?” faster. | People still reconstruct context in meetings. |
| Decision reversal quality | Post-release learning updates assumptions. | Failures do not update the Nexus. |
| Cross-functional reuse | Sales/marketing/product use the same nodes. | Each team keeps a separate truth. |
| Output beyond wiki | Feature bunches, experiments, strategy notes, PRDs cite the Nexus. | Wiki grows but no artifacts cite it. |

### Pilot benchmark

Before the pilot, collect 10 real decision questions, for example:

- Which segment should we prioritize next quarter?
- What evidence supports this feature bunch?
- Which competitor risk changed this month?
- Which assumptions block this opportunity?
- What did we learn from the last release that changes the next bet?

Run each question in two modes:

1. without Nexus: normal meetings/docs/search;
2. with Nexus/Cortex: agent answers from shared Nexus with source links and gaps.

Score:

```text
time_to_answer
source_coverage
confidence_delta
number_of surfaced gaps
decision artifact produced
whether decision changed or became clearer
```

Success condition:

> At least 3-5 real decisions or product/growth artifacts cite the Nexus within one month, and at least one confidence/risk/gap changed because of new evidence.

## What is already portable from LLM-Wiki skills

Portable now:

- `raw/ -> wiki/ -> schema` structure;
- index/log navigation;
- capture, triage, ingest, query, lint, refresh loop;
- source preservation and provenance;
- review states and anti-slop rules;
- privacy/model/data policy skills;
- with-wiki vs without-wiki evaluation;
- browser-first capture and PR-based review patterns;
- long-term Markdown/git durability.

Useful skills immediately:

- `llm-wiki-faq` for objections;
- `llm-wiki-team-rollout` for ownership and review;
- `llm-wiki-domain-pack` for Nexus node taxonomy;
- `llm-wiki-capture-pipeline` and `llm-wiki-channel-capture` for evidence intake;
- `wiki-triage`, `wiki-ingest`, `wiki-query`, `wiki-lint` for Cortex operations;
- `llm-wiki-provenance`, `llm-wiki-trust-audit`, `llm-wiki-model-policy` for safety;
- `llm-wiki-eval` and `llm-wiki-benchmark-suite` for effect measurement.

## What must be built for company-level PAF alignment

Needs additional design:

- PAF-specific Nexus node schema;
- mapping from Nexus nodes to Goal Map, Feature Bunch, Confidence Point, mNSM/NPV window;
- role model for Product Engineer, Product Ops, domain owners and security/privacy owners;
- browser-first capture surfaces for non-technical contributors;
- permissions and access controls per source/data class;
- decision templates requiring Nexus citations;
- cadence for confidence/ripeness updates;
- dashboards for decision influence, not page count;
- integrations with product analytics, CRM, support, research repositories and delivery tools.

## Recommended answer to the user's question

> You are not wrong: LLM-Wiki plus skills is very close to the technical mechanics of Nexus and Cortex. But it is a simplification if we stop there. A Nexus is not just a wiki; it is a living model of a managed object such as market, product or growth system. A Cortex is not just an agent; it is the operating system of workflows, rules, permissions and decision loops that manipulate the Nexus. The first practical company step is a small Market Opportunity Nexus for one strategic segment, with browser-first capture, weekly Cortex workflows, explicit owners, and a decision benchmark: do real feature/growth/strategy decisions cite the Nexus and change confidence/risk because of it?

## Compact answer templates

### “Is LLM-Wiki the Nexus and Cortex?”

> In spirit, yes, but the equivalence is incomplete. LLM-Wiki can be the technical skeleton of a Nexus: a living, source-backed context layer. Skills/agents can be an early Cortex: the rules and operations for working with that context. PAF needs more than that: a managed object, node schema, confidence/ripeness, owners, decision loops and links to bunches/goals/risks.

### “Which Nexus should a company start with?”

> The most practical start is a Market Opportunity Nexus for one strategic segment or market. It is naturally shared: product, marketing, sales, support and leadership bring different sources, while product and growth decisions begin to rely on one external context. If the market is already clear and the pain is inside the product, start with a Product Nexus.

### “How do we make it shared rather than personal?”

> Choose a managed object that matters to several functions, give everyone simple capture through a browser/form/bot, define a shared node schema, assign review owners and require decisions/experiments/feature bunches to cite the Nexus. The repository does not make it shared; cross-functional evidence and decisions that actually use the context do.

### “How can we quickly test decision impact?”

> Take 10 real decision questions and compare the normal mode with Nexus/Cortex mode. Measure time-to-answer, source coverage, confidence delta, surfaced gaps and the number of decisions/PRDs/experiments that cite the Nexus, not page count. If no decision changes or becomes clearer after a month, this is still a dump, not a Nexus.

### “What is portable and what still needs to be built?”

> Portable pieces include raw/wiki/schema, capture -> triage -> ingest -> query -> lint -> refresh, provenance, review states, privacy/model policy and evaluation. PAF-specific work remains: node schemas, Confidence Point/Ripeness, links to Goal Map/Feature Bunch/mNSM, Product Engineer/Product Ops roles, access control, browser capture and decision templates.
