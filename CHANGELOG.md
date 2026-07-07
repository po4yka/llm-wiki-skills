# Changelog

All notable changes to this project will be documented in this file.

## Unreleased

### Added

- Full lifecycle LLM-Wiki Agent Skills pack.
- Advanced use-case skills for diagnosis, provenance, evaluation, Obsidian hardening, repo docs, source refresh, privacy redaction and skill governance.
- Evidence-backed FAQ layer and local pilot evaluation guidance.
- Validation scripts and release packaging workflow.
- Criticism mitigation layer: `llm-wiki-critique-audit` skill and criticism-aware FAQ answers.
- Team operating model: expanded `llm-wiki-team-rollout` skill, team operating model reference doc and team starter templates (operating model, RACI/DACI, review workflow, SLO scorecard, onboarding checklist, CODEOWNERS).
- Self-hosted GitLab operating model: `llm-wiki-gitlab-operating-model` skill, GitLab starter templates (operating model, CODEOWNERS, CI, protected branch/environment policy, RACI/DACI, SLO scorecard, merge request template) and reference doc.
- Human synthesis atom template (`templates/wiki/human-synthesis-atom.md`).
- Documentation illustrations under `docs/assets/`, embedded across key docs.

### Changed

- Synced docs/07 skills overview, docs/00-index, skill router (JSON and MD) and roadmap with the 49 shipped skills; added coverage validator to prevent catalog drift.

### Release process

Use `docs/release-policy.md` for versioning and release checklist.
