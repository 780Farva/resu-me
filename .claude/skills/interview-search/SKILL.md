---
name: interview-search
description: Interview the user about their job-search parameters and draft or update job-search.md — location, comp target, role archetypes with search terms and anti-filters, and the company pipeline. Use when job-search.md doesn't exist yet, or the user wants to update a search parameter, add a role archetype, or add to the company pipeline.
---

# Interview: job search

Build or update `job-search.md` — see AGENTS.md for what belongs in it: search
parameters (location, comp target, role type), the role archetypes being targeted with
their search terms and anti-filters, the company pipeline, and a "needs manual search"
list for boards that defeat automated fetching.

First, check whether `job-search.md` already exists.

**If it doesn't exist yet:** interview the user, one topic at a time. Start with the
practical constraints (location/remote, comp floor, role types they'll consider and
won't), then move to role archetypes — for each one, what makes it distinct enough to
need its own search terms, and what should filter it *out* (titles or postings that look
like a match but aren't). Only then get into specific companies for the pipeline, if any
are already in mind. Draft the file as you go.

**If `job-search.md` already exists:** read it first, then ask what's changed — comp
target moved, a role archetype turned out to be a dead end, a new company worth adding to
the pipeline, a board that needs to move to the "needs manual search" list because
automated fetching keeps failing on it. Fold updates in directly.

If `career-timeline.md` is already filled in, use it: role archetypes should connect
back to the stories that support them, not be invented independently.

End by naming anything still vague enough to cause trouble later — an archetype with no
real anti-filter, a comp target not tied to a defensible number.

If `about_me.md` and `career-timeline.md` also both exist now, onboarding is complete.
Check whether `applications/2026-01-example-co/` (marked by its `opportunity.md.example`
— see the `.example` convention in AGENTS.md) is still around, and if so, offer to
delete it and remove the matching `## Example Co.` section from `TODO.md` right now.
Then ask whether to start a first real application — if the user names a company,
**invoke the `new-application` skill** (the Skill tool, not a paraphrase from memory)
rather than telling them to run anything separately.
