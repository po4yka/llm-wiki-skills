---
name: llm-wiki-team-rollout
description: Plan and implement LLM-Wiki adoption for a team or company. Use for onboarding knowledge, bus factor, repo docs, decision records, PR-based agent writes, CODEOWNERS, permissions, security boundaries, review queues, and operating rituals.
license: MIT
compatibility: Designed for Agent Skills-compatible coding agents. Requires access to the relevant repository or docs workspace; may require GitHub permissions for PR-based workflows.
metadata:
  author: po4yka
  version: "0.1.0"
---

# LLM-Wiki Team Rollout

## Goal

Introduce LLM-Wiki into a team without creating an unreviewed official-looking slop layer.

## Inputs

- Team size and workflows.
- Repository/docs platform.
- Existing docs, ADRs, onboarding material and issue/PR history.
- Security and permissions constraints.
- Preferred write model: read-only, PR-based, direct writes.

## Procedure

### 1. Identify the organizational problem

Classify the primary use case:

- onboarding;
- bus factor / departing experts;
- agent context for coding workflows;
- decision provenance;
- incident/ops knowledge;
- product/research knowledge;
- customer/support knowledge;
- cross-team handoff.

### 2. Choose write model

| Model | Use when | Risk |
|---|---|---|
| read-only reports | early pilot, low trust | knowledge does not compound |
| PR-based writes | most teams | review queue required |
| direct writes | tiny trusted teams only | silent corruption |
| separate draft wiki | high automation | extra promotion workflow |

Default to PR-based writes for teams.

### 3. Define ownership

Specify:

- CODEOWNERS or equivalent review ownership;
- who can approve synthesis pages;
- who owns taxonomy/schema changes;
- who handles lint reports;
- which domains are sensitive or restricted;
- what agents may read and write.

### 4. Start with high-value domains

Good first domains:

- onboarding map;
- architecture overview;
- ADR/decision history;
- repo conventions;
- incident postmortems;
- product terminology;
- recurring support questions.

Avoid migrating everything at once.

### 5. Create rollout plan

Use phases:

1. read-only inventory;
2. draft wiki for one domain;
3. weekly lint and review;
4. PR-based updates;
5. onboarding/query usage;
6. expand to more domains.

### 6. Define metrics

Track:

- onboarding questions answered from the wiki;
- retrieval hit rate;
- review backlog;
- stale verified pages;
- agent mistakes caused by missing context;
- PR cycle time for documentation updates;
- docs read/write ratio.

## Output

```markdown
## Team rollout recommendation

## Primary use case

## Proposed write model

## Ownership and review

## Initial domain

## Folder/repo structure

## Agent permissions

## Rollout phases

## Metrics

## Risks
```

## Safety gates

- Do not recommend direct writes for teams without a named reviewer and rollback path.
- Do not index secrets or restricted data into broadly readable wiki pages.
- Do not blur draft and verified knowledge.
- Do not let lint agents silently resolve truth conflicts.
