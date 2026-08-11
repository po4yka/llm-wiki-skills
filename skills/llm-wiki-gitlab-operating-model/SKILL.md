---
name: llm-wiki-gitlab-operating-model
description: Design an LLM-Wiki team operating model for self-hosted GitLab and internal enterprise environments. Use for GitLab Self-Managed or air-gapped contours with groups, merge requests, CODEOWNERS, approval rules, protected branches, CI/CD, LDAP/SAML, RBAC, audit and compliance.
license: MIT
compatibility: Designed for Agent Skills-compatible coding agents. Browse current GitLab, security, compliance and platform docs before giving version-specific configuration, feature-tier, API or deployment advice.
metadata:
  author: po4yka
  version: "1.0.2"
  install_scope: self-contained
---

# LLM-Wiki GitLab Operating Model

## Goal

Plan an LLM-Wiki operating model for a self-managed GitLab instance inside an enterprise/internal network, with GitLab-native governance, CI/CD, permissions, compliance, publishing and reliability controls.

Use `references/docs/23-gitlab-self-hosted-operating-model.md` as the reference model.

## When to use

- The user runs GitLab Self-Managed (CE/EE) or an air-gapped/offline GitLab contour and needs an LLM-Wiki governance and delivery model on top of it.
- Groups/subgroups, CODEOWNERS, MR approval rules, protected branches/environments or GitLab CI/CD pipelines need to be designed or reviewed for LLM-Wiki content.
- Identity/RBAC (LDAP, SAML, SCIM), runner topology, audit/compliance evidence, or offline mirror strategy need mapping to GitLab primitives.
- The user asks how to move LLM-Wiki authorship and publishing off the GitLab Wiki feature onto a CI/CODEOWNERS/eval-gated workflow.
- Not for GitHub-hosted repositories (use the GitHub-specific operating-model skill instead) or for generic project-management advice unrelated to GitLab.

## Starter templates

Use these local templates when available:

- `references/templates/gitlab-operating-model.yaml`
- `references/templates/gitlab-codeowners.llm-wiki`
- `references/templates/gitlab-llm-wiki-ci.yml`
- `references/templates/gitlab-merge-request-template.md`
- `references/templates/gitlab-protected-branch-environment-policy.yaml`
- `references/templates/gitlab-raci-daci.yaml`
- `references/templates/gitlab-slo-scorecard.yaml`

Copy only the templates that match the user's GitLab operating-model scope, then replace placeholder groups, approvers, environments and runner assumptions.

## Inputs

- GitLab edition/tier if known: Free, Premium, Ultimate; CE/EE install context if relevant.
- GitLab deployment: single-node, HA, Geo, offline/air-gapped, Kubernetes, VM/bare metal.
- Organization model: team count, top-level group strategy, subgroups, tenants/domains.
- Desired LLM-Wiki surfaces: repo docs, internal portal, GitLab Pages, MCP/API, agent bundle, exports.
- Existing controls: LDAP, SAML, SCIM, CODEOWNERS, branch protection, approval rules, protected environments, runners, registries, audit events, SIEM.
- Risk profile: internal-only, sensitive, regulated, production-critical.
- Current pain: review bottleneck, runner sprawl, policy drift, stale knowledge, ungoverned agent writes, compliance evidence gaps.

## Procedure

### 1. Classify the deployment and constraints

Record:

```yaml
gitlab:
  offering: self-managed
  edition_install: CE|EE|unknown
  tier: Free|Premium|Ultimate|unknown
  deployment: single-node|ha|geo|cloud-native|hybrid|unknown
  network: internal|restricted-egress|air-gapped|internet-exposed|unknown
  identity: ldap|saml|scim|local|unknown
  kubernetes: true|false|unknown
  compliance_requirements: []
```

Re-check current GitLab docs before making tier-specific statements.

### 2. Choose operating model

Default:

```text
central GitLab platform hub + federated domain/content pods + security/compliance guardrails + SRE-owned reliability
```

Use:

| Model | Use when |
| --- | --- |
| centralized platform | early maturity, heavy compliance, few product teams. |
| federated teams | mature engineering org, strong local ownership. |
| hub-and-pod | most self-hosted GitLab enterprises. |

### 3. Design group/subgroup topology

Recommend a top-level group with controlled subgroups:

```text
corp/
  platform/
  security/
  knowledge/
  domains/
  delivery/
  artifacts/
```

Rules:

- keep top-level Owners limited;
- separate platform-owned CI components from domain-owned content;
- use `delivery/` repos when GitOps promotion must be separated from authorship;
- use `artifacts/` repos for governed package/container/OCI promotion;
- avoid ad hoc subgroup sprawl.

### 4. Map LLM-Wiki workflow to GitLab

Use:

```text
Issue -> feature branch -> Merge Request -> CI gates -> CODEOWNERS/approval rules -> protected branch -> protected environment -> Release/evidence
```

Map concerns:

