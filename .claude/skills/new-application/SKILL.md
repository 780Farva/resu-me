---
name: new-application
description: Start a new application for a named company, following the "New application checklist" in AGENTS.md — create the applications/ directory, opportunity.md, and resume .typ, pulling contact fields from about_me.md and stories from career-timeline.md. Use when the user wants to apply to a job, shares a posting, or asks to set up a new application.
---

# New application

The company or opportunity is usually named in the invocation (e.g. `/new-application
Acme Corp`). Ask for whatever else is needed — the posting link or pasted text, comp if
known, referral status, anything already known about the employer — before writing
anything.

Read `career-timeline.md` and `about_me.md` first — both feed `opportunity.md` and the
resume. If either is missing, say so briefly and **invoke that skill directly**
(`interview-career` / `interview-about-me`, via the Skill tool) rather than suggesting
the user go run it themselves; this application can't be written without them, so it's
not a fork, just a prerequisite. Come back to `new-application` once they're done.

**Never invent or leave a placeholder for contact info in a resume `.typ`.** If a field
is genuinely still unknown even after `about_me.md` exists, ask the user for it directly
rather than writing a bracketed placeholder like `[ADD PHONE]` into `resume.with(...)` —
a placeholder that reaches a committed PDF is a resume nobody can be reached from.

Then:

1. Create `applications/<YYYY-MM>-<company>/`, dated by this month.
2. Write `opportunity.md`: the status line (`open`, today's date), the posting details,
   comp, referral status, employer research, and how the user's load-bearing stories
   from `career-timeline.md` should be framed for this employer specifically. Check
   `career-timeline.md`'s open questions for anything that needs resolving before this
   application ships, and flag it if so.
3. Write the resume `.typ`, importing `../../template.typ`, with `resume.with(...)`
   filled in from `about_me.md` — name, location, email, phone, links, and credentials
   if set.
4. Run `just compile <company-fragment>` and `just check <company-fragment>`.

If any open job-search task falls out of this (a follow-up to send, a question to
resolve), add it to `TODO.md` — not `opportunity.md`, which holds facts and decisions
only.
