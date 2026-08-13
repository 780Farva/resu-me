---
name: interview-career
description: Interview the user about their work history and draft or update career-timeline.md — the company-agnostic career record every resume draws from (verified timeline, load-bearing stories, current focus, open questions). Use when career-timeline.md doesn't exist yet, or the user wants to add a new story, project, or correction to it.
---

# Interview: career timeline

Build or update `career-timeline.md` — see AGENTS.md for exactly what belongs in it
(verified timeline, load-bearing stories, current focus, open questions).

First, check whether `career-timeline.md` already exists.

**If it doesn't exist yet:** interview the user about their work history, one seam at a
time — don't dump a wall of questions. Go role by role: what the company did, what they
actually did there, the two or three stories from that role worth telling across
applications (with real numbers and specifics, not summaries), and anything unresolved
that would affect how a resume frames it (title conflicts, dates they're unsure of, how
to describe a role that doesn't map cleanly to a title). Ask "what did you do" rather
than leading questions. Draft the file as you go rather than waiting until the end, so
the user can correct the shape early.

Before asking questions, check whether `past_resumes/` has anything in it — if so, read
it first so the user isn't repeating what's already on paper; use the interview to fill
the gaps (context, numbers, the "why" a resume bullet can't carry) instead of
re-deriving what a resume already states.

**If `career-timeline.md` already exists:** read it first, then ask what's changed or
what's new — a project that's since shipped, a number that's now citable, a correction
to something already written. Fold updates in directly; mark any correction to
previously-wrong material with a ⚠️ and the date, per the resume-review skill's
convention, so a future session doesn't reintroduce the same error.

Either way, end by stating plainly what's still thin or unresolved, so the user knows
what to come back to.

Then check whether `job-search.md` exists. If it doesn't, ask whether to continue
straight into building it now, and if so, **invoke the `interview-search` skill** (the
Skill tool, not a paraphrase from memory) rather than telling the user to run anything
separately.
