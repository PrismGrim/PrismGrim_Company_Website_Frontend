import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowRight, Zap } from "lucide-react";
import { useSite } from "@/lib/site";

export default function Hero() {
  const { content } = useSite();
  const { hero } = content;
  return (
    <section
      className="relative min-h-[100vh] pt-32 pb-24 overflow-hidden"
      data-testid="hero-section"
    >
      <div
        aria-hidden
        className="absolute inset-0 opacity-40 pointer-events-none"
        style={{
          backgroundImage:
            "radial-gradient(600px circle at 20% 20%, rgba(0,240,255,0.15), transparent), radial-gradient(400px circle at 80% 60%, rgba(255,0,60,0.12), transparent)",
        }}
      />
      <div
        aria-hidden
        className="absolute inset-0 opacity-[0.07] pointer-events-none"
        style={{
          backgroundImage:
            "linear-gradient(var(--pg-grid) 1px, transparent 1px), linear-gradient(90deg, var(--pg-grid) 1px, transparent 1px)",
          backgroundSize: "80px 80px",
        }}
      />

      <div className="relative max-w-[1400px] mx-auto px-6 md:px-10 grid lg:grid-cols-12 gap-8">
        <div className="lg:col-span-8">
          <div className="flex items-center gap-3 mb-10">
            <div className="w-1.5 h-1.5 bg-[var(--pg-primary)] animate-pulse" />
            <span className="font-mono text-[11px] uppercase tracking-[0.25em] text-[var(--pg-text-2)]">
              {hero.eyebrow}
            </span>
          </div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="font-display text-[42px] sm:text-[64px] lg:text-[92px] leading-[0.95] tracking-tighter whitespace-pre-line"
            data-testid="hero-heading"
          >
            {hero.title_prefix}
            <span className="text-[var(--pg-primary)] italic font-light">
              {hero.title_accent}
            </span>
            {hero.title_suffix}
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.15 }}
            className="mt-10 max-w-[620px] text-[var(--pg-text-2)] text-base md:text-lg leading-relaxed"
            data-testid="hero-subtitle"
          >
            {hero.subtitle}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3 }}
            className="mt-12 flex flex-wrap gap-5"
          >
            <Link to="/contact" className="pg-btn pg-btn-solid" data-testid="hero-cta-contact">
              Start a Project <ArrowRight size={16} />
            </Link>
            <Link to="/portfolio" className="pg-btn" data-testid="hero-cta-portfolio">
              See our work
            </Link>
          </motion.div>
        </div>

        {/* Right decorative panel */}
        <motion.aside
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="hidden lg:flex lg:col-span-4 flex-col gap-5 self-center"
        >
          <div className="border border-[var(--pg-border)] bg-[var(--pg-surface)] p-6 relative overflow-hidden group">
            <div className="absolute -right-6 -top-6 w-24 h-24 border border-[var(--pg-primary)] opacity-20 group-hover:opacity-40 transition-opacity rotate-45" />
            <div className="font-mono text-[10px] uppercase tracking-[0.25em] text-[var(--pg-primary)]">
              [ Currently shipping ]
            </div>
            <div className="mt-4 font-display text-2xl leading-tight">
              {hero.currently_shipping}
            </div>
            <div className="mt-4 flex items-center gap-3">
              <span className="w-2 h-2 bg-[var(--pg-primary)] animate-pulse" />
              <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-[var(--pg-text-2)]">
                Live studio · Lucknow, IN
              </span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {[
              { k: "Design", v: "brand · web · social" },
              { k: "Build", v: "react · next · node" },
              { k: "Grow", v: "meta · google · seo" },
              { k: "Host", v: "cloud · domain · ops" },
            ].map((x) => (
              <div
                key={x.k}
                className="pg-card p-4"
                data-testid={`hero-side-${x.k.toLowerCase()}`}
              >
                <div className="font-display text-lg">{x.k}</div>
                <div className="mt-1 font-mono text-[10px] uppercase tracking-[0.15em] text-[var(--pg-muted)]">
                  {x.v}
                </div>
              </div>
            ))}
          </div>
        </motion.aside>
      </div>

      <div className="relative max-w-[1400px] mx-auto px-6 md:px-10">
        <div className="mt-24 grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-10 border-t border-[var(--pg-border)] pt-10">
          {[
            { k: "150+", v: "Websites shipped" },
            { k: "80+", v: "Brands served" },
            { k: "6", v: "Service verticals" },
            { k: "24h", v: "Avg reply time" },
          ].map((s, i) => (
            <motion.div
              key={s.v}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 + i * 0.08 }}
              data-testid={`hero-stat-${i}`}
            >
              <div className="font-display text-3xl md:text-5xl text-[var(--pg-text)]">
                {s.k}
              </div>
              <div className="mt-2 font-mono text-[10px] uppercase tracking-[0.2em] text-[var(--pg-muted)]">
                {s.v}
              </div>
            </motion.div>
          ))}
        </div>

        <div className="mt-16 flex items-center gap-3 text-[var(--pg-muted)]">
          <Zap size={14} />
          <span className="font-mono text-[11px] uppercase tracking-[0.2em]">
            Scroll to explore
          </span>
        </div>
      </div>
    </section>
  );
}
