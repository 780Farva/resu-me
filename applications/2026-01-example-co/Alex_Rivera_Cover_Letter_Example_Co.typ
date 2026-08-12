// Example cover letter, for a fictional application. Shows how letter() pairs with
// resume() from template.typ. Replace with your own before compiling for real.

#import "../../template.typ": *

#show: letter.with(
  name: "Alex Rivera",
  credentials: "B.Sc. Computer Science",
  location: "Portland, OR, USA",
  email: "alex.rivera@example.com",
  phone: "(555) 010-1234",
  date: "January 5, 2026",
)

Hello,

I'm applying for the Senior Platform Engineer role. I've spent the last four years running
the platform team at a logistics startup as it scaled from one region to nationwide
coverage, and before that three years as a backend engineer on the same team.

The part of your posting that stood out was the emphasis on on-call health. I've been the
person who inherited a rotation that paged nine times a week and rebuilt it around fixing
root causes instead of writing more runbooks — it's down to under two now, and the team
that owns it hasn't lost anyone to burnout since.

On what I don't have: I haven't worked with your specific event-streaming stack, though
I've run Kafka in production at smaller scale. I'd be learning the operational edges of it
on the job.

#block(breakable: false)[
  I'm based in Portland and open to relocation. Happy to talk whenever is convenient.

  #signoff("Alex Rivera")
]
