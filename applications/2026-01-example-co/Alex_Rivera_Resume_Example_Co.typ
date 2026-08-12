#import "../../template.typ": *

#show: resume.with(
  name: "Alex Rivera",
  credentials: "B.Sc. Computer Science",
  title: "Senior Platform Engineer",
  location: "Portland, OR, USA",
  email: "alex.rivera@example.com",
  phone: "(555) 010-1234",
  links: ("linkedin.com/in/alexrivera-example", "github.com/alexrivera-example"),
)

#section("Summary")
#par[
I've spent nine years building and operating backend systems, the last four of them
running the platform team at a logistics startup as it scaled from one region to
nationwide coverage. I like the parts of the job other people avoid: on-call design,
migrations with no downtime window, and the long tail of cleanup after an incident. This
is placeholder example content — replace it with your own summary.
]

#section("Experience")

#entry(role: "Staff Platform Engineer", org: "Example Logistics Co.", dates: "2022 – Present")[
  #text(size: 10pt)[I lead the platform team responsible for the shared infrastructure every product team at the company builds on.]
  #v(7pt)
  #bullets((
    [Led the migration of the order-routing service from a single-region deployment to a multi-region active-active setup, cutting failover time from twenty minutes to under thirty seconds.],
    [Redesigned the on-call rotation and alerting after a quarter where the team was paged an average of nine times a week. Cut that to under two by fixing root causes instead of adding runbooks for the symptoms.],
    [Introduced a staged rollout process for backend deploys, gating each stage on error-rate and latency thresholds pulled from existing dashboards. Bad deploys now reach a small fraction of traffic instead of everyone.],
    [Hired and ran a team of four engineers, including two promotions from mid-level to senior during my time leading the group.],
  ))
]

#entry(role: "Backend Engineer", org: "Example Logistics Co.", dates: "2020 – 2022")[
  #bullets((
    [Rebuilt the billing reconciliation pipeline after recurring discrepancies were traced to a race condition in the original implementation. Discrepancies dropped to zero over the following two quarters.],
    [Owned the transition from a monolithic Rails application to a set of services with clear ownership boundaries, starting with the two highest-traffic endpoints.],
  ))
]

#entry(role: "Software Engineer", org: "Prior Company Example", dates: "2017 – 2020")[
  #bullets((
    [Built the internal tooling used by support staff to investigate and resolve customer-reported order issues, cutting average resolution time by half.],
    [Wrote the integration layer connecting the product to a third-party payments provider, including its retry and idempotency handling.],
  ))
]

#section("Technical")
#skill-line("Infrastructure ", "Kubernetes · Terraform · AWS (EC2, RDS, S3, Lambda) · Docker")
#skill-line("Operations ", "Prometheus · Grafana · PagerDuty · incident response · on-call design")
#skill-line("Languages ", "Go · Python · Ruby · SQL")
#skill-line("Data ", "PostgreSQL · Redis · Kafka")

#section("Education")
#block[*B.Sc., Computer Science* — Example State University, 2017]
