---
name: interview-skills
description: Build or update skills-inventory.csv, the structured and dated skills register every resume's skills section draws from. Seed it from career-timeline.md and past_resumes/, review it with the user, collect their own competency ratings, and offer an interview to uncover skills not yet on record. Use when skills-inventory.csv is still empty (just its header row), when the user mentions a skill that isn't in it, or when they want to rate or re-rate a skill.
---

# Interview: skills inventory

Build or update `skills-inventory.csv`. See AGENTS.md for its columns, the 1–5
competency scale, and the dated-history rule. Every rating comes from the user. Never
infer one from a resume, a job title, or how often a skill appears.

`skills-inventory.csv` ships with its header row already in place. Keep that header
exactly as it is, since tools read the columns by name. Write the rows as real CSV: one
row per line, with any field that
contains a comma, quote, or newline quoted. Use a CSV library to write it rather than
string concatenation, because notes and evidence often contain commas. Use `\n` line
endings (in Python, `csv.writer(f, lineterminator="\n")`), not the CSV default of `\r\n`.

First, check whether `skills-inventory.csv` has any rows below the header.

## If it's empty: seed it, then review it

**Seed before asking anything.** Read `career-timeline.md` and every file in
`past_resumes/`, and pull out every skill they show: languages, tools, platforms,
protocols and standards, domain knowledge, and the non-technical skills a resume rarely
lists but a role needed (sales, negotiation, hiring, managing subcontractors, running a
team's process). A skill shown by what someone did counts as much as one named in a
skills list.

For each skill, fill `earned_through` (the roles or projects it came from) and `source`
(the `career-timeline.md` section, or the resume file). Where a skill is a specific tool
or instance of a broader skill, set `group` to that umbrella skill (Loki → Observability,
WireGuard → Networking), and make sure the umbrella has its own row. Leave `group` blank
when nothing natural contains it; don't invent umbrellas to fill the column. Leave `competency` and
`assessed_on` blank. If a skill appears only on an old resume and nowhere in
`career-timeline.md`, set `source` to that file and say so in `notes`, so it reads as
unconfirmed rather than settled.

If `past_resumes/` is empty and the user hasn't already been asked about old resumes this
session, ask whether they have any. They can paste the text in, or save files into
`past_resumes/`. An old resume's skills section is often the fastest way to seed this.

**Then review it with the user, one category at a time.** Don't show all the rows at
once. For each category, list its skills briefly and ask two things: is anything wrong or
overstated, and is anything missing. Fix rows as you go.

**Collect ratings.** Explain the scale once, briefly. Then ask for a rating per skill,
category by category. Record each one with today's date in `assessed_on`. When the user
describes a level in words rather than a number ("I'm great with it," "decent"), put
their words in `notes`, propose the number you think they mean, and record it only once
they confirm. A skill they'd rather not rate stays blank. That's fine, and better than a
guess.

**Offer to dig for more.** Once the seeded register has been reviewed, say that most
people's registers are missing skills they take for granted, and offer a short interview
to find them. If they say yes, work through angles like these, one at a time:

- For each role in `career-timeline.md`: what did they have to learn to do that job that
  they didn't know going in?
- What do people come to them for? What are they the go-to person on a team for?
- Fundamentals from their education or trade that they still rely on, even if they never
  list them.
- Tools they use every day and have stopped noticing.
- Skills from side projects, volunteering, or work outside their main career.
- Business and people skills: selling, negotiating, hiring, mentoring, writing, running
  meetings, managing budgets or vendors.

For each new skill, ask where they earned it or used it, so the row has real evidence.
If the story behind it isn't already in `career-timeline.md`, and it's substantial enough
to tell on a resume, add it there too.

## If it already has skills in it

Read it first, then ask what's changed: a new skill, a skill that's grown, one that's
gone stale.

- **A new rating is a new row** for the same skill, with today's date. Never edit or
  overwrite an earlier rating, because the history is the point of the file.
- A correction to a skill's evidence or notes (not its rating) can be an edit in place.
- If the user mentions a skill in passing that isn't in the file, add it and ask where it
  was earned.

## Ending

Summarise plainly: how many skills are on record, how many are rated, and which rows have
only weak evidence (an old resume and nothing else). Those are the ones to confirm before
a resume uses them.

Then, if `about_me.md`, `career-timeline.md`, and `job-search.md` all exist, onboarding
is complete. Check whether `applications/2026-01-example-co/` (marked by its
`opportunity.md.example`; see the `.example` convention in AGENTS.md) is still around.
If so, offer to delete it and remove the matching `## Example Co.` section from
`TODO.md` right now. Then ask whether to start a first real application. If the user
names a company, **invoke the `new-application` skill** (the Skill tool, not a paraphrase
from memory) rather than telling them to run anything separately.
