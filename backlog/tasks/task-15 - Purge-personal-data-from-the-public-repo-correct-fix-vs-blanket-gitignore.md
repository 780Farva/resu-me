---
id: TASK-15
title: Purge personal data from the public repo; correct fix vs blanket gitignore
status: Done
assignee: []
created_date: '2026-08-13 03:49'
updated_date: '2026-08-13 03:50'
labels: []
dependencies: []
ordinal: 23000
---

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
A test run's about_me.md/career-timeline.md/job-search.md and a real application (applications/2026-08-sentry) got committed and pushed to this repo's public main branch. Purged it: since it was exactly the tip commit on both main and origin/main, reset --hard to the parent and force-pushed, restoring the shipped example-co scaffold and generic TODO.md that the offending commit had deleted/modified. First attempt at prevention was wrong: a repo-wide .gitignore for about_me.md/career-timeline.md/job-search.md/applications/*/grants/* would ship to every fork too, blocking the exact thing forks are supposed to do (commit their own real data in full). Reverted that. Correct fix: this repo's main is the shared public template and must stay free of personal data, but that's a property of *this* checkout, not something expressible in a file that ships to forks. Added a CLAUDE.local.md (gitignored, Claude Code's per-checkout personal-memory file, never forked or committed) instructing any session in this checkout to confirm before committing real personal data. Documented the fork-first model in README.md's Getting Started section.
<!-- SECTION:DESCRIPTION:END -->

## Acceptance Criteria
<!-- AC:BEGIN -->
- [x] #1 origin/main no longer contains the commit with real personal data; git log confirms only template/tooling history
- [x] #2 .gitignore contains no blanket rule against about_me.md/career-timeline.md/job-search.md/applications/grants -- only CLAUDE.local.md and the pre-existing entries
- [x] #3 CLAUDE.local.md exists, is gitignored, and instructs confirming before committing real personal data in this specific checkout
- [x] #4 README.md's Getting Started section states the fork-first model: personal data belongs in the user's own fork, not this shared template
<!-- AC:END -->

## Final Summary

<!-- SECTION:FINAL_SUMMARY:BEGIN -->
Purged the one commit with real personal data by resetting main/test to its parent and force-pushing (it was exactly the tip on both local and origin, so no deep history rewrite was needed). Reverted the blanket .gitignore rule I'd first added for about_me.md/career-timeline.md/job-search.md/applications/grants -- it would have shipped to every fork and blocked forks from committing their own real data, which is the intended, correct behavior there. Replaced it with CLAUDE.local.md (Claude Code's gitignored per-checkout personal-memory file, confirmed via docs to load automatically but never be shared/forked) instructing any session in this specific checkout to confirm before committing real personal data, since that's a property of this repo being the shared upstream template, not something a forked-and-shared file could correctly express. Documented the fork-first usage model in README.md's Getting Started section.
<!-- SECTION:FINAL_SUMMARY:END -->
