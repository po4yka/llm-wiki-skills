# Security policy

This repository distributes Agent Skills: natural-language procedures that coding agents may use to read, write, search, lint, publish or otherwise operate on user knowledge bases. Treat skill instructions as part of the software supply chain.

## Supported versions

Security fixes are made against `main` and the latest published release tag when a release exists.

| Version | Supported |
|---|---|
| `main` | Yes |
| latest `v*` release | Yes |
| older releases | Best effort |

## Reporting a vulnerability

Use GitHub private vulnerability reporting if it is enabled for this repository. If private reporting is unavailable, open a minimal public issue that avoids sensitive details and ask for a private disclosure channel.

Do **not** include:

- real API keys, tokens, credentials or cookies;
- private vault contents;
- sensitive raw sources;
- private model prompts or logs;
- exploit payloads that would directly enable abuse.

Include:

- affected file or skill;
- expected behavior;
- observed risky behavior;
- reproduction steps using synthetic data;
- suggested severity if known.

## What counts as security-sensitive here

Please report issues such as:

- skills that encourage unsafe direct writes, deletion or bypassing review;
- skills that route sensitive data to external services without explicit approval;
- prompt-injection surfaces where captured content is treated as instructions;
- instructions that weaken system/user policy or permission boundaries;
- generated-memory or LLM-Wiki workflows that can silently promote unreviewed claims;
- examples, templates or scripts that leak secrets, PII or private paths;
- GitHub Actions or release workflows with unsafe permissions;
- supply-chain risks in install, release or generated skill workflows.

## Security review expectations

Before merging changes that affect skills, automation, release packaging or external integrations:

1. Run `npm run validate`.
2. Confirm all new or changed skills have explicit safety gates.
3. Confirm destructive operations default to report-only, dry-run, proposal or PR-based modes.
4. Confirm current ecosystem or provider claims are re-verified when relevant.
5. Confirm examples use synthetic data only.
6. Confirm generated artifacts do not include secrets or local-only files.

## Data-boundary principle

The default stance is local-first and review-first. A skill should not send user content to cloud tools, external model providers, hosted parsers, remote MCP/API servers or publishing targets unless the user explicitly accepts that boundary.

## Related repository guidance

- `docs/security/skill-supply-chain.md`
- `skills/llm-wiki-security-review/SKILL.md`
- `skills/llm-wiki-model-policy/SKILL.md`
- `skills/llm-wiki-privacy-redactor/SKILL.md`
