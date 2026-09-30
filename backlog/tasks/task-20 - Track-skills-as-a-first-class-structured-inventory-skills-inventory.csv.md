---
id: TASK-20
title: Track skills as a first-class structured inventory (skills-inventory.csv)
status: In Progress
assignee:
  - '@claude'
created_date: '2026-09-28 16:53'
updated_date: '2026-09-30 20:31'
labels: []
dependencies: []
ordinal: 28000
---

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
Resume skills sections are currently re-picked from memory for each application, so a skill can spread across resumes with no evidence recorded behind it, and a true skill can drop off one resume but not another. Add skills-inventory.csv as a company-agnostic, structured inventory alongside career-timeline.md: one row per skill assessment, with columns skill, category, competency, assessed_on, earned_through, source, notes. Competency is the user's own rating on a documented 1-5 scale (aware, working, proficient, strong, expert), never inferred; blank means unrated. Ratings are dated and history is kept: a new rating is a new row with a later assessed_on, so the file shows competency changing over time, and the latest row is current. CSV rather than markdown on purpose, so the data can be queried and rendered by tooling.
<!-- SECTION:DESCRIPTION:END -->

## Acceptance Criteria
<!-- AC:BEGIN -->
- [x] #1 AGENTS.md Layout documents skills-inventory.csv: its columns, the 1-5 scale with a meaning for each level, the dated-history rule, and that resume skills lines are a selection from it
- [ ] #2 A shipped placeholder, skills-inventory.csv.example, shows the format with fictional rows, per the .example convention
- [x] #3 An interview skill builds and updates the inventory, asking the user for each rating and recording where the skill was earned and its evidence
- [ ] #4 new-application builds a resume's skills lines from the inventory instead of from scratch
- [ ] #5 resume-review flags any skill on a resume that has no inventory row
- [x] #6 Onboarding seeds the inventory from past_resumes/ and career-timeline.md: ingest-resumes and the skills interview extract skills from old resumes as unrated rows citing the file they came from
- [x] #7 The onboarding chain ends with the skills interview: interview-search invokes it, it reviews the seeded register with the user, collects ratings, and offers a further interview to uncover skills not yet on record, then hands on to example cleanup and new-application
<!-- AC:END -->

## Implementation Plan

<!-- SECTION:PLAN:BEGIN -->
1. New interview-skills skill: seed from career-timeline.md and past_resumes/, review by category, collect user ratings as dated rows, offer an uncovering interview, then run the onboarding-complete tail.
2. interview-search hands off to interview-skills when skills-inventory.csv is missing, instead of ending onboarding itself.
3. ingest-resumes adds skills from old resumes to the inventory as unrated rows.
4. interview-career notes that listed skills are left for the skills step.
5. just interview-skills recipe; get-started gains a skills-inventory.csv step.
6. AGENTS.md: skill list and onboarding chain description.
Remaining for later: .example file, new-application selecting from the inventory, resume-review flagging unbacked skills.
<!-- SECTION:PLAN:END -->

## Implementation Notes

<!-- SECTION:NOTES:BEGIN -->
2026-09-28: new interview-skills skill (seed from career-timeline.md and past_resumes/, category-by-category review, user-confirmed dated ratings, optional uncovering interview, onboarding-complete tail). interview-search now hands off to it; ingest-resumes adds old-resume skills as unrated rows; interview-career leaves skills lists to it. just interview-skills recipe and a get-started step. AGENTS.md (layout entry with columns and scale, skill list, chain), GETTING_STARTED.md (new step 5), README.md. Still open: .example file (AC2), new-application selecting from the inventory (AC4), resume-review flagging unbacked skills (AC5).

2026-09-28: added a group column after category. category stays broad; group optionally names an umbrella skill that is itself a row (Loki -> Observability), so a resume can list either granular tools or the umbrella. AGENTS.md and interview-skills describe it.
<!-- SECTION:NOTES:END -->
