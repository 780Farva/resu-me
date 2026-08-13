---
id: TASK-6
title: Add about_me.md for contact/identity info and use it in new-application
status: Done
assignee: []
created_date: '2026-08-13 00:55'
updated_date: '2026-08-13 00:59'
labels: []
dependencies: []
references:
  - GETTING_STARTED.md
  - AGENTS.md
ordinal: 14000
---

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
just get-started successfully launched the career-timeline interview but nothing ever asked for or persisted the contact/identity fields template.typ's resume() and letter() need (name, credentials, location, email, phone, links) — a real test run left a resume committed with placeholders like 'Jules [SURNAME]' and '[ADD PHONE]' baked into the .typ. Add an about_me.md file (short field list, not a narrative) as the single source for these fields, an interview-about-me skill/recipe to build and update it, and make the new-application flow read from it and refuse to write a placeholder into a resume .typ — asking for a missing field instead. Wire it into just get-started (checked first, since every resume needs it) and document it in AGENTS.md, README.md, and GETTING_STARTED.md.
<!-- SECTION:DESCRIPTION:END -->

## Acceptance Criteria
<!-- AC:BEGIN -->
- [x] #1 about_me.md's shape (name, credentials, location, email, phone, links) is documented in AGENTS.md's Layout section
- [x] #2 An interview-about-me skill + just recipe exists that builds about_me.md on first run and asks what's changed on subsequent runs
- [x] #3 just get-started checks for about_me.md before career-timeline.md/job-search.md and launches interview-about-me first if it's missing
- [x] #4 The new-application skill reads about_me.md and fills resume.with(...)'s contact fields from it, and explicitly must not write a bracketed placeholder into a committed .typ — it asks for a missing field instead
- [x] #5 GETTING_STARTED.md and README.md mention about_me.md at the appropriate step
<!-- AC:END -->

## Final Summary

<!-- SECTION:FINAL_SUMMARY:BEGIN -->
Added about_me.md as the single source for name/credentials/location/email/phone/links, documented in AGENTS.md's Layout section right alongside career-timeline.md. Added an interview-about-me skill + just recipe (short direct exchange, not a long interview, since these are memorized facts) that also greps committed resume .typ files for bracketed placeholders and offers to fill them in. just get-started now checks about_me.md before career-timeline.md/job-search.md, since it's the most fundamental thing every resume needs. Rewrote the new-application skill to read about_me.md for contact fields and explicitly forbid writing a placeholder into a committed .typ — it must ask for a missing field instead of leaving a bracket, which is the exact bug the user hit (a real test run left 'Jules [SURNAME]' and '[ADD PHONE]' in a committed resume). Updated GETTING_STARTED.md (new step 2, renumbered the rest) and README.md's Layout list and intro paragraph.
<!-- SECTION:FINAL_SUMMARY:END -->
