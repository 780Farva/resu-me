---
id: TASK-13
title: Surface hidden options instead of silently checking and moving on
status: Done
assignee: []
created_date: '2026-08-13 02:51'
updated_date: '2026-08-13 02:51'
labels: []
dependencies:
  - TASK-11
ordinal: 21000
---

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
A real test run hit interview-career with an empty past_resumes/ and it silently checked the folder, found nothing, and announced 'no past_resumes/ and no career-timeline.md, so we start from scratch' without ever telling the user that folder was an option to begin with -- a first-time user run through just get-started has no way to know it exists. Added a general rule to AGENTS.md's Conversational style section (assume the user hasn't read any of this repo's docs; ask about an option directly instead of silently checking it and reporting the absence as settled) and fixed interview-career to actually ask whether the user has old resumes to paste in or drop into past_resumes/ before assuming there's nothing to work from. Also tightened new-application and ingest-resumes, which had a related but different issue: they 'suggested' the user go run a prerequisite skill themselves instead of just invoking it, which contradicts the don't-hand-back-an-obvious-step rule from TASK-11.
<!-- SECTION:DESCRIPTION:END -->

## Acceptance Criteria
<!-- AC:BEGIN -->
- [x] #1 AGENTS.md's Conversational style section has a rule about surfacing options the user can't know about, rather than silently checking and reporting absence
- [x] #2 interview-career asks the user directly about past resumes (paste text or drop into past_resumes/) when the folder is empty, instead of silently checking and announcing 'starting from scratch'
- [x] #3 new-application and ingest-resumes invoke their prerequisite skill directly when career-timeline.md/about_me.md is missing, instead of suggesting the user run it
<!-- AC:END -->

## Final Summary

<!-- SECTION:FINAL_SUMMARY:BEGIN -->
Added a 'Surface options the user can't know about' bullet to AGENTS.md's Conversational style section. Rewrote interview-career's empty-past_resumes/ branch to explicitly ask the user whether they have old resumes to paste in or save into the folder, before assuming there's nothing to work from -- only proceeding to the blank-slate interview once that's been asked and answered. Tightened new-application (missing career-timeline.md/about_me.md now gets interview-career/interview-about-me invoked directly, not suggested) and ingest-resumes (missing career-timeline.md now invokes interview-career directly).
<!-- SECTION:FINAL_SUMMARY:END -->
