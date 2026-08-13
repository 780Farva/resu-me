---
name: interview-about-me
description: Interview the user for the contact and identity fields that go on every resume and cover letter (name, credentials, location, email, phone, links) and draft or update about_me.md from the answers. Use when about_me.md doesn't exist yet, when a resume has placeholder contact info, or when the user wants to update a contact detail.
---

# Interview: about me

`about_me.md` holds the handful of fields every resume and cover letter needs verbatim —
exactly the arguments `resume()` and `letter()` in `template.typ` take: name,
credentials (optional — a degree or license, shown next to the title), location, email,
phone, and links (LinkedIn, GitHub, portfolio — bare `domain/path`, no `https://`).

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
`[ADD PHONE]`, or a name with a bracketed portion) and tell the user which ones still
have one. Offer to fill them in now that the real values exist.

Then check whether `career-timeline.md` exists. If it doesn't, `about_me.md` was the
first step in onboarding — ask whether to continue straight into building it now, and if
so, carry on in this same conversation following the `interview-career` skill's
instructions rather than telling the user to run anything separately.
