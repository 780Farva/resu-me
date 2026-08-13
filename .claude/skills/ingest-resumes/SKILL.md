---
name: ingest-resumes
description: Read past_resumes/ and fold anything missing into career-timeline.md, asking for the context behind each claim rather than copying resume bullets verbatim. Use when the user adds a file to past_resumes/, or asks to reconcile old resumes with career-timeline.md.
---

# Ingest past resumes

Look in `past_resumes/` and diff what's there against `career-timeline.md`, folding in
anything that's in an old resume but missing from the timeline.

If `past_resumes/` is empty or doesn't exist, say so and stop — there's nothing to
ingest.

If `career-timeline.md` doesn't exist yet, say so briefly and **invoke the
`interview-career` skill** directly (via the Skill tool) instead — it covers this same
ingestion as part of the interview, so there's no separate step to hand back to the
user.

Otherwise, for each past resume: read it, and for every claim, project, or number that
isn't already reflected in `career-timeline.md`, ask for the context a resume bullet
can't carry (what the number means, who else was involved, why it mattered) rather than
copying the bullet text in verbatim — a resume claim is a compressed version of the real
story, and the timeline should hold the real story. Flag anything that looks like an
overstatement worth double-checking rather than silently trusting the old resume.

End with a short summary of what got added and what, if anything, in the old resumes
looked questionable enough to flag.
