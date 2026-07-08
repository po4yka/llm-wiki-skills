---
name: llm-wiki-security-review
description: Review an existing LLM-Wiki or Agent Skills setup for practical security gaps. Use when the user asks whether current permissions, MCP/API exposure, exports, cloud-model use, or data boundaries are safe enough; route new architecture threat modeling to llm-wiki-threat-model.
license: MIT
compatibility: Designed for Agent Skills-compatible coding agents. Requires read access to project instructions, skill files, and relevant configuration; write access is optional. Browse current vendor, CVE, scanner and MCP docs before giving version-specific security advice.
metadata:
  author: po4yka
  version: "1.0.0"
  install_scope: self-contained
---

# LLM-Wiki Security Review

## Goal

Identify security, privacy and data-boundary risks in an LLM-Wiki workflow or skill package, then recommend concrete mitigations and repo artifacts.

Use `references/docs/19-security-threat-model.md` for the full threat model and control baseline. Use `llm-wiki-threat-model` when the user needs a full architecture-level threat model rather than a review of an existing setup.

## When to use

- The user asks whether an existing LLM-Wiki repo's permissions, MCP/API exposure, exports, cloud-model use, or data boundaries are safe.
- Before enabling remote MCP/API access, a new export profile, or cloud model/embedding calls on a vault that holds sensitive or regulated content.
- After adding or changing skills, agent instructions, ingestion pipelines, or CI automation that touch raw sources, indexes, or writes.
- The user wants a prioritized, severity-ranked list of security findings and concrete mitigations rather than a from-scratch threat model (use `llm-wiki-threat-model` for that instead).

## Inputs

- Vault/repository path.
- Agent instructions and installed skills.
- Capture pipelines and ingestion configs.
- Raw/wiki/index/export/tracing layout.
- MCP/API server configuration if present.
- Model/provider policy if available.
- CI, CODEOWNERS and branch protection configuration.
- Desired mode: report-only, patch recommendations or repo updates.

## Procedure

### 1. Map trust boundaries

Identify:

- external sources and capture channels;
- parser/OCR/conversion jobs;
- local files and raw sources;
- generated wiki pages and review state;
- FTS/vector/graph indexes;
- retrieval and context packing;
- installed skills and agent instructions;
- external model, embedding and reranker calls;
- MCP/API servers and tools;
- CI/workflow automation;
- team permissions and branch controls;
- traces, logs, eval artifacts and published/exported outputs.

### 2. Review data classification

Classify content as:

```text
public | internal | sensitive | regulated | unknown
```

Flag mismatches between data class and:

- model/provider choice;
- cloud parser/OCR/embedding/reranker use;
- trace/log storage;
- semantic search snippets;
- public/internal export profiles;
- eval datasets;
- MCP/API accessibility.

### 3. Review ingestion and parser safety

Check whether:

- untrusted files are quarantined before parsing;
- parser/OCR workers are sandboxed;
- parser workers lack secrets and repo write access;
- output paths are constrained against traversal;
- file types and sizes are allowlisted;
- parser dependency CVEs are monitored;
- extracted text is scanned before indexing/export.

Treat PDFs, Office docs, archives, email containers, web clips, images/OCR, chat exports and repo files as untrusted inputs.

### 4. Review skill and prompt supply chain

Check `SKILL.md`, prompts and agent instructions for:

- broad write permissions;
- remote install commands without explanation;
- unclear shell commands;
- hidden data exfiltration paths;
- instructions to ignore user or system policy;
- instructions to follow commands embedded in untrusted content;
- agent memory or instructions that hide durable knowledge without provenance.

### 5. Review retrieval and index safety

Check:

- production retrieval excludes `draft`, `rejected`, `stale` and `quarantined` content unless explicitly requested;
- tenant, sensitivity, owner, review-state and publication-state filters are enforced before retrieval;
- vector/FTS/graph indexes are classified and rebuildable;
- raw sources are not used in high-privilege workflows without explicit scope;
- poisoned or conflicting pages can be quarantined;
- indexes can be rebuilt from known-good wiki/raw state.

### 6. Review prompt-injection surfaces

Treat these as untrusted content:

