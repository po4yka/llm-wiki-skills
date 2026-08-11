# LLM-Wiki external starter

This vault is already configured for safe agent-assisted knowledge work. Keep source material local, review generated pages in git, and publish only an approved public subset.

## Start

Ask the agent to ingest `raw/sources/example-source.md`. The agent must preserve the raw file, create draft wiki pages with provenance, and report the git diff for review.

## Safety defaults

- `raw/` is immutable.
- Generated content is draft and requires human review.
- `## My synthesis` is human-owned.
- `_meta/redaction-policy.yml` requires a redaction preview.
- `_meta/redaction-policy.yml` records whether documents may leave this machine.
- When enabled, `exports/profiles/public.yml` allows only approved public pages under `wiki/public/`.
- Publication and external uploads require explicit human approval.

Add your own files under `raw/sources/` when you are ready. Do not put secrets in the vault.

## Build a public copy

Move only reviewed public pages to `wiki/public/`, then run:

```bash
npm run external:build
```

The command writes the public bundle to `dist/`. If the profile is disabled, or if the command finds sensitive content or an unapproved page, it fails without creating a publishable bundle.
