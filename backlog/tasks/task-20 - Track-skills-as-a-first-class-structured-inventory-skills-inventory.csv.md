---
id: TASK-20
title: Track skills as a first-class structured inventory (skills-inventory.csv)
status: Done
assignee:
  - '@claude'
created_date: '2026-09-28 16:53'
updated_date: '2026-09-30 21:32'
labels: []
dependencies: []
ordinal: 28000
---

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
Resume skills sections are currently re-picked from memory for each application, so a skill can spread across resumes with no evidence recorded behind it, and a true skill can drop off one resume but not another. Add skills-inventory.csv as a company-agnostic, structured inventory alongside career-timeline.md: one row per skill assessment, with columns skill, category, group, competency, assessed_on, earned_through, source, notes. Competency is the user's own rating on a documented 1-5 scale (aware, working, proficient, strong, expert), never inferred; blank means unrated. Ratings are dated and history is kept: a new rating is a new row with a later assessed_on, so the file shows competency changing over time, and the latest row is current. CSV rather than markdown on purpose, so the data can be queried and rendered by tooling.
<!-- SECTION:DESCRIPTION:END -->

## Acceptance Criteria
<!-- AC:BEGIN -->
- [x] #1 AGENTS.md Layout documents skills-inventory.csv: its columns, the 1-5 scale with a meaning for each level, the dated-history rule, and that resume skills lines are a selection from it
- [x] #2 An interview skill builds and updates the inventory, asking the user for each rating and recording where the skill was earned and its evidence
- [x] #3 new-application builds a resume's skills lines from the inventory instead of from scratch
- [x] #4 resume-review flags any skill on a resume that has no inventory row
- [x] #5 Onboarding seeds the inventory from past_resumes/ and career-timeline.md: ingest-resumes and the skills interview extract skills from old resumes as unrated rows citing the file they came from
- [x] #6 The onboarding chain ends with the skills interview: interview-search invokes it, it reviews the seeded register with the user, collects ratings, and offers a further interview to uncover skills not yet on record, then hands on to example cleanup and new-application
- [x] #7 skills-inventory.csv ships checked in with only its header row, and the onboarding chain treats a header-only file as not yet built
<!-- AC:END -->

## Implementation Plan

<!-- SECTION:PLAN:BEGIN -->
1. New interview-skills skill: seed from career-timeline.md and past_resumes/, review by category, collect user ratings as dated rows, offer an uncovering interview, then run the onboarding-complete tail.
2. interview-search hands off to interview-skills when skills-inventory.csv is empty, instead of ending onboarding itself.
3. ingest-resumes adds skills from old resumes to the inventory as unrated rows.
4. interview-career notes that listed skills are left for the skills step.
5. just interview-skills recipe; get-started gains a skills-inventory.csv step.
6. AGENTS.md: skill list and onboarding chain description.
7. Ship skills-inventory.csv with only its header row.
8. new-application picks a resume's skills lines from the inventory; resume-review flags skills with no row or weak evidence.
<!-- SECTION:PLAN:END -->

## Implementation Notes

<!-- SECTION:NOTES:BEGIN -->
2026-09-28: new interview-skills skill (seed from career-timeline.md and past_resumes/, category-by-category review, user-confirmed dated ratings, optional uncovering interview, onboarding-complete tail). interview-search now hands off to it; ingest-resumes adds old-resume skills as unrated rows; interview-career leaves skills lists to it. just interview-skills recipe and a get-started step. AGENTS.md (layout entry with columns and scale, skill list, chain), GETTING_STARTED.md (new step 5), README.md.

2026-09-28: added a group column after category. category stays broad; group optionally names an umbrella skill that is itself a row (Loki -> Observability), so a resume can list either granular tools or the umbrella. AGENTS.md and interview-skills describe it.

2026-09-30: replaced the planned skills-inventory.csv.example (fictional rows) with a header-only skills-inventory.csv checked in, so the column shape is fixed in the repo rather than written from scratch by the interview. Onboarding checks now test for rows below the header instead of the file's existence. Still open: new-application selecting from the inventory (AC3), resume-review flagging unbacked skills (AC4).

2026-09-30: new-application now reads skills-inventory.csv (invoking interview-skills if it's empty) and picks the skills lines from it by current rating, choosing tool-level or umbrella-level to suit the reader; a skill with no row gets one, with evidence, before it goes on. resume-review reads the inventory in Phase 0, flags skills in the skills lines or built into bullets that have no row (and, more softly, ones rated 1, unrated, or backed only by an old resume), and in Phase 4 records confirmed skills as rows and re-ratings as new rows. AGENTS.md checklist and README updated. Checked: skill and doc edits reviewed by hand; no automated tests cover skill prose.
<!-- SECTION:NOTES:END -->

## Final Summary

<!-- SECTION:FINAL_SUMMARY:BEGIN -->
Added skills-inventory.csv, a header-only CSV checked into the repo, as a dated, user-rated register of every skill a resume can list, with a group column for umbrella skills. A new interview-skills skill seeds it from career-timeline.md and past_resumes/, reviews it by category and collects ratings; it closes the onboarding chain. ingest-resumes adds old-resume skills as unrated rows, new-application picks each resume's skills lines from the inventory, and resume-review flags skills with no row or weak evidence. Documented in AGENTS.md, README.md and GETTING_STARTED.md, with a just interview-skills recipe and a get-started step. Verified: just --list parses, the empty-inventory check handles header-only, missing and populated files, and the example resume compiles.
<!-- SECTION:FINAL_SUMMARY:END -->
