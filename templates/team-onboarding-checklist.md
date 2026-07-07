# LLM-Wiki team onboarding checklist

> Status: template
> Use with `llm-wiki-team-rollout`.

## First two weeks: context and safe access

- [ ] Read the team charter and operating model.
- [ ] Read the working agreements and escalation map.
- [ ] Review the architecture overview: `raw/`, `wiki/`, `indexes/`, `evals/`, `exports/`, `api/` / MCP.
- [ ] Review review states: `draft`, `reviewed`, `verified`, `published`, `stale`, `rejected`, `quarantined`.
- [ ] Review CODEOWNERS and protected paths.
- [ ] Set up local repo, docs workspace and required tools.
- [ ] Confirm access boundaries and least-privilege defaults.
- [ ] Observe one ingest flow.
- [ ] Observe one retrieval/eval review.
- [ ] Observe one release/export review.
- [ ] Observe one incident drill or postmortem review.

Exit criteria:

- [ ] Can explain the source-to-wiki-to-export lifecycle.
- [ ] Can identify owners for sensitive paths and domains.
- [ ] Can explain what agents may read, propose and publish.
- [ ] Can escalate a policy, security or quality concern.

## First month: shadowed execution

- [ ] Perform one low-risk source ingest under review.
- [ ] Create or update one source manifest.
- [ ] Run one lint/eval workflow.
- [ ] Review one low-risk wiki page or proposal with a domain owner.
- [ ] Add one small eval or regression case from a real failure.
- [ ] Update one runbook or checklist based on a gap found during onboarding.

Exit criteria:

- [ ] Can complete routine tasks with review.
- [ ] Can interpret scorecards and CI failures.
- [ ] Can distinguish draft and production knowledge.

## Second month: limited ownership

- [ ] Own one recurring workflow lane: ingest, review queue, eval, export, security or dashboard.
- [ ] Lead one review queue grooming session.
- [ ] Prepare one release/export or index refresh plan.
- [ ] Propose one automation improvement that reduces toil.
- [ ] Participate in one incident simulation or real incident as secondary.

Exit criteria:

- [ ] Can run one workflow independently.
- [ ] Can escalate correctly when policy or review gates are unclear.

## Third month: operational readiness

- [ ] Ship one change from planning to PR to merge to verification.
- [ ] Own one scorecard update.
- [ ] Lead one small postmortem or failure review.
- [ ] Propose updates to RACI, dashboards or operating rituals if needed.

Exit criteria:

- [ ] Ready for normal team rotation and accountable ownership in one lane.
- [ ] Has a named owner/mentor for the next maturity step.
