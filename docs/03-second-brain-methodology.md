# Second-brain methodology in the LLM era

> Status: draft
> Scope: how established second-brain methods change when agents can maintain bookkeeping.
> Current as of: 2026-07-07

## Thesis

LLM-Wiki does not make all second-brain methodology obsolete. It changes which parts should be automated. The useful split is:

- automate structure maintenance;
- preserve human ownership of synthesis and belief formation.

## What agents are good at

Agents are strong at repeatable bookkeeping:

- extracting metadata;
- normalizing frontmatter;
- finding repeated entities;
- suggesting wikilinks;
- detecting orphan pages;
- maintaining indexes and logs;
- clustering related notes;
- drafting source summaries;
- creating comparison tables;
- flagging stale claims.

These tasks are valuable but tedious, which is why human-maintained wikis decay.

## What should remain human-owned

Humans should own:

- what matters;
- what is believed;
- what is promoted from draft to reviewed;
- the final wording of personal synthesis;
- decisions under ambiguity;
- deletion and archival of important material.

A useful page template separates agent and human sections:

```markdown
## Extracted from sources

Agent-maintained. Must cite source pages or raw sources.

## My synthesis

Human-owned. The agent may ask questions but should not overwrite this section.

## Related

Agent-maintained links and candidates.
```

## Methods that become more useful

### Diátaxis

Diátaxis maps cleanly to documentation and wiki page roles: tutorial, how-to, explanation, reference. It is easy for agents to classify and lint.

### Evergreen notes

Evergreen notes work well when agents help with titles, links and refactoring. The human still needs to own the durable claim.

### MOCs / maps of content

Agents can generate draft MOCs from co-citation, backlinks, shared tags and repeated entities. MOCs should still include a human-written orientation paragraph for important domains.

### Faceted metadata

Facets are better than single-location filing for agent retrieval. A page can be about one project, one concept, one source family and one status at the same time.

### Docs-as-code

Git, schemas, CI-style validation and review gates are natural controls for agent-written knowledge.

## Methods that become brittle

### PARA as the primary ontology

PARA's actionability axis is useful for task management, but research-heavy knowledge collapses into `Resources`. Use it as an overlay, not as the main ontology.

### Folgezettel IDs as semantic structure

Agents can generate valid-looking IDs without owning the mental model behind the sequence. Use stable IDs for uniqueness, not as the main reasoning structure.

### Pure tag soup

Agents can add tags cheaply, which makes drift worse. Use a controlled vocabulary in `_meta/taxonomy.md`.

### Pure links without folders or types

A link-only vault can be elegant for a human author and chaotic for an agent. Use lightweight folders and page types as guardrails.

## Recommended hybrid

```text
Small system-role folders
+ explicit page types
+ controlled vocabulary
+ wikilinks
+ MOCs generated and reviewed
+ git and schema validation
+ separate draft/reviewed states
```

## The central boundary

Do not ask the agent to "think for you" as a default. Ask it to keep the structure alive so that your own thinking has memory.

## Operational rule

Every automation should answer one question:

> Does this reduce bookkeeping without reducing trust?

If not, keep the step manual or put it behind review.
