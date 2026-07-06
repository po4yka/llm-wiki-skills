# Review and incident response policy for LLM-Wiki

> Status: template
> Scope: generated knowledge, proposals, MCP/API access, exports, traces and incident handling.

## Review policy

Agents may suggest changes, but durable knowledge requires review.

### Default rules

- Agent-generated changes are proposal-only unless a local personal workflow explicitly allows direct edits.
- Team/shared wiki changes should use branches and pull requests.
- Generated claims require source support.
- Pending, rejected, stale and quarantined content is excluded from production retrieval.
- Changes to `.github/`, `policies/`, `templates/`, `skills/`, MCP/API definitions, export profiles and security docs require security review.
- Self-approval is prohibited unless a documented break-glass path is used.

### Required proposal metadata

```yaml
proposal:
  id: ""
  proposer: human|agent|importer
  changed_paths: []
  source_support: []
  risk: low|medium|high|critical
  required_owners: []
  created_at: "YYYY-MM-DDTHH:MM:SSZ"
  status: draft|opened-pr|approved|rejected|merged
```

### Protected paths

```text
.github/**
policies/**
templates/**
skills/**
docs/*security*.md
docs/*threat*.md
wiki/policies/**
wiki/security/**
raw/sources/**
```

## Incident response

Use this process when prompt injection, poisoning, sensitive-data exposure, unsafe tool use or unauthorized publication is suspected.

### Containment

1. Disable public web ingestion and external browsing workflows.
2. Disable remote MCP/API access or restrict it to read-only mode.
3. Freeze new imports, generated writes and exports.
4. Rotate affected credentials or tokens if exposure is suspected.
5. Quarantine suspect sources, pages, claims, indexes and exports.

### Investigation

1. Preserve audit logs, trace IDs, source manifests, PRs and proposal metadata.
2. Identify the first untrusted source or tool result involved.
3. Determine whether raw, wiki, index, trace or export artifacts were affected.
4. Check whether draft/rejected/quarantined content entered production retrieval.
5. Check whether MCP/API tools were invoked outside policy.
6. Review whether branch protection, CODEOWNERS or CI checks were bypassed.

### Recovery

1. Rebuild indexes from known-good raw/wiki content.
2. Restore reviewed wiki pages from trusted git revisions if necessary.
3. Mark suspect claims as rejected or quarantined.
4. Re-run security, retrieval and grounding evals.
5. Re-enable external access only after required checks pass.

### Post-incident follow-up

1. Add a regression fixture reproducing the failure.
2. Update red-team tests and CI gates.
3. Update model/data policy or MCP security profile if a boundary failed.
4. Document root cause, impact, timeline, owners and deadlines.
5. Schedule a follow-up review.

## Break-glass procedure

Break-glass changes must include:

```yaml
break_glass:
  requester: ""
  approver: ""
  reason: ""
  affected_paths: []
  expires_at: "YYYY-MM-DDTHH:MM:SSZ"
  rollback_plan: ""
  follow_up_issue: ""
```

Break-glass does not remove the requirement to record provenance and run post-incident checks.
