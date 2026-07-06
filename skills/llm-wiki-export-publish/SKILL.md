---
name: llm-wiki-export-publish
description: Export or publish a safe subset of an LLM-Wiki as public docs, handbook, website, PDF, changelog, newsletter, or Markdown bundle. Use when the user wants to publish from wiki while excluding private raw sources and sensitive generated notes.
license: MIT
compatibility: Designed for Agent Skills-compatible coding agents. Requires read access to the wiki and write access only when generating export files.
metadata:
  author: po4yka
  version: "0.1.0"
---

# LLM-Wiki Export Publish

## Goal

Turn a private or internal LLM-Wiki into a safe, curated publishable artifact.

## Inputs

- Source wiki path.
- Target format: Markdown bundle, static site, handbook, PDF, release notes, newsletter.
- Audience and privacy boundary.
- Publish destination if known.

## Procedure

### 1. Define publish boundary

Classify pages as:

```text
public | internal | private | raw-only | draft | verified | exclude
```

Default to exclude drafts, raw private sources, sensitive notes and generated reports unless explicitly approved.

### 2. Select pages

Use index pages, tags, status, folders and explicit include lists. Do not publish by blindly copying the whole wiki.

### 3. Redact and normalize

Check for:

- private links;
- names, emails, keys or internal URLs;
- raw source excerpts with license restrictions;
- comments and hidden metadata;
- unreviewed generated claims;
- broken wikilinks after export.

### 4. Build output structure

Possible targets:

- `publish/markdown/`;
- `publish/site/`;
- `publish/handbook/`;
- `publish/newsletter/`;
- `publish/release-notes/`.

Convert wikilinks only in the exported copy, not in the source wiki, unless the user explicitly requests otherwise.

### 5. Create change summary

For recurring publication, summarize what changed since the last export and which pages still need review.

## Output

```markdown
## Publish plan

## Included pages

## Excluded pages

## Redactions needed

## Export structure

## Broken links or license issues

## Publication checklist
```

## Safety gates

- Do not publish private, sensitive or draft material by default.
- Do not modify source wiki links during export.
- Do not assume source licenses allow republication.
- Do not hide provenance gaps in public output.
