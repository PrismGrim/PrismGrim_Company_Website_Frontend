import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Briefcase, MapPin, Clock, DollarSign, X } from "lucide-react";
import { toast } from "sonner";
import api from "@/lib/api";
import MathCaptcha from "@/components/MathCaptcha";

export default function Careers() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [active, setActive] = useState(null); // job selected for apply

  useEffect(() => {
    api
      .get("/jobs")
      .then((r) => setJobs(r.data))
      .catch(() => setJobs([]))
      .finally(() => setLoading(false));
  }, []);

  return (
    <section
      id="careers"
      className="relative py-24 md:py-32 border-t border-[var(--pg-border)]"
      data-testid="careers-section"
    >
      <div className="max-w-[1400px] mx-auto px-6 md:px-10">
        <div className="grid md:grid-cols-12 gap-6 mb-14">
          <div className="md:col-span-3">
            <div className="font-mono text-[11px] uppercase tracking-[0.25em] text-[var(--pg-secondary)]">
              [ 04 ] Careers
            </div>
          </div>
          <div className="md:col-span-9">
            <h2 className="font-display text-4xl md:text-6xl leading-[1] tracking-tight">
              Open positions.
            </h2>
            <p className="mt-6 max-w-[640px] text-[var(--pg-text-2)] text-base md:text-lg">
              We hire curious builders. If shipping high-craft work sounds like
              your kind of chaos, we should talk.
            </p>
          </div>
        </div>

        {loading ? (
          <div
            className="text-[var(--pg-muted)] font-mono text-sm"
            data-testid="careers-loading"
          >
            Loading roles…
          </div>
        ) : jobs.length === 0 ? (
          <div
            className="border border-[var(--pg-border)] p-10 text-center text-[var(--pg-text-2)]"
            data-testid="careers-empty"
          >
            No open positions right now. Check back soon.
          </div>
        ) : (
          <div className="border-t border-[var(--pg-border)]">
            {jobs.map((job, i) => (
              <motion.div
                key={job.id}
                initial={{ opacity: 0, x: -10 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
                className="grid md:grid-cols-12 gap-4 py-8 border-b border-[var(--pg-border)] items-start md:items-center hover:bg-[var(--pg-surface-2)] transition-colors px-2 md:px-4"
                data-testid={`job-row-${job.id}`}
              >
                <div className="md:col-span-5">
                  <div className="font-display text-xl md:text-2xl leading-tight">
                    {job.title}
                  </div>
                  <div className="mt-2 font-mono text-[11px] uppercase tracking-[0.2em] text-[var(--pg-primary)]">
                    {job.department}
                  </div>
                </div>
                <div className="md:col-span-2 text-sm text-[var(--pg-text-2)] flex items-center gap-2">
                  <MapPin size={14} /> {job.location}
                </div>
                <div className="md:col-span-2 text-sm text-[var(--pg-text-2)] flex items-center gap-2">
                  <Clock size={14} /> {job.type}
                </div>
                <div className="md:col-span-1 text-sm text-[var(--pg-text-2)] flex items-center gap-2">
                  <Briefcase size={14} /> {job.experience}
                </div>
                <div className="md:col-span-2 flex md:justify-end">
                  <button
                    className="pg-btn"
                    onClick={() => setActive(job)}
                    data-testid={`job-apply-${job.id}`}
                  >
                    Apply
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {active && <ApplyModal job={active} onClose={() => setActive(null)} />}
    </section>
  );
}

function ApplyModal({ job, onClose }) {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    experience: "",
    portfolio_url: "",
    cover_letter: "",
  });
  const [website, setWebsite] = useState(""); // honeypot
  const [token, setToken] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    if (!token) {
      toast.error("Please complete the human check first");
      return;
    }
    setSubmitting(true);
    try {
      await api.post("/apply", {
        job_id: job.id,
        ...form,
        website,
        form_token: token,
      });
      toast.success("Application sent! Confirmation email on the way.");
      onClose();
    } catch (err) {
      toast.error(err?.response?.data?.detail || "Could not submit");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-[80] bg-[var(--pg-bg)]/70 backdrop-blur-sm flex items-start md:items-center justify-center p-4 overflow-y-auto"
      data-testid="apply-modal"
    >
      <div className="relative w-full max-w-2xl bg-[var(--pg-surface-2)] border border-[var(--pg-border)] p-6 md:p-10 my-8">
        <button
          className="absolute top-4 right-4 text-[var(--pg-text-2)] hover:text-[var(--pg-text)] transition-colors"
          onClick={onClose}
          data-testid="apply-close"
          aria-label="Close"
        >
          <X />
        </button>
        <div className="font-mono text-[11px] uppercase tracking-[0.25em] text-[var(--pg-primary)]">
          Apply now
        </div>
        <h3 className="mt-3 font-display text-2xl md:text-3xl leading-tight">
          {job.title}
        </h3>
        <p className="mt-2 text-[var(--pg-text-2)] text-sm">
          {job.location} · {job.type} · {job.experience}
        </p>

        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-3">
          {job.requirements?.map((r) => (
            <div
              key={r}
              className="text-[12px] text-[var(--pg-text-2)] pl-3 border-l border-[var(--pg-border)]"
            >
              {r}
            </div>
          ))}
        </div>

        <form onSubmit={submit} className="mt-8 space-y-4">
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
              <label className="pg-label">Full name</label>
              <input
                required
                className="pg-input"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                data-testid="apply-name"
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
                data-testid="apply-email"
              />
            </div>
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="pg-label">Phone</label>
              <input
                required
                className="pg-input"
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                data-testid="apply-phone"
              />
            </div>
            <div>
              <label className="pg-label">Experience</label>
              <input
                required
                placeholder="e.g. 3 years"
                className="pg-input"
                value={form.experience}
                onChange={(e) =>
                  setForm({ ...form, experience: e.target.value })
                }
                data-testid="apply-experience"
              />
            </div>
          </div>
          <div>
            <label className="pg-label">Portfolio / LinkedIn URL</label>
            <input
              className="pg-input"
              value={form.portfolio_url}
              onChange={(e) =>
                setForm({ ...form, portfolio_url: e.target.value })
              }
              data-testid="apply-portfolio"
            />
          </div>
          <div>
            <label className="pg-label">Cover letter</label>
            <textarea
              required
              rows={5}
              className="pg-input resize-y"
              value={form.cover_letter}
              onChange={(e) =>
                setForm({ ...form, cover_letter: e.target.value })
              }
              data-testid="apply-cover"
            />
          </div>
          <MathCaptcha onToken={setToken} testIdPrefix="apply-captcha" />
          <button
            type="submit"
            disabled={submitting}
            className="pg-btn pg-btn-solid w-full justify-center mt-2"
            data-testid="apply-submit"
          >
            {submitting ? "Submitting…" : "Submit Application"}
          </button>
        </form>
      </div>
    </div>
  );
}
