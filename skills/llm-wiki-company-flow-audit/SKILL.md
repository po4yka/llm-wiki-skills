---
name: llm-wiki-company-flow-audit
description: Map company/team information flows into an LLM-Wiki adoption plan. Use when the user asks where team knowledge can be collected from, which streams can be automated, how Confluence/Jira/GitHub/Slack/Teams/Drive changes stay synced, how fragile vault-review/lint systems are, whether there is UI for fixing links/contradictions, whether confidential data and permissions are supported, what pitfalls to avoid, or whether maintenance cost is worth the benefit.
license: MIT
compatibility: Designed for Agent Skills-compatible coding agents. Browse and cite fresh vendor API/security docs before giving exact connector or permission claims.
metadata:
  author: po4yka
  version: "0.1.0"
---

# LLM-Wiki Company Flow Audit

## Goal

Help users plan company/team-level LLM-Wiki ingestion and operations from real information flows, without pretending that all knowledge can be safely or usefully automated.

## When to use

Use when the user asks:

- where team/company information currently lives;
- how to collect from Confluence, Jira, GitHub, Slack, Teams, Drive, meetings, support, analytics or email;
- what can be fully automated and what cannot;
- how to keep external docs updated when they change;
- how fragile vault-review/lint systems are;
- how much time link/contradiction repair takes;
- whether there is a good UI for review queues;
- whether confidential information and access control are supported;
- what pitfalls to avoid;
- whether the maintenance cost is worth the value.

## Required references

Read these when available:

- `docs/23-company-information-flows.md`
- `docs/20-adoption-objections.md`
- `docs/21-adoption-q-and-a.md`
- `docs/19-security-threat-model.md`

For vendor claims about Confluence, Jira, Slack, Teams, Google Drive, SharePoint or GitHub, browse and cite current official docs.

## Core stance

Use this answer:

> Start from the information flows that already influence decisions. Automate capture, metadata, version/hash tracking, stale marking and review reports. Do not fully automate truth promotion, contradiction resolution, sensitive summaries or official documentation updates.

## Procedure

### 1. Inventory source flows

Map sources into:

| Flow | Examples |
|---|---|
| Docs | Confluence, Notion, Google Docs, SharePoint, PDFs. |
| Work tracking | Jira, Linear, GitHub Issues, YouTrack. |
| Code collaboration | PRs, reviews, commits, releases, ADRs. |
| Chat | Slack, Teams, Telegram, Discord. |
| Meetings | Calendar, transcripts, recordings, notes. |
| Customer/product evidence | CRM, support tickets, sales calls, research repos. |
| Analytics | BI, warehouse queries, product analytics, experiments. |
| Ops/incidents | PagerDuty, postmortems, on-call notes. |

Recommend starting with 3-5 flows that affect real decisions, not every system.

### 2. Classify automation level

Use three levels:

| Level | Meaning | Examples |
|---|---|---|
| Automatic capture | Safe append-only or metadata sync. | Webhooks, event logs, source hashes, stale flags. |
| Assisted transformation | Agent drafts structure but review is needed. | Summaries, entity pages, decision pages, dedup candidates. |
| Human-gated truth | Human owner must approve. | Verified claims, contradictions, sensitive summaries, official docs. |

### 3. Design external update handling

Require a source registry:

```yaml
source_id: confluence:123456
system: confluence|jira|github|slack|teams|drive|manual
external_id: "123456"
url: "https://..."
version: "42"
updated_at: "2026-07-07T10:00:00Z"
source_hash: "sha256:..."
last_seen_at: "2026-07-07T10:05:00Z"
last_ingested_at: "2026-07-07T10:10:00Z"
derived_pages: []
refresh_policy: webhook|poll|manual|snapshot
```

Update flow:

```text
webhook/delta/poll -> raw event -> fetch current source -> compare version/hash -> mark derived pages stale -> create diff/refresh report -> owner review
```

Do not silently overwrite reviewed human synthesis.

### 4. Explain fragility and repair effort

Be honest:

- broken links and orphans are usually cheap;
- schema drift is manageable with validators and dry-run migrations;
- duplicates and contradictions require owner judgment;
- stale external sources require a source registry and refresh loop;
- permission leaks and generated slop are high-risk;
- ignored review queues are a system failure, not a UI bug.

Use planning ranges, not guarantees:

| Scale | Maintenance planning range |
|---|---|
| Personal/tiny pilot | 30-60 minutes weekly. |
| One team/domain | 1-2 hours weekly plus domain-owner review. |
| Cross-functional pilot | Product Ops/curator rotation and weekly review meeting. |
| Company-level Nexus | Dedicated ownership, access policy and dashboards. |

### 5. Discuss UI

Default UI stack:

- Markdown reports for portability;
- GitHub/GitLab PR or issue queue for review;
- Obsidian graph/backlinks/Dataview for local exploration;
- Jira/Linear board for team triage;
- dashboard only after queues are too hard to operate manually.

Do not imply a polished universal UI exists unless the repository/tooling actually has one.

### 6. Handle confidentiality

Say:

> Yes, but only with data classification, split access domains, least-privilege agents, model boundaries, redaction and audit logs. If permissions cannot be modeled, keep metadata/links only and fetch with user-scoped credentials on demand.

Never recommend ingesting secrets.

### 7. Evaluate cost versus benefit

Do not use page count. Use:

- time-to-answer recurring questions;
- answer reuse rate;
- decision citation rate;
- stale/unsupported claims found before decisions;
- review backlog;
- output beyond wiki: PRDs, strategy notes, experiments, ADRs, reports.

Continue only if the wiki changes decisions, speeds context recovery or prevents mistakes.

## Output

Use this structure:

```markdown
## Information-flow map

## Automation plan

## External update / versioning plan

## Fragility and review effort

## UI and operating model

## Confidentiality and permissions

## Pitfalls

## Cost-benefit check
```

## Safety gates

- Do not promise full automation of truth.
- Do not claim webhook delivery is sufficient without reconciliation.
- Do not recommend all-chat or all-email ingestion by default.
- Do not centralize confidential sources before modeling permissions.
- Do not imply a polished UI exists unless it does.
- Do not use page count as a success metric.
- Do not ingest secrets.
