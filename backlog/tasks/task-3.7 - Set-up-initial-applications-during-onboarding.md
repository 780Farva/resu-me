---
id: TASK-3.7
title: Set up initial applications during onboarding
status: To Do
assignee: []
created_date: '2026-08-12 21:53'
updated_date: '2026-08-12 21:53'
labels: []
dependencies:
  - TASK-3.3
parent_task_id: TASK-3
ordinal: 10000
---

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
The last step in getting a new user to a usable output: ask what opportunities they're currently chasing (even just a company name and a posting link is enough to start), then create a real applications/<date>-<company>/ directory for each one — opportunity.md scaffolded with what was said, and a first-draft resume .typ generated from the career-history document via template.typ. The onboarding flow should end with at least one compiled PDF the user can look at, not just filled-in documents, so 'zero to one usable resume' is actually true rather than aspirational. Depends on the search-parameters interview (TASK-3.3) for pipeline context, but should tolerate a user who wants to skip straight to a specific opportunity without filling out the full pipeline first.
<!-- SECTION:DESCRIPTION:END -->

## Acceptance Criteria
<!-- AC:BEGIN -->
- [ ] #1 Given at least one named opportunity, onboarding creates its applications/ directory with a filled-in opportunity.md and a compiled resume PDF
- [ ] #2 A user with zero current opportunities can finish onboarding with career-history and search-parameters documents in place and no application directory created
- [ ] #3 Generated resume content is drawn from the career-history document rather than invented
<!-- AC:END -->
