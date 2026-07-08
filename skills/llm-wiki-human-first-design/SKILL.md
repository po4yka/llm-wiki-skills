---
name: llm-wiki-human-first-design
description: Design or audit an LLM-Wiki so it remains useful to humans without agents. Use when the user fears an agent-generated document dump or a new Confluence-like mess, or needs human-readable page contracts, navigation maps, and agent-free acceptance tests.
license: MIT
compatibility: Designed for Agent Skills-compatible coding agents. Does not require web unless the user asks for current tool-specific UI or SaaS integration details.
metadata:
  author: po4yka
  version: "0.1.1"
  install_scope: self-contained
---

# LLM-Wiki Human-First Design

## Goal

Help users design or audit an LLM-Wiki as a human-readable shared context layer, not an opaque agent cache or a folder of generated Markdown summaries.

## When to use

Use when the user says or asks:

- "LLM-Wiki should not be considered in a vacuum."
- "If agents disappear tomorrow, can humans still find information?"
- "I do not want another Confluence-like document dump."
- "How do we make the wiki readable and useful for humans?"
- "How do we prevent agent-generated markdown from becoming slop?"
- "What page structure makes the wiki navigable?"
- "How do we test human findability?"
- "How do we design a wiki around decisions/questions rather than sources/spaces?"

## Inputs

- The current wiki tree (or a proposed layout) — directory structure, `index.md`, domain maps.
- A handful of recurring questions humans actually ask (or need to derive them if the user has not listed any).
- Sample pages, especially any that mix generated summary with human-authored synthesis.
- Any existing page-contract or frontmatter convention already in use, so the audit can search for deviations instead of inventing a new contract.
- Whether the wiki currently has agent write access, and under what review process — needed to assess the draft/review/promote gate in step 7.

## Required references

Read these when available:

- `references/docs/24-human-first-llm-wiki.md`
- `references/docs/adoption-objections.md`
- `references/docs/adoption-q-and-a.md`
- `references/docs/criticism-and-mitigations.md`
- `references/docs/04-anti-slop-and-trust.md`

## Core stance

Use this answer:

> The objection is correct. LLM-Wiki should be human-first and agent-assisted. Humans must be able to find, read and challenge the knowledge without an agent. Agents should maintain bookkeeping, links, indexes, drafts, lint reports and refresh queues; they should not become the owner of truth.

## Design principles

```text
human-readable by default
agent-optimized by metadata
source-backed by construction
decision-oriented by structure
```

Avoid:

- agent-generated summary folders;
- mirroring Confluence spaces as the primary navigation model;
- pages with no owner/status/source links;
- generated text that sounds official before review;
- requiring an agent to understand where to look.

## Procedure

### 1. Run the agent-disappears test

Ask:

> If agents disappeared tomorrow, could a human answer the 10 most important recurring questions faster than in the old system?

Minimum pass criteria:

- `index.md` and domain maps are usable by humans;
- recurring questions have decision/problem/opportunity pages;
- pages show sources, status, uncertainty and related pages;
- `## Human synthesis` is separated from generated summary;
- stale/unsupported/draft claims are visible.

### 2. Start from human questions

Collect 10 recurring questions such as:

- Why did we choose segment X?
- What do we know about competitor Y?
- Which assumptions block initiative Z?
- What changed in pricing evidence?
- Where is the latest decision about metric N?

These questions define the initial navigation and benchmark.

### 3. Build navigation before bulk ingestion

Create:

```text
wiki/index.md
wiki/log.md
wiki/decisions/index.md
wiki/open-questions.md
wiki/stale-and-unsupported.md
wiki/<domain>/index.md
```

Do not bulk ingest before there is a human-readable map.

### 4. Organize around decision objects

Prefer:

```text
markets/
segments/
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

Do not organize primarily by tools like Confluence, Jira or Slack unless that matches how humans ask questions.

### 5. Enforce a human-readable page contract

Important pages should include:

```markdown
## Direct answer / why this page matters
## Current status
## Source-backed facts
## Evidence table
## Human synthesis
## Open questions / uncertainty
## Related decisions, risks and assumptions
## Related source pages
## Changelog
```

Protect `## Human synthesis`. The agent may propose changes, but should not overwrite it silently.

### 6. Keep source and synthesis separate

Sources are evidence. Synthesis pages are interpretation and navigation.

Example:

```text
sources/confluence-roadmap-2026.md
decisions/why-onboarding-before-activation-dashboard.md
problems/new-user-onboarding-friction.md
```

### 7. Default generated pages to draft

Generated pages default to:

```yaml
status: draft
review_required: true
ai_generated: true
owner: <human-or-team>
```

Promotion to `reviewed` or `verified` is a human action.

### 8. Lint for human usability

Check for:

- orphan pages;
- missing owner/status;
- source pages not linked from synthesis;
- decision pages without source links;
- generated pages without human synthesis;
- stale pages still referenced by decisions;
- important pages missing from maps;
- pages that require an agent to interpret.

### 9. Benchmark against the old system

For the 10 recurring questions, measure:

```text
time_to_find_answer
number_of_clicks_or_searches
source_clarity
stale_or_uncertain_claims_visible
whether_human_needed_agent_to_understand
whether_answer_changes_decision
```

Success condition:

> Humans answer at least 7/10 recurring questions faster or with clearer provenance than in the old system, without using an agent.

## Output

Use this structure:

```markdown
## Direct answer

## Why the objection is valid

## Human-first design principles

## What to change in the wiki structure

## Page contract and protected sections

## Agent-disappears acceptance test

## Implementation checklist
```

## Safety gates

- Do not defend agent-generated document dumps.
- Do not treat findability as solved by semantic search alone.
- Do not allow generated summaries to become official without review.
- Do not overwrite human synthesis silently.
- Do not optimize for page count.
- Do not require an agent for humans to understand navigation.
