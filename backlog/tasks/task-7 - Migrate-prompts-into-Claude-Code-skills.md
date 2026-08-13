---
id: TASK-7
title: Migrate prompts/ into Claude Code skills
status: Done
assignee: []
created_date: '2026-08-13 00:55'
updated_date: '2026-08-13 00:59'
labels: []
dependencies:
  - TASK-5
ordinal: 15000
---

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
The four interaction recipes added in TASK-5 (interview-career, interview-search, ingest-resumes, new-application) invoke Claude Code by catting a plain prompt file from prompts/ as the initial message. The project already has one working mechanism for this — the resume-review skill under .claude/skills/, invoked as a slash command from the review recipe. Two mechanisms for the same job is inconsistent, and plain prompt files only work when the user goes through the just recipe — they don't get picked up if the user just describes what they want in an ad-hoc conversation. Convert each prompts/*.md file into a .claude/skills/<name>/SKILL.md (with a description Claude can match against organically), update the just recipes to invoke them as slash commands like review already does, and delete prompts/.
<!-- SECTION:DESCRIPTION:END -->

## Acceptance Criteria
<!-- AC:BEGIN -->
- [x] #1 prompts/ is removed; .claude/skills/interview-career, interview-search, ingest-resumes, and new-application each have a SKILL.md with frontmatter name+description
- [x] #2 The matching just recipes invoke the skill via slash command (exec claude ... "/interview-career") instead of catting a prompt file, same pattern as the existing review recipe
- [x] #3 AGENTS.md documents the full set of skills in one place
<!-- AC:END -->

## Final Summary

<!-- SECTION:FINAL_SUMMARY:BEGIN -->
Migrated all four prompts/*.md files into .claude/skills/<name>/SKILL.md (interview-career, interview-search, ingest-resumes, new-application), matching the existing resume-review skill's frontmatter (name + description) and prose-instruction style, rewritten from user-voice prompt text into agent-facing instructions. Deleted prompts/. Updated the matching just recipes to invoke each skill as a slash command (exec claude ... "/interview-career") instead of catting a file, same pattern review already used. Added a new 'Claude Code skills' section to AGENTS.md listing all five skills in one place (including the new interview-about-me from TASK-6), replacing the narrower 'Reviewing an existing application' section. Verified all five skills are picked up by the Skill tool listing and that just --list / just -n dry-runs still construct the right claude invocations.
<!-- SECTION:FINAL_SUMMARY:END -->
