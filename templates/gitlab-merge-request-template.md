# LLM-Wiki GitLab Merge Request Template

## Change type

- [ ] Wiki content / source page
- [ ] Source manifest / ingestion profile
- [ ] Retrieval / index / eval
- [ ] Skill / agent behavior
- [ ] MCP/API contract or permission
- [ ] GitLab CI/CD / runner / protected branch / protected environment
- [ ] Export / publishing / agent bundle
- [ ] Security / model policy / compliance
- [ ] Incident fix / regression case

## Summary

Describe the change and the user/team problem it solves.

## Scope

Affected paths:

- 

Affected domains/tenants:

- 

## Review state

- [ ] Draft only; excluded from production retrieval
- [ ] Ready for domain review
- [ ] Ready for technical review
- [ ] Ready for security/compliance review
- [ ] Ready for publish/export review

## Evidence and provenance

- [ ] Source manifests updated where needed
- [ ] Important claims have citations or support labels
- [ ] Unsupported/conflicting claims are marked
- [ ] Link/citation changes are intentional

## GitLab governance

- [ ] CODEOWNERS reviewers are appropriate
- [ ] Required approval rules are expected to apply
- [ ] Protected branch policy is not bypassed
- [ ] Protected environment approval is required if deploying/publishing
- [ ] Release artifacts/manifests/checksums are produced if applicable

## CI/CD and security

- [ ] Wiki lint/link/citation checks pass
- [ ] Eval smoke/scorecard updated where applicable
- [ ] Redaction/private-data scan passes where applicable
- [ ] MCP/API scope tests pass where applicable
- [ ] Runner scope and secrets handling reviewed if CI changed

## Rollback

Describe how to revert or quarantine the change.

## Follow-up

Open issues or follow-up tasks:

- 
