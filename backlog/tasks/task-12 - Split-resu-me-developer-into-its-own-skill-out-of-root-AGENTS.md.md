---
id: TASK-12
title: 'Split resu-me-developer into its own skill, out of root AGENTS.md'
status: Done
assignee: []
created_date: '2026-08-13 02:24'
updated_date: '2026-08-13 02:24'
labels: []
dependencies:
  - TASK-9
ordinal: 20000
---

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
Root AGENTS.md/CLAUDE.md loads unconditionally for every session in this repo, including the onboarding interview skills that never touch this repo's own tooling. It carried a CRITICAL_INSTRUCTION mandating a Backlog.md check before every single request, so running just get-started's interview-about-me made its first move a backlog instructions overview check -- pure noise for someone building their resume. Root AGENTS.md should describe the resume-building product only; developing resu-me's own tooling is a different job and now has its own skill. Moved the Backlog.md Workflow block, the justfile's internal mechanics (_resolve, _stamp, provenance hashing, sticky blocks), and template.typ's structural rationale into a new resu-me-developer skill, whose description routes to it by intent (developing the justfile/template.typ/skills) rather than requiring a backlog/ file to already be open. AGENTS.md keeps everything the product skills actually need: Layout, application lifecycle, conventions, writing/conversational style, the skills list, and the checklist.
<!-- SECTION:DESCRIPTION:END -->

## Acceptance Criteria
<!-- AC:BEGIN -->
- [x] #1 The Backlog.md Workflow CRITICAL_INSTRUCTION block is removed from AGENTS.md and lives in .claude/skills/resu-me-developer/SKILL.md instead
- [x] #2 resu-me-developer's description explicitly routes on developing resu-me's own tooling and explicitly excludes interviews/application work, so it doesn't compete with the product skills
- [x] #3 AGENTS.md's justfile/Build provenance Layout entries are trimmed to what a product skill needs (what a command does), with mechanism detail (_resolve, _stamp, provenance hashing internals) moved to the dev skill
- [x] #4 AGENTS.md's Claude Code skills section distinguishes the product skills from resu-me-developer
<!-- AC:END -->

## Final Summary

<!-- SECTION:FINAL_SUMMARY:BEGIN -->
Created .claude/skills/resu-me-developer/SKILL.md holding the Backlog.md Workflow instructions (verbatim content, reworded from 'every user request' to 'every request that falls under this skill'), the justfile's internal mechanics (_resolve/_stamp, provenance hashing rationale, sticky-block/just-check backstop, install-hooks wiring, [doc(...)] attribute gotcha), and template.typ's structural rationale (ATS-safety single-column choice, shared contact-field shape between resume()/letter(), signoff()'s unsigned-by-construction guarantee). Removed the CRITICAL_INSTRUCTION block entirely from AGENTS.md. Trimmed AGENTS.md's backlog/, justfile, and Build provenance Layout entries down to what a product skill needs, each pointing at resu-me-developer for the rest. Added a closing note to the Claude Code skills section distinguishing the five product skills from resu-me-developer. This relies on Claude Code's skill-routing (description-match) rather than the subdirectory-CLAUDE.md contextual-loading mechanism considered earlier, so it fires on intent (e.g. 'add a just recipe') without first needing to read a file under backlog/ — confirmed via a claude-code-guide lookup that root CLAUDE.md loads unconditionally while subdirectory CLAUDE.md only loads on file access, which is exactly the loophole a description-routed skill avoids.
<!-- SECTION:FINAL_SUMMARY:END -->
