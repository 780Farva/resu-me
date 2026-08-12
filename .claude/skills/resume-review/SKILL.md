---
name: resume-review
description: Review a resume or grant application in the persona of the person who would actually screen it, then interview the candidate through the findings and incorporate them. Use when asked to review, critique, or improve an application in applications/ or grants/, or when asked to "put on a recruiter hat." Not for drafting a new application from scratch — see the new-application checklist in AGENTS.md for that.
---

# Resume review

A review is worth little on its own. The value is the **interview afterward**: run
correctly, the review finds a handful of real problems, and the interview finds twice
that much material nobody knew was missing. Budget accordingly — the review is the
opening move, not the deliverable.

Two classes of finding come out of the interview, and you are hunting both:

- **Overstatements.** Claims that collapse under a second question. These are urgent,
  because they fail an interview worse than they'd ever have failed a filter, and they
  propagate — the same sentence is usually sitting in three other resumes.
- **Omissions.** Things the candidate does so routinely they don't register as
  credentials. This is the larger category by far — things stay invisible until asked
  about directly.

## Phase 0 — read before opening your mouth

`AGENTS.md`, `career-timeline.md`, the application's `opportunity.md`, the resume source,
and any cover note. Also `TODO.md`, per the project convention.

## Phase 1 — find out what the employer actually is

Do this before reading the resume critically, because it changes what counts as a
finding. Web search and fetch: what they sell, who pays them, headcount, ownership,
recent contracts or announcements, the careers/culture page, leadership if findable.

**Distrust the obvious analogy.** A company that looks like "X for industry Y" on the
surface can turn out to be a services firm whose revenue is one anchor client's master
services agreement, or vice versa — that kind of single fact can change the framing of
the whole application. Ask specifically: product or services? One platform or per-client
environments? Who is the actual customer?

Then build a **specific persona** — the delivery lead or hiring manager who would screen
this, at that company, with that book of business — and write the review in their voice.
A generic recruiter produces generic findings.

**Write the research into that application's `opportunity.md` before going further**,
under a dated heading, with the sources listed. This is not optional bookkeeping: the
research is what the persona rests on, it's what the candidate needs for interview prep
weeks later, and if it stays in the conversation it is gone. Capture what the company
sells and to whom, scale and revenue if findable, the named clients, what their work
concretely looks like, culture-page language (and which of their stated values the
candidate's material actually hits), office and remote posture, and anything about
benefits or process that changes what to write or ask. Flag figures that will age. Note
explicitly that their own culture words must not be quoted back at them — name the
target, write in the candidate's own voice.

## Phase 2 — the review

Structure: who you are and what you're carrying, then a verdict, then what lands, then
ranked pushback. Rank by what would actually change a screening decision, not by how easy
the fix is.

Things that have earned their place on the checklist:

- **Is the stated motivation aimed at what this employer does?** The most common serious
  error. A genuine, specific enthusiasm pointed at work the company doesn't do reads
  worse than no enthusiasm at all — it looks like a form letter.
- **Does the resume answer the shape of the business?** A consulting firm needs evidence
  of client delivery. A product company needs something else. Internal-only framing of
  work that was actually client-facing is a recurring miss.
- **What does page one spend its space on?** Frequently the least relevant entry, because
  entries are ordered by date and the newest job isn't always the most relevant one.
- **Which bullets are suspiciously short?** Nine words for the most senior thing on the
  page is the tell. Interrogate the short ones.
- **Table stakes for the role that are simply absent** — for platform work: secrets,
  backup and restore, access control, networking, auditability. Some are honesty gaps and
  must stay off. Most are just omissions.
- **Hedge words standing in for numbers** ("substantially," "significantly").
- **Title-line seniority mismatch** against the posting.
- **Arithmetic the reader can do** — a "years of experience" claim that contradicts the
  dates on the same page.
- **Anything mirroring the posting's own phrasing.** Rewrite in the candidate's own voice.

## Phase 3 — the interview

**One note at a time.** Do not batch the whole review into a single wall of questions;
the first two get answered and the rest are lost. Bank each answer explicitly ("Banking
this: ...") before moving to the next, so the candidate can correct your reading.

**When an answer contains a factual correction, stop and chase it.** Corrections often
drop casually — "well, there wasn't *no* observability." That's the signal. Ask what was
actually there and what was theirs, in components, before writing anything.

**Follow up on the answers that get skipped.** Three of four questions get answered and
the conversation moves on. The skipped one is often the interesting one. Ask again.

**Ask "who did what," never "did you do X."** Leading questions get agreement. "Which of
these existed, which did you build, which did you rebuild" gets the truth.

Question seams that have paid off, roughly in order of yield:

- **Client-facing work.** Who outside the company did they deal with? Sales calls, site
  visits, escalations? Were they point on the difficult ones? Did they write to
  customers?
- **The team.** How many, inherited or started, did they run hiring, one-on-ones,
  performance, did anyone get promoted? Then: **IC or lead next?** — it changes the pitch
  and they should have an answer ready anyway.
- **What they leave behind.** Runbooks, handover documentation, onboarding material.
  Framing this as reducing bus factor, or making the role functional rather than the
  person, is strong material and should be used in their own words.
- **Security and identity.** IdP, SSO, federation, least privilege, host hardening. Ask
  for the *actual components*, not the category word; then ask whether they read the logs
  and whether anything ever got in.
- **Backup and restore.** Not "do you have backups" but "have you restored."
- **Auditability.** Did the process leave a record? Who read it? Reporting upward?
- **Credentials as practice.** Not "do you hold the credential" but "do you work under
  it, and how does it change what you do."
- **Version control, legacy tooling, enterprise plumbing.** Unglamorous and often the
  only evidence of an ecosystem the employer lives in.

## Phase 4 — incorporate

**Fix the source documents first.** Every correction goes into `career-timeline.md` with
a `⚠️` and the date, phrased so a future session can't reintroduce the error. New material
goes there too, with a note on *why* it matters and to whom. Application-specific framing
and the reasoning behind each decision go in that application's `opportunity.md`. Only
then edit the resume. A fix that lives only in one resume will be undone by the next one.

**Anything actionable goes in `TODO.md`, never in `opportunity.md`** — that file holds
facts and decisions, not tasks. In particular, open a TODO for the other applications:
overstatements caught here are almost certainly sitting in previously-shipped resumes.

**Then compile:** `just compile <fragment>` and `just check <fragment>`.

## Phase 5 — the page budget

Once a resume is full, every addition costs something. Check the page count after each
round of edits; `typst query ... '<layout-probe>'` shows where sections land if you need
to see how far over you are.

Rules: never compress spacing to force a page count — that's explicitly against
`AGENTS.md`. Cut content instead, cheapest-first, and **always report what you cut and
why.** Never silently drop material. Content cut for space stays in `career-timeline.md`.

When trades start feeling marginal, say so and recommend stopping. Late material is
usually better spent as interview preparation than as compression pressure.

## Phase 6 — before showing them

Self-check against the writing style in `AGENTS.md`: no em-dashes as sentence-joiners, no
buzzwords, no bolded-aphorism bullet openers, no tacked-on reflection clauses. Diff
against the posting for shared phrasing. Then report honestly — page count, what was cut,
what remains unresolved, and what you assumed.