- web clips;
- PDFs;
- chat exports;
- emails;
- Telegram/Slack/Discord messages;
- GitHub issues, comments and PRs;
- notes imported from external sources;
- source code comments from untrusted repositories;
- generated pages not yet reviewed;
- MCP/tool results.

Check that retrieval/agent tools treat embedded instructions as content, not commands.

### 7. Review MCP/API exposure

If MCP or local API exists, check:

- stdio is preferred for local personal use where feasible;
- local HTTP binds to `127.0.0.1`;
- HTTP/remote access requires authentication;
- origin/DNS rebinding protections are considered for localhost HTTP;
- read, proposal-write and admin tools are separated;
- admin tools are disabled by default;
- tool calls are scoped by tenant/sensitivity/review state;
- no direct raw-source deletion or mutation is exposed;
- tool outputs are bounded, paginated and sanitized;
- sensitive reads, proposals and admin actions are audited;
- prompt-injection tests cover tool descriptions and returned content.

### 8. Review write safety

Check whether agents can edit raw sources, delete files, bypass git review, rewrite many pages without dry-run, modify protected human sections, approve their own generated claims, or alter `.github/`, `policies/`, `templates/`, `skills/` or MCP tool definitions — none of this should be possible without explicit approval and security review.

For team/shared knowledge, prefer:

- proposal-only writes;
- PR-based writes;
- CODEOWNERS;
- branch protection or rulesets;
- required lint/eval/security checks;
- review-gated proposal workflows;
- append-only logs for high-risk operations.

### 9. Review export, logs and traces

Check:

- public exports are allowlist-based;
- raw sources are excluded by default;
- `llms.txt`, JSONL, JSON-LD, GraphML and static-site outputs run redaction checks;
- traces/logs do not store secrets/PII by default;
- public trace sharing is disabled or explicitly approved;
- export manifests record redaction and sensitivity decisions.

### 10. Recommend concrete tooling

Use current docs before giving install commands. Candidate tools:

| Risk | Candidate controls |
| --- | --- |
| Secrets in raw/wiki/config/export | GitHub secret scanning/push protection, gitleaks, detect-secrets, trufflehog, pre-commit and CI gates. |
| PII in captures/exports/traces | Microsoft Presidio, scrubadub, custom regex/classifiers, redaction manifests. |
| Dependency/supply-chain risk | Dependabot, dependency review, OSV Scanner, npm audit, pip-audit, lockfile review. |
| Static code/config issues | Semgrep, CodeQL, shellcheck, actionlint. |
| Prompt injection and RAG poisoning | promptfoo red-team, garak, malicious-source fixtures, canary secret/PII fixtures. |
| Unsafe generated writes | dry-run patches, git diff review, CODEOWNERS, branch protection, protected sections. |
| MCP/API exposure | localhost binding, auth, origin validation, tool allowlists, read/propose/admin split, audit logs. |
| Cloud data exposure | model/data-use matrix, local-only labels, redaction-before-cloud, provider retention verification. |

### 11. Prioritize findings

Use severity:

| Severity | Meaning |
| --- | --- |
| Critical | Secrets/regulated data likely exposed, direct unsafe writes, cross-tenant leak, parser RCE path, or remote unauthenticated access. |
| High | Sensitive data can reach cloud models/indexes/traces, or agents can bypass review without explicit approval. |
| Medium | Missing audit trails, weak filters, stale dependencies, broad permissions. |
| Low | Documentation gaps or hardening opportunities. |

## Output

```markdown
## Security review summary

## Scope and assumptions

## Trust boundaries

## Data classification

## High-risk findings

## Ingestion and parser risks

## Retrieval and index risks

## Prompt-injection surfaces

## MCP/API exposure

## Write-safety review

## Export/log/trace risks

## Recommended tooling

## Recommended mitigations

## CI/red-team plan

## Follow-up skill
```

## Safety gates

- Do not print sensitive content verbatim in the final report.
- Do not suggest disabling agent permissions to improve convenience.
- Do not approve cloud processing of sensitive material without explicit user consent.
- Do not auto-fix security policy without review.
- Do not expose remote MCP/API access without authentication and filtering.
- Do not rely on prompt wording as the only prompt-injection defense.
- Do not mark production retrieval safe if it includes draft, rejected or quarantined content.
