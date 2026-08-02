import { useState } from "react";
import { toast } from "sonner";
import { Mail, Phone, MapPin, Send } from "lucide-react";
import api from "@/lib/api";
import MathCaptcha from "@/components/MathCaptcha";
import { useSite } from "@/lib/site";

export default function Contact() {
  const { content } = useSite();
  const { contact: c } = content;
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });
  const [website, setWebsite] = useState("");
  const [token, setToken] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    if (!token) return toast.error("Please complete the human check first");
    setSubmitting(true);
    try {
      await api.post("/contact", { ...form, website, form_token: token });
      toast.success("Thanks! Confirmation email is on its way.");
      setForm({ name: "", email: "", phone: "", subject: "", message: "" });
    } catch (err) {
      toast.error(err?.response?.data?.detail || "Could not send message");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section
      id="contact"
      className="relative py-24 md:py-32 border-t border-[var(--pg-border)]"
      data-testid="contact-section"
    >
      <div className="max-w-[1400px] mx-auto px-6 md:px-10 grid md:grid-cols-12 gap-10">
        <div className="md:col-span-5">
          <div className="font-mono text-[11px] uppercase tracking-[0.25em] text-[var(--pg-primary)]">
            [ 06 ] Contact
          </div>
          <h2 className="mt-4 font-display text-4xl md:text-6xl leading-[1] tracking-tight">
            Have a project?
            <br />
            <span className="text-[var(--pg-primary)] italic font-light">
              Let&apos;s build it.
            </span>
          </h2>
          <p className="mt-6 text-[var(--pg-text-2)] text-base md:text-lg max-w-[480px]">
            Send us your brief. We reply within 24 hours with a plan.
          </p>

          <div className="mt-12 space-y-6">
            <div
              className="flex items-start gap-4"
              data-testid="contact-email-item"
            >
              <div className="w-10 h-10 border border-[var(--pg-border)] flex items-center justify-center text-[var(--pg-primary)]">
                <Mail size={16} />
              </div>
              <div>
                <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-[var(--pg-muted)]">
                  Email
                </div>
                <a
                  href={`mailto:${c.email}`}
                  className="mt-1 block text-[var(--pg-text)] hover:text-[var(--pg-primary)] transition-colors"
                >
                  {c.email}
                </a>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 border border-[var(--pg-border)] flex items-center justify-center text-[var(--pg-primary)]">
                <Phone size={16} />
              </div>
              <div>
                <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-[var(--pg-muted)]">
                  Phone
                </div>
                <a
                  href={`tel:${c.phone_href}`}
                  className="mt-1 block text-[var(--pg-text)] hover:text-[var(--pg-primary)] transition-colors"
                >
                  {c.phone_display}
                </a>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 border border-[var(--pg-border)] flex items-center justify-center text-[var(--pg-primary)]">
                <MapPin size={16} />
              </div>
              <div>
                <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-[var(--pg-muted)]">
                  Location
                </div>
                <div className="mt-1 text-[var(--pg-text)]">{c.location}</div>
              </div>
            </div>
          </div>
        </div>

        <form
          onSubmit={submit}
          className="md:col-span-7 border border-[var(--pg-border)] p-6 md:p-10 bg-[var(--pg-surface-2)]"
          data-testid="contact-form"
        >
          <input
            type="text"
            className="honeypot"
            tabIndex={-1}
            autoComplete="off"
            value={website}
            onChange={(e) => setWebsite(e.target.value)}
            aria-hidden
          />
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="pg-label">Your name</label>
              <input
                required
                className="pg-input"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                data-testid="contact-name"
              />
            </div>
            <div>
              <label className="pg-label">Email</label>
              <input
                required
                type="email"
                className="pg-input"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                data-testid="contact-email"
              />
            </div>
          </div>
          <div className="grid md:grid-cols-2 gap-4 mt-4">
            <div>
              <label className="pg-label">Phone (optional)</label>
              <input
                className="pg-input"
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                data-testid="contact-phone"
              />
            </div>
            <div>
              <label className="pg-label">Subject</label>
              <input
                required
                className="pg-input"
                value={form.subject}
                onChange={(e) => setForm({ ...form, subject: e.target.value })}
                data-testid="contact-subject"
              />
            </div>
          </div>
          <div className="mt-4">
            <label className="pg-label">Message</label>
            <textarea
              required
              rows={5}
              className="pg-input resize-y"
              value={form.message}
              onChange={(e) => setForm({ ...form, message: e.target.value })}
              data-testid="contact-message"
            />
          </div>
          <div className="mt-6">
            <MathCaptcha onToken={setToken} testIdPrefix="contact-captcha" />
          </div>
          <button
            type="submit"
            disabled={submitting}
            className="mt-6 pg-btn pg-btn-solid w-full justify-center"
            data-testid="contact-submit"
          >
            {submitting ? "Sending…" : "Send Message"} <Send size={14} />
          </button>
        </form>
      </div>
    </section>
  );
}
