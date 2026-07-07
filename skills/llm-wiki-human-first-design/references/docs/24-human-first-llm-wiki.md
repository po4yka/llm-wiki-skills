# Human-first LLM-Wiki design

> Scope: fix the adoption argument that LLM-Wiki must not be treated as an agent-generated document dump. The wiki must remain useful when agents are unavailable, while agents assist with bookkeeping, linking, linting and refresh.

## Short answer

This objection is correct:

> If a human cannot find, read and challenge the information without an agent, the system is not a trustworthy LLM-Wiki. It is an opaque agent cache or a better-looking document dump.

The default design stance should be:

```text
human-readable by default
agent-optimized by metadata
source-backed by construction
decision-oriented by structure
```

LLM-Wiki should be **human-first, agent-assisted**:

```text
Humans own meaning, acceptance and navigation quality.
Agents maintain bookkeeping, links, drafts, indexes, lint reports and refresh queues.
```

## Why this matters

Confluence-style knowledge bases often fail not because there are too few documents, but because context is scattered across spaces, projects, teams and historical layers.

Typical fragmentation:

- product strategy in one space;
- project execution in Jira;
- rationale in Slack or meeting notes;
- technical context in PRs and ADRs;
- customer evidence in CRM/support/research tools;
- old decisions in people's memory.

An LLM-Wiki is only useful if it creates a **navigation and synthesis layer** over those sources. If it merely creates new agent-generated summaries, it repeats the same failure mode with more confident prose.

## The agent-disappears test

Before calling a wiki successful, run this test:

> If agents disappeared tomorrow, could a human open the wiki and answer the most important recurring questions faster than in Confluence/search?

Minimum pass criteria:

1. A human can start from `wiki/index.md` or a domain map, not from search guesswork.
2. A human can find the page for a recurring question or decision in 1-2 minutes.
3. The page states what is known, what is uncertain, what is stale and what sources support it.
4. The page separates source-backed facts from generated summary and human synthesis.
5. Related decisions, risks, assumptions and source pages are linked.
6. The page has `status`, `owner`, `review_required`, freshness and provenance fields.
7. A human can decide whether to trust the page without asking an agent.

If this fails, do not add more ingestion. Fix navigation, page contracts and review states first.

## Bad vs good artifact

### Bad: agent-generated dump

```text
/wiki/generated/
  jira-summary.md
  confluence-summary.md
  slack-summary.md
  product-summary-final-v3.md
```

Symptoms:

- organized by source/tool, not by question or decision;
- no clear owner or status;
- summaries sound official but lack provenance;
- humans still need an agent to know where to look;
- pages grow but decisions do not cite them.

### Good: shared context layer

```text
/wiki/
  index.md
  log.md
  market/
    smb-segment.md
  product/
    onboarding-problem.md
  decisions/
    why-we-prioritized-smb-onboarding.md
  risks/
    activation-drop-risk.md
  assumptions/
    onboarding-friction-assumption.md
  sources/
    confluence-product-strategy-2026.md
    jira-epic-onboarding-redesign.md
    sales-call-summary-acme.md
```

A human starts from a question:

```text
Why did we prioritize SMB onboarding?
```

and reaches a page with:

- direct answer;
- source-backed facts;
- decision history;
- open questions;
- stale/unsupported claims;
- related pages;
- human synthesis;
- review state.

## Information architecture rules

### 1. Organize around decision objects, not tools

Prefer folders/pages such as:

```text
markets/
segments/
customers/
problems/
opportunities/
features/
decisions/
risks/
assumptions/
metrics/
sources/
queries/
```

Do not mirror Confluence spaces or Jira projects as the primary navigation model unless those spaces already match how people ask questions.

### 2. Keep source pages separate from synthesis pages

Use `sources/` for evidence and `decisions/`, `problems/`, `opportunities/`, `risks/` for reusable context.

```text
sources/confluence-roadmap-2026.md
sources/jira-epic-onboarding.md
decisions/why-onboarding-before-activation-dashboard.md
problems/new-user-onboarding-friction.md
```

This prevents generated synthesis from pretending to be raw evidence.

### 3. Build human entry points

Every useful wiki needs visible maps:

| Entry point | Purpose |
|---|---|
| `index.md` | Whole-wiki map, short enough to read. |
| `log.md` | Recent activity and change history. |
| Domain MOC | Human map for a market/product/problem area. |
| Decision index | “Why did we decide X?” entry point. |
| Open questions page | Shows missing knowledge and current investigations. |
| Stale/unsupported claims report | Shows trust gaps. |

### 4. Use stable, descriptive page titles

Good:

```text
why-we-prioritized-smb-onboarding.md
activation-drop-risk.md
enterprise-segment-pricing-assumption.md
```

Bad:

```text
summary-2026-07-07.md
jira-notes.md
agent-output-14.md
```

### 5. Make generated content visibly provisional

Generated pages default to:

```yaml
status: draft
review_required: true
ai_generated: true
owner: <human-or-team>
```

Promotion to `reviewed` or `verified` is a human action.

## Human-readable page contract

Use this minimum contract for important pages:

