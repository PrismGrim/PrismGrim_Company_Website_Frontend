import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { ArrowUpRight, ArrowRight } from "lucide-react";
import Hero from "@/components/Hero";
import Services from "@/components/Services";
import Testimonials from "@/components/Testimonials";
import ProcessSection from "@/components/ProcessSection";
import SEO, { orgJsonLd } from "@/components/SEO";
import api from "@/lib/api";

function PortfolioTeaser() {
  const [items, setItems] = useState([]);
  useEffect(() => {
    api
      .get("/portfolio")
      .then((r) => setItems(r.data.slice(0, 3)))
      .catch(() => setItems([]));
  }, []);

  return (
    <section
      className="relative py-24 md:py-32 border-t border-[var(--pg-border)]"
      data-testid="home-portfolio-teaser"
    >
      <div className="max-w-[1400px] mx-auto px-6 md:px-10">
        <div className="grid md:grid-cols-12 gap-6 mb-14 items-end">
          <div className="md:col-span-8">
            <div className="font-mono text-[11px] uppercase tracking-[0.25em] text-[var(--pg-accent)]">
              [ Portfolio ]
            </div>
            <h2 className="mt-4 font-display text-4xl md:text-6xl leading-[1] tracking-tight">
              Selected works.
            </h2>
          </div>
          <div className="md:col-span-4 md:text-right">
            <Link to="/portfolio" className="pg-btn">
              All projects <ArrowRight size={14} />
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {items.map((p, i) => (
            <motion.a
              key={p.id}
              href={p.project_url || "#"}
              target={p.project_url ? "_blank" : undefined}
              rel="noopener noreferrer"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              className="pg-card block overflow-hidden group"
              data-testid={`home-portfolio-${p.id}`}
            >
              <div className="relative aspect-[4/3] overflow-hidden bg-[var(--pg-surface-2)]">
                <img
                  src={p.image_url}
                  alt={p.title}
                  loading="lazy"
                  className="w-full h-full object-cover opacity-80 group-hover:opacity-100 group-hover:scale-105 transition-all duration-500"
                />
                <div className="absolute top-3 right-3 w-9 h-9 bg-black/60 backdrop-blur-md border border-white/10 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <ArrowUpRight size={16} className="text-white" />
                </div>
              </div>
              <div className="p-6 border-t border-[var(--pg-border)]">
                <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-[var(--pg-primary)] mb-2">
                  {p.category}
                </div>
                <div className="font-display text-lg md:text-xl leading-tight">
                  {p.title}
                </div>
              </div>
            </motion.a>
          ))}
        </div>
      </div>
    </section>
  );
}

function BigCTA() {
  return (
    <section className="relative py-24 md:py-40 border-t border-[var(--pg-border)] overflow-hidden">
      <div
        aria-hidden
        className="absolute inset-0 opacity-30 pointer-events-none"
        style={{
          backgroundImage:
            "radial-gradient(500px circle at 80% 50%, rgba(0,240,255,0.18), transparent 60%)",
        }}
      />
      <div className="relative max-w-[1400px] mx-auto px-6 md:px-10 grid md:grid-cols-12 gap-10 items-center">
        <div className="md:col-span-8">
          <div className="font-mono text-[11px] uppercase tracking-[0.25em] text-[var(--pg-primary)]">
            [ Ready to build ]
          </div>
          <h2 className="mt-4 font-display text-4xl md:text-7xl leading-[0.95] tracking-tighter">
            Let&apos;s ship something{" "}
            <span className="text-[var(--pg-primary)] italic font-light">
              legendary.
            </span>
          </h2>
        </div>
        <div className="md:col-span-4 flex md:justify-end">
          <Link
            to="/contact"
            className="pg-btn pg-btn-solid"
            data-testid="home-bigcta-contact"
          >
            Start a project <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    </section>
  );
}

export default function HomePage() {
  return (
    <div data-testid="home-page">
      <SEO
        title=""
        path="/"
        description="PrismGrim is a full-service digital studio in Lucknow — web development, social media marketing, graphic design, Google Ads, hosting and domain services. Trusted by 80+ brands."
        jsonLd={orgJsonLd()}
      />
      <Hero />
      <Services />
      <ProcessSection accent="primary" />
      <PortfolioTeaser />
      <Testimonials />
      <BigCTA />
    </div>
  );
}
