---
id: TASK-11
title: >-
  Add a conversational-style rule and stop asking permission for the obvious
  next step
status: Done
assignee: []
created_date: '2026-08-13 02:09'
updated_date: '2026-08-13 02:09'
labels: []
dependencies:
  - TASK-9
ordinal: 19000
---

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
A real onboarding conversation surfaced two tone problems: the agent narrated its own mechanism ('I grepped the .typ files for placeholders', 'Placeholder check:', 'recorded the missing phone as a deliberate omission rather than a blank') instead of just stating outcomes, and it stopped to ask 'want me to continue?' at an onboarding hand-off where the next step was the obvious one, not a real decision. Added a new AGENTS.md section (Conversational style) establishing both rules generally, since they'll recur across every skill, not just interview-about-me. Updated the interview-about-me -> interview-career and interview-career -> interview-search hand-offs to state briefly what's next and invoke the skill directly instead of asking permission first; left the interview-search -> new-application hand-off and the example-co deletion offer as real questions, since those need a company name or a delete confirmation respectively.
<!-- SECTION:DESCRIPTION:END -->

## Acceptance Criteria
<!-- AC:BEGIN -->
- [x] #1 AGENTS.md has a Conversational style section: no narrating the mechanism, don't ask permission for an unambiguous next step, keep responses proportionate
- [x] #2 interview-about-me's fix-the-placeholders step is stated as something done, not offered, and its hand-off to interview-career proceeds without asking permission
- [x] #3 interview-career's hand-off to interview-search proceeds without asking permission
<!-- AC:END -->

## Final Summary

<!-- SECTION:FINAL_SUMMARY:BEGIN -->
Added a Conversational style section to AGENTS.md (placed between Writing style and Claude Code skills) covering: don't narrate the mechanism (state outcomes plainly, not grep results or internal record-keeping decisions), don't hand back a decision that isn't one (take the obvious next step and say so briefly, rather than asking 'want me to continue?'), and keep responses proportionate. Updated interview-about-me: the placeholder-fill step is now framed as something done automatically, not offered, and its hand-off to interview-career states the move and invokes the skill without asking first. Same fix for interview-career's hand-off to interview-search. Left interview-search's hand-offs (example-co deletion, new-application) as real questions since they involve a delete confirmation and a missing piece of information (the company name) respectively — consistent with the new rule's carve-out for actual decisions.
<!-- SECTION:FINAL_SUMMARY:END -->
