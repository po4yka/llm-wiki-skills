---
name: llm-wiki-export-publish
description: Export or publish a safe subset of an LLM-Wiki as public docs, an internal handbook, a static site, llms.txt, JSONL/JSON-LD, graph export, or an archive. Use when publishing from the wiki must preserve provenance and exclude private raw sources, sensitive notes, and draft pages.
license: MIT
compatibility: Designed for Agent Skills-compatible coding agents. Requires read access to the wiki and write access only when generating export files. Browse current publishing-tool docs before giving version-specific commands, hosted-feature claims or generator compatibility advice.
metadata:
  author: po4yka
  version: "1.0.0"
  install_scope: self-contained
---

# LLM-Wiki Export Publish

## Goal

Turn private or internal LLM-Wiki content into safe, scoped, versioned and provenance-preserving outputs for humans, agents, APIs, graphs or archives.

Use `references/docs/21-publishing-export.md` as the reference architecture for export profiles, human/agent/API/graph/archive targets, redaction, manifests, CI gates, release workflows and rollout.

## When to use

- A wiki maintainer wants to publish a public docs site, internal handbook, or agent-readable `llms.txt`/JSONL bundle from private wiki content.
- A release needs a redacted, provenance-preserving export that excludes draft, private, sensitive or unreviewed pages.
- A team needs a graph export (GraphML, JSON-LD, Cytoscape) or an archive bundle for long-term preservation.
- CI needs export-profile validation, redaction scanning, or manifest/checksum generation before a release gate.
- Do not use this skill to author new wiki content, run ingestion, or perform redaction analysis in depth — hand those off to `llm-wiki-ingest`, `llm-wiki-privacy-redactor` or `llm-wiki-security-review`.

## Inputs

- Source wiki path.
- Target audience: private reviewers, internal users, public users, agents, API clients, graph tools or archive consumers.
- Target format: Markdown bundle, static site, handbook, PDF, release notes, newsletter, `llms.txt`, `llms-full.txt`, JSONL, JSON-LD, GraphML, OpenAPI, MCP manifest, archive bundle.
- Audience and privacy boundary.
- Publish destination if known.
- Export profile, allowlist, tags, folders or review states if available.
- Redaction policy and review requirements.

## Procedure

### 1. Define export profile

Choose one or more profiles:

| Profile | Audience | Typical output | Default policy |
| --- | --- | --- | --- |
| `private-review` | maintainers/reviewers | review bundle, diff report, unresolved claims | may include drafts, never public |
| `internal-site` | team/company | static site, internal search, Markdown bundle | reviewed/approved internal pages only |
| `public-site` | public users | curated static docs, sitemap, Pagefind/search index | explicit allowlist and redaction required |
| `agent-bundle` | LLM/agent consumers | `llms.txt`, per-page Markdown/TXT, JSONL, manifest | concise, cited, machine-friendly, no private raw content |
| `api-export` | product/integration clients | OpenAPI, read-only MCP resource profile, JSON endpoints | separate public/internal contracts |
| `graph-export` | graph tools/visualization | JSON-LD, GraphML, Mermaid, GraphViz, Cytoscape JSON | edge provenance and sensitivity filters |
| `archive` | long-term preservation | tar/zip, checksums, release asset, WARC where applicable | immutable, versioned, access-controlled |

Do not reuse one export profile for all audiences.

### 2. Define publish boundary

Classify pages as:

```text
public | internal | private | raw-only | draft | reviewed | verified | published | rejected | quarantined | exclude
```

Default blockers for public/agent exports:

- `sensitivity` is `sensitive`, `regulated` or `unknown`;
- `review_state` is `draft`, `rejected`, `stale` or `quarantined`;
- `publication_state` is `private` or `archived`;
- page lacks required citations or claim-support labels;
- page depends on raw private sources;
- page contains unresolved redaction findings;
- page has broken links/citations that would be material in the export.

### 3. Select pages

Use explicit include rules:

- allowlisted paths;
- allowlisted tags;
- publish frontmatter;
- reviewed/verified/published states;
- specific wiki spaces;
- release profile.

Do not publish by blindly copying the whole wiki.

### 4. Redact and normalize

Check for:

- private links and internal-only URLs;
- private user or customer details;
- credentials or secret-like strings;
- raw source excerpts with license restrictions;
- comments, hidden metadata and source maps;
- unreviewed generated claims;
- unsupported claims;
- broken wikilinks after export;
- search-index leakage.

