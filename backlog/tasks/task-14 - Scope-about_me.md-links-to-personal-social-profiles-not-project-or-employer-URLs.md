---
id: TASK-14
title: >-
  Scope about_me.md links to personal/social profiles, not project or employer
  URLs
status: Done
assignee: []
created_date: '2026-08-13 03:02'
updated_date: '2026-08-13 03:02'
labels: []
dependencies:
  - TASK-6
ordinal: 22000
---

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
A real test run had the user tell interview-about-me they had no links, then later mention verylift.com (a personal project), github.com/780Farva/resu-me (a specific repo, not their GitHub profile), and lucidbox.ca (their consulting company) while describing their work history to interview-career. The agent caught the contradiction with the earlier 'no links' answer but suggested adding all three URLs to the resume header, conflating profile links with project/employer URLs that belong with the relevant career-timeline.md entry instead. Tightened about_me.md's links definition everywhere it's described (AGENTS.md, interview-about-me) to personal/social profile links only, and added guidance to interview-career for handling URLs that come up mid-interview: capture project/employer URLs with the entry they belong to, and only flag a genuine profile link (distinguishing a profile from a specific repo path) against about_me.md.
<!-- SECTION:DESCRIPTION:END -->

## Acceptance Criteria
<!-- AC:BEGIN -->
- [x] #1 AGENTS.md's about_me.md Layout bullet and interview-about-me's SKILL.md both scope links to personal/social profile links, explicitly excluding project and employer URLs
- [x] #2 interview-career's SKILL.md instructs capturing project/employer URLs with their career-timeline.md entry, and only flagging a genuine profile link against about_me.md (not project/employer URLs mentioned alongside it)
<!-- AC:END -->

## Final Summary

<!-- SECTION:FINAL_SUMMARY:BEGIN -->
Tightened the definition of about_me.md's 'links' field in three places: AGENTS.md's Layout bullet, interview-about-me's SKILL.md (frontmatter description and body), both now scoped explicitly to personal/social profile links (LinkedIn, GitHub profile, a personal home-page site) and explicitly excluding project/employer URLs. Added a paragraph to interview-career's SKILL.md for handling URLs that come up mid-interview: capture a project or employer URL with the career-timeline.md entry it belongs to, never suggest it for the resume header, and only flag a genuine profile link (distinct from a specific repo path) as worth reconciling against about_me.md's existing answer.
<!-- SECTION:FINAL_SUMMARY:END -->
