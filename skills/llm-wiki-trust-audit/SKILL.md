---
name: llm-wiki-trust-audit
description: Audit an LLM-Wiki system for anti-slop controls such as provenance, review gates, protected human synthesis, stale claims, and unsafe agent write permissions. Use when the user asks whether their wiki can be trusted; route setup/permission safety reviews to llm-wiki-security-review and proposal risk audits to llm-wiki-critique-audit.
license: MIT
compatibility: Designed for Agent Skills-compatible coding agents. Requires read access to the vault/repo; git history is recommended for edit provenance.
metadata:
  author: po4yka
  version: "1.0.0"
  install_scope: self-contained
---

# LLM-Wiki Trust Audit

## Goal

Evaluate whether an LLM-Wiki is trustworthy enough to use for decisions and identify the highest-risk failure modes.

## When to use

- The user asks whether their LLM-Wiki can be trusted before relying on it for a decision.
- Before granting an agent write access to a vault, or after granting it, to confirm the write-safety boundary still holds.
- After a large ingest, bulk edit, or lint run, to confirm provenance and review gates were not weakened.
- Route setup/permission-only reviews to `llm-wiki-security-review` and proposal-specific risk reviews to `llm-wiki-critique-audit` instead of this skill.

## Inputs

- Vault/repository path.
- `AGENTS.md`, `CLAUDE.md`, skills and schemas.
- `raw/`, `wiki/`, `_meta/`, `_agent/reports/` if present.
- Git history if available.
- User's risk tolerance and domain sensitivity.

## Procedure

### 1. Inspect the trust model

Check whether the system defines:

- raw source immutability;
- page lifecycle states;
- source backlinks;
- claim types;
- confidence semantics;
- review requirements;
- protected human sections;
- lint cadence;
- rollback/recovery path.

### 2. Audit provenance

Sample important pages and report:

- no provenance;
- source-level provenance only;
- claim-level provenance;
- generated pages citing generated pages;
- stale or missing source hashes;
- source links that no longer resolve.

Re-verify any page flagged stale or with an unresolved source link before treating its claims as trustworthy.

### 3. Audit generated content boundaries

Look for:

- AI-generated pages marked reviewed/verified without evidence;
- `ai_confidence` defaulted lazily;
- low-confidence pages not requiring review;
- ambiguous claims in trusted pages;
- human synthesis sections overwritten or unprotected.

### 4. Audit structural health

Coordinate with `wiki-lint` if available. Check:

- broken links;
- orphan pages;
- duplicate concepts;
- taxonomy drift;
- stale pages;
- contradiction reports ignored;
- excessive draft backlog.

### 5. Audit write safety

Check whether agents can:

- edit `raw/`;
- delete source material;
- bulk rewrite wiki pages without dry-run;
- bypass git/PR review without explicit approval;
- follow prompt-injection instructions from captured content;
- expose sensitive material to external tools.

### 6. Grade risk

Use this scorecard:

| Area | Risk | Evidence | Fix |
| --- | --- | --- | --- |
| Raw immutability | low/medium/high | | |
| Provenance | low/medium/high | | |
| Review gates | low/medium/high | | |
| Human synthesis boundary | low/medium/high | | |
| Staleness | low/medium/high | | |
| Agent write safety | low/medium/high | | |
| Sensitive data | low/medium/high | | |

### 7. Recommend fixes

Prioritize fixes that reduce trust risk before productivity features:

1. protect raw sources;
2. add review states;
3. add provenance fields;
4. protect human sections;
5. add lint reports;
6. add dry-run/PR workflow;
7. add retrieval upgrades only after trust basics.

## Output

```markdown
## Trust audit summary

## Top risks

## Evidence

## Scorecard

## Fix plan

## Stop conditions

## Optional follow-up skills
```

## Safety gates

- Do not mark the wiki safe without evidence.
- Do not auto-fix truth conflicts during audit.
- Do not expose sensitive file contents in the final report.
- Do not treat beautiful structure as proof of correctness.
