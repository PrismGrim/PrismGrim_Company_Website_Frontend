import { useEffect, useState } from "react";
import PageHeader from "@/components/PageHeader";
import Careers from "@/components/Careers";
import SEO, { jobPostingJsonLd } from "@/components/SEO";
import api from "@/lib/api";
import { Users, Rocket, Compass, HeartHandshake, GraduationCap, Coffee } from "lucide-react";

const perks = [
  {
    icon: Rocket,
    title: "Ship what matters",
    desc: "Real projects for real brands from week one. No timesheet theatre.",
  },
  {
    icon: Compass,
    title: "Remote-first",
    desc: "Work from Lucknow, Bali or anywhere with wifi. Async by default.",
  },
  {
    icon: GraduationCap,
    title: "Learning budget",
    desc: "₹40k/year for courses, books, conferences — no approvals needed.",
  },
  {
    icon: HeartHandshake,
    title: "Ownership > titles",
    desc: "Own features end-to-end. Present to clients. Earn credit publicly.",
  },
  {
    icon: Users,
    title: "Small crew, senior peers",
    desc: "Every teammate has 3+ years of shipping experience. Learn fast.",
  },
  {
    icon: Coffee,
    title: "Sane hours",
    desc: "Focus mornings, collab afternoons. No weekend Slack. Ever.",
  },
];

export default function CareersPage() {
  const [jobs, setJobs] = useState([]);
  useEffect(() => {
    api.get("/jobs").then((r) => setJobs(r.data)).catch(() => setJobs([]));
  }, []);

  const jsonLd = jobs.length
    ? {
        "@context": "https://schema.org",
        "@type": "ItemList",
        itemListElement: jobs.map((j, i) => ({
          "@type": "ListItem",
          position: i + 1,
          item: jobPostingJsonLd(j),
        })),
      }
    : undefined;

  return (
    <div data-testid="careers-page">
      <SEO
        title="Careers"
        path="/careers"
        description="Open positions at PrismGrim. Remote-first digital studio hiring engineers, marketers and designers in Lucknow and beyond."
        jsonLd={jsonLd}
      />
      <PageHeader
        eyebrow="[ Careers ]"
        title="Build the next chapter of PrismGrim."
        subtitle="We hire curious builders. If shipping high-craft work sounds like your kind of chaos, we should talk."
        accent="secondary"
      />

      <section className="py-24 md:py-32 section-tinted border-t border-[var(--pg-border)]">
        <div className="max-w-[1400px] mx-auto px-6 md:px-10">
          <div className="grid md:grid-cols-12 gap-6 mb-14">
            <div className="md:col-span-3">
              <div className="font-mono text-[11px] uppercase tracking-[0.25em] text-[var(--pg-primary)]">
                [ Why join ]
              </div>
            </div>
            <div className="md:col-span-9">
              <h2 className="font-display text-4xl md:text-6xl leading-[1] tracking-tight">
                A rare place to do the{" "}
                <span className="text-[var(--pg-primary)] italic font-light">
                  best work
                </span>{" "}
                of your career.
              </h2>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
            {perks.map((p, i) => {
              const Icon = p.icon;
              return (
                <div
                  key={p.title}
                  className="pg-card p-6 md:p-8"
                  data-testid={`career-perk-${i}`}
                >
                  <div className="w-11 h-11 border border-[var(--pg-border)] flex items-center justify-center text-[var(--pg-primary)]">
                    <Icon size={18} />
                  </div>
                  <div className="mt-6 font-display text-xl">{p.title}</div>
                  <p className="mt-2 text-sm text-[var(--pg-text-2)] leading-relaxed">
                    {p.desc}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <Careers />
    </div>
  );
}
