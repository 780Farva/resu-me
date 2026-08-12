---
id: TASK-1
title: Add a career-history document template
status: To Do
assignee: []
created_date: '2026-08-12 21:44'
labels: []
dependencies: []
ordinal: 1000
---

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
Every resume in this project should draw from one company-agnostic source of truth: a document holding the verified career timeline, the handful of load-bearing accomplishment stories a person tells across applications, current focus areas, and open questions that affect more than one resume (title conflicts, contact details, etc.). This document doesn't exist yet in the scaffold — only referenced from CLAUDE.md and the review skill. Add a template/starter version of it, with section headers and inline guidance on what belongs in each section, so a new user has something to fill in rather than a blank page. Seeding it by hand should work; seeding it through a guided interview is the job of the chat interface (see the resume CLI epic) once that exists.
<!-- SECTION:DESCRIPTION:END -->

## Acceptance Criteria
<!-- AC:BEGIN -->
- [ ] #1 A template document exists at the repo root with the sections CLAUDE.md already describes: verified timeline, load-bearing stories, current focus, open questions
- [ ] #2 Each section includes a short inline comment or example explaining what belongs there
- [ ] #3 README and CLAUDE.md point to the template instead of describing a file that isn't there
<!-- AC:END -->
