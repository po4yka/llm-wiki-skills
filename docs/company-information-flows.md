# Company information flows for LLM-Wiki adoption

> Scope: answer how a typical product/engineering/company team can collect internal knowledge into an LLM-Wiki, what can be automated, what cannot, how external document changes are tracked, how fragile the system is, how to handle confidential information, and how to weigh maintenance cost against value.
> Current as of: 2026-07-07
> Source note: re-check current SaaS API/webhook docs before promising exact connector behavior.

## Short answer

A company LLM-Wiki should not start as a place where people manually copy documents into an inbox. It should start as a **source registry plus event log** for the information flows that already exist.

```text
existing systems -> source registry -> raw event/source log -> triage -> wiki pages -> review/refresh/eval
```

The goal is not to capture everything. The goal is to capture the flows that influence decisions, preserve evidence, and make reusable answers visible.

## 1. Where information lives in a typical team

Use this as a discovery checklist.

| Flow | Examples | Capture default | Why it matters |
| --- | --- | --- | --- |
| Documents | Confluence, Notion, Google Docs, SharePoint, Drive, PDFs, internal specs | API export, webhook/delta, scheduled diff | Often holds official but stale context. |
| Work tracking | Jira, Linear, GitHub Issues, YouTrack, Asana | Webhooks + changelog API + periodic reconciliation | Contains decision residue, status, ownership and scope changes. |
| Code collaboration | GitHub/GitLab PRs, reviews, commits, releases, ADRs | Webhooks + repo crawler | Explains what changed and why. |
| Chat | Slack, Teams, Telegram, Discord | Events API / Graph notifications / bot capture / selective reactions | Contains tacit context, but high noise and sensitive content. |
| Meetings | Calendar, transcripts, recordings, notes, AI summaries | Calendar + transcript export + explicit consent | Captures rationale and unresolved questions. |
| Product evidence | User interviews, sales calls, support tickets, NPS, research repos | CRM/support/research tool API + curated tags | Grounds market/product assumptions. |
| Analytics | BI dashboards, warehouse queries, product analytics, experiment results | Scheduled snapshots + links, not raw firehose | Supports confidence/ripeness and decision updates. |
| Incidents/ops | PagerDuty, incident docs, postmortems, on-call notes | Webhooks + postmortem templates | Captures operational learning and risk. |
| Design | Figma, FigJam, Miro, whiteboards | Export selected frames/links + design review notes | Useful for product rationale, but raw design state changes too often. |
| Email/newsletters | Gmail/Outlook, customer threads, market newsletters | User-approved labels/folders + scheduled sync | Good signal, but privacy-heavy. |

### Example team setup

For a product/engineering team, start with these five sources:

1. Confluence/Notion space for official docs.
2. Jira/Linear project for work items and history.
3. GitHub/GitLab repo for PRs, ADRs and releases.
4. Slack/Teams channels selected by purpose, not every channel.
5. Customer/support/research source for external evidence.

Do not start with every workspace, every chat and every meeting.

## 2. What can be fully automated

“Fully automated” should mean **capture and bookkeeping**, not automatic truth.

Safe to automate by default:

| Automation | Why safe | Output |
| --- | --- | --- |
| Source discovery | Reads metadata and links, does not interpret truth. | Source registry entries. |
| Event ingestion | Append-only record of updates/deletes/comments. | Raw event log. |
| Version/hash tracking | Detects change without judging meaning. | `source_hash`, `version`, `last_seen_at`. |
| Broken link checks | Deterministic. | Link report. |
| Stale marking | Based on timestamp/policy. | `status: stale` or refresh queue. |
| Duplicate candidates | Candidate generation only. | Review report, not deletion. |
| Inbox routing | Low-risk classification if reversible. | Triage queues. |
| Daily/weekly digest | Summarizes what changed. | Digest/report. |
| Refresh report | Says what changed upstream. | Review queue. |

## 3. What should not be fully automated

Do not fully automate these without a review gate:

| Operation | Why not fully automatic | Safe default |
| --- | --- | --- |
| Promoting claims to verified | Requires domain judgment. | Agent drafts; human promotes. |
| Resolving contradictions | Multiple true contexts may exist. | Conflict report with sources. |
| Deleting/merging pages | Lossy and socially risky. | Dry-run merge/delete proposal. |
| Summarizing sensitive conversations | Privacy and consent risk. | Redact/classify first. |
| Inferring decisions from chat | Chat is incomplete and informal. | Draft decision page, ask owner. |
| Capturing all meetings | Consent, noise and access issues. | Opt-in meetings or labeled calendars. |
| Capturing all email | High privacy and legal risk. | Labels/folders and explicit rules. |
| Updating public/official docs | Reputation and compliance risk. | PR/review gate. |

### Why full automation is hard

Common blockers:

- APIs expose events, not intent.
- Permissions differ across tools and teams.
- Chat and meetings contain jokes, half-decisions and sensitive data.
- Edits and deletes matter as much as creates.
- Rate limits and webhooks can be missed.
- Version numbers do not always imply semantic change.
- Generated summaries can become false authority.
- External links rot and upstream content changes.
- People disagree about what is “official”.

