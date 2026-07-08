# Redaction and retention policy for LLM-Wiki

> Status: template
> Scope: raw sources, wiki pages, indexes, traces, logs, eval artifacts and exports.

## Purpose

This policy defines what may be captured, indexed, retrieved, traced, exported and retained in an LLM-Wiki system.

## Data classes

| Class | Examples | Default handling |
| --- | --- | --- |
| public | Published docs, public repo content, public web pages. | May be indexed and exported when provenance is preserved. |
| internal | Team docs, internal project notes, non-public architecture. | May be indexed for authorized users; export requires internal profile. |
| sensitive | Private operational data, customer-related material, confidential business context. | Requires classification, filters and redaction before external processing or export. |
| regulated | Data governed by legal, contractual or compliance rules. | Do not process externally or export without explicit policy approval. |
| unknown | Unclassified captures or raw imports. | Treat as sensitive until classified. |

## Capture and raw storage

- Raw sources are stored only when there is a clear purpose.
- Raw sources must have manifests with source ID, origin, hash, capture time, owner and sensitivity.
- Unknown or sensitive raw sources are excluded from production retrieval until classified.
- Parser output must be scanned before indexing or export.
- Raw source deletion or mutation through MCP/API tools is disabled by default.

## Indexing and retrieval

- Production retrieval must filter by tenant, sensitivity, publication state and review state.
- Draft, rejected, stale and quarantined content is excluded from production retrieval unless explicitly requested for review.
- Vector, FTS and graph indexes inherit the highest sensitivity of their source chunks.
- Indexes are rebuildable and must not become the only durable copy of sensitive content.

## Redaction

Before external processing, tracing or export, scan for sensitive identifiers, confidential business context, private user content and restricted operational details.

Redaction reports must include:

```yaml
redaction_report:
  generated_at: "YYYY-MM-DDTHH:MM:SSZ"
  input_paths: []
  output_paths: []
  detectors: []
  findings_count: 0
  blocked: true|false
  reviewer: ""
```

## Traces and logs

- Traces and logs are sensitive stores.
- Do not publicly share traces containing prompts, retrieved snippets or private source material.
- Prefer hashes, source IDs and page IDs over raw source text in audit logs.
- Keep retention periods short for raw prompts and retrieved snippets.
- Audit logs for sensitive reads, proposals and admin tools should be retained according to team policy.

## Exports

- Public exports are allowlist-based.
- `raw/` is excluded from public exports by default.
- `llms.txt`, JSONL, JSON-LD, GraphML and static-site exports require redaction checks.
- Export manifests must list included spaces, excluded paths, sensitivity classes, redaction status and reviewer.

## Retention

| Artifact | Default retention |
| --- | --- |
| Raw public sources | Keep while useful and cited. |
| Raw internal/sensitive sources | Review retention periodically; minimize where possible. |
| Parser temp output | Delete after successful manifest/index/page creation. |
| Traces with snippets | Short retention unless explicitly approved. |
| Audit logs | Retain according to security/compliance policy. |
| Public export artifacts | Retain with release/archive manifest. |
| Red-team fixtures | Keep isolated; never mix with production sources. |

## Exceptions

Every exception must include:

```yaml
exception:
  owner: ""
  reason: ""
  affected_paths: []
  data_class: sensitive|regulated|unknown
  compensating_controls: []
  expires_at: "YYYY-MM-DD"
  approver: ""
```
