# Operational refresh reports

> Status: draft
> Scope: deterministic offline refresh reports for stale source-backed claims and ecosystem registry entries.

## Thesis

Refresh workflows should create review queues, not silently rewrite truth.

The repository has two operational refresh reports:

| Report | Command | Workflow | Purpose |
|---|---|---|---|
| Source refresh | `npm run refresh:source-report` | `source-refresh-report.yml` | Find expired `stale_after`, missing provenance and current-as-of docs that need review. |
| Ecosystem refresh | `npm run refresh:ecosystem-report` | `ecosystem-refresh-report.yml` | Turn `docs/13-ecosystem-matrix.md` into a verification queue for current project/tool claims. |

Run both:

```bash
npm run refresh:reports
```

## Source refresh report

The source refresh scan is offline and deterministic. It checks Markdown files for:

- frontmatter `stale_after` dates in the past;
- reviewed/verified/stale pages that lack `source_paths` or `source_urls`;
- missing local paths listed in `source_paths`;
- external `source_urls` that require web-capable verification;
- `Current as of: YYYY-MM-DD` markers older than the configured threshold.

It writes:

```text
dist/source-refresh-report.md
```

Configure the current-as-of age threshold:

```bash
CURRENT_AS_OF_MAX_AGE_DAYS=60 npm run refresh:source-report
```

## Ecosystem refresh report

The ecosystem refresh scaffold is also offline. It parses `docs/13-ecosystem-matrix.md` for:

- the matrix `Current as of` date;
- implementation registry rows;
- seed URLs;
- evidence labels such as `verified-current`, `verify-before-use`, `experimental` and `adjacent`.

It writes:

```text
dist/ecosystem-refresh-report.md
```

Use it as a worklist for `llm-wiki-ecosystem-registry` with web access.

## Review workflow

```text
offline report -> human/agent review -> web verification where needed -> proposed patch -> human approval
```

## Safety rules

- Do not let scheduled workflows update verified pages directly.
- Do not treat an offline report as source verification.
- Do not browse or call external APIs from CI unless the workflow explicitly documents that boundary.
- Do not auto-resolve contradicted claims; hand them to `llm-wiki-conflict-resolver`.
- Keep report artifacts separate from source-of-truth wiki pages unless explicitly reviewed.
