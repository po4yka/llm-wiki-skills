---
name: llm-wiki-threat-model
description: Build a formal security architecture threat model for an LLM-Wiki system. Use when the user asks for STRIDE, LINDDUN, PASTA, data-flow diagrams, trust boundaries, attack-surface mapping, abuse cases, risk matrices, red-team scenarios, or control baselines; route existing-config safety reviews to llm-wiki-security-review.
license: MIT
compatibility: Designed for Agent Skills-compatible coding agents. Browse current vendor, MCP, OWASP, CVE and tooling docs before making current security claims or version-specific recommendations.
metadata:
  author: po4yka
  version: "1.0.1"
  install_scope: self-contained
---

# LLM-Wiki Threat Model

## Goal

Produce a threat model for an LLM-Wiki system that maps trust boundaries, attack surfaces, prioritized threats, controls, CI gates, red-team scenarios and incident response.

Use `references/docs/19-security-threat-model.md` as the reference architecture and control baseline.

## When to use

- The user asks for a STRIDE, LINDDUN, PASTA, or data-flow-diagram threat model of an LLM-Wiki system.
- The user wants trust boundaries, attack-surface mapping, abuse cases, or a risk/severity matrix for ingestion, retrieval, MCP/API, or write paths.
- The user is designing or hardening a new LLM-Wiki deployment (local-first, hosted, MCP/API server) and needs a control baseline and red-team scenarios before build-out.
- The user asks for an incident-response plan or security scorecard tied to a threat model, not an ad-hoc config review.
- Route requests to review an *existing* config or deployment for known weaknesses to `llm-wiki-security-review` instead; use this skill for building the formal model from scratch.

## Inputs

- Implementation family: local-first, desktop app, repo-docs, Obsidian, team wiki, hosted product, MCP/API server.
- Data flows: capture, ingestion, raw storage, wiki compilation, indexing, retrieval, generation, MCP/API, writes, exports, observability.
- Data classes: public, internal, sensitive, regulated, unknown.
- Deployment: local stdio, localhost HTTP, remote MCP/API, CI, cloud models, cloud parsers, hosted search/vector DB.
- Existing controls: CODEOWNERS, branch protection, scanners, auth, review queue, audit logs, redaction, eval/red-team.
- Desired output: high-level model, detailed matrix, remediation plan, repo file changes or CI templates.

## Procedure

### 1. Inventory components and data flows

Map:

```text
sources -> ingestion/parsing -> raw store -> wiki pages -> indexes -> retrieval -> agent -> MCP/API tools -> proposals/PRs -> exports/traces
```

For each component, record:

```yaml
component: ""
inputs: []
outputs: []
trusted: true|false
contains_sensitive_data: true|false
writes_durable_state: true|false
network_exposed: true|false
existing_controls: []
missing_controls: []
```

### 2. Mark trust boundaries

At minimum mark:

- external source -> parser;
- parser output -> raw store;
- raw store -> index;
- index -> model context;
- model output -> proposal/write/export;
- MCP/API -> tools and downstream systems;
- wiki/export -> public or cross-team consumers;
- CI runner -> repository writes or secrets.

### 3. Classify threats

Use STRIDE for system threats:

| Category | LLM-Wiki focus |
| --- | --- |
| Spoofing | fake source identity, fake MCP server, forged reviewer. |
| Tampering | poisoned source, forged citation, modified index/wiki page. |
| Repudiation | missing audit trail for generated proposal or approval. |
| Information disclosure | secrets/PII in retrieval, traces, exports. |
| Denial of service | huge documents, graph explosion, expensive red-team jobs. |
| Elevation of privilege | prompt injection triggers admin tool or bypasses review. |

Use LINDDUN-style checks for privacy:

- linkability;
- identifiability;
- detectability of sensitive source existence;
- disclosure;
- unawareness of capture/indexing;
- non-compliance with retention/export policy.

### 4. Prioritize LLM-Wiki-specific risks

Always assess:

| Threat | Default severity |
| --- | --- |
| Indirect prompt injection causing data exfiltration or unsafe tool use | Critical |
| Corpus poisoning or durable wiki corruption | High |
| Parser exploitation during ingestion | Critical when untrusted files are parsed |
| Secret/PII leakage through wiki, index, trace or export | High/Critical |
| Unauthenticated or overbroad MCP/API | High/Critical |
| Agent direct writes to durable knowledge | High |
| Cross-tenant or sensitivity-filter failure | Critical |
| Supply-chain compromise in parser, scanner, MCP server or GitHub Action | High |
| Public export or trace oversharing | Medium/High |

### 5. Define control baseline

Minimum viable baseline:

- parser sandboxing;
- secret and PII scans;
- reviewed-only production retrieval;
- read-only MCP/API by default;
- proposal-only agent writes;
- CODEOWNERS and branch protection;
- required CI checks;
- export allowlist and redaction report;
- audit logs for sensitive reads, proposals and admin tools.

Recommended production baseline:

- signed/attributable commits;
- append-only audit logs;
- prompt/RAG/MCP red-team suite;
- canary secrets and synthetic PII in isolated fixtures;
- incident response playbook;
- regular reindex/restore from known-good snapshots;
- explicit exception register.

### 6. Build a security test plan

Include tests for:

- hidden webpage prompt injection;
- malicious PDF/email/parser fixture;
- poisoned draft page excluded from production retrieval;
- public-source attempt to trigger private MCP data read;
- direct write/delete tool rejection;
- admin tools disabled by default;
- cross-tenant retrieval denial;
- export blocked by sensitive page;
- public trace/log oversharing;
- GitHub workflow/action pinning and minimal permissions.

### 7. Recommend repo artifacts

Depending on the user's repo, propose or add:

- `references/docs/19-security-threat-model.md`;
- `references/templates/security-scorecard.yaml`;
- `references/templates/mcp-security-profile.yaml`;
- `references/templates/promptfoo-llm-wiki-redteam.yaml`;
- `references/templates/llm-wiki-security.github-actions.yml`;
- `references/policies/redaction-retention-policy.md`;
- `references/policies/review-incident-response.md`;
- `.github/CODEOWNERS` updates;
- CI workflow or pre-commit hooks.

## Output

```markdown
## Threat model summary

## Scope and assumptions

## Component inventory

## Data-flow diagram

## Trust boundaries

## Threat matrix

## Priority risks

## Control baseline

## CI and red-team plan

## Incident response

## Security scorecard

## Recommended repo changes
```

## Safety gates

- Do not print secrets, PII or sensitive source contents verbatim.
- Do not recommend unauthenticated remote MCP/API.
- Do not rely on prompt wording as the only mitigation for prompt injection.
- Do not let convenience override review-gated durable writes.
- Do not recommend cloud parsing, cloud embeddings, tracing or eval on sensitive data without explicit policy approval.
- Do not mark a system production-ready if production retrieval includes draft/rejected/quarantined content.