## 4. How to keep external documents updated

Use a **source registry** and **derived-page dependency map**.

### Source registry fields

```yaml
source_id: confluence:123456
system: confluence|jira|github|slack|teams|drive|manual
external_id: "123456"
url: "https://..."
title: "..."
owner: "team-or-person"
data_class: public|internal|confidential|restricted
access_scope: "space/project/channel/repo"
version: "42"
updated_at: "2026-07-07T10:00:00Z"
source_hash: "sha256:..."
last_seen_at: "2026-07-07T10:05:00Z"
last_ingested_at: "2026-07-07T10:10:00Z"
derived_pages:
  - wiki/concepts/pricing.md
  - wiki/decisions/segment-priority.md
refresh_policy: webhook|poll|manual|snapshot
```

### Update flow

```text
webhook/delta/poll event
  -> append raw event
  -> fetch current source metadata/content
  -> compare version/hash
  -> mark derived pages stale or refresh_required
  -> generate diff summary
  -> do not overwrite reviewed human synthesis
  -> ask owner to review material changes
```

### Confluence example

Use Confluence page IDs and page version metadata as the stable source identity. Confluence webhooks can notify on page/content update events, and REST reads can fetch current page body and version. When a page changes, create a refresh report for every derived wiki page that cites that Confluence source.

### Jira example

Use issue key/ID as the stable source identity. Jira webhooks can notify on issue updates, and changelog APIs can fetch field-level change history. Do not re-ingest every issue comment as truth. Instead, map changes to decisions, scope, risks, assumptions or source notes.

### Systems without reliable webhooks

Use scheduled polling or delta APIs where available. If neither exists, use snapshots:

```text
nightly export -> normalize -> hash -> compare -> refresh queue
```

## 5. Fragility: what breaks and how much effort it takes

This system is useful but fragile. Treat fragility as an operating cost, not a surprise.

### Fragility map

| Failure mode | Symptom | Repair cost | Repair pattern |
| --- | --- | ---: | --- |
| Orphan pages | Pages with no inbound links. | Low | Link, merge, archive or mark intentional. |
| Broken links | Renames or moved pages. | Low | Deterministic link repair. |
| Schema drift | Frontmatter variants multiply. | Low/medium | Validator + migration dry-run. |
| Duplicate concepts | Same idea under many titles. | Medium | Merge proposal + owner review. |
| Contradictions | Two pages disagree. | Medium/high | Conflict report + source review. |
| Stale external sources | Wiki cites old Confluence/Jira/doc versions. | Medium | Source registry + refresh queue. |
| Silent slop | Generated page reads as official but lacks evidence. | High | Provenance audit + review states. |
| Permission leak | Search surfaces restricted context. | High/critical | Data classification + split vault/access model. |
| Index corruption | Local search/vector index out of sync. | Low if rebuildable | Treat indexes as cache. |
| Workflow abandonment | Nobody reads reports. | Critical | Stop expanding; fix decision loop. |

### Time expectations

Do not promise exact maintenance time without a pilot. Use these planning ranges:

| Scale | Suggested maintenance budget |
| --- | --- |
| Personal / tiny pilot | 30-60 minutes weekly for triage, lint and review. |
| One team / one domain | 1-2 hours weekly plus owner review for high-impact claims. |
| Cross-functional pilot | Curator rotation or Product Ops owner; weekly review meeting. |
| Company-level Nexus | Dedicated ownership, dashboards, access policy and automation runbooks. |

The expensive work is rarely fixing links. It is resolving contradictions, deciding what is official, and reviewing sensitive or high-impact claims.

### UI options today

| UI | Good for | Weakness |
| --- | --- | --- |
| Markdown reports | Portable, reviewable, git-friendly. | Not interactive. |
| GitHub/GitLab PR UI | Diffs, comments, CODEOWNERS. | Too technical for casual contributors. |
| Obsidian graph/backlinks/Dataview/Bases | Human exploration and orphan/link review. | Not a full team governance UI. |
| Jira/Linear board | Review queue and ownership. | Loses document context unless linked well. |
| Custom dashboard | Decision metrics, stale queues, source freshness. | Must be built and maintained. |

Default: start with Markdown reports + PR/issue review. Add UI only when review queues are ignored because they are hard to use.

## 6. Confidential information and permissions

Yes, the system can work with confidential information, but not as one flat, fully searchable corpus.

Rules:

- classify every source before ingestion;
- preserve source access boundaries;
- split vaults or indexes by data class/access domain;
- use least-privilege service accounts and agents;
- do not copy restricted raw sources into git by default;
- redact before summaries leave the boundary;
- use local or approved-private model paths for confidential/restricted sources;
- log exports, prompt use and public publishing;
- never ingest secrets; rotate if captured.

Recommended data classes:

| Class | Handling |
| --- | --- |
| Public | Normal flow; cloud or local models if policy allows. |
| Internal | Private storage, private index, approved model policy. |
| Confidential | Local/private model preferred; owner review required. |
| Restricted/regulatory | Explicit approval, minimization, retention, often no-model. |
| Secret | Do not ingest. |

