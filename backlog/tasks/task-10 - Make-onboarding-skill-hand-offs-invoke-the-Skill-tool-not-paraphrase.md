---
id: TASK-10
title: 'Make onboarding skill hand-offs invoke the Skill tool, not paraphrase'
status: Done
assignee: []
created_date: '2026-08-13 01:55'
updated_date: '2026-08-13 01:55'
labels: []
dependencies:
  - TASK-9
ordinal: 18000
---

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
TASK-9's chained hand-off text ('carry on in this same conversation following the X skill's instructions') was ambiguous about mechanism: nothing forced the model to actually invoke the next skill rather than improvise a similar interview from the one-line description already in its skill listing. Caught live when a real onboarding conversation reached the hand-off point and it wasn't obvious whether the agent would call the Skill tool for interview-career or just wing it. Reworded all three hand-offs (interview-about-me, interview-career, interview-search) to explicitly say 'invoke the X skill (the Skill tool, not a paraphrase from memory)', and updated AGENTS.md's chain description to match.
<!-- SECTION:DESCRIPTION:END -->

## Acceptance Criteria
<!-- AC:BEGIN -->
- [x] #1 interview-about-me, interview-career, and interview-search each explicitly instruct invoking the next skill via the Skill tool rather than describing it as 'following its instructions'
- [x] #2 AGENTS.md's chain description states the hand-off is a skill invocation, not a paraphrase
<!-- AC:END -->

## Final Summary

<!-- SECTION:FINAL_SUMMARY:BEGIN -->
Reworded the hand-off line in interview-about-me, interview-career, and interview-search to explicitly say 'invoke the <name> skill (the Skill tool, not a paraphrase from memory)' with a short parenthetical on why (skill-specific specifics like the past_resumes/ check are easy to drift from if improvised). Updated AGENTS.md's chain description to say the hand-off invokes the next skill rather than 'continuing in the same conversation following its instructions.'
<!-- SECTION:FINAL_SUMMARY:END -->
