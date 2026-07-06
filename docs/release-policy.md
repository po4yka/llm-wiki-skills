# Release and versioning policy

> Status: draft
> Scope: how this Agent Skills pack versions skills, docs and release artifacts.

## Package releases

Package releases use git tags:

```text
vMAJOR.MINOR.PATCH
```

The release workflow validates the pack, generates catalogs and builds an archive.

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

## Release checklist

1. Run `npm run validate`.
2. Run `npm run catalog:generate`.
3. Run `npm run release:notes -- vX.Y.Z`.
4. Update `CHANGELOG.md`.
5. Create tag `vX.Y.Z`.
6. Confirm release archive includes `skills/`, `docs/`, `templates/`, `domain-packs/`, `benchmarks/`, `scripts/`, `skills.sh.json`, `README.md` and `LICENSE`.

## Deprecation policy

Deprecate before removing when possible:

```yaml
metadata:
  deprecated: true
  replaced_by: llm-wiki-new-skill
```

Do not remove deprecated skills until a major release.
