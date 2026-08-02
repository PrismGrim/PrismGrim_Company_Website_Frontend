import { useEffect, useMemo, useState } from "react";
import PageHeader from "@/components/PageHeader";
import Portfolio from "@/components/Portfolio";
import SEO, { creativeWorkJsonLd } from "@/components/SEO";
import api from "@/lib/api";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowRight, ArrowUpRight } from "lucide-react";

function CategoryFilter({ items, active, onChange }) {
  const cats = useMemo(() => {
    const set = new Set(items.map((i) => i.category));
    return ["All", ...Array.from(set)];
  }, [items]);
  return (
    <div className="flex flex-wrap gap-2 mb-10" data-testid="portfolio-filter">
      {cats.map((c) => (
        <button
          key={c}
          onClick={() => onChange(c)}
          className={`px-4 py-2 font-mono text-[10px] uppercase tracking-[0.2em] border transition-colors ${
            active === c
              ? "border-[var(--pg-primary)] text-[var(--pg-primary)] bg-[var(--pg-surface)]"
              : "border-[var(--pg-border)] text-[var(--pg-text-2)] hover:text-[var(--pg-text)]"
          }`}
          data-testid={`portfolio-filter-${c.toLowerCase().replace(/\s+/g, "-")}`}
        >
          {c}
        </button>
      ))}
    </div>
  );
}

function FilteredGrid() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [active, setActive] = useState("All");

  useEffect(() => {
    api
      .get("/portfolio")
      .then((r) => setItems(r.data))
      .catch(() => setItems([]))
      .finally(() => setLoading(false));
  }, []);

  const filtered =
    active === "All" ? items : items.filter((i) => i.category === active);

  return (
    <section
      className="relative py-16 md:py-24 border-t border-[var(--pg-border)]"
      data-testid="portfolio-filtered"
    >
      <div className="max-w-[1400px] mx-auto px-6 md:px-10">
        <div className="grid md:grid-cols-12 gap-6 mb-10 items-end">
          <div className="md:col-span-8">
            <div className="font-mono text-[11px] uppercase tracking-[0.25em] text-[var(--pg-accent)]">
              [ Browse ]
            </div>
            <h2 className="mt-3 font-display text-3xl md:text-5xl leading-[1] tracking-tight">
              Filter by discipline.
            </h2>
          </div>
          <div className="md:col-span-4 md:text-right font-mono text-[11px] uppercase tracking-[0.2em] text-[var(--pg-muted)]">
            {filtered.length} / {items.length} projects
          </div>
        </div>

        <CategoryFilter items={items} active={active} onChange={setActive} />

        {loading ? (
          <div className="text-[var(--pg-muted)] font-mono text-sm">
            Loading…
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((p, i) => (
              <motion.a
                key={p.id}
                href={p.project_url || "#"}
                target={p.project_url ? "_blank" : undefined}
                rel="noopener noreferrer"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: (i % 6) * 0.05 }}
                className="pg-card block overflow-hidden group"
                data-testid={`portfolio-filtered-${p.id}`}
              >
                <div className="relative aspect-[4/3] overflow-hidden bg-[var(--pg-surface-2)]">
                  <img
                    src={p.image_url}
                    alt={p.title}
                    className="w-full h-full object-cover opacity-80 group-hover:opacity-100 group-hover:scale-105 transition-all duration-500"
                    loading="lazy"
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
                  <div className="mt-2 flex items-center justify-between text-[12px] text-[var(--pg-muted)]">
                    <span>{p.client}</span>
                    <span className="font-mono">{p.year}</span>
                  </div>
                </div>
              </motion.a>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

export default function PortfolioPage() {
  const [items, setItems] = useState([]);
  useEffect(() => {
    api.get("/portfolio").then((r) => setItems(r.data)).catch(() => setItems([]));
  }, []);
  return (
    <div data-testid="portfolio-page">
      <SEO
        title="Portfolio"
        path="/portfolio"
        description="A slice of the brands PrismGrim has helped build — websites, campaigns, brand identities and Google Ads that shipped."
        jsonLd={items.length ? creativeWorkJsonLd(items) : undefined}
      />
      <PageHeader
        eyebrow="[ Portfolio ]"
        title="Selected works, shipped."
        subtitle="A slice of the brands we've helped build — websites, campaigns, identities and Google Ads."
        accent="accent"
      />
      <FilteredGrid />

      <section className="py-20 border-t border-[var(--pg-border)] section-tinted">
        <div className="max-w-[1400px] mx-auto px-6 md:px-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <h3 className="font-display text-3xl md:text-4xl leading-tight max-w-[720px]">
            Your project could be next on this wall.
          </h3>
          <Link to="/contact" className="pg-btn pg-btn-solid">
            Start a project <ArrowRight size={14} />
          </Link>
        </div>
      </section>
    </div>
  );
}