```markdown
# Page title

## Direct answer / why this page matters

## Current status
- status:
- owner:
- last_reviewed:
- stale_after:
- confidence / ripeness:

## Source-backed facts

## Evidence table
| Claim | Source | Support | Notes |

## Human synthesis

## Open questions / uncertainty

## Related decisions, risks and assumptions

## Related source pages

## Changelog
```

Rules:

- `## Human synthesis` is protected. The agent may suggest changes, but should not overwrite it silently.
- `## Source-backed facts` must cite source pages or claim anchors.
- `## Open questions` should be visible, not hidden in chat history.
- `## Changelog` should explain material changes, not every typo.

## How to achieve this in an LLM-Wiki

### Step 1. Pick 10 recurring human questions

Before building structure, collect questions people actually ask:

- Why did we choose segment X?
- What do we know about competitor Y?
- Which assumptions block initiative Z?
- What changed in pricing evidence this month?
- Which customer pains are repeated across sources?
- What is stale in the onboarding strategy?
- Where is the latest decision about metric N?

These questions become the acceptance test and page-design seed.

### Step 2. Build a human navigation skeleton first

Create:

```text
wiki/index.md
wiki/log.md
wiki/decisions/index.md
wiki/open-questions.md
wiki/stale-and-unsupported.md
wiki/<domain>/index.md
```

Do this before bulk ingestion. The skeleton defines how humans will browse.

### Step 3. Define page types and protected sections

Minimum page types:

```text
source
problem
decision
risk
assumption
opportunity
metric
query
synthesis
```

Protected sections:

```text
## Human synthesis
## Decision / accepted interpretation
## Owner notes
```

Agent rule:

> Edit links, metadata, draft summaries and review reports freely; propose changes to protected sections; do not overwrite them.

### Step 4. Ingest sources into draft pages, not official pages

Use two-step ingest:

```text
analyze source -> propose affected pages -> write draft updates -> run lint/provenance -> human review -> promote
```

Never let one LLM pass both interpret the source and promote the result to official knowledge.

### Step 5. File back good answers

When a user asks a useful question, save the answer as a `query` or `decision` page:

```text
wiki/queries/why-smb-onboarding-now.md
wiki/decisions/why-smb-onboarding-before-dashboard.md
```

This is how the wiki becomes easier for humans over time. Otherwise value remains in chat exhaust.

### Step 6. Lint for human usability, not only broken links

Add checks for:

- orphan pages;
- no source-backed facts;
- missing owner/status;
- pages with generated summary but no human synthesis;
- decision pages without decision date or source links;
- source pages not linked from any synthesis page;
- important pages missing from domain maps;
- stale pages still used by decisions;
- pages that require an agent to interpret them.

### Step 7. Review random pages without agents

Monthly test:

1. Pick 10 random pages.
2. Ask a human reviewer to explain what each page is for.
3. Check whether sources, status, related pages and open questions are clear.
4. Fix navigation and page contracts before adding more ingestion.

### Step 8. Compare against Confluence/search

Use the 10 recurring questions from Step 1.

Measure:

```text
time_to_find_answer
number_of_clicks_or_searches
source_clarity
stale_or_uncertain_claims_visible
whether_answer_changes_decision
whether_human_needed_agent_to_understand
```

Success condition:

> Humans can answer at least 7/10 recurring questions faster or with clearer provenance than in the old system, without relying on an agent.

## Human-first metrics

Do not optimize for page count.

Use:

| Metric | Meaning |
|---|---|
| Human findability | Can a human find a recurring answer in 1-2 minutes? |
| Navigation coverage | Are important pages reachable from maps/indexes? |
| Source clarity | Can a reader see why a claim is believed? |
| Trust visibility | Are stale, draft, unsupported and uncertain claims visible? |
| Decision citation rate | Do decisions cite wiki pages and sources? |
| Answer reuse | Do filed-back answers get reused? |
| Read/write ratio | Is the wiki read as well as written? |
| Agent-free pass rate | How many test questions can humans answer without an agent? |

## Minimum implementation checklist

- [ ] `index.md` fits in one quick human read.
- [ ] Every domain has a domain map.
- [ ] Decision pages exist for important “why” questions.
- [ ] Source pages are separate from synthesis pages.
- [ ] Important pages have owner/status/review/freshness fields.
- [ ] Generated pages default to draft.
- [ ] Human synthesis sections are protected.
- [ ] Lint reports include human-usability checks.
- [ ] Good answers are filed back.
- [ ] Monthly agent-free review runs.
- [ ] 10 recurring questions are benchmarked against the old system.

## Recommended answer to the objection

> I agree with the concern. LLM-Wiki should not be a vacuum where agents generate more documents. It should be a human-readable shared context layer that remains useful without agents. Agents are the librarians: they maintain links, indexes, metadata, lint reports and refresh queues. Humans own meaning, review and trust. The practical test is simple: take 10 questions that are hard to answer in Confluence today. If a human can answer them faster from the wiki without an agent, with clearer sources and uncertainty, the system is working. If only the agent can magically retrieve the answer, we built an opaque cache, not a knowledge base.
