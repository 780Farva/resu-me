---
id: TASK-4
title: Split Quickstart out of README into GETTING_STARTED.md
status: Done
assignee: []
created_date: '2026-08-12 23:08'
updated_date: '2026-08-12 23:09'
labels: []
dependencies: []
ordinal: 12000
---

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
The README's Quickstart section is just a list of just commands. It skips the actual main loop of the tool: building career-timeline.md and job-search.md through conversation with Claude Code, then drafting an opportunity.md and resume per application. A new user reading only the README has no path from clone to first resume. Move the command list into a new root-level GETTING_STARTED.md that narrates the full loop (setup, career-timeline.md, job-search.md, starting an application, review, status lifecycle, repeat), and leave README with a short teaser + link.
<!-- SECTION:DESCRIPTION:END -->

## Acceptance Criteria
<!-- AC:BEGIN -->
- [x] #1 GETTING_STARTED.md exists at repo root and walks through: one-time setup, building career-timeline.md via conversation, building job-search.md, starting an application (opportunity.md + resume .typ + compile), review via /resume-review, tracking status/TODO.md, and repeating per opportunity
- [x] #2 GETTING_STARTED.md ends with a build-command reference (install-fonts, install-hooks, compile, watch, check, review, sign, provenance)
- [x] #3 README.md's Quickstart section is replaced with a short paragraph plus a link to GETTING_STARTED.md, with no duplicated command list
- [x] #4 No content is duplicated verbatim across README.md, GETTING_STARTED.md, and AGENTS.md
<!-- AC:END -->

## Final Summary

<!-- SECTION:FINAL_SUMMARY:BEGIN -->
Added GETTING_STARTED.md at repo root walking through the full loop: one-time setup, building career-timeline.md and job-search.md via conversation with Claude Code, starting an application (opportunity.md + resume .typ + compile), review via /resume-review, tracking status/TODO.md, repeating per opportunity, and a build-command reference table at the end. Replaced README.md's Quickstart command block with a short paragraph + link to GETTING_STARTED.md, and fixed a stale 'see Quickstart above' cross-reference in the Layout section. Verified no verbatim duplication across README.md, GETTING_STARTED.md, and AGENTS.md, and cross-checked justfile recipe names/args against the new build-command table.
<!-- SECTION:FINAL_SUMMARY:END -->
