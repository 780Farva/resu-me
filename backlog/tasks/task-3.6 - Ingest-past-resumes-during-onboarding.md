---
id: TASK-3.6
title: Ingest past resumes during onboarding
status: To Do
assignee: []
created_date: '2026-08-12 21:53'
labels: []
dependencies:
  - TASK-3.1
  - TASK-1
parent_task_id: TASK-3
ordinal: 9000
---

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
As part of getting a new user from zero to a usable resume, the CLI should ask whether they have prior resumes lying around and, if so, walk them through copying those files into a standard directory in the project (matching the existing past_resumes/ convention named in CLAUDE.md, which isn't yet scaffolded). Once copies are in place, the harness should read them, extract anything not already reflected in the career-history document, and propose additions for the user to accept or reject rather than writing them in silently — mirroring the fold-in-what's-new process CLAUDE.md already describes for this directory. This step should work whether or not the career-history interview (TASK-3.2) has run yet, and should be safe to skip entirely for a user with nothing to import.
<!-- SECTION:DESCRIPTION:END -->

## Acceptance Criteria
<!-- AC:BEGIN -->
- [ ] #1 The onboarding flow prompts for prior resume files and, when given a directory or file paths, copies them into the standard past_resumes/ location
- [ ] #2 Content extracted from an old resume is proposed as additions to the career-history document and requires explicit user acceptance before being written
- [ ] #3 Declining to provide old resumes does not block the rest of onboarding
<!-- AC:END -->
