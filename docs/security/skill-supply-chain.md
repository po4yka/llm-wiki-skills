# Agent Skills supply-chain security

> Status: draft
> Scope: how to review third-party Agent Skills before installation or distribution.

## Why this matters

Agent Skills are operational instructions. A malicious or sloppy `SKILL.md` can influence tool selection, file writes, external calls and user trust even when it is not executable code.

## Review checklist before install

- [ ] Read the full `SKILL.md`.
- [ ] Check whether the description is trigger-oriented or manipulative.
- [ ] Look for broad write permissions.
- [ ] Look for remote install scripts or shell commands.
- [ ] Check whether the skill asks the agent to ignore review, policy or user approval.
- [ ] Check whether untrusted content is treated as commands.
- [ ] Check whether sensitive data can leave the machine.
- [ ] Prefer pinned versions or reviewed commits for shared/team installs.

## Dangerous patterns

| Pattern | Risk |
| --- | --- |
| direct writes without dry-run | silent knowledge corruption |
| automatic merging | bypassed human review |
| broad external model use | data leakage |
| hidden domain facts in skills | stale invisible knowledge |
| instructions inside examples that override safety | prompt-injection by demonstration |
| generated skills from private wiki pages | accidental secret publication |

## Recommended install modes

| Mode | Use when |
| --- | --- |
| one-off `skills use` | testing a skill without installing it. |
| project install | skills should be reviewed and committed with the repo. |
| global install | stable personal workflows from trusted sources only. |
| fork and pin | team/company use or sensitive work. |

## Governance loop

```text
review skill -> install in project -> run llm-wiki-skill-doctor -> validate -> use in report-only mode -> expand permissions after trust
```

## Repository controls

This repository provides:

- `npm run validate:skills`;
- `npm run validate:manifest`;
- `npm run validate:agent-safety`;
- `npm run validate:skill-smells`;
- `llm-wiki-skill-doctor`;
- `llm-wiki-security-review`.

## Rule of thumb

A skill that can change many files should first produce a report, a dry-run plan or a pull request. Direct mutation is the exception, not the default.
