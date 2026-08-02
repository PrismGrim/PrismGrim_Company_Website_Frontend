import PageHeader from "@/components/PageHeader";
import About from "@/components/About";
import SEO from "@/components/SEO";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

const values = [
  {
    k: "01",
    title: "Craft over volume",
    desc: "We take fewer projects and pour more attention. Every deliverable is signed off by a senior.",
  },
  {
    k: "02",
    title: "Measure what matters",
    desc: "Design that converts, code that scales, campaigns that produce revenue — never vanity metrics.",
  },
  {
    k: "03",
    title: "Own the outcome",
    desc: "We stay accountable to business results, not just to shipping features and creatives.",
  },
];

const timeline = [
  { year: "2020", title: "Started as a two-person studio", desc: "Building websites for local businesses in Lucknow." },
  { year: "2022", title: "Grew into a full-service agency", desc: "Added marketing, brand, and Google Ads verticals." },
  { year: "2024", title: "150+ projects shipped", desc: "Trusted by D2C brands, SaaS startups and service businesses." },
  { year: "2026", title: "Team of 12 · 4 countries", desc: "Remote-first team, headquartered in Lucknow, India." },
];

export default function AboutPage() {
  return (
    <div data-testid="about-page">
      <SEO
        title="About"
        path="/about"
        description="PrismGrim is a small remote-first digital studio obsessed with craft. Meet the team, values and journey behind 150+ shipped projects."
      />
      <PageHeader
        eyebrow="[ About ]"
        title="A small team obsessed with digital craft."
        subtitle="PrismGrim is where designers, developers and marketers work as one squad to ship distinctive digital products."
      />
      <About />

      <section className="py-24 md:py-32 border-t border-[var(--pg-border)] section-tinted">
        <div className="max-w-[1400px] mx-auto px-6 md:px-10">
          <div className="font-mono text-[11px] uppercase tracking-[0.25em] text-[var(--pg-primary)] mb-6">
            [ Values ]
          </div>
          <h2 className="font-display text-3xl md:text-5xl tracking-tight mb-12">
            How we work.
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            {values.map((v) => (
              <div
                key={v.k}
                className="pg-card p-8"
                data-testid={`about-value-${v.k}`}
              >
                <div className="font-mono text-[11px] tracking-[0.2em] text-[var(--pg-primary)]">
                  {v.k}
                </div>
                <div className="mt-4 font-display text-2xl">{v.title}</div>
                <p className="mt-3 text-[var(--pg-text-2)] leading-relaxed">
                  {v.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-24 md:py-32 border-t border-[var(--pg-border)]">
        <div className="max-w-[1400px] mx-auto px-6 md:px-10">
          <div className="grid md:grid-cols-12 gap-6 mb-16">
            <div className="md:col-span-3">
              <div className="font-mono text-[11px] uppercase tracking-[0.25em] text-[var(--pg-accent)]">
                [ Journey ]
              </div>
            </div>
            <div className="md:col-span-9">
              <h2 className="font-display text-4xl md:text-6xl leading-[1] tracking-tight">
                Six years, one obsession.
              </h2>
            </div>
          </div>
          <div className="grid gap-0 md:pl-24">
            {timeline.map((t, i) => (
              <div
                key={t.year}
                className="grid grid-cols-[100px_1fr] md:grid-cols-[140px_1fr] gap-6 py-8 border-b border-[var(--pg-border)] last:border-b-0"
                data-testid={`timeline-${t.year}`}
              >
                <div className="font-display text-3xl md:text-5xl text-[var(--pg-primary)] leading-none">
                  {t.year}
                </div>
                <div>
                  <div className="font-display text-xl md:text-2xl">
                    {t.title}
                  </div>
                  <div className="mt-2 text-[var(--pg-text-2)]">{t.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-24 md:py-32 border-t border-[var(--pg-border)] section-tinted">
        <div className="max-w-[1400px] mx-auto px-6 md:px-10 grid md:grid-cols-4 gap-6">
          {[
            { k: "150+", v: "Projects shipped" },
            { k: "80+", v: "Brands served" },
            { k: "12", v: "In the crew" },
            { k: "4", v: "Countries" },
          ].map((s, i) => (
            <div
              key={s.v}
              className="border border-[var(--pg-border)] bg-[var(--pg-surface)] p-8"
              data-testid={`about-stat-${i}`}
            >
              <div className="font-display text-4xl md:text-6xl text-[var(--pg-text)]">
                {s.k}
              </div>
              <div className="mt-3 font-mono text-[10px] uppercase tracking-[0.2em] text-[var(--pg-muted)]">
                {s.v}
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="py-20 border-t border-[var(--pg-border)]">
        <div className="max-w-[1400px] mx-auto px-6 md:px-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <h3 className="font-display text-3xl md:text-4xl leading-tight max-w-[720px]">
            Ready to work with a team that gives a damn?
          </h3>
          <Link to="/contact" className="pg-btn pg-btn-solid">
            Start a project <ArrowRight size={14} />
          </Link>
        </div>
      </section>
    </div>
  );
}
