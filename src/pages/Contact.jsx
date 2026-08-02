import PageHeader from "@/components/PageHeader";
import Contact from "@/components/Contact";
import SEO from "@/components/SEO";
import { CheckCircle2 } from "lucide-react";

const faqs = [
  {
    q: "How quickly do you reply?",
    a: "We reply to every brief within 24 hours (Mon–Sat). Emergencies during active engagements are handled same-day via WhatsApp.",
  },
  {
    q: "What is the typical timeline for a website?",
    a: "Most marketing sites ship in 4–6 weeks. Web apps and larger platforms range from 8–16 weeks depending on scope.",
  },
  {
    q: "Do you work on retainer?",
    a: "Yes — after a successful launch we offer growth retainers covering marketing, Google Ads, iterative dev, and hosting.",
  },
  {
    q: "What tech do you build on?",
    a: "React / Next.js / FastAPI / Node — deployed on Vercel, AWS or Cloudflare depending on the workload. We choose boring tech that scales.",
  },
];

const steps = [
  { k: "01", t: "You send a brief", d: "Fill the form or email us." },
  { k: "02", t: "We reply in 24h", d: "With clarifying questions and a rough plan." },
  { k: "03", t: "30-min call", d: "Free discovery call to align on scope and timelines." },
  { k: "04", t: "Proposal & kickoff", d: "Fixed-scope proposal with milestones and pricing." },
];

export default function ContactPage() {
  return (
    <div data-testid="contact-page">
      <SEO
        title="Contact"
        path="/contact"
        description="Have a project? Send your brief. PrismGrim replies within 24 hours with a plan and a rough estimate."
      />
      <PageHeader
        eyebrow="[ Contact ]"
        title="Have a project? Let's build it."
        subtitle="Send your brief. We reply within 24 hours with a plan and a rough estimate."
      />
      <Contact />

      <section className="py-24 md:py-32 border-t border-[var(--pg-border)] section-tinted">
        <div className="max-w-[1400px] mx-auto px-6 md:px-10">
          <div className="grid md:grid-cols-12 gap-6 mb-14">
            <div className="md:col-span-3">
              <div className="font-mono text-[11px] uppercase tracking-[0.25em] text-[var(--pg-primary)]">
                [ Next steps ]
              </div>
            </div>
            <div className="md:col-span-9">
              <h2 className="font-display text-4xl md:text-6xl leading-[1] tracking-tight">
                What happens after you hit send.
              </h2>
            </div>
          </div>
          <div className="grid md:grid-cols-4 gap-4 md:gap-6">
            {steps.map((s) => (
              <div
                key={s.k}
                className="pg-card p-6 md:p-8"
                data-testid={`contact-step-${s.k}`}
              >
                <div className="font-display text-5xl text-[var(--pg-primary)] leading-none">
                  {s.k}
                </div>
                <div className="mt-6 font-display text-xl leading-tight">
                  {s.t}
                </div>
                <p className="mt-2 text-sm text-[var(--pg-text-2)]">{s.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-24 md:py-32 border-t border-[var(--pg-border)]">
        <div className="max-w-[1400px] mx-auto px-6 md:px-10 grid md:grid-cols-12 gap-8">
          <div className="md:col-span-4">
            <div className="font-mono text-[11px] uppercase tracking-[0.25em] text-[var(--pg-accent)]">
              [ FAQ ]
            </div>
            <h2 className="mt-3 font-display text-3xl md:text-5xl leading-tight tracking-tight">
              The usual suspects.
            </h2>
          </div>
          <div className="md:col-span-8 space-y-4">
            {faqs.map((f, i) => (
              <details
                key={f.q}
                className="pg-card p-6 md:p-8 group"
                data-testid={`faq-${i}`}
              >
                <summary className="list-none flex items-start justify-between gap-6 cursor-pointer">
                  <div className="flex items-start gap-4">
                    <CheckCircle2
                      size={18}
                      className="text-[var(--pg-primary)] mt-1 shrink-0"
                    />
                    <span className="font-display text-lg md:text-xl leading-tight">
                      {f.q}
                    </span>
                  </div>
                  <span className="font-mono text-lg text-[var(--pg-muted)] group-open:hidden">
                    +
                  </span>
                  <span className="font-mono text-lg text-[var(--pg-primary)] hidden group-open:inline">
                    −
                  </span>
                </summary>
                <p className="mt-4 pl-8 text-[var(--pg-text-2)] leading-relaxed">
                  {f.a}
                </p>
              </details>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
