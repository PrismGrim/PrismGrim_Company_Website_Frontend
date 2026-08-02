import PageHeader from "@/components/PageHeader";
import Services from "@/components/Services";
import ProcessSection from "@/components/ProcessSection";
import SEO from "@/components/SEO";
import { Link } from "react-router-dom";
import { CheckCircle2, ArrowRight } from "lucide-react";

const deliverables = [
  {
    vertical: "Website & Web Apps",
    items: [
      "Design system + Figma files",
      "Production codebase (React / Next.js)",
      "CMS integration & hosting setup",
      "Core Web Vitals ≥ 90 target",
    ],
  },
  {
    vertical: "Social Media & Ads",
    items: [
      "Monthly content calendar",
      "Meta / LinkedIn / Google Ads campaigns",
      "Creatives, reels and copy",
      "Weekly performance report",
    ],
  },
  {
    vertical: "Brand & Graphic",
    items: [
      "Logo system + brand guidelines",
      "Print & digital collateral",
      "Marketing asset library",
      "Rights-cleared source files",
    ],
  },
];

export default function ServicesPage() {
  return (
    <div data-testid="services-page">
      <SEO
        title="Services"
        path="/services"
        description="Web development, social media marketing, graphic design, Google Ads, hosting and domain services from PrismGrim — a full-service digital studio."
      />
      <PageHeader
        eyebrow="[ Services ]"
        title="Every pixel, every click — covered."
        subtitle="Six verticals, one accountable team. From strategy to launch, we own the outcome end-to-end so you can focus on the business."
      />
      <Services />
      <ProcessSection accent="primary" />

      <section className="py-24 md:py-32 border-t border-[var(--pg-border)]">
        <div className="max-w-[1400px] mx-auto px-6 md:px-10">
          <div className="font-mono text-[11px] uppercase tracking-[0.25em] text-[var(--pg-primary)] mb-6">
            [ Deliverables ]
          </div>
          <h2 className="font-display text-4xl md:text-6xl leading-[1] tracking-tight mb-12">
            What you actually receive.
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            {deliverables.map((d, i) => (
              <div
                key={d.vertical}
                className="pg-card p-6 md:p-8"
                data-testid={`deliverable-${i}`}
              >
                <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-[var(--pg-muted)]">
                  0{i + 1}
                </div>
                <div className="mt-2 font-display text-xl leading-tight">
                  {d.vertical}
                </div>
                <ul className="mt-6 space-y-3">
                  {d.items.map((it) => (
                    <li key={it} className="flex items-start gap-3 text-sm">
                      <CheckCircle2
                        size={16}
                        className="text-[var(--pg-primary)] mt-0.5 shrink-0"
                      />
                      <span className="text-[var(--pg-text-2)]">{it}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-24 md:py-32 border-t border-[var(--pg-border)] section-tinted">
        <div className="max-w-[1400px] mx-auto px-6 md:px-10 grid md:grid-cols-12 gap-8 items-center">
          <div className="md:col-span-8">
            <h2 className="font-display text-3xl md:text-5xl leading-[1.05] tracking-tight">
              Have something specific in mind?{" "}
              <span className="text-[var(--pg-primary)] italic font-light">
                Let&apos;s scope it.
              </span>
            </h2>
            <p className="mt-4 text-[var(--pg-text-2)] max-w-[520px]">
              We reply within 24 hours with a plan and a rough estimate.
            </p>
          </div>
          <div className="md:col-span-4 md:text-right">
            <Link to="/contact" className="pg-btn pg-btn-solid">
              Book a call <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
