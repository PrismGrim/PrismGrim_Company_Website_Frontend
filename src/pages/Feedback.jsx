import { useState } from "react";
import { toast } from "sonner";
import { Star, Share2, Copy, Check } from "lucide-react";
import PageHeader from "@/components/PageHeader";
import MathCaptcha from "@/components/MathCaptcha";
import SEO from "@/components/SEO";
import api from "@/lib/api";

export default function FeedbackPage() {
  const [form, setForm] = useState({
    name: "",
    role: "",
    rating: 5,
    message: "",
  });
  const [website, setWebsite] = useState("");
  const [token, setToken] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [copied, setCopied] = useState(false);
  const [done, setDone] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    if (!token) {
      toast.error("Please complete the human check first");
      return;
    }
    setSubmitting(true);
    try {
      await api.post("/feedback", { ...form, website, form_token: token });
      toast.success("Thanks! Your feedback is awaiting approval.");
      setDone(true);
    } catch (err) {
      toast.error(err?.response?.data?.detail || "Could not submit");
    } finally {
      setSubmitting(false);
    }
  };

  const copyLink = async () => {
    const url = `${window.location.origin}/feedback`;
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      toast.success("Feedback link copied");
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error("Could not copy");
    }
  };

  return (
    <div data-testid="feedback-page">
      <SEO
        title="Share your feedback"
        path="/feedback"
        description="Loved working with PrismGrim? Share your feedback — approved reviews appear on our testimonials wall."
      />
      <PageHeader
        eyebrow="[ Feedback ]"
        title="Loved working with us? Share your story."
        subtitle="Your words help other founders trust us. Approved feedback is featured on our testimonials wall (with your name, role, and rating)."
        accent="accent"
      />

      <section className="py-16 md:py-24">
        <div className="max-w-[1200px] mx-auto px-6 md:px-10 grid md:grid-cols-12 gap-10">
          {/* Left rail: shareable link + guidelines */}
          <aside className="md:col-span-4 space-y-6" data-testid="feedback-side">
            <div className="border border-[var(--pg-border)] bg-[var(--pg-surface)] p-6">
              <div className="font-mono text-[10px] uppercase tracking-[0.25em] text-[var(--pg-primary)]">
                Share this URL
              </div>
              <p className="mt-3 text-sm text-[var(--pg-text-2)]">
                Send this direct link to any client to collect feedback.
              </p>
              <div className="mt-4 flex items-stretch">
                <div className="flex-1 min-w-0 px-3 py-3 border border-[var(--pg-border)] border-r-0 font-mono text-[11px] text-[var(--pg-text)] truncate">
                  {typeof window !== "undefined"
                    ? `${window.location.origin}/feedback`
                    : "/feedback"}
                </div>
                <button
                  onClick={copyLink}
                  className="px-4 border border-[var(--pg-primary)] bg-[var(--pg-primary)] text-[var(--pg-bg)] hover:bg-[var(--pg-text)] transition-colors"
                  data-testid="feedback-copy-link"
                  aria-label="Copy feedback URL"
                >
                  {copied ? <Check size={16} /> : <Copy size={16} />}
                </button>
              </div>
              <button
                onClick={async () => {
                  if (navigator.share) {
                    try {
                      await navigator.share({
                        title: "Share feedback with PrismGrim",
                        text: "Please share your feedback with the PrismGrim team.",
                        url: `${window.location.origin}/feedback`,
                      });
                    } catch {
                      /* user cancelled share */
                    }
                  } else {
                    copyLink();
                  }
                }}
                className="mt-3 pg-btn w-full justify-center"
                data-testid="feedback-share"
              >
                <Share2 size={14} /> Share link
              </button>
            </div>

            <div className="border border-[var(--pg-border)] bg-[var(--pg-surface)] p-6">
              <div className="font-mono text-[10px] uppercase tracking-[0.25em] text-[var(--pg-accent)]">
                What we ask
              </div>
              <ul className="mt-4 space-y-3 text-sm text-[var(--pg-text-2)]">
                {[
                  "One thing we did well.",
                  "One thing you'd want us to improve.",
                  "Would you recommend us?",
                ].map((q, i) => (
                  <li key={q} className="flex gap-3">
                    <span className="font-mono text-[10px] tracking-[0.2em] text-[var(--pg-muted)] pt-1">
                      0{i + 1}
                    </span>
                    <span>{q}</span>
                  </li>
                ))}
              </ul>
            </div>
          </aside>

          {/* Right: form */}
          <div className="md:col-span-8">
            {done ? (
              <div
                className="border border-[var(--pg-primary)] bg-[var(--pg-surface)] p-10 md:p-14 text-center"
                data-testid="feedback-thanks"
              >
                <div className="w-14 h-14 mx-auto border border-[var(--pg-primary)] flex items-center justify-center text-[var(--pg-primary)]">
                  <Check size={22} />
                </div>
                <h2 className="mt-6 font-display text-3xl md:text-4xl leading-tight">
                  Thanks —{" "}
                  <span className="text-[var(--pg-primary)] italic font-light">
                    got it.
                  </span>
                </h2>
                <p className="mt-4 text-[var(--pg-text-2)] max-w-[520px] mx-auto">
                  Your feedback is now awaiting moderation. Once approved, it
                  will appear on our testimonials wall.
                </p>
                <button
                  className="mt-8 pg-btn"
                  onClick={() => {
                    setDone(false);
                    setForm({ name: "", role: "", rating: 5, message: "" });
                  }}
                  data-testid="feedback-again"
                >
                  Send another
                </button>
              </div>
            ) : (
              <form
                onSubmit={submit}
                className="border border-[var(--pg-border)] bg-[var(--pg-surface)] p-6 md:p-10"
                data-testid="feedback-form"
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
                      onChange={(e) =>
                        setForm({ ...form, name: e.target.value })
                      }
                      data-testid="feedback-name"
                    />
                  </div>
                  <div>
                    <label className="pg-label">Company / role</label>
                    <input
                      className="pg-input"
                      placeholder="Happy Customer"
                      value={form.role}
                      onChange={(e) =>
                        setForm({ ...form, role: e.target.value })
                      }
                      data-testid="feedback-role"
                    />
                  </div>
                </div>
                <div className="mt-4">
                  <label className="pg-label">How was your experience?</label>
                  <div className="flex gap-2" data-testid="feedback-rating">
                    {[1, 2, 3, 4, 5].map((n) => (
                      <button
                        key={n}
                        type="button"
                        onClick={() => setForm({ ...form, rating: n })}
                        className="p-1"
                        data-testid={`feedback-rating-${n}`}
                        aria-label={`Rate ${n}`}
                      >
                        <Star
                          size={26}
                          className={
                            n <= form.rating
                              ? "text-[var(--pg-accent)]"
                              : "text-[var(--pg-border)]"
                          }
                          fill={n <= form.rating ? "currentColor" : "none"}
                          strokeWidth={n <= form.rating ? 0 : 2}
                        />
                      </button>
                    ))}
                  </div>
                </div>
                <div className="mt-4">
                  <label className="pg-label">Your feedback</label>
                  <textarea
                    required
                    rows={6}
                    className="pg-input resize-y"
                    placeholder="Tell us what worked, what didn't, and what you'd want us to build next…"
                    value={form.message}
                    onChange={(e) =>
                      setForm({ ...form, message: e.target.value })
                    }
                    data-testid="feedback-message"
                  />
                </div>
                <div className="mt-6">
                  <MathCaptcha
                    onToken={setToken}
                    testIdPrefix="feedback-captcha"
                  />
                </div>
                <button
                  type="submit"
                  disabled={submitting}
                  className="mt-6 pg-btn pg-btn-solid w-full justify-center"
                  data-testid="feedback-submit"
                >
                  {submitting ? "Submitting…" : "Publish feedback"}
                </button>
                <p className="mt-4 text-[11px] text-[var(--pg-muted)] font-mono uppercase tracking-[0.15em]">
                  Protected by math CAPTCHA + JWT · Awaits moderation before
                  going live
                </p>
              </form>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
