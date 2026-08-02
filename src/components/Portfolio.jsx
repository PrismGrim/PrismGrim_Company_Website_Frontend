import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import api from "@/lib/api";

export default function Portfolio() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get("/portfolio")
      .then((r) => setItems(r.data))
      .catch(() => setItems([]))
      .finally(() => setLoading(false));
  }, []);

  return (
    <section
      id="portfolio"
      className="relative py-24 md:py-32 border-t border-[var(--pg-border)]"
      data-testid="portfolio-section"
    >
      <div className="max-w-[1400px] mx-auto px-6 md:px-10">
        <div className="grid md:grid-cols-12 gap-6 mb-14">
          <div className="md:col-span-3">
            <div className="font-mono text-[11px] uppercase tracking-[0.25em] text-[var(--pg-accent)]">
              [ 03 ] Portfolio
            </div>
          </div>
          <div className="md:col-span-9 flex items-end justify-between gap-4">
            <h2 className="font-display text-4xl md:text-6xl leading-[1] tracking-tight">
              Selected works.
            </h2>
            <div className="hidden md:block font-mono text-[11px] uppercase tracking-[0.2em] text-[var(--pg-muted)]">
              {items.length} projects
            </div>
          </div>
        </div>

        {loading ? (
          <div
            className="text-[var(--pg-muted)] font-mono text-sm"
            data-testid="portfolio-loading"
          >
            Loading projects…
          </div>
        ) : items.length === 0 ? (
          <div
            className="text-[var(--pg-muted)] font-mono text-sm"
            data-testid="portfolio-empty"
          >
            No projects yet.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {items.map((p, i) => (
              <motion.a
                key={p.id}
                href={p.project_url || "#"}
                target={p.project_url ? "_blank" : undefined}
                rel="noopener noreferrer"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.5, delay: (i % 3) * 0.06 }}
                className="pg-card block overflow-hidden group"
                data-testid={`portfolio-item-${p.id}`}
              >
                <div className="relative aspect-[4/3] overflow-hidden bg-[var(--pg-surface-2)]">
                  <img
                    src={p.image_url}
                    alt={p.title}
                    className="w-full h-full object-cover opacity-80 group-hover:opacity-100 group-hover:scale-105 transition-all duration-500"
                    loading="lazy"
                  />
                  <div className="absolute top-3 right-3 w-9 h-9 bg-[var(--pg-header-bg)] backdrop-blur-md border border-[var(--pg-border)] flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <ArrowUpRight size={16} className="text-[var(--pg-text)]" />
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
