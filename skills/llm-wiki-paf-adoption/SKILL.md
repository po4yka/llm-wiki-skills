---
name: llm-wiki-paf-adoption
description: Answer questions that map LLM-Wiki to Product Architecture Framework concepts such as Nexus, Cortex, Product Engineer, Product Ops, Context Ripeness, Confidence Point, Feature Bunch and company-level AI product operations. Use when the user asks whether LLM-Wiki is a Nexus/Cortex, how to start a company-level Nexus, which Nexus to start with, how to make it shared, how to measure decision impact, or what must be added beyond basic LLM-Wiki.
license: MIT
compatibility: Designed for Agent Skills-compatible coding agents. Browse and cite fresh PAF sources when making current or source-specific claims.
metadata:
  author: po4yka
  version: "0.1.0"
  install_scope: self-contained
---

# LLM-Wiki PAF Adoption

## Goal

Help users reason about LLM-Wiki as a possible technical substrate for PAF Nexus/Cortex adoption without collapsing the product-management framework into a generic wiki.

## When to use

Use when the user asks:

- "Is LLM-Wiki basically Nexus and Cortex?"
- "Am I oversimplifying PAF by mapping Nexus to wiki and Cortex to agents?"
- "Which Nexus should we start with: market, product, growth, company?"
- "How do we make this shared at company level, not personal or single-team?"
- "How do we check that it affects decisions rather than becoming another docs dump?"
- "What can we reuse from LLM-Wiki skills, and what must be built for PAF?"
- "How do Product Engineer / Product Ops roles map to LLM-Wiki ownership?"

## Required references

Read these when available:

- `references/docs/paf-nexus-cortex.md`
- `skills/llm-wiki-faq/references/additional-adoption-q-and-a.md`
- `references/docs/adoption-objections.md`
- `references/docs/adoption-q-and-a.md`

For PAF source claims, browse and cite the current Product Framework page or the specific PAF source the user provides.

## Core stance

Use this answer:

> LLM-Wiki can be the technical skeleton of a Nexus, and Agent Skills/workflows can be an early Cortex. But this is only true after you add PAF-specific object boundaries, node schema, ownership, confidence/ripeness metrics, decision loops and company governance. A Markdown wiki by itself is not a Nexus; a chatbot by itself is not a Cortex.

## Mapping

| PAF concept | LLM-Wiki mapping | Caveat |
|---|---|---|
| Nexus | Shared `raw/` + `wiki/` + index/log + source-backed pages | Needs product/market/growth node schema. |
| Nexus Node | Typed wiki page | Needs PAF node types such as segment, competitor, feature, lever, risk, assumption, opportunity, decision. |
| Context Ripeness | Completeness + freshness + review/provenance coverage | Needs explicit ripeness formula. |
| Confidence Point | Confidence/risk state of a feature/opportunity | Do not confuse with LLM confidence. |
| Cortex | Skills, agents, retrieval, lint, refresh, integrations | Needs company-specific rules and permissions. |
| Product Engineer | Human owner of product decisions | Agent cannot own truth. |
| Product Ops | Maintainer of Nexus/Cortex process quality | Strong fit for schema/workflow/eval ownership. |

## Procedure

### 1. State whether the analogy is valid

Say:

- "Directionally yes."
- "But it is not an identity."
- "LLM-Wiki is the knowledge substrate; PAF adds management semantics."

Avoid:

- "LLM-Wiki is PAF."
- "Any wiki is a Nexus."
- "Any agent is a Cortex."
- "Start by building a company-wide AI operating system."

### 2. Recommend the first company-level step

Default recommendation:

```text
one object of management
one decision loop
one shared source inbox
one Nexus schema
one weekly decision review
one measurable decision outcome
```

Prefer a **Market Opportunity Nexus** first when the user wants company-level adoption and the main pain is fragmented external context.

Prefer a **Product Nexus** first when the user has one product, clear market context and delivery/product decisions are the urgent pain.

Avoid Company/Portfolio Nexus as the first pilot unless leadership is already committed and ownership is clear.

### 3. Make it shared, not personal

A company Nexus must have:

- object of management: market segment, product line, growth system or business unit;
- multiple source functions: product, marketing, sales, support, analytics, research, leadership;
- browser-first capture for contributors;
- named owners for review/promotion;
- decision artifacts that must cite Nexus pages;
- access controls and data classification;
- metrics that track decision influence.

### 4. Define the minimal Cortex

The minimum Cortex is a repeatable set of agent workflows:

| Workflow | Skill fit |
|---|---|
| Capture triage | `wiki-triage`, `llm-wiki-channel-capture` |
| Source ingest | `wiki-ingest` |
| Decision query | `wiki-query` |
| Gap/risk report | `wiki-lint`, `llm-wiki-provenance` |
| Confidence update | `llm-wiki-eval`, `llm-wiki-benchmark-suite` |
| Decision file-back | `wiki-query`, `llm-wiki-adr-memory` |

### 5. Verify decision impact

Use decision-influence metrics, not page count:

- decision citation rate;
- confidence/risk movement;
- gap closure rate;
- time-to-context;
- decision reversal quality after new evidence;
- cross-functional reuse;
- output beyond the wiki.

Pilot success condition:

> Within one month, at least 3-5 real decisions or product/growth artifacts cite the Nexus, and at least one confidence/risk/gap changes because of new evidence.

### 6. Separate portable parts from missing parts

Portable from LLM-Wiki:

- `raw/ -> wiki/ -> schema`;
- index/log;
- capture/triage/ingest/query/lint/refresh;
- provenance and review states;
- privacy/model/data policy;
- with-wiki vs without-wiki evaluation.

Must be built for PAF:

- Nexus node taxonomy;
- Context Ripeness formula;
- Confidence Point and risk model;
- Goal Map / Feature Bunch / mNSM or NPV linkage;
- Product Engineer/Product Ops ownership;
- decision templates with required Nexus citations;
- dashboards and company access model.

## Output

Use this structure:

```markdown
## Direct answer

## Where the analogy holds

## Where it is too simple

## First company-level Nexus pilot

## Minimal Cortex workflow

## How to measure decision impact

## Portable now vs needs to be built
```

## Safety gates

- Do not claim PAF endorsement or equivalence unless the user provides such evidence.
- Do not treat generated pages as official Nexus nodes without review.
- Do not recommend company-wide rollout before a small pilot.
- Do not use page count as success metric.
- Do not confuse LLM confidence with product Confidence Point.
- Do not centralize sensitive company context without data classification and access control.
