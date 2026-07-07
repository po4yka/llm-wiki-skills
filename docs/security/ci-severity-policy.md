# CI severity policy

> Status: draft
> Scope: which checks should fail CI and which are advisory for this Agent Skills pack.

## Thesis

This repository contains operational instructions for agents. CI should fail on checks that protect distribution integrity and unsafe generated behavior, while advisory checks can surface quality issues that are too noisy to block every PR.

## Current policy

| Check | Command / workflow | PR severity | Release severity | Rationale |
|---|---|---|---|---|
| Skill metadata and frontmatter | `npm run validate:skills` | fail | fail | Broken skills cannot be discovered or installed safely. |
| Manifest and README catalog consistency | `npm run validate:manifest` | fail | fail | Distribution metadata must match available skills. |
| Markdown links | `npm run validate:links` | fail | fail | Broken local docs reduce trust and installability. |
| Agent safety boundaries | `npm run validate:agent-safety` | fail | fail | Unsafe write/external-data patterns must not merge silently. |
| Domain pack consistency | `npm run validate:domain-packs` | fail | fail | Domain packs must not break the core page schema. |
| Skill router metadata | `npm run validate:router` | fail | fail | Agents need reliable routing metadata. |
| Catalog and index coverage | `npm run validate:coverage` | fail | fail | Hand-maintained catalogs (skills overview, skill router, docs index) must not drift from the skills on disk. |
| Claim anchors | `npm run validate:claim-anchors` | fail | fail | Duplicate or unsupported claim anchors create false trust. |
| Examples / semantic fixtures | `npm run check:examples` | fail | fail | Examples are the executable user contract. |
| Distribution smoke test | `npm run smoke:skills` | fail | fail | The pack must work with the upstream `skills` CLI. |
| Skill version bump | `npm run check:skill-versions -- --strict` | fail on PRs that change skills | fail | Installed behavior changes must be versioned. In strict mode, missing base refs are failures, not skips. |
| actionlint | workflow job | fail | fail | Broken workflows should not merge. |
| gitleaks | workflow job | advisory until baseline is clean | fail | Prevents secret leakage while allowing existing synthetic fixtures to be reviewed before release. |
| zizmor | workflow job | advisory | advisory unless configured otherwise | Workflow hardening signal; can be noisy during early governance. |
| markdownlint | workflow job | advisory | advisory | Style issues should not block urgent safety fixes. |

Pinned tool versions:

- `skills@1.5.15`
- `markdownlint-cli2@0.23.0`
- `github.com/gitleaks/gitleaks/v8/cmd/gitleaks@v8.30.1`
- `github.com/rhysd/actionlint/cmd/actionlint@v1.7.12`
- `zizmor==1.26.1`

## Promotion path

Advisory checks should become blocking when:

1. false positives are documented or allowlisted;
2. the check has stable output across three consecutive PRs;
3. the repository has a review owner for failures;
4. a failing check indicates user-data risk or broken distribution behavior.

## Rules for new checks

A new check should fail CI only if it is deterministic, low-noise and tied to one of:

- installability;
- skill discovery;
- unsafe writes;
- data exposure;
- provenance integrity;
- schema compatibility;
- release artifact correctness.

Otherwise, start advisory and document the promotion criteria.

## Reviewer guidance

Do not bypass a failing validation check by weakening the check. Either fix the underlying issue, add a narrow allowlist with explanation, or split the PR.
