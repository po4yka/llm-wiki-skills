# Release and versioning policy

> Status: draft
> Scope: how this Agent Skills pack versions skills, docs and release artifacts.

## Package releases

New package releases use canonical git tags:

```text
vMAJOR.MINOR.PATCH
```

The release workflow also accepts the legacy `MAJOR.MINOR.PATCH` form used by the existing `1.0.0` release. Do not rewrite published tags only to add the prefix.

The release workflow validates the pack, smoke-tests the package with the upstream `skills` CLI, tests the starter CLI, generates catalogs and builds an archive.

## Skill versions

Each skill has `metadata.version` in `SKILL.md`.

Use:

| Change | Bump |
| --- | --- |
| typo, clarification, safer wording | patch |
| new procedure step, output section or optional capability | minor |
| changed trigger, changed write permissions, renamed skill, incompatible output contract | major |

## Version bump enforcement

Pull requests that change `skills/<name>/SKILL.md` must bump that skill's `metadata.version`.

Run locally:

```bash
npm run check:skill-versions
```

CI runs the same check in strict mode for pull requests:

```bash
npm run check:skill-versions -- --strict
```

The check compares the PR branch against the base branch and only applies to changed `SKILL.md` files.

On release tags, the workflow compares skill versions with the previous reachable semantic-version release tag instead of `main`.

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
3. Every shipped skill can be installed with `npx skills add <repo> --skill <name> -a claude-code --copy -y`.
4. Every installed skill preserves its declared standalone-install contract.

During a release, validation and the distribution smoke test run against the extracted archive rather than only the source checkout.

Set `SKILLS_CLI_PACKAGE` to pin a different CLI version during debugging:

```bash
SKILLS_CLI_PACKAGE=skills@1.2.3 npm run smoke:skills
```

## Release checklist

1. Run `npm run validate`.
2. Run `npm run smoke:skills` and `npm pack --dry-run`.
3. Run `npm run check:skill-versions` if any skills changed.
4. Run `npm run catalog:generate`.
5. Run `npm run release:notes -- vX.Y.Z`.
6. Update `CHANGELOG.md`.
7. Create tag `vX.Y.Z`.
8. Confirm the extracted release archive passes `npm run validate` and `npm run smoke:skills`.
9. Confirm the release archive includes the pack roots, machine-readable router and quality baseline, policies, package metadata, root guidance and validation workflows.
10. Publish `llm-wiki-starter` to npm with maintainer credentials after the matching tag passes.

## Deprecation policy

Deprecate before removing when possible:

```yaml
metadata:
  deprecated: true
  replaced_by: llm-wiki-new-skill
```

Do not remove deprecated skills until a major release.
