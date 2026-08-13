---
name: interview-career
description: Interview the user about their work history and draft or update career-timeline.md — the company-agnostic career record every resume draws from (verified timeline, load-bearing stories, current focus, open questions). Use when career-timeline.md doesn't exist yet, or the user wants to add a new story, project, or correction to it.
---

# Interview: career timeline

Build or update `career-timeline.md` — see AGENTS.md for exactly what belongs in it
(verified timeline, load-bearing stories, current focus, open questions).

First, check whether `career-timeline.md` already exists.

**If it doesn't exist yet:** before asking anything else, check `past_resumes/`. If it
already has files in it, read them first so the user isn't repeating what's already on
paper. If it's empty, **ask the user directly** whether they have any old resumes lying
around — they can paste the text right into the conversation, or save the file(s) into
`past_resumes/` and say so — before assuming there's nothing to work from. Don't silently
check an empty folder and announce "starting from scratch"; the user has no way to know
that folder exists unless you tell them.

Then interview the user about their work history, one seam at a time — don't dump a wall
of questions. Go role by role: what the company did, what they actually did there, the
two or three stories from that role worth telling across applications (with real numbers
and specifics, not summaries), and anything unresolved that would affect how a resume
frames it (title conflicts, dates they're unsure of, how to describe a role that doesn't
map cleanly to a title). Ask "what did you do" rather than leading questions. If a past
resume surfaced material, use the interview to fill the gaps it can't carry (context,
numbers, the "why") instead of re-deriving what it already states. Draft the file as you
go rather than waiting until the end, so the user can correct the shape early.

**If `career-timeline.md` already exists:** read it first, then ask what's changed or
what's new — a project that's since shipped, a number that's now citable, a correction
to something already written. Fold updates in directly; mark any correction to
previously-wrong material with a ⚠️ and the date, per the resume-review skill's
convention, so a future session doesn't reintroduce the same error.

Either way, end by stating plainly what's still thin or unresolved, so the user knows
what to come back to.

Then check whether `job-search.md` exists. If it doesn't, say briefly that you're moving
into it and **invoke the `interview-search` skill** (the Skill tool, not a paraphrase
from memory). Don't stop to ask permission first; this is the expected next step, not a
fork.
