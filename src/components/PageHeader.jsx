export default function PageHeader({ eyebrow, title, subtitle, accent = "primary" }) {
  const accentClass = {
    primary: "text-[var(--pg-primary)]",
    secondary: "text-[var(--pg-secondary)]",
    accent: "text-[var(--pg-accent)]",
  }[accent];

  return (
    <section
      className="relative pt-40 pb-16 md:pt-48 md:pb-24 border-b border-[var(--pg-border)]"
      data-testid="page-header"
    >
      <div
        aria-hidden
        className="absolute inset-0 opacity-30 pointer-events-none"
        style={{
          backgroundImage:
            "radial-gradient(600px circle at 20% 0%, rgba(0,240,255,0.10), transparent 60%)",
        }}
      />
      <div className="relative max-w-[1400px] mx-auto px-6 md:px-10">
        <div className={`font-mono text-[11px] uppercase tracking-[0.25em] ${accentClass}`}>
          {eyebrow}
        </div>
        <h1
          className="mt-5 font-display text-4xl sm:text-5xl lg:text-7xl leading-[0.95] tracking-tighter max-w-[1100px]"
          data-testid="page-title"
        >
          {title}
        </h1>
        {subtitle && (
          <p className="mt-6 max-w-[680px] text-[var(--pg-text-2)] text-base md:text-lg leading-relaxed">
            {subtitle}
          </p>
        )}
      </div>
    </section>
  );
}
