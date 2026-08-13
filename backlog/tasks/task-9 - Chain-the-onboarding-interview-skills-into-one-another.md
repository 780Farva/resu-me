---
id: TASK-9
title: Chain the onboarding interview skills into one another
status: Done
assignee: []
created_date: '2026-08-13 01:25'
updated_date: '2026-08-13 01:25'
labels: []
dependencies:
  - TASK-6
  - TASK-8
ordinal: 17000
---

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
interview-about-me, interview-career, and interview-search each ran standalone: after finishing, none of them checked whether the next onboarding file was still missing, so a user running just get-started would land in one interview and then have to know to manually run the next just recipe (or re-run get-started) to continue. Add an explicit hand-off at the end of each: interview-about-me offers to continue into interview-career if career-timeline.md is missing, interview-career offers interview-search if job-search.md is missing, and interview-search — once all three onboarding files exist — offers to clean up the shipped example-co application (per the .example convention from TASK-8) and then offers to continue straight into new-application if the user names a company. The hand-off continues in the same conversation (the skill's own instructions, not a new claude process) rather than telling the user to run another just command.
<!-- SECTION:DESCRIPTION:END -->

## Acceptance Criteria
<!-- AC:BEGIN -->
- [x] #1 interview-about-me's SKILL.md ends by checking for career-timeline.md and offering to continue into interview-career's instructions in the same conversation
- [x] #2 interview-career's SKILL.md ends by checking for job-search.md and offering to continue into interview-search's instructions
- [x] #3 interview-search's SKILL.md ends by, once all three onboarding files exist, offering to clean up applications/2026-01-example-co/ and then offering to continue into new-application if a company is named
- [x] #4 AGENTS.md's Claude Code skills section documents the chain
- [x] #5 GETTING_STARTED.md's steps 2-4 mention that each interview offers to carry into the next
<!-- AC:END -->

## Final Summary

<!-- SECTION:FINAL_SUMMARY:BEGIN -->
Added an explicit hand-off to the end of each onboarding skill's SKILL.md: interview-about-me checks for career-timeline.md and offers to continue into interview-career's instructions in the same conversation; interview-career checks for job-search.md and offers interview-search; interview-search, once about_me.md/career-timeline.md/job-search.md all exist, offers to clean up applications/2026-01-example-co/ (the .example scaffold from TASK-8) and then offers to continue into new-application if a company is named. All hand-offs continue within the same running conversation rather than spawning a new claude process. Documented the chain in AGENTS.md's Claude Code skills section and noted it at each relevant step in GETTING_STARTED.md.
<!-- SECTION:FINAL_SUMMARY:END -->
