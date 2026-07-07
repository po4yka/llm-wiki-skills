## Summary

<!-- What does this PR change and why? -->

## Type of change

- [ ] Skill change
- [ ] Documentation change
- [ ] Template/schema change
- [ ] Domain pack change
- [ ] CI/release/tooling change
- [ ] Security/safety change
- [ ] Other

## Checklist

- [ ] I read `AGENTS.md` and `CONTRIBUTING.md`.
- [ ] The change is focused and reviewable.
- [ ] `npm run validate` passes, or I explain below why it was not run.
- [ ] I updated docs, examples or templates when behavior changed.
- [ ] I avoided adding stale current-state claims without re-verification.
- [ ] I did not add real secrets, private data or sensitive source content.

## Skill checklist

Complete when adding or changing skills:

- [ ] `skills/<skill-name>/SKILL.md` has valid frontmatter.
- [ ] `name` matches the directory name.
- [ ] `description` is trigger-oriented.
- [ ] The skill has explicit safety gates.
- [ ] Risky write operations default to report-only, dry-run, proposal or PR-based mode.
- [ ] The skill is listed in `skills.sh.json`.
- [ ] The skill is listed in `docs/07-skills-overview.md`.
- [ ] The skill has a route in `skill-router.json` and is mentioned in `docs/skill-router.md`.
- [ ] New docs pages are linked from `docs/00-index.md`.
- [ ] `CHANGELOG.md` records the change.
- [ ] README and `docs/skills-catalog.md` are updated or regenerated.

## Schema/domain-pack checklist

Complete when changing schemas or domain packs:

- [ ] Core `type` values remain stable.
- [ ] Domain-specific page classes use `domain_type`.
- [ ] Domain packs include or update `schema.overlay.json`.
- [ ] `npm run validate:domain-packs` passes.

## Security checklist

Complete when the change affects writes, model/provider boundaries, publishing, MCP/API, release packaging or CI:

- [ ] Data boundaries are explicit.
- [ ] The change does not weaken review gates.
- [ ] The change does not route sensitive content to external services without explicit approval.
- [ ] Prompt-injection surfaces treat captured/source content as data, not instructions.
- [ ] Generated outputs do not include secrets or private content.

## Validation

```text
# paste relevant validation output, or explain why not run
```

## Notes for reviewers

<!-- Risks, follow-ups, or intentionally deferred work. -->