Hand off to `llm-wiki-privacy-redactor` for redaction-heavy exports and to `llm-wiki-security-review` for public or agent-readable releases.

### 5. Choose output targets

Human outputs:

- MkDocs Material;
- Docusaurus;
- VitePress;
- Quartz;
- Astro/Starlight;
- static Markdown bundle;
- PDF/handbook/newsletter when specifically requested.

Agent/API outputs:

- `llms.txt`;
- `llms-full.txt` only when explicitly allowed;
- per-page `.md` / `.txt`;
- `pages.jsonl`;
- `manifest.json` / `manifest.yaml`;
- JSON-LD;
- OpenAPI;
- read-only MCP resource manifest/profile.

Graph/archive outputs:

- GraphML;
- Mermaid;
- GraphViz DOT;
- Cytoscape JSON;
- RDF/Turtle;
- tar/zip archive;
- checksums;
- WARC for web-capture preservation when applicable.

### 6. Preserve provenance and citations

Every exported page should carry:

```yaml
id: ""
title: ""
source_path: "wiki/..."
export_url: ""
review_state: approved|published|verified
publication_state: public|internal
sensitivity: public|internal
updated_at: "YYYY-MM-DD"
source_citations: []
claim_support:
  supported: 0
  unsupported: 0
  conflicting: 0
checksums:
  markdown_sha256: ""
```

Keep citations stable where possible. If paths are rewritten, generate a citation mapping report.

### 7. Generate export manifest

Every export must produce a manifest:

```yaml
export_id: ""
profile_id: ""
created_at: "YYYY-MM-DDTHH:MM:SSZ"
created_by: human|agent|ci
wiki_revision: ""
source_revision: ""
policy_revision: ""
profile_revision: ""
outputs: []
counts:
  pages_included: 0
  pages_excluded: 0
  citations_checked: 0
  links_checked: 0
  redactions_applied: 0
reports:
  redaction: ""
  citation: ""
  broken_links: ""
  search_index: ""
status: draft|passed|failed|published|archived
```

### 8. Build `llms.txt` and agent bundle safely

Recommended rules:

- make `llms.txt` concise;
- link to stable per-page Markdown/TXT;
- include export scope and generation date;
- include only reviewed and approved pages for the selected profile;
- preserve citations per page;
- generate `llms-full.txt` only when the export profile explicitly permits it;
- never include private raw source text by default;
- include a machine-readable manifest with hashes and page metadata.

### 9. Build static search safely

Recommended order:

```text
filter pages -> redact -> build site -> build Pagefind/static search index -> inspect index report -> publish
```

Use separate search indexes for public and internal builds. Never reuse an internal index in a public site.

### 10. Add CI and release gates

PR-time gates:

- export profile schema valid;
- no draft/private/sensitive page in public profile;
- links and citations resolve;
- redaction scan passes;
- `llms.txt` generated and scoped correctly;
- export manifest and checksums generated.

Release gates:

- owner approval;
- security review for public/agent bundle;
- comparison against previous export manifest;
- changelog generated;
- rollback artifact retained;
- release tag or artifact published.

### 11. Publish or archive

Possible destinations:

- GitHub Pages;
- internal static hosting;
- release artifacts;
- artifact registry/object storage;
- docs platform;
- repo branch such as `gh-pages`;
- offline bundle.

Record publication URL, release tag, checksum and rollback artifact in the export manifest.

## Output

```markdown
## Publish/export recommendation

## Export profile

## Included pages

## Excluded pages and reasons

## Redactions needed

## Output targets

## Provenance and citation strategy

## Static site/search plan

## Agent-readable bundle plan

## Graph/API/archive plan

## Export manifest and checksums

## CI/release gates

## Publication checklist

## Follow-up skills
```

## Safety gates

- Do not publish private, sensitive, unknown-sensitivity, draft, rejected, stale or quarantined material by default.
- Do not modify source wiki links during export; transform only the exported copy.
- Do not assume source licenses allow republication.
- Do not hide provenance gaps in public output.
- Do not generate `llms-full.txt` from broad internal content without explicit profile approval.
- Do not build public search indexes from internal site output.
- Do not expose proposal-write or admin MCP/API tools through public exports.
- Do not archive only rendered HTML if source manifests and checksums are needed for reproducibility.
