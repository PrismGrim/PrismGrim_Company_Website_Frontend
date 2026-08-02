import { useEffect, useState } from "react";
import Marquee from "react-fast-marquee";
import { Star, Quote } from "lucide-react";
import api from "@/lib/api";

export default function Testimonials() {
  const [items, setItems] = useState([]);

  useEffect(() => {
    api.get("/feedback").then((r) => setItems(r.data)).catch(() => setItems([]));
  }, []);

  return (
    <section
      id="testimonials"
      className="relative py-24 md:py-32 border-t border-[var(--pg-border)] overflow-hidden"
      data-testid="testimonials-section"
    >
      <div className="max-w-[1400px] mx-auto px-6 md:px-10 mb-16">
        <div className="grid md:grid-cols-12 gap-6">
          <div className="md:col-span-3">
            <div className="font-mono text-[11px] uppercase tracking-[0.25em] text-[var(--pg-primary)]">
              [ 05 ] Testimonials
            </div>
          </div>
          <div className="md:col-span-9">
            <h2 className="font-display text-4xl md:text-6xl leading-[1] tracking-tight">
              What people think about us.
            </h2>
          </div>
        </div>
      </div>

      {/* massive outline text */}
      <div
        aria-hidden
        className="absolute inset-x-0 top-1/2 -translate-y-1/2 pointer-events-none select-none"
      >
        <div className="font-display pg-outline-text text-[120px] md:text-[220px] leading-none whitespace-nowrap tracking-tighter">
          CLIENT · LOVE · CLIENT · LOVE ·
        </div>
      </div>

      {items.length > 0 && (
        <Marquee
          pauseOnHover
          gradient
          gradientColor="transparent"
          gradientWidth={80}
          speed={40}
        >
          {items.map((f) => (
            <div
              key={f.id}
              className="mx-3 w-[420px] pg-card p-8"
              data-testid={`testimonial-${f.id}`}
            >
              <Quote size={22} className="text-[var(--pg-primary)] mb-4" />
              <p className="text-[var(--pg-text)] text-base leading-relaxed">
                {f.message}
              </p>
              <div className="mt-6 flex items-center justify-between border-t border-[var(--pg-border)] pt-4">
                <div>
                  <div className="font-display text-base">{f.name}</div>
                  <div className="text-[11px] text-[var(--pg-text-2)] font-mono uppercase tracking-widest">
                    {f.role}
                  </div>
                </div>
                <div className="flex gap-1 text-[var(--pg-accent)]">
                  {Array.from({ length: f.rating || 5 }).map((_, i) => (
                    <Star key={i} size={12} fill="currentColor" strokeWidth={0} />
                  ))}
                </div>
              </div>
            </div>
          ))}
        </Marquee>
      )}
    </section>
  );
}
