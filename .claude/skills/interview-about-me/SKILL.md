---
name: interview-about-me
description: Interview the user for the contact and identity fields that go on every resume and cover letter (name, credentials, location, email, phone, profile links) and draft or update about_me.md from the answers. Use when about_me.md doesn't exist yet, when a resume has placeholder contact info, or when the user wants to update a contact detail.
---

# Interview: about me

`about_me.md` holds the handful of fields every resume and cover letter needs verbatim —
exactly the arguments `resume()` and `letter()` in `template.typ` take: name,
credentials (optional — a degree or license, shown next to the title), location, email,
phone, and links.

**Links means personal/social profile links only** — LinkedIn, a GitHub *profile* (not a
specific repo), Instagram, a personal site that serves as your professional home page.
Bare `domain/path`, no `https://`. A project's own URL or an employer's site is a
different thing entirely — that belongs with the relevant entry in `career-timeline.md`,
not the resume header, and is `interview-career`'s job to capture, not this skill's.

**If `about_me.md` doesn't exist yet:** ask for each field directly. This is short,
factual information, not a story, so there's no need to interview at length — but do
confirm the exact form each should take on the page (how the user wants their name to
read, which links they want shown), since that's what gets typed into every resume
header verbatim.

**If it already exists:** read it back and ask what's changed — a new phone number, a
new link worth adding, a location that's moved.

Write the file as a short, unambiguous field list — this is data other skills parse, not
prose. Once it's written (or updated), grep committed resume `.typ` files under
`applications/` and `grants/` for placeholder markers (a bracketed value like
`[ADD PHONE]`, or a name with a bracketed portion). If any exist, fill them in now that
the real values exist — this is an unambiguous fix, not a decision to check on — and say
which files changed.

Then check whether `career-timeline.md` exists. If it doesn't, `about_me.md` was the
first step in onboarding — say briefly that you're moving into it and **invoke the
`interview-career` skill** (the Skill tool, not a paraphrase from memory — its
instructions have specifics, like checking `past_resumes/` first, that are easy to drift
from if improvised). Don't stop to ask permission first; this is the expected next step,
not a fork.
