---
id: TASK-8
title: Mark shipped placeholder content .example and clean it up automatically
status: Done
assignee: []
created_date: '2026-08-13 01:11'
updated_date: '2026-08-13 01:11'
labels: []
dependencies: []
references:
  - AGENTS.md
  - justfile
ordinal: 16000
---

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
A real test run of the onboarding flow left the shipped example-co application (and its TODO.md reminder to delete it) sitting untouched after career-timeline.md/job-search.md were filled in for real — nothing in the loop ever checked back on it, so template scaffolding just lingered indefinitely. Rename the one markdown file that's placeholder content (applications/2026-01-example-co/opportunity.md) to opportunity.md.example, establishing a repo convention that shipped scaffolding is unmistakably marked and excluded from anything that scans for real opportunity.md files. Wire just get-started to detect the example-co directory once about_me.md/career-timeline.md/job-search.md all exist for real, and offer to delete it (and clear the stale TODO.md section) right then, instead of leaving it as a reminder nobody circles back to.
<!-- SECTION:DESCRIPTION:END -->

## Acceptance Criteria
<!-- AC:BEGIN -->
- [x] #1 applications/2026-01-example-co/opportunity.md is renamed to opportunity.md.example; its .typ/.pdf files keep their normal names so just compile/check/review still have something to run against out of the box
- [x] #2 AGENTS.md documents the *.example naming convention for shipped placeholder content
- [x] #3 just get-started, once about_me.md/career-timeline.md/job-search.md all exist, detects applications/2026-01-example-co and offers to delete it and clear TODO.md's matching section
<!-- AC:END -->

## Final Summary

<!-- SECTION:FINAL_SUMMARY:BEGIN -->
Renamed applications/2026-01-example-co/opportunity.md to opportunity.md.example, and updated its own text to explain the naming and point at the new automated cleanup. Added a '.example' naming convention bullet to AGENTS.md's Conventions section. Extended just get-started's fully-set-up branch: once about_me.md, career-timeline.md, and job-search.md all exist, it checks for applications/2026-01-example-co and offers (read -rp) to launch a claude session that deletes it and removes the stale '## Example Co.' section from TODO.md. Verified the rename doesn't break just check/provenance against the example (build tooling only globs .typ files, never reads opportunity.md's name), and exercised the get-started branch logic in an isolated temp dir with dummy files to confirm the prompt/exec fires only when all three real files exist and the example directory is still present.
<!-- SECTION:FINAL_SUMMARY:END -->
