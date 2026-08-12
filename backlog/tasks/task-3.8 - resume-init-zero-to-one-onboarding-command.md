---
id: TASK-3.8
title: 'resume init: zero-to-one onboarding command'
status: To Do
assignee: []
created_date: '2026-08-12 21:53'
labels: []
dependencies:
  - TASK-3.2
  - TASK-3.3
  - TASK-3.6
  - TASK-3.7
parent_task_id: TASK-3
ordinal: 11000
---

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
Compose the interview flows into a single 'resume init' command that takes a new clone of this project from nothing to a usable resume: run the career-history interview (TASK-3.2), offer to ingest any past resumes the user has on hand (TASK-3.6), run the search-parameters interview (TASK-3.3), then ask about opportunities currently being chased and set up a first application for each (TASK-3.7). Each step should be individually skippable and re-runnable later — 'resume init' is the fast path through all of them in order, not the only way to reach them. The command should be idempotent enough that re-running it against a partially set-up project resumes rather than overwriting.
<!-- SECTION:DESCRIPTION:END -->

## Acceptance Criteria
<!-- AC:BEGIN -->
- [ ] #1 'resume init' run against an empty project produces: a filled career-history document, a filled search-parameters document, and (if any opportunities were named) at least one compiled application PDF
- [ ] #2 Each step (career-history interview, past-resume ingestion, search-parameters interview, initial applications) can be skipped without aborting the rest of the command
- [ ] #3 Re-running 'resume init' on a project that already has some of these documents filled in does not overwrite existing answers without confirmation
<!-- AC:END -->
