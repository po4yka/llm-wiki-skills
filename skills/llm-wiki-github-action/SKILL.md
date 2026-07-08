---
name: llm-wiki-github-action
description: Configure GitHub Actions for LLM-Wiki maintenance. Use when the user wants scheduled wiki lint reports, PR-based documentation updates, Agent Skills validation, provenance checks, or safe repo-docs maintenance without direct writes to main.
license: MIT
compatibility: Designed for Agent Skills-compatible coding agents with repository write access. Requires GitHub Actions support in the repository.
metadata:
  author: po4yka
  version: "0.1.0"
  install_scope: self-contained
---

# LLM-Wiki GitHub Action

## Goal

Create safe GitHub Actions workflows for LLM-Wiki validation and maintenance.

## Starter templates

Use these local templates when available in a full repository checkout. In a single-skill install, recreate the same workflow shapes from this list:

- `llm-wiki-evals.github-actions.yml` for retrieval, grounding, promptfoo and wiki-health checks.
- `llm-wiki-ingestion.github-actions.yml` for source manifests, ingestion fidelity, parser security and retrieval smoke checks.
- `llm-wiki-publish.github-actions.yml` for export profile validation, redaction/security checks, artifacts and optional Pages publish.
- `llm-wiki-security.github-actions.yml` for secrets, dependency, OSV, Semgrep, red-team and export-policy checks.

The starter workflow schedules are commented out by default. Enable cron only after `workflow_dispatch` has run successfully and the repository owner accepts the recurring cost and external calls.

## Inputs

- Repository path.
- Desired automation: validation, lint, scheduled report, maintenance PR, skill validation.
- Permission constraints.
- Whether Actions should write files, open PRs, or only upload reports.

## Procedure

### 1. Choose automation mode

| Mode | Use when |
| --- | --- |
| report-only | Early adoption or sensitive repos. |
| artifact report | Reports should not change the repo. |
| PR-based update | Generated output needs human review. |
| validation | Validate schemas, links, skills and frontmatter. |

Default to report-only or PR-based updates. Avoid direct pushes to `main`.

### 2. Define triggers

Start with manual and pull request triggers. Add a schedule only after the first manual run succeeds. Keep copied starter `schedule:` blocks commented until that happens.

```yaml
on:
  pull_request:
  workflow_dispatch:
```

### 3. Set permissions narrowly

Use the least privilege required by the chosen mode. Read-only jobs should not request write permissions. PR-creation jobs should be clearly separated from validation jobs.

### 4. Add validation jobs

Possible jobs:

- Agent Skills frontmatter validation for every `skills/*/SKILL.md`;
- repository-specific validation scripts when the target repo already defines them;
- frontmatter schema validation;
- broken link scan;
- `wiki-lint` report generation;
- stale page report;
- provenance gap report.

### 5. Add PR workflow only when safe

For PR-based updates:

- create a branch;
- commit reports or generated docs;
- open PR with clear summary;
- request review from owners;
- never merge automatically.

### 6. Copy starter workflows deliberately

When the user asks for ready-made workflow files, copy only the relevant starters:

| Need | Starter |
| --- | --- |
| evals and red-team | `llm-wiki-evals.github-actions.yml` |
| ingestion pipeline checks | `llm-wiki-ingestion.github-actions.yml` |
| publish/export pipeline | `llm-wiki-publish.github-actions.yml` |
| security scans | `llm-wiki-security.github-actions.yml` |

Rename each copied file to `.github/workflows/<purpose>.yml`, replace placeholder commands, and keep permissions minimal.

## Output

```markdown
## GitHub Actions plan

## Workflow files created or proposed

## Permissions

## Triggers

## Safety model

## Manual verification steps
```

## Safety gates

- Do not grant broad write permissions without justification.
- Do not configure direct pushes to `main` for generated knowledge.
- Do not run external model calls on private content without explicit approval.
- Do not hide generated changes outside pull-request review.
