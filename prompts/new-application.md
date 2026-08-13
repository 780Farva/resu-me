Start a new application, following the "New application checklist" in AGENTS.md. The
company or opportunity is named below — ask me for whatever else you need (the posting
link or pasted text, comp if known, referral status, anything I already know about the
employer) before you start writing.

Read `career-timeline.md` first — if it doesn't exist yet, tell me and suggest running
`just interview-career` before continuing, since `opportunity.md` and the resume both
draw from it.

Then:

1. Create `applications/<YYYY-MM>-<company>/` dated by this month.
2. Write `opportunity.md`: the status line (`open`, today's date), the posting details,
   comp, referral status, employer research, and how my load-bearing stories from
   `career-timeline.md` should be framed for this employer specifically. Check
   `career-timeline.md`'s open questions for anything that needs resolving before this
   application ships, and flag it to me if so.
3. Write the resume `.typ`, importing `../../template.typ`.
4. Run `just compile <company-fragment>` and `just check <company-fragment>`.

If any open job-search task falls out of this (a follow-up to send, a question to
resolve), add it to `TODO.md` — not `opportunity.md`, which holds facts and decisions
only.