| Concern | GitLab primitive |
| --- | --- |
| work intake | Issues, labels, milestones, issue boards. |
| review | Merge Requests and reviewer states. |
| ownership | CODEOWNERS. |
| mandatory review | MR approval rules. |
| branch governance | protected branches. |
| validation | GitLab CI/CD. |
| production/public export authorization | protected environments + deployment approvals. |
| durable evidence | Releases, artifacts, package registry, checksums. |

### 5. Define CODEOWNERS and approval rules

Protect:

- `.gitlab-ci.yml`;
- `.gitlab/**`;
- `skills/**`;
- `references/templates/**`;
- `references/policies/**`;
- `api/**`;
- `mcp/**`;
- `exports/profiles/**`;
- `evals/**`;
- `wiki/policies/**`;
- `wiki/security/**`;
- `wiki/architecture/**`;
- `raw/manifests/**`.

Risk-tier approvals:

| Change type | Approvals |
| --- | --- |
| low-risk content update | domain owner or knowledge engineer. |
| page promotion | domain owner plus knowledge engineer when provenance matters. |
| ingestion/retrieval/eval change | technical lead plus workflow owner. |
| security/model/data policy | security plus product/risk owner. |
| CI/runners/protected branch/environment | platform plus security. |
| public/internal/agent export profile | publishing plus security plus domain owner. |
| MCP/API permission/tool change | platform plus security plus technical lead. |

### 6. Design GitLab CI/CD and runner model

Use a split model:

```text
central CI components + group/project extension points + scoped runners + protected deployments + release artifacts
```

Runner defaults:

| Runner scope | Recommendation |
| --- | --- |
| group runners | default enterprise runner scope. |
| project runners | sensitive/high-privilege/special-case jobs. |
| instance runners | low-risk shared jobs only with segmentation and trust assumptions. |
| offline runners | internal images/mirrors/scanner feeds only. |

CI stages:

```yaml
stages:
  - validate
  - lint
  - eval
  - security
  - package
  - preview
  - deploy
  - release
```

### 7. Protect environments and publishing

Use protected environments for:

- production;
- public export;
- agent bundle;
- internal MCP/API;
- compliance evidence publication.

Public/internal/agent exports should produce release artifacts:

- export manifest;
- checksums;
- redaction report;
- citation report;
- scorecard;
- changelog;
- rollback artifact.

### 8. Define identity, RBAC and internal perimeter controls

Recommend:

- LDAP or SAML SSO;
- SAML group sync, SCIM or LDAP group sync where available;
- least-privilege GitLab roles;
- small top-level Owner set;
- external secrets provider for sensitive CI secrets;
- protected variables only for protected branches/tags/environments;
- protected runners for privileged jobs;
- audit events into SIEM where tier permits;
- segmented network zones for GitLab app, database/cache, runners, registries, object storage, secrets backend, Kubernetes agents and MCP/API services.

Internal network is not a sufficient security boundary.

### 9. Plan offline/air-gapped operations

If egress is restricted, design internal substitutes:

| Need | Internal substitute |
| --- | --- |
| runner images | internal container registry mirror. |
| package dependencies | internal package registry/proxy. |
| security analyzers | mirrored analyzer images and offline data. |
| CI components | versioned `platform/ci-components` project. |
| docs/export tooling | pinned internal packages/images. |
| MCP/API images | signed internal OCI images. |

### 10. Define SLOs and dashboards

Track:

- GitLab UI/API availability;
- backup success and restore drill status;
- runner queue time and utilization;
- CI success/failure by group;
- package/container registry health;
- audit stream delivery;
- review backlog;
- stale pages;
- index freshness;
- protected environment approval latency;
- export/publish pipeline status;
- patch/upgrade compliance.

### 11. Recommend rollout

Use phases:

1. GitLab admin ownership, SSO, top-level group structure, runner MVP, backup, base CI components.
2. Protected branch baseline, MR approval rules, CODEOWNERS, issue boards, audit collection.
3. Protected environments, deployment approvals, release evidence, SIEM forwarding, restore rehearsal, dashboards, HA/Geo decision.
4. Offline mirrors, GitOps delivery repos, runner fleet tuning, compliance framework mapping, SLO/error budget review.

## Output

```markdown
## GitLab self-hosted operating model

## Scope and assumptions

## Edition/tier implications

## Group/subgroup topology

## Workflow mapping

## CODEOWNERS and approval rules

## CI/CD and runner model

## Protected branches and environments

## Identity, RBAC and internal perimeter controls

## Offline/air-gapped design

## Publishing/export/MCP/API model

## SLOs and dashboards

## Rollout plan

## Risks and open decisions
```

## Safety gates

- Do not assume GitLab feature availability without checking current tier/version docs.
- Do not treat internal network placement as a substitute for RBAC, segmentation, audit and secrets controls.
- Do not recommend broad instance runners for sensitive jobs without segmentation and runner trust review.
- Do not recommend GitLab Wiki for production LLM-Wiki knowledge that needs CI, CODEOWNERS, evals and export gates.
- Do not enable public/internal agent bundles without export profiles, redaction and protected-environment approvals.
- Do not treat Geo as high availability; evaluate HA and DR separately.
