# Release and versioning policy

> Status: draft
> Scope: how this Agent Skills pack versions skills, docs and release artifacts.

## Package releases

Package releases use git tags:

```text
vMAJOR.MINOR.PATCH
```

The release workflow validates the pack, smoke-tests the package with the upstream `skills` CLI, generates catalogs and builds an archive.

## Skill versions

Each skill has `metadata.version` in `SKILL.md`.

Use:

| Change | Bump |
|---|---|
| typo, clarification, safer wording | patch |
| new procedure step, output section or optional capability | minor |
| changed trigger, changed write permissions, renamed skill, incompatible output contract | major |

## Breaking changes

Breaking changes include:

- skill rename;
- removal from `skills.sh.json`;
- changing default write mode from report-only to apply;
- removing safety gates;
- changing output format that downstream agents rely on.

## Distribution smoke test

The distribution smoke test checks that this repository works as a local source for the `skills` CLI.

Run locally:

```bash
npm run smoke:skills
```

It verifies:

1. `npx skills add <repo> --list` can discover representative skills.
2. `npx skills use <repo> --skill llm-wiki-faq` can render a prompt without launching an agent.
3. `npx skills add <repo> --skill llm-wiki-faq -a claude-code --copy -y` installs a real `SKILL.md` into a temporary project.

Set `SKILLS_CLI_PACKAGE` to pin a different CLI version during debugging:

```bash
SKILLS_CLI_PACKAGE=skills@1.2.3 npm run smoke:skills
```

## Release checklist

1. Run `npm run validate`.
2. Run `npm run smoke:skills`.
3. Run `npm run catalog:generate`.
4. Run `npm run release:notes -- vX.Y.Z`.
5. Update `CHANGELOG.md`.
6. Create tag `vX.Y.Z`.
7. Confirm release archive includes `skills/`, `docs/`, `templates/`, `domain-packs/`, `benchmarks/`, `scripts/`, `skills.sh.json`, `README.md` and `LICENSE`.

## Deprecation policy

Deprecate before removing when possible:

```yaml
metadata:
  deprecated: true
  replaced_by: llm-wiki-new-skill
```

Do not remove deprecated skills until a major release.
