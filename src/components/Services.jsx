import { motion } from "framer-motion";
import {
  Code2,
  Megaphone,
  PenTool,
  Search,
  Server,
  Globe,
  ArrowUpRight,
} from "lucide-react";

const services = [
  {
    icon: Code2,
    title: "Website Design & Development",
    desc: "High-conversion websites and web apps built with modern stacks. Blazing fast, SEO-ready, and pixel-perfect.",
    span: "md:col-span-7",
    accent: "primary",
  },
  {
    icon: Megaphone,
    title: "Social Media Marketing",
    desc: "Full-funnel content, community and paid ad strategy that turns followers into revenue.",
    span: "md:col-span-5",
    accent: "secondary",
  },
  {
    icon: PenTool,
    title: "Graphic Designing & Branding",
    desc: "Logo systems, brand guidelines, print collateral and social creatives.",
    span: "md:col-span-4",
    accent: "accent",
  },
  {
    icon: Search,
    title: "Google Services",
    desc: "Google Ads, Google My Business optimization and analytics setup that compounds.",
    span: "md:col-span-4",
    accent: "primary",
  },
  {
    icon: Server,
    title: "Hosting",
    desc: "Reliable, fast, secure managed hosting with 99.9% uptime SLA.",
    span: "md:col-span-4",
    accent: "secondary",
  },
  {
    icon: Globe,
    title: "Domain Services",
    desc: "Register, transfer and manage domains for your entire portfolio.",
    span: "md:col-span-12",
    accent: "primary",
  },
];

const accentClass = {
  primary: "hover:border-[var(--pg-primary)]",
  secondary: "hover:border-[var(--pg-secondary)]",
  accent: "hover:border-[var(--pg-accent)]",
};
const iconClass = {
  primary: "text-[var(--pg-primary)]",
  secondary: "text-[var(--pg-secondary)]",
  accent: "text-[var(--pg-accent)]",
};

export default function Services() {
  return (
    <section
      id="services"
      className="relative py-24 md:py-32 border-t border-[var(--pg-border)]"
      data-testid="services-section"
    >
      <div className="max-w-[1400px] mx-auto px-6 md:px-10">
        <div className="grid md:grid-cols-12 gap-6 mb-16">
          <div className="md:col-span-3">
            <div className="font-mono text-[11px] uppercase tracking-[0.25em] text-[var(--pg-primary)]">
              [ 01 ] Services
            </div>
          </div>
          <div className="md:col-span-9">
            <h2 className="font-display text-4xl md:text-6xl leading-[1] tracking-tight max-w-[900px]">
              Services we provide.
            </h2>
            <p className="mt-6 text-[var(--pg-text-2)] max-w-[640px] text-base md:text-lg">
              Six verticals, one team. From strategy to launch — we cover every
              pixel and every click of your digital footprint.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          {services.map((s, i) => {
            const Icon = s.icon;
            return (
              <motion.div
                key={s.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.5, delay: i * 0.05 }}
                className={`pg-card p-8 md:p-10 ${s.span} ${
                  accentClass[s.accent]
                } group relative overflow-hidden`}
                data-testid={`service-card-${i}`}
              >
                <div className="flex items-start justify-between mb-8">
                  <div
                    className={`w-12 h-12 border border-[var(--pg-border)] flex items-center justify-center ${
                      iconClass[s.accent]
                    } group-hover:border-current transition-colors`}
                  >
                    <Icon size={20} />
                  </div>
                  <ArrowUpRight
                    size={20}
                    className="text-[var(--pg-muted)] group-hover:text-[var(--pg-text)] transition-colors"
                  />
                </div>
                <h3 className="font-display text-xl md:text-2xl leading-tight mb-3">
                  {s.title}
                </h3>
                <p className="text-[var(--pg-text-2)] text-sm md:text-base leading-relaxed max-w-[520px]">
                  {s.desc}
                </p>
                <div className="mt-8 font-mono text-[10px] uppercase tracking-[0.2em] text-[var(--pg-muted)]">
                  0{i + 1} / 06
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
