# Templates catalog

> Status: draft
> Scope: discoverability map for starter files in `templates/`.

Use this catalog to choose starter files before copying them into a downstream LLM-Wiki vault or repository. Templates are examples and review surfaces, not production-ready policy by themselves.

## Vault starters

| Template | Primary skill | Use |
| --- | --- | --- |
| `templates/vault/AGENTS.md` | `llm-wiki-setup` | Agent rules for a downstream vault. |
| `templates/vault/CLAUDE.md` | `llm-wiki-setup` | Claude Code entry instructions for a downstream vault. |
| `templates/wiki/index.md` | `llm-wiki-setup` | Initial semantic wiki map. |
| `templates/wiki/log.md` | `llm-wiki-setup` | Append-only wiki activity log. |
| `templates/wiki/source-page.md` | `wiki-ingest` | Source summary page. |
| `templates/wiki/entity-page.md` | `wiki-ingest` | Entity page. |
| `templates/wiki/concept-page.md` | `wiki-ingest` | Concept page. |
| `templates/wiki/query-page.md` | `wiki-query` | Saved reusable answer. |
| `templates/wiki/human-synthesis-atom.md` | `llm-wiki-human-first-design` | Human-owned synthesis note. |
| `templates/wiki/technology-decision.md` | `llm-wiki-adr-memory` | Decision/ADR-style synthesis. |
| `templates/wiki/claim-provenance-report.md` | `llm-wiki-provenance` | Claim evidence gap report. |
| `templates/wiki/lint-report.md` | `wiki-lint` | Structural health report. |

## Ingestion and retrieval

| Template | Primary skill | Use |
| --- | --- | --- |
| `templates/source-manifest.yaml` | `llm-wiki-ingestion-stack` | Source identity, hash and extraction metadata. |
| `templates/ingestion-pipeline-profile.yaml` | `llm-wiki-ingestion-stack` | Parser routing and ingestion controls. |
| `templates/ingestion-fidelity-suite.yaml` | `llm-wiki-ingestion-stack` | Golden corpus/fidelity smoke suite. |
| `templates/retrieval-eval-set.yaml` | `llm-wiki-eval-tooling` | Retrieval questions and qrels. |
| `templates/eval-scorecard.yaml` | `llm-wiki-eval-tooling` | Layered eval scorecard. |
| `templates/promptfoo-llm-wiki.yaml` | `llm-wiki-eval-tooling` | Prompt/RAG regression starter. |

## MCP, API and security

| Template | Primary skill | Use |
| --- | --- | --- |
| `templates/mcp-wiki-profile.yaml` | `llm-wiki-mcp-integration` | MCP read/propose/admin surface profile. |
| `templates/mcp-security-profile.yaml` | `llm-wiki-threat-model` | MCP/API security controls. |
| `templates/openapi-wiki-core.yaml` | `llm-wiki-mcp-integration` | REST/OpenAPI facade starter. |
| `templates/security-scorecard.yaml` | `llm-wiki-security-review` | Security review scorecard. |
| `templates/promptfoo-llm-wiki-redteam.yaml` | `llm-wiki-threat-model` | Prompt-injection and data-leak red-team starter. |
| `templates/redaction-policy.yml` | `llm-wiki-privacy-redactor` | Redaction policy starter. |
| `templates/llm-wiki-security.github-actions.yml` | `llm-wiki-github-action` | GitHub security workflow starter. |

## Publishing and export

| Template | Primary skill | Use |
| --- | --- | --- |
| `templates/export-profile.yaml` | `llm-wiki-export-publish` | Audience and scope profile. |
| `templates/export-manifest.yaml` | `llm-wiki-export-publish` | Auditable export record. |
| `templates/agent-export-bundle.yaml` | `llm-wiki-export-publish` | `llms.txt` and agent bundle profile. |
| `templates/static-site-export-profile.yaml` | `llm-wiki-export-publish` | Static-site export profile. |
| `templates/llm-wiki-publish.github-actions.yml` | `llm-wiki-github-action` | GitHub export/publish workflow starter. |
| `templates/release-notes.md` | `llm-wiki-export-publish` | Release notes starter. |

