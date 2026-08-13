---
id: TASK-5
title: Add just recipes with pre-built prompts for the main Claude Code interactions
status: Done
assignee: []
created_date: '2026-08-12 23:19'
updated_date: '2026-08-13 00:31'
labels: []
dependencies: []
references:
  - GETTING_STARTED.md
ordinal: 13000
---

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
GETTING_STARTED.md now narrates the main loop (build career-timeline.md, build job-search.md, start an application, review) but every step requires the user to freehand a prompt to Claude Code. Give each step a canned entry point: a prompts/ folder holding the prompt text for each interaction (career-timeline interview, job-search interview, new-application kickoff, past-resume ingestion), and just recipes that invoke claude with the matching prompt file, following the existing 'review' recipe's pattern (exec claude --model --permission-mode "<prompt>", overridable model/mode args). Add a 'just get-started' recipe on top: verify Typst/just/claude are installed (and offer to run install-fonts/install-hooks if not done yet), then kick off the first missing interaction — the career-timeline interview if career-timeline.md doesn't exist yet, otherwise the next step in the loop. This is a lightweight, justfile-based complement to the guided-interview vision in TASK-3's CLI-harness epic (TASK-3.2, TASK-3.3, TASK-3.6, TASK-3.8) -- it doesn't require building a custom CLI, just wires up canned prompts through the tool the project already assumes (Claude Code). Update GETTING_STARTED.md to reference the new recipes at each relevant step.
<!-- SECTION:DESCRIPTION:END -->

## Acceptance Criteria
<!-- AC:BEGIN -->
- [x] #1 A prompts/ folder exists with one prompt file per main interaction: career-timeline interview, job-search interview, new-application kickoff, and past-resume ingestion
- [x] #2 just recipes exist to run each prompt through Claude Code (e.g. just interview-career, just interview-search, just new-application <company>), following the model/mode override pattern used by the existing review recipe
- [x] #3 just get-started checks that Typst, just, and claude are installed, offers to run install-fonts/install-hooks if not already done, and then launches the appropriate next interaction based on what already exists in the project (career-timeline.md, job-search.md)
- [x] #4 GETTING_STARTED.md is updated to point to the new recipes at each step instead of only describing free-form prompting
- [x] #5 justfile recipes are organized into named groups ([group('...')] attributes) so 'just --list' reads as setup / build / claude sections instead of one flat list
- [x] #6 'just help' (and bare 'just') prints a short getting-started hint plus a pointer to 'just --list' for the full recipe menu
<!-- AC:END -->

## Implementation Notes

<!-- SECTION:NOTES:BEGIN -->
User asked to group the justfile and add a help/default recipe before the prompts/get-started work lands; folding into this task since it's the same justfile-ergonomics effort. Implementing groups + help now; prompts/ folder and interview recipes still to come.

Grouped justfile recipes with [group('setup'|'build'|'claude')] and added a help/default recipe. Note: just's doc-comment picker only takes the single comment line immediately above a recipe (multi-line comment blocks got truncated to their last line in --list), so used explicit [doc('...')] attributes for a clean one-line summary on multi-line-commented recipes, keeping the fuller prose comments in place above as source-only documentation. Verified with 'just --list', bare 'just', and a real compile/check/provenance run against the example application.

Added prompts/career-timeline-interview.md, prompts/job-search-interview.md, prompts/new-application.md, prompts/past-resume-ingestion.md, and matching just recipes (interview-career, interview-search, ingest-resumes, new-application) in the [claude] group, same model/mode override pattern as review. new-application takes a company name and appends it to the prompt via a bash $'\n\n' literal (just's own lexer errors on a raw multi-line string spanning recipe lines, so built the two-line prompt in one shell statement instead). Updated GETTING_STARTED.md to point to the new recipes at each relevant step and added them to the build command reference table. Verified with 'just --list' and 'just -n' dry-runs of interview-career and new-application. AC #3 (just get-started) still open.
<!-- SECTION:NOTES:END -->

## Final Summary

<!-- SECTION:FINAL_SUMMARY:BEGIN -->
Added prompts/ (career-timeline-interview.md, job-search-interview.md, new-application.md, past-resume-ingestion.md) and matching just recipes in a new [claude] group (interview-career, interview-search, ingest-resumes, new-application), following the review recipe's model/mode override pattern. Grouped the whole justfile into setup/build/claude via [group(...)] attributes, replaced the dangerous bare-'just'-runs-install-fonts default with a help recipe, and added 'just get-started' (setup group) which checks Typst/just/claude are on PATH, offers to run install-fonts/install-hooks if not done, and launches whichever interview (career-timeline or job-search) is still missing, or points to new-application if both exist. GETTING_STARTED.md updated throughout to reference the new recipes. Verified via 'just --list', 'just -n' dry-runs, and running the get-started logic directly against this repo's real state (fonts/hooks already installed, no career-timeline.md yet) to confirm it skips the two setup prompts and correctly picks the career interview as next.
<!-- SECTION:FINAL_SUMMARY:END -->
