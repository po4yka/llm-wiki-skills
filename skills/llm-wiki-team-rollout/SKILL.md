---
name: llm-wiki-team-rollout
description: Plan and implement LLM-Wiki adoption for a team or company. Use for onboarding knowledge, bus factor, repo docs, decision records, PR-based agent writes, CODEOWNERS, permissions, governance, RACI/DACI, SLOs, review queues, team rituals, staffing, dashboards, security boundaries and operating models.
license: MIT
compatibility: Designed for Agent Skills-compatible coding agents. Requires access to the relevant repository or docs workspace; may require GitHub permissions for PR-based workflows. Browse current GitHub, SRE, eval, observability and platform docs before giving version-specific configuration advice.
metadata:
  author: po4yka
  version: "1.0.0"
  install_scope: self-contained
---

# LLM-Wiki Team Rollout

## Goal

Introduce and operate LLM-Wiki in a team without creating an unreviewed official-looking slop layer or a hidden reliability burden.

Use `references/docs/22-team-operating-model.md` as the reference operating model for roles, RACI/DACI, governance, SLOs, rituals, staffing stages, dashboards, onboarding and GitOps controls.

## When to use

- A team is adopting LLM-Wiki for the first time and needs an operating model, not just tooling.
- A pilot wiki is moving to early production and needs PR-based writes, CODEOWNERS and a review queue.
- Leadership asks for RACI/DACI, SLOs or a rollout plan before expanding to more domains.
- A team is deciding between read-only reports, PR-based writes, a draft wiki or direct writes.
- An existing rollout needs a governance or maturity-stage review (e.g. moving toward regulated/24x7).

## Starter templates

Use these local templates when available:

- `references/templates/team-operating-model.yaml`
- `references/templates/team-raci-daci.yaml`
- `references/templates/team-review-workflow.yaml`
- `references/templates/team-slo-scorecard.yaml`
- `references/templates/team-onboarding-checklist.md`
- `references/templates/CODEOWNERS.llm-wiki`

Copy only the templates that fit the rollout stage, then replace placeholder roles, owners, SLOs and review-state gates.

## Inputs

- Team size and workflows.
- Repository/docs platform.
- Existing docs, ADRs, onboarding material, issue/PR history, incident history and support channels.
- Security, privacy and permission constraints.
- Existing CODEOWNERS, branch protection and CI gates.
- Preferred write model: read-only, PR-based, direct writes, separate draft wiki.
- Current LLM-Wiki maturity: pilot, early production, business-critical, regulated/24x7.
- Desired outcome: adoption plan, operating model, RACI, templates, repo changes or governance review.

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
- cross-team handoff;
- multi-domain knowledge governance;
- public/internal publishing;
- MCP/API/product interface support.

### 2. Choose maturity stage

| Stage | What is true | Suggested posture |
| --- | --- | --- |
| pilot | one domain, limited users, manual review acceptable. | one accountable pod, report-first metrics. |
| early production | recurring ingest, CI evals, protected releases. | PR-based writes, named owners, weekly reviews. |
| business-critical | multi-domain, API/MCP surface, publishing/export. | SLOs, incident playbooks, dedicated platform/security input. |
| regulated or 24x7 | strict approvals, strong auditability, real on-call. | formal governance, support rotation, security sign-off. |

### 3. Define operating model

Recommended default:

```text
Product Owner + Technical Lead + Knowledge Engineer + Retrieval/Eval Engineer
+ shared Platform/SRE + shared Security + Domain Editors/SMEs + Publishing owner where needed
```

Use roles:

| Role | Owns |
| --- | --- |
| Product Owner | scope, value, priority, KPI targets, rollout. |
| Technical Lead | architecture, schema, API/MCP, technical decisions. |
| Knowledge Engineer | source model, wiki structure, taxonomy, provenance, page QA. |
| Retrieval/Eval Engineer | retrieval quality, eval datasets, scorecards, regressions. |
| Platform/SRE | CI/CD, observability, SLOs, runbooks, deployments, incidents. |
| Security Engineer | threat model, data boundaries, approval policy, red-team. |
| Domain Editor/SME | factual acceptance and domain judgment. |
| Publishing/Docs Manager | information architecture, releases, exports, training. |

### 4. Choose write model

| Model | Use when | Risk |
| --- | --- | --- |
| read-only reports | early pilot or low trust | knowledge does not compound. |
| PR-based writes | most teams | review queue required. |
| separate draft wiki | high automation or sensitive domains | promotion workflow needed. |
| direct writes | tiny trusted teams only | silent corruption. |