## Team and GitLab operating model

| Template | Primary skill | Use |
| --- | --- | --- |
| `templates/CODEOWNERS.llm-wiki` | `llm-wiki-team-rollout` | GitHub-style CODEOWNERS starter. |
| `templates/team-operating-model.yaml` | `llm-wiki-team-rollout` | Team operating model profile. |
| `templates/team-raci-daci.yaml` | `llm-wiki-team-rollout` | RACI/DACI workflow ownership. |
| `templates/team-review-workflow.yaml` | `llm-wiki-team-rollout` | Review states and proposal flow. |
| `templates/team-slo-scorecard.yaml` | `llm-wiki-team-rollout` | Team SLO and operating scorecard. |
| `templates/team-onboarding-checklist.md` | `llm-wiki-team-rollout` | Team onboarding checklist. |
| `templates/gitlab-codeowners.llm-wiki` | `llm-wiki-gitlab-operating-model` | GitLab CODEOWNERS starter. |
| `templates/gitlab-llm-wiki-ci.yml` | `llm-wiki-gitlab-operating-model` | GitLab CI/CD starter. |
| `templates/gitlab-merge-request-template.md` | `llm-wiki-gitlab-operating-model` | GitLab MR template. |
| `templates/gitlab-operating-model.yaml` | `llm-wiki-gitlab-operating-model` | Self-hosted GitLab operating model. |
| `templates/gitlab-protected-branch-environment-policy.yaml` | `llm-wiki-gitlab-operating-model` | Protected branch/environment policy. |
| `templates/gitlab-raci-daci.yaml` | `llm-wiki-gitlab-operating-model` | GitLab-specific RACI/DACI. |
| `templates/gitlab-slo-scorecard.yaml` | `llm-wiki-gitlab-operating-model` | GitLab SLO scorecard. |

## GitHub workflow starters

| Template | Primary skill | Use |
| --- | --- | --- |
| `templates/llm-wiki-evals.github-actions.yml` | `llm-wiki-github-action` | Evaluation workflow starter. |
| `templates/llm-wiki-ingestion.github-actions.yml` | `llm-wiki-github-action` | Ingestion workflow starter. |
| `templates/llm-wiki-publish.github-actions.yml` | `llm-wiki-github-action` | Publish workflow starter. |
| `templates/llm-wiki-security.github-actions.yml` | `llm-wiki-github-action` | Security workflow starter. |

Starter workflow schedules are commented out by default. Enable cron only after a manual run succeeds.

## Report starters

| Template | Primary skill | Use |
| --- | --- | --- |
| `templates/reports/critique-audit-report.md` | `llm-wiki-critique-audit` | Critique audit report. |
| `templates/reports/ecosystem-refresh.md` | `llm-wiki-ecosystem-registry` | Ecosystem refresh report. |
| `templates/reports/monthly-eval.md` | `llm-wiki-eval` | Monthly evaluation report. |
| `templates/reports/source-refresh-report.md` | `llm-wiki-source-refresh` | Source refresh report. |
| `templates/reports/weekly-lint.md` | `wiki-lint` | Weekly lint report. |

## Schemas

| Template | Primary skill | Use |
| --- | --- | --- |
| `templates/schemas/canonical-vocabularies.json` | `llm-wiki-domain-pack` | Canonical shared enums and workflow ownership. |
| `templates/schemas/page.schema.json` | `wiki-lint` | Core page schema. |
| `templates/schemas/domain-pack.schema.json` | `llm-wiki-domain-pack` | Domain pack overlay schema. |
| `templates/schemas/domain-pack-profile.schema.json` | `llm-wiki-domain-pack` | Domain pack apply profile schema. |
| `templates/schemas/skill-router.schema.json` | `llm-wiki-skill-doctor` | Skill router schema. |
| `templates/schemas/taxonomy.md` | `llm-wiki-domain-pack` | Claim/page taxonomy reference. |
