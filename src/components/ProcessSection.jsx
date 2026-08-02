import { motion } from "framer-motion";

const steps = [
  {
    n: "01",
    title: "Discover",
    desc: "Kickoff workshop, competitive audit, and clarity on goals, KPIs and success metrics.",
    duration: "Week 1",
  },
  {
    n: "02",
    title: "Design",
    desc: "Wireframes, art direction, brand system and interactive prototypes signed off before code.",
    duration: "Weeks 2–3",
  },
  {
    n: "03",
    title: "Develop",
    desc: "Weekly demo drops. Production-grade code with CI, tests, and performance budgets.",
    duration: "Weeks 3–5",
  },
  {
    n: "04",
    title: "Deploy & Grow",
    desc: "Ship to production, monitor, iterate — plus optional Google Ads and social growth support.",
    duration: "Week 6+",
  },
];

export default function ProcessSection({ accent = "primary" }) {
  const accentClass = {
    primary: "text-[var(--pg-primary)]",
    secondary: "text-[var(--pg-secondary)]",
    accent: "text-[var(--pg-accent)]",
  }[accent];

  return (
    <section
      className="relative py-24 md:py-32 border-t border-[var(--pg-border)] section-tinted"
      data-testid="process-section"
    >
      <div className="max-w-[1400px] mx-auto px-6 md:px-10">
        <div className="grid md:grid-cols-12 gap-6 mb-16">
          <div className="md:col-span-3">
            <div className={`font-mono text-[11px] uppercase tracking-[0.25em] ${accentClass}`}>
              [ Process ]
            </div>
          </div>
          <div className="md:col-span-9">
            <h2 className="font-display text-4xl md:text-6xl leading-[1] tracking-tight">
              A predictable path from brief to launch.
            </h2>
            <p className="mt-6 max-w-[620px] text-[var(--pg-text-2)] text-base md:text-lg">
              A four-phase rhythm we've refined across 150+ engagements — so you
              always know what's happening, when, and why.
            </p>
          </div>
        </div>

        <div className="grid md:grid-cols-4 gap-4 md:gap-6">
          {steps.map((s, i) => (
            <motion.div
              key={s.n}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              className="pg-card p-6 md:p-8 relative"
              data-testid={`process-step-${s.n}`}
            >
              <div className="font-display text-5xl md:text-6xl text-[var(--pg-primary)] leading-none opacity-90">
                {s.n}
              </div>
              <div className="mt-6 font-display text-xl md:text-2xl leading-tight">
                {s.title}
              </div>
              <p className="mt-3 text-sm text-[var(--pg-text-2)] leading-relaxed">
                {s.desc}
              </p>
              <div className="mt-6 font-mono text-[10px] uppercase tracking-[0.2em] text-[var(--pg-muted)]">
                {s.duration}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
