import { Link } from "react-router-dom";
import { Share2 } from "lucide-react";
import { useSite } from "@/lib/site";

export default function Footer() {
  const { content } = useSite();
  const { contact, brand } = content;

  return (
    <footer
      className="relative bg-[var(--pg-bg)] border-t border-[var(--pg-border)] pt-16 pb-8"
      data-testid="site-footer"
    >
      <div className="max-w-[1400px] mx-auto px-6 md:px-10">
        <div className="grid md:grid-cols-12 gap-10">
          <div className="md:col-span-6">
              <img
                src="/pglogo-rbg.png"
                alt="PrismGrim"
                className="h-14 md:h-20 w-auto"
                width="360"
                height="80"
                style={{ position: "relative", left: "130px" }}
              />
              <br />
              <img
                src="/pgtext-rbg.png"
                alt="PrismGrim"
                className="h-14 md:h-10 w-auto"
                width="360"
                height="80"
                // style={{ marginTop: "35px", marginRight: "240px" }}
              />
            <p className="mt-6 text-[var(--pg-text-2)] max-w-[440px]">
              {brand.footer_desc}
            </p>
          </div>

          <div className="md:col-span-3">
            <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-[var(--pg-muted)] mb-4">
              Explore
            </div>
            <ul className="space-y-2 text-sm">
              {[
                ["/services", "Services"],
                ["/about", "About"],
                ["/portfolio", "Portfolio"],
                ["/careers", "Careers"],
                ["/contact", "Contact"],
                ["/feedback", "Share feedback"],
              ].map(([to, label]) => (
                <li key={to}>
                  <Link
                    to={to}
                    className="text-[var(--pg-text-2)] hover:text-[var(--pg-primary)] transition-colors"
                    data-testid={`footer-link-${label.toLowerCase().replace(/\s+/g, "-")}`}
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="md:col-span-3">
            <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-[var(--pg-muted)] mb-4">
              Get in touch
            </div>
            <ul className="space-y-2 text-sm">
              <li>
                <a
                  href={`mailto:${contact.email}`}
                  className="text-[var(--pg-text-2)] hover:text-[var(--pg-primary)] transition-colors"
                  data-testid="footer-email"
                >
                  {contact.email}
                </a>
              </li>
              <li>
                <a
                  href={`tel:${contact.phone_href}`}
                  className="text-[var(--pg-text-2)] hover:text-[var(--pg-primary)] transition-colors"
                  data-testid="footer-phone"
                >
                  {contact.phone_display}
                </a>
              </li>
              <li className="text-[var(--pg-text-2)]" data-testid="footer-location">
                {contact.location}
              </li>
            </ul>

            <Link
              to="/feedback"
              className="mt-6 inline-flex items-center gap-2 border border-[var(--pg-primary)] text-[var(--pg-primary)] px-3 py-2 font-mono text-[10px] uppercase tracking-[0.2em] hover:bg-[var(--pg-primary)] hover:text-[var(--pg-bg)] transition-colors"
              data-testid="footer-share-feedback"
            >
              <Share2 size={12} /> Share your feedback
            </Link>
          </div>
        </div>

        <div className="mt-16 pt-6 border-t border-[var(--pg-border)] flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
          <div className="text-[11px] font-mono uppercase tracking-[0.2em] text-[var(--pg-muted)]">
            © {new Date().getFullYear()} PrismGrim · All rights reserved
          </div>
          <div className="flex items-center gap-6 text-[11px] font-mono uppercase tracking-[0.2em]">
            <Link
              to="/admin"
              className="text-[var(--pg-muted)] hover:text-[var(--pg-primary)] transition-colors"
              data-testid="footer-admin-link"
            >
              Admin
            </Link>
            <Link
              to="/feedback"
              className="text-[var(--pg-muted)] hover:text-[var(--pg-text)] transition-colors"
              data-testid="footer-feedback-link"
            >
              Feedback
            </Link>
            <Link
              to="/contact"
              className="text-[var(--pg-muted)] hover:text-[var(--pg-text)] transition-colors"
            >
              Contact
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