Default to PR/proposal-based writes for teams:

```text
agent proposal -> branch/patch -> lint/eval/security checks -> CODEOWNERS/domain review -> merge -> index refresh
```

### 5. Define ownership and RACI

Map:

- who owns each wiki domain/path;
- who approves synthesis pages;
- who owns taxonomy/schema changes;
- who handles lint and eval failures;
- who owns ingestion profiles;
- who approves MCP/API/export changes;
- who handles incident response;
- which domains are sensitive or restricted;
- what agents may read, propose and publish.

Use RACI for recurring execution and DACI for cross-team decisions.

Minimum RACI fields:

```yaml
workflow: ""
responsible: []
accountable: ""
consulted: []
informed: []
required_checks: []
escalation: ""
```

### 6. Add governance layers

Ensure the rollout covers:

| Layer | Mechanism |
| --- | --- |
| domain ownership | path owners, CODEOWNERS, SMEs. |
| technical ownership | architect, ADRs, schemas, MCP/OpenAPI contracts. |
| quality governance | evals, scorecards, lint, review backlog. |
| security governance | threat model, model policy, redaction, incident playbook. |
| publishing governance | export profiles, manifests, release approvals. |
| operational governance | SLOs, runbooks, alerts, error budget policy. |

### 7. Start with high-value domains

Good first domains:

- onboarding map;
- architecture overview;
- ADR/decision history;
- repo conventions;
- incident postmortems;
- product terminology;
- recurring support questions;
- policy/runbook pages with clear owners.

Avoid migrating everything at once.

### 8. Define metrics and SLOs

Track:

- retrieval hit rate;
- citation coverage;
- unsupported-claim rate;
- review backlog count;
- median review age;
- stale verified pages;
- source/index freshness lag;
- agent mistakes caused by missing context;
- PR cycle time for documentation updates;
- docs read/write ratio;
- onboarding questions answered from the wiki;
- public/agent export failures;
- incident count and MTTR;
- team toil percentage.

Example gates:

```yaml
review_queue:
  median_age_days_max: 7
  high_risk_age_days_max: 3
retrieval:
  recall_at_10_min: 0.80
grounding:
  citation_coverage_min: 0.90
  material_unsupported_claims_max: 0
publishing:
  blocking_redaction_findings_max: 0
operations:
  index_freshness_hours_max: 24
```

### 9. Define operating rituals

Recommended cadence:

| Cadence | Ritual |
| --- | --- |
| daily async | ingest/retrieval/security triage. |
| weekly | retrieval/eval review. |
| weekly | review queue grooming. |
| weekly/biweekly | release/export review. |
| biweekly | architecture/security review. |
| monthly | team health and toil review. |
| monthly | scorecard review. |
| quarterly | operating model review. |
| per incident | incident command and postmortem. |

### 10. Add GitOps controls

Recommend:

- CODEOWNERS for `wiki/`, `raw/manifests/`, `skills/`, `templates/`, `.github/`, `api/`, `mcp/`, `exports/profiles/`, `evals/`;
- branch protection or rulesets;
- required PR reviews;
- required checks by PR type;
- protected environments for publishing/deployment;
- minimal workflow permissions;
- artifact manifests and scorecards.

### 11. Create rollout plan

Use phases:

1. team charter, working agreements, owners, initial RACI;
2. read-only inventory;
3. draft wiki for one domain;
4. PR-based updates and review states;
5. weekly lint/eval/security review;
6. onboarding/query usage;
7. export/MCP/API only after gates exist;
8. expand to more domains;
9. operating scorecard and maturity review.

## Output

```markdown
## Team rollout recommendation

## Primary use case

## Maturity stage

## Proposed operating model

## Roles and RACI

## Proposed write model

## Ownership and review policy

## Initial domains

## Repository and GitOps controls

## SLOs, metrics and dashboards

## Rituals and cadences

## Onboarding plan

## Rollout phases

## Risks and mitigations

## Follow-up skills
```

## Safety gates

- Do not recommend direct writes for teams without a named reviewer and rollback path.
- Do not index restricted material into broadly readable wiki pages.
- Do not blur draft and verified knowledge.
- Do not let lint/eval agents silently resolve truth conflicts.
- Do not recommend public export, `llms-full.txt`, MCP/API or agent-bundle rollout before redaction, eval and approval gates exist.
- Do not recommend 24x7 support without a sustainable on-call staffing plan.