If permissions cannot be modeled, do not centralize the source. Keep links and metadata only, and fetch on demand with user-scoped credentials.

## 7. Pitfalls / rake list

Common adoption rakes:

1. Capturing everything instead of decision-relevant flows.
2. Letting chat firehoses dominate the wiki.
3. Treating webhook delivery as perfect; no reconciliation job.
4. Not handling deletes and permission changes.
5. One-step ingest that writes confident slop.
6. Generated summaries replacing raw evidence.
7. No source registry or derived-page dependency map.
8. No owner for review queues.
9. Using page count as success metric.
10. Making non-developers use git/PRs for ordinary capture.
11. Auto-merging contradictions.
12. Syncing local indexes/vector DBs as source of truth.
13. Centralizing confidential sources before access model exists.
14. No budget for stale-source refresh.
15. Changing taxonomy every week.
16. No output beyond the wiki.

## 8. How to weigh benefit versus maintenance cost

Use a local cost-benefit scorecard. Do not rely on intuition alone.

### Cost side

Track:

- time spent on integration setup;
- time spent on capture/triage/review;
- time spent fixing links/duplicates/contradictions;
- model/API cost;
- time spent by domain owners reviewing claims;
- time spent training users;
- incident/security overhead.

### Benefit side

Track:

- time-to-answer recurring questions;
- answer reuse rate;
- decision citation rate;
- onboarding questions answered from wiki;
- duplicate research avoided;
- confidence/risk changes due to new evidence;
- stale/unsupported claims found before decisions;
- output beyond wiki: PRDs, strategy notes, experiments, ADRs, customer reports.

### Stop / continue rule

Continue when:

- real decisions cite the wiki;
- useful answers are filed back and reused;
- review queues shrink or stay manageable;
- people ask fewer repeated context-reconstruction questions;
- stale/unsupported claims are found before they cause errors.

Stop or shrink when:

- writes grow but reads do not;
- no decisions cite the wiki;
- review queues are ignored;
- maintenance time exceeds saved time;
- users distrust generated pages;
- sensitive-data risk is unresolved.

## 9. Recommended answer to the user's questions

> Start from the information flows that already produce decisions: docs, tickets, PRs, meetings, chats, support/customer evidence and analytics snapshots. Automate append-only capture, source metadata, version/hash tracking, stale marking and review reports. Do not fully automate truth promotion, contradiction resolution, sensitive summaries or official documentation updates. For Confluence/Jira/Drive/etc., keep a source registry with external IDs, versions, hashes and derived pages; webhooks/delta APIs mark pages stale and create refresh reports. Expect fragility around links, duplicates, contradictions, source freshness and permissions; the cheap repairs are deterministic, the expensive repairs require domain-owner judgment. Use Markdown reports/PRs first, Obsidian or dashboards only when review queues need better UI. For confidential data, split access domains and model boundaries before ingestion. Judge benefit by decision citations, answer reuse and time-to-context, not page count.

## Compact answer templates

### “Where should information be collected from?”

> Collect from the flows that already exist: Confluence/Notion/Docs, Jira/Linear/GitHub Issues, PRs/ADRs/release notes, Slack/Teams/Telegram, meetings and transcripts, customer/support/research, analytics/BI and incidents/postmortems. Start with 3-5 streams that actually affect decisions, not every channel.

### “What can be fully automated?”

> Fully automate capture/bookkeeping: source registry, raw event log, version/hash tracking, stale marking, broken-link checks, digests and refresh reports. Do not automate promotion to verified, contradiction resolution, page deletion/merge, sensitive summaries or inferred decisions from chat without review.

### “How should Confluence/Jira be updated when sources change?”

> Each external entity should have a `source_id`, external version/hash, `last_seen` and a list of derived pages. A webhook/delta/poll records the change, the agent fetches the new version, compares hash/version, marks dependent pages `stale` or `refresh_required` and creates a diff review. It must not silently overwrite human synthesis.

### “How fragile is this?”

> Fragility appears where knowledge becomes official: contradictions, stale sources, permissions, slop and ownership. Broken links and orphans are cheap to fix; contradictions and verified claims require a domain owner. This needs a weekly lint/review budget and queue, not faith in automatic self-healing.

### “Is there a UI?”

> The baseline UI is a Markdown report plus a GitHub/GitLab PR or issue queue. For personal or research work, Obsidian graph/backlinks/Dataview can help. A company will probably need a dashboard over stale/conflict/provenance queues, but it should not start with a custom UI.

### “Does it work with confidential information?”

> Yes, but only if you avoid one shared searchable dump. You need data classes, vault/index splits by access domain, least-privilege agents, redaction, local or approved-private models for sensitive data, audit logs and no secrets ingestion.

### “Is the benefit worth the cost?”

> Validate it with a pilot. Count time-to-answer, answer reuse, decision citation rate, output beyond the wiki and stale/unsupported claims found before decisions, not pages. If decisions do not cite the wiki after a month and nobody reads the review queue, shrink or stop the system.
