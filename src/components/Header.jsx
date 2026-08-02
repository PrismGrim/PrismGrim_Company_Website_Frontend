import { useEffect, useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { Menu, X, Sun, Moon } from "lucide-react";
import { useTheme } from "@/lib/theme";
import { formatRelative } from "date-fns";

const nav = [
  { label: "Services", to: "/services" },
  { label: "About", to: "/about" },
  { label: "Portfolio", to: "/portfolio" },
  { label: "Careers", to: "/careers" },
  { label: "Contact", to: "/contact" },
];

export default function Header() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { theme, toggle } = useTheme();
  const location = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setOpen(false);
    window.scrollTo({ top: 0, behavior: "instant" });
  }, [location.pathname]);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-colors duration-300 ${
        scrolled
          ? "bg-[var(--pg-header-bg)] backdrop-blur-xl border-b border-[var(--pg-border)]"
          : "bg-transparent"
      }`}
      data-testid="site-header"
    >
      <div className="max-w-[1400px] mx-auto px-6 md:px-10 py-4 flex items-center justify-between">
        <Link
          to="/"
          className="flex items-center gap-3"
          data-testid="brand-link"
        >
          <img
            src="/pglogo-rbg.png"
            alt="PrismGrim"
            className="h-9 md:h-12 w-auto"
            
          />
        </Link>

        <nav className="hidden md:flex items-center gap-10">
          {nav.map((n) => (
            <NavLink
              key={n.to}
              to={n.to}
              className={({ isActive }) =>
                `font-mono text-[12px] uppercase tracking-[0.15em] transition-colors ${
                  isActive
                    ? "text-[var(--pg-text)]"
                    : "text-[var(--pg-text-2)] hover:text-[var(--pg-text)]"
                }`
              }
              data-testid={`nav-${n.label.toLowerCase()}`}
            >
              {n.label}
            </NavLink>
          ))}
        </nav>

        <div className="hidden md:flex items-center gap-4">
          <button
            onClick={toggle}
            className="w-10 h-10 border border-[var(--pg-border)] flex items-center justify-center text-[var(--pg-text-2)] hover:text-[var(--pg-primary)] hover:border-[var(--pg-primary)] transition-colors"
            data-testid="theme-toggle"
            aria-label="Toggle theme"
          >
            {theme === "dark" ? <Sun size={16} /> : <Moon size={16} />}
          </button>
          <Link
            to="/contact"
            className="pg-btn pg-btn-solid"
            data-testid="header-cta"
          >
            Start a Project
          </Link>
        </div>

        <div className="md:hidden flex items-center gap-2">
          <button
            onClick={toggle}
            className="w-10 h-10 border border-[var(--pg-border)] flex items-center justify-center text-[var(--pg-text-2)]"
            data-testid="mobile-theme-toggle"
            aria-label="Toggle theme"
          >
            {theme === "dark" ? <Sun size={16} /> : <Moon size={16} />}
          </button>
          <button
            className="w-10 h-10 border border-[var(--pg-border)] flex items-center justify-center text-[var(--pg-text)]"
            onClick={() => setOpen(!open)}
            data-testid="mobile-menu-toggle"
            aria-label="Toggle menu"
          >
            {open ? <X size={16} /> : <Menu size={16} />}
          </button>
        </div>
      </div>

      {open && (
        <div className="md:hidden border-t border-[var(--pg-border)] bg-[var(--pg-surface)] backdrop-blur-xl">
          <div className="px-6 py-6 flex flex-col gap-5">
            {nav.map((n) => (
              <NavLink
                key={n.to}
                to={n.to}
                onClick={() => setOpen(false)}
                className="font-mono text-sm uppercase tracking-[0.15em] text-[var(--pg-text-2)]"
                data-testid={`mobile-nav-${n.label.toLowerCase()}`}
              >
                {n.label}
              </NavLink>
            ))}
            <Link
              to="/contact"
              onClick={() => setOpen(false)}
              className="pg-btn pg-btn-solid justify-center"
              data-testid="mobile-header-cta"
            >
              Start a Project
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
