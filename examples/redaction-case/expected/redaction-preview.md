# Expected redaction preview contract

## Expected finding categories

The preview should flag categories, not print sensitive values verbatim:

- `email`
- `internal_url`
- `phone`
- `privacy: sensitive` or equivalent metadata finding

## Safety expectation

The preview should not mutate source files by default and should not print full sensitive values in final reports.
