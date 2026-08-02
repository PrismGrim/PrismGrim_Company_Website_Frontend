import { motion } from "framer-motion";

export default function About() {
  return (
    <section
      id="about"
      className="relative py-24 md:py-32 border-t border-[var(--pg-border)]"
      data-testid="about-section"
    >
      <div className="max-w-[1400px] mx-auto px-6 md:px-10 grid md:grid-cols-12 gap-10">
        <div className="md:col-span-5">
          <div className="font-mono text-[11px] uppercase tracking-[0.25em] text-[var(--pg-primary)] mb-6">
            [ 02 ] About Us
          </div>
          <h2 className="font-display text-4xl md:text-5xl leading-[1.05] tracking-tight">
            Designing, developing and marketing your{" "}
            <span className="text-[var(--pg-primary)] italic font-light">
              digital future.
            </span>
          </h2>
        </div>
        <div className="md:col-span-7 md:pl-10">
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-[var(--pg-text-2)] text-base md:text-lg leading-relaxed"
          >
            Welcome to <span className="text-[var(--pg-text)]">PRISMGRIM</span>, your
            trusted partner in designing, developing, and marketing your digital
            future. We are a dynamic and innovative company dedicated to
            providing cutting-edge solutions that propel businesses forward in
            the digital age.
          </motion.p>
          <p className="mt-6 text-[var(--pg-text-2)] text-base md:text-lg leading-relaxed">
            With our expert team of talented designers, skilled developers, and
            savvy marketers, we collaborate with our clients to create impactful
            and user-centric digital experiences. Whether you need a visually
            stunning website, a powerful mobile application, or a comprehensive
            digital marketing strategy — we have the expertise to bring your
            vision to life.
          </p>

          <div className="mt-12 grid grid-cols-3 gap-4 md:gap-6">
            {[
              { k: "Design", v: "Distinctive visual identities" },
              { k: "Develop", v: "Ship fast, ship stable" },
              { k: "Market", v: "Growth that compounds" },
            ].map((x, i) => (
              <div
                key={x.k}
                className="border-l border-[var(--pg-border)] pl-4"
                data-testid={`about-pillar-${i}`}
              >
                <div className="font-display text-lg">{x.k}</div>
                <div className="mt-2 text-[12px] text-[var(--pg-text-2)]">{x.v}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
