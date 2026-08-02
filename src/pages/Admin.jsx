import { useEffect, useState } from "react";
import { toast } from "sonner";
import { LogOut, Plus, Trash2, Pencil, X, Check, EyeOff, Eye } from "lucide-react";
import { Link } from "react-router-dom";
import api from "@/lib/api";
import { useTheme } from "@/lib/theme";
import { useSite } from "@/lib/site";
import InvoicesPanel from "@/pages/admin/InvoicesPanel";
import { Sun, Moon } from "lucide-react";

export default function AdminPage() {
  const [token, setToken] = useState(
    () => localStorage.getItem("pg_admin_token") || ""
  );
  const [pwd, setPwd] = useState("");
  const [tab, setTab] = useState("dashboard");
  const { theme, toggle } = useTheme();

  const login = async (e) => {
    e.preventDefault();
    try {
      const { data } = await api.post("/admin/login", { password: pwd });
      localStorage.setItem("pg_admin_token", data.token);
      setToken(data.token);
      toast.success("Signed in");
    } catch (err) {
      toast.error(err?.response?.data?.detail || "Invalid password");
    }
  };

  const logout = () => {
    localStorage.removeItem("pg_admin_token");
    setToken("");
  };

  if (!token) {
    return (
      <div
        className="min-h-screen flex items-center justify-center px-6 bg-[var(--pg-bg)] text-[var(--pg-text)]"
        data-testid="admin-login-page"
      >
        <form
          onSubmit={login}
          className="w-full max-w-md border border-[var(--pg-border)] p-8 bg-[var(--pg-surface)]"
        >
          <div className="font-mono text-[11px] uppercase tracking-[0.25em] text-[var(--pg-primary)]">
            Admin
          </div>
          <h1 className="mt-3 font-display text-3xl">Sign in</h1>
          <p className="mt-2 text-[var(--pg-text-2)] text-sm">
            Protected area. Password required.
          </p>
          <label className="pg-label mt-6">Password</label>
          <input
            type="password"
            className="pg-input"
            value={pwd}
            onChange={(e) => setPwd(e.target.value)}
            required
            data-testid="admin-password"
          />
          <button
            className="mt-6 pg-btn pg-btn-solid w-full justify-center"
            type="submit"
            data-testid="admin-login-submit"
          >
            Enter
          </button>
          <Link
            to="/"
            className="mt-6 block text-center text-[11px] font-mono uppercase tracking-widest text-[var(--pg-muted)] hover:text-[var(--pg-text)]"
          >
            ← Back to site
          </Link>
        </form>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen bg-[var(--pg-bg)] text-[var(--pg-text)]"
      data-testid="admin-dashboard"
    >
      <header className="border-b border-[var(--pg-border)] px-6 md:px-10 py-5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-7 h-7 border border-[var(--pg-primary)] flex items-center justify-center">
            <div className="w-2.5 h-2.5 bg-[var(--pg-primary)]" />
          </div>
          <div>
            <div className="font-display text-lg">
              PRISM<span className="text-[var(--pg-primary)]">GRIM</span>
            </div>
            <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-[var(--pg-muted)]">
              Admin
            </div>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={toggle}
            className="w-10 h-10 border border-[var(--pg-border)] flex items-center justify-center text-[var(--pg-text-2)] hover:text-[var(--pg-primary)] transition-colors"
            data-testid="admin-theme-toggle"
            aria-label="Toggle theme"
          >
            {theme === "dark" ? <Sun size={16} /> : <Moon size={16} />}
          </button>
          <Link
            to="/"
            className="text-sm text-[var(--pg-text-2)] hover:text-[var(--pg-text)]"
          >
            View site
          </Link>
          <button
            className="pg-btn"
            onClick={logout}
            data-testid="admin-logout"
          >
            <LogOut size={14} /> Logout
          </button>
        </div>
      </header>

      <div className="max-w-[1200px] mx-auto px-6 md:px-10 py-10">
        <div className="flex gap-2 mb-8 border-b border-[var(--pg-border)] overflow-x-auto">
          {["dashboard", "contacts", "applications", "jobs", "portfolio", "feedback", "invoices", "site"].map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`px-4 py-3 font-mono text-[11px] uppercase tracking-[0.2em] transition-colors whitespace-nowrap ${
                tab === t
                  ? "text-[var(--pg-text)] border-b-2 border-[var(--pg-primary)] -mb-px"
                  : "text-[var(--pg-muted)] hover:text-[var(--pg-text)]"
              }`}
              data-testid={`admin-tab-${t}`}
            >
              {t}
            </button>
          ))}
        </div>

        {tab === "dashboard" && <DashboardPanel />}
        {tab === "contacts" && <ContactsPanel />}
        {tab === "applications" && <ApplicationsPanel />}
        {tab === "jobs" && <JobsPanel />}
        {tab === "portfolio" && <PortfolioPanel />}
        {tab === "feedback" && <FeedbackPanel />}
        {tab === "invoices" && <InvoicesPanel />}
        {tab === "site" && <SiteContentPanel />}
      </div>
    </div>
  );
}

/* -------------------- Jobs -------------------- */
const emptyJob = {
  title: "",
  department: "",
  location: "",
  type: "Full-time",
  experience: "",
  salary: "",
  description: "",
  requirements: "",
};

function JobsPanel() {
  const [jobs, setJobs] = useState([]);
  const [form, setForm] = useState(emptyJob);
  const [editingId, setEditingId] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const load = () => api.get("/jobs").then((r) => setJobs(r.data));
  useEffect(() => {
    load();
  }, []);

  const startEdit = (j) => {
    setEditingId(j.id);
    setForm({
      title: j.title || "",
      department: j.department || "",
      location: j.location || "",
      type: j.type || "Full-time",
      experience: j.experience || "",
      salary: j.salary || "",
      description: j.description || "",
      requirements: (j.requirements || []).join("\n"),
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setForm(emptyJob);
  };

  const submit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const payload = {
        ...form,
        requirements: form.requirements
          .split("\n")
          .map((s) => s.trim())
          .filter(Boolean),
      };
      if (editingId) {
        await api.put(`/admin/jobs/${editingId}`, payload);
        toast.success("Job updated");
      } else {
        await api.post("/admin/jobs", payload);
        toast.success("Job posted");
      }
      cancelEdit();
      load();
    } catch (err) {
      toast.error(err?.response?.data?.detail || "Could not save");
    } finally {
      setSubmitting(false);
    }
  };

  const del = async (id) => {
    if (!window.confirm("Delete this job?")) return;
    await api.delete(`/admin/jobs/${id}`);
    toast.success("Deleted");
    if (editingId === id) cancelEdit();
    load();
  };

  return (
    <div className="grid lg:grid-cols-12 gap-8" data-testid="admin-jobs-panel">
      <form
        onSubmit={submit}
        className="lg:col-span-5 border border-[var(--pg-border)] p-6 bg-[var(--pg-surface)] space-y-4 h-fit lg:sticky lg:top-4"
        data-testid="admin-job-form"
      >
        <div className="flex items-center justify-between">
          <div className="font-display text-2xl">
            {editingId ? "Edit job" : "Add job"}
          </div>
          {editingId && (
            <button
              type="button"
              onClick={cancelEdit}
              className="text-[var(--pg-muted)] hover:text-[var(--pg-text)]"
              data-testid="admin-job-cancel"
              aria-label="Cancel edit"
            >
              <X size={16} />
            </button>
          )}
        </div>
        {[
          ["title", "Title"],
          ["department", "Department"],
          ["location", "Location"],
          ["type", "Type"],
          ["experience", "Experience"],
          ["salary", "Salary"],
        ].map(([k, l]) => (
          <div key={k}>
            <label className="pg-label">{l}</label>
            <input
              required
              className="pg-input"
              value={form[k]}
              onChange={(e) => setForm({ ...form, [k]: e.target.value })}
              data-testid={`admin-job-${k}`}
            />
          </div>
        ))}
        <div>
          <label className="pg-label">Description</label>
          <textarea
            required
            rows={3}
            className="pg-input resize-y"
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            data-testid="admin-job-description"
          />
        </div>
        <div>
          <label className="pg-label">Requirements (one per line)</label>
          <textarea
            rows={4}
            className="pg-input resize-y"
            value={form.requirements}
            onChange={(e) => setForm({ ...form, requirements: e.target.value })}
            data-testid="admin-job-requirements"
          />
        </div>
        <button
          type="submit"
          disabled={submitting}
          className="pg-btn pg-btn-solid w-full justify-center"
          data-testid="admin-job-submit"
        >
          {editingId ? <Check size={14} /> : <Plus size={14} />}{" "}
          {submitting ? "Saving…" : editingId ? "Update" : "Publish"}
        </button>
      </form>

      <div className="lg:col-span-7 space-y-3">
        <div className="font-mono text-[11px] uppercase tracking-[0.2em] text-[var(--pg-muted)]">
          {jobs.length} live jobs
        </div>
        {jobs.map((j) => (
          <div
            key={j.id}
            className={`border p-5 flex items-start justify-between gap-4 transition-colors ${
              editingId === j.id
                ? "border-[var(--pg-primary)] bg-[var(--pg-surface-2)]"
                : "border-[var(--pg-border)] hover:border-[var(--pg-primary)]"
            }`}
            data-testid={`admin-job-${j.id}`}
          >
            <div>
              <div className="font-display text-lg">{j.title}</div>
              <div className="mt-1 text-[12px] text-[var(--pg-text-2)]">
                {j.department} · {j.location} · {j.type} · {j.experience}
              </div>
              <div className="mt-2 text-[11px] font-mono text-[var(--pg-muted)]">
                {j.id}
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => startEdit(j)}
                className="text-[var(--pg-text-2)] hover:text-[var(--pg-primary)] transition-colors"
                data-testid={`admin-job-edit-${j.id}`}
                aria-label="Edit"
              >
                <Pencil size={16} />
              </button>
              <button
                onClick={() => del(j.id)}
                className="text-[var(--pg-secondary)] hover:text-[var(--pg-text)] transition-colors"
                data-testid={`admin-job-delete-${j.id}`}
                aria-label="Delete"
              >
                <Trash2 size={16} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* -------------------- Portfolio -------------------- */
const emptyProject = {
  title: "",
  category: "",
  client: "",
  description: "",
  image_url: "",
  project_url: "",
  year: String(new Date().getFullYear()),
};

function PortfolioPanel() {
  const [items, setItems] = useState([]);
  const [form, setForm] = useState(emptyProject);
  const [editingId, setEditingId] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const load = () => api.get("/portfolio").then((r) => setItems(r.data));
  useEffect(() => {
    load();
  }, []);

  const startEdit = (p) => {
    setEditingId(p.id);
    setForm({
      title: p.title || "",
      category: p.category || "",
      client: p.client || "",
      description: p.description || "",
      image_url: p.image_url || "",
      project_url: p.project_url || "",
      year: p.year || String(new Date().getFullYear()),
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setForm(emptyProject);
  };

  const submit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      if (editingId) {
        await api.put(`/admin/portfolio/${editingId}`, form);
        toast.success("Project updated");
      } else {
        await api.post("/admin/portfolio", form);
        toast.success("Project added");
      }
      cancelEdit();
      load();
    } catch (err) {
      toast.error(err?.response?.data?.detail || "Could not save");
    } finally {
      setSubmitting(false);
    }
  };

  const del = async (id) => {
    if (!window.confirm("Delete this project?")) return;
    await api.delete(`/admin/portfolio/${id}`);
    toast.success("Deleted");
    if (editingId === id) cancelEdit();
    load();
  };

  const fields = [
    ["title", "Title", true],
    ["category", "Category", true],
    ["client", "Client", true],
    ["image_url", "Image URL", true],
    ["project_url", "Project URL (optional)", false],
    ["year", "Year", true],
  ];
  const idAliases = {
    image_url: "admin-project-image",
    project_url: "admin-project-url",
  };

  return (
    <div className="grid lg:grid-cols-12 gap-8" data-testid="admin-portfolio-panel">
      <form
        onSubmit={submit}
        className="lg:col-span-5 border border-[var(--pg-border)] p-6 bg-[var(--pg-surface)] space-y-4 h-fit lg:sticky lg:top-4"
        data-testid="admin-project-form"
      >
        <div className="flex items-center justify-between">
          <div className="font-display text-2xl">
            {editingId ? "Edit project" : "Add project"}
          </div>
          {editingId && (
            <button
              type="button"
              onClick={cancelEdit}
              className="text-[var(--pg-muted)] hover:text-[var(--pg-text)]"
              data-testid="admin-project-cancel"
              aria-label="Cancel edit"
            >
              <X size={16} />
            </button>
          )}
        </div>
        {fields.map(([k, l, req]) => (
          <div key={k}>
            <label className="pg-label">{l}</label>
            <input
              required={req}
              className="pg-input"
              value={form[k]}
              onChange={(e) => setForm({ ...form, [k]: e.target.value })}
              data-testid={idAliases[k] || `admin-project-${k}`}
            />
          </div>
        ))}
        <div>
          <label className="pg-label">Description</label>
          <textarea
            required
            rows={3}
            className="pg-input resize-y"
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            data-testid="admin-project-description"
          />
        </div>
        <button
          type="submit"
          disabled={submitting}
          className="pg-btn pg-btn-solid w-full justify-center"
          data-testid="admin-project-submit"
        >
          {editingId ? <Check size={14} /> : <Plus size={14} />}{" "}
          {submitting ? "Saving…" : editingId ? "Update" : "Publish"}
        </button>
      </form>

      <div className="lg:col-span-7 grid sm:grid-cols-2 gap-4">
        {items.map((p) => (
          <div
            key={p.id}
            className={`border overflow-hidden transition-colors ${
              editingId === p.id
                ? "border-[var(--pg-primary)]"
                : "border-[var(--pg-border)] hover:border-[var(--pg-primary)]"
            }`}
            data-testid={`admin-project-${p.id}`}
          >
            <div className="aspect-[4/3] bg-[var(--pg-surface-2)] overflow-hidden">
              <img
                src={p.image_url}
                alt={p.title}
                className="w-full h-full object-cover opacity-80"
                loading="lazy"
              />
            </div>
            <div className="p-4 flex items-start justify-between gap-2">
              <div>
                <div className="font-display text-base">{p.title}</div>
                <div className="mt-1 text-[11px] text-[var(--pg-text-2)] font-mono uppercase tracking-widest">
                  {p.category}
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => startEdit(p)}
                  className="text-[var(--pg-text-2)] hover:text-[var(--pg-primary)] transition-colors"
                  data-testid={`admin-project-edit-${p.id}`}
                  aria-label="Edit"
                >
                  <Pencil size={16} />
                </button>
                <button
                  onClick={() => del(p.id)}
                  className="text-[var(--pg-secondary)] hover:text-[var(--pg-text)] transition-colors"
                  data-testid={`admin-project-delete-${p.id}`}
                  aria-label="Delete"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* -------------------- Feedback Moderation -------------------- */
function FeedbackPanel() {
  const [items, setItems] = useState([]);
  const [filter, setFilter] = useState("all"); // all | pending | approved
  const [loading, setLoading] = useState(true);

  const load = () => {
    setLoading(true);
    api
      .get("/admin/feedback", { params: { status: filter } })
      .then((r) => setItems(r.data))
      .finally(() => setLoading(false));
  };
  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filter]);

  const setApproved = async (id, approved) => {
    try {
      await api.patch(`/admin/feedback/${id}`, { approved });
      toast.success(approved ? "Approved — visible on site" : "Hidden from site");
      load();
    } catch (err) {
      toast.error(err?.response?.data?.detail || "Could not update");
    }
  };

  const del = async (id) => {
    if (!window.confirm("Delete this feedback permanently?")) return;
    await api.delete(`/admin/feedback/${id}`);
    toast.success("Deleted");
    load();
  };

  const pendingCount = items.filter((i) => !i.approved).length;

  return (
    <div className="space-y-6" data-testid="admin-feedback-panel">
      <div className="flex flex-wrap items-center gap-4 justify-between">
        <div className="flex gap-2">
          {["all", "pending", "approved"].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-2 font-mono text-[10px] uppercase tracking-[0.2em] border transition-colors ${
                filter === f
                  ? "border-[var(--pg-primary)] text-[var(--pg-primary)]"
                  : "border-[var(--pg-border)] text-[var(--pg-text-2)] hover:text-[var(--pg-text)]"
              }`}
              data-testid={`admin-feedback-filter-${f}`}
            >
              {f}
            </button>
          ))}
        </div>
        {filter === "all" && pendingCount > 0 && (
          <div className="font-mono text-[11px] uppercase tracking-[0.2em] text-[var(--pg-secondary)]">
            {pendingCount} pending review
          </div>
        )}
      </div>

      {loading ? (
        <div className="text-[var(--pg-muted)] font-mono text-sm">Loading…</div>
      ) : items.length === 0 ? (
        <div
          className="border border-[var(--pg-border)] p-10 text-center text-[var(--pg-text-2)]"
          data-testid="admin-feedback-empty"
        >
          No feedback in this view.
        </div>
      ) : (
        <div className="space-y-3">
          {items.map((f) => (
            <div
              key={f.id}
              className="border border-[var(--pg-border)] p-5 hover:border-[var(--pg-primary)] transition-colors"
              data-testid={`admin-feedback-${f.id}`}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 flex-wrap">
                    <div className="font-display text-lg">{f.name}</div>
                    <span
                      className={`font-mono text-[10px] uppercase tracking-[0.15em] px-2 py-1 border ${
                        f.approved
                          ? "border-[var(--pg-primary)] text-[var(--pg-primary)]"
                          : "border-[var(--pg-secondary)] text-[var(--pg-secondary)]"
                      }`}
                      data-testid={`admin-feedback-status-${f.id}`}
                    >
                      {f.approved ? "Approved" : "Pending"}
                    </span>
                    <span className="font-mono text-[10px] text-[var(--pg-muted)]">
                      {f.rating}★ · {f.role}
                    </span>
                  </div>
                  <p className="mt-3 text-[var(--pg-text-2)] leading-relaxed">
                    {f.message}
                  </p>
                  <div className="mt-3 font-mono text-[10px] text-[var(--pg-muted)]">
                    {f.id} · {new Date(f.posted_at).toLocaleString()}
                  </div>
                </div>
                <div className="flex flex-col items-end gap-2">
                  {f.approved ? (
                    <button
                      onClick={() => setApproved(f.id, false)}
                      className="pg-btn"
                      data-testid={`admin-feedback-hide-${f.id}`}
                    >
                      <EyeOff size={14} /> Hide
                    </button>
                  ) : (
                    <button
                      onClick={() => setApproved(f.id, true)}
                      className="pg-btn pg-btn-solid"
                      data-testid={`admin-feedback-approve-${f.id}`}
                    >
                      <Eye size={14} /> Approve
                    </button>
                  )}
                  <button
                    onClick={() => del(f.id)}
                    className="text-[var(--pg-secondary)] hover:text-[var(--pg-text)] p-2"
                    data-testid={`admin-feedback-delete-${f.id}`}
                    aria-label="Delete"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}


/* -------------------- Dashboard -------------------- */
function DashboardPanel() {
  const [stats, setStats] = useState(null);
  useEffect(() => {
    api.get("/admin/stats").then((r) => setStats(r.data)).catch(() => setStats(null));
  }, []);

  if (!stats) {
    return (
      <div className="text-[var(--pg-muted)] font-mono text-sm" data-testid="admin-dashboard-loading">
        Loading stats…
      </div>
    );
  }

  const cards = [
    { k: "Contacts", t: stats.contacts.total, s: `${stats.contacts.new} new`, tab: "contacts", accent: "primary" },
    { k: "Applications", t: stats.applications.total, s: `${stats.applications.new} new`, tab: "applications", accent: "secondary" },
    { k: "Feedback", t: stats.feedback.total, s: `${stats.feedback.pending} awaiting`, tab: "feedback", accent: "accent" },
    { k: "Live jobs", t: stats.jobs.total, s: "positions open", tab: "jobs", accent: "primary" },
    { k: "Portfolio", t: stats.portfolio.total, s: "projects shipped", tab: "portfolio", accent: "primary" },
    { k: "Approved reviews", t: stats.feedback.approved, s: "on the wall", tab: "feedback", accent: "accent" },
  ];
  const accentClass = {
    primary: "text-[var(--pg-primary)]",
    secondary: "text-[var(--pg-secondary)]",
    accent: "text-[var(--pg-accent)]",
  };

  return (
    <div data-testid="admin-dashboard-panel" className="space-y-10">
      <div>
        <div className="font-mono text-[11px] uppercase tracking-[0.25em] text-[var(--pg-primary)]">
          [ Overview ]
        </div>
        <h2 className="mt-3 font-display text-3xl md:text-4xl leading-tight">
          Everything, at a glance.
        </h2>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {cards.map((c) => (
          <div
            key={c.k}
            className="pg-card p-6 md:p-8"
            data-testid={`dashboard-card-${c.k.toLowerCase().replace(/\s+/g, "-")}`}
          >
            <div className="font-mono text-[10px] uppercase tracking-[0.25em] text-[var(--pg-muted)]">
              {c.k}
            </div>
            <div className={`mt-4 font-display text-5xl md:text-6xl ${accentClass[c.accent]}`}>
              {c.t}
            </div>
            <div className="mt-3 text-sm text-[var(--pg-text-2)]">{c.s}</div>
          </div>
        ))}
      </div>
      <div className="pg-card p-6 md:p-8">
        <div className="font-mono text-[11px] uppercase tracking-[0.25em] text-[var(--pg-primary)]">
          [ SEO ]
        </div>
        <h3 className="mt-3 font-display text-2xl leading-tight">Search-engine assets</h3>
        <ul className="mt-4 space-y-2 text-sm">
          <li>
            <a
              href="/api/sitemap.xml"
              target="_blank"
              rel="noreferrer"
              className="text-[var(--pg-primary)] hover:underline"
              data-testid="dashboard-sitemap-link"
            >
              /api/sitemap.xml
            </a>
            <span className="text-[var(--pg-muted)] font-mono text-[11px] ml-2">
              (auto-generated, includes all jobs & projects)
            </span>
          </li>
          <li>
            <a
              href="/robots.txt"
              target="_blank"
              rel="noreferrer"
              className="text-[var(--pg-primary)] hover:underline"
              data-testid="dashboard-robots-link"
            >
              /robots.txt
            </a>
            <span className="text-[var(--pg-muted)] font-mono text-[11px] ml-2">
              (crawl policy — /admin blocked)
            </span>
          </li>
        </ul>
      </div>
    </div>
  );
}

/* -------------------- Contacts -------------------- */
const CONTACT_STATUSES = ["new", "read", "resolved"];

function ContactsPanel() {
  const [items, setItems] = useState([]);
  const [filter, setFilter] = useState("all");
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(null);

  const load = () => {
    setLoading(true);
    api
      .get("/admin/contacts", { params: { status: filter } })
      .then((r) => setItems(r.data))
      .finally(() => setLoading(false));
  };
  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filter]);

  const setStatus = async (id, status) => {
    try {
      await api.patch(`/admin/contacts/${id}`, { status });
      toast.success(`Marked ${status}`);
      load();
    } catch (err) {
      toast.error(err?.response?.data?.detail || "Could not update");
    }
  };

  const del = async (id) => {
    if (!window.confirm("Delete this contact submission?")) return;
    await api.delete(`/admin/contacts/${id}`);
    toast.success("Deleted");
    setOpen(null);
    load();
  };

  return (
    <div className="space-y-6" data-testid="admin-contacts-panel">
      <div className="flex gap-2">
        {["all", ...CONTACT_STATUSES].map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-2 font-mono text-[10px] uppercase tracking-[0.2em] border transition-colors ${
              filter === f
                ? "border-[var(--pg-primary)] text-[var(--pg-primary)]"
                : "border-[var(--pg-border)] text-[var(--pg-text-2)] hover:text-[var(--pg-text)]"
            }`}
            data-testid={`admin-contacts-filter-${f}`}
          >
            {f}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="text-[var(--pg-muted)] font-mono text-sm">Loading…</div>
      ) : items.length === 0 ? (
        <div
          className="border border-[var(--pg-border)] p-10 text-center text-[var(--pg-text-2)]"
          data-testid="admin-contacts-empty"
        >
          No contact submissions in this view.
        </div>
      ) : (
        <div className="space-y-3">
          {items.map((c) => (
            <div
              key={c.id}
              className="border border-[var(--pg-border)] p-5 hover:border-[var(--pg-primary)] transition-colors"
              data-testid={`admin-contact-${c.id}`}
            >
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-3 flex-wrap">
                    <div className="font-display text-lg">{c.name}</div>
                    <span
                      className={`font-mono text-[10px] uppercase tracking-[0.15em] px-2 py-1 border ${
                        c.status === "new"
                          ? "border-[var(--pg-secondary)] text-[var(--pg-secondary)]"
                          : c.status === "read"
                            ? "border-[var(--pg-accent)] text-[var(--pg-accent)]"
                            : "border-[var(--pg-primary)] text-[var(--pg-primary)]"
                      }`}
                      data-testid={`admin-contact-status-${c.id}`}
                    >
                      {c.status}
                    </span>
                  </div>
                  <div className="mt-1 text-sm text-[var(--pg-text-2)]">
                    <a href={`mailto:${c.email}`} className="hover:text-[var(--pg-primary)]">
                      {c.email}
                    </a>
                    {c.phone ? ` · ${c.phone}` : ""}
                  </div>
                  <div className="mt-3 font-display text-base">{c.subject}</div>
                  <p
                    className={`mt-2 text-[var(--pg-text-2)] leading-relaxed ${
                      open === c.id ? "" : "line-clamp-2"
                    }`}
                  >
                    {c.message}
                  </p>
                  <button
                    onClick={() => setOpen(open === c.id ? null : c.id)}
                    className="mt-2 font-mono text-[10px] uppercase tracking-[0.2em] text-[var(--pg-primary)] hover:underline"
                    data-testid={`admin-contact-toggle-${c.id}`}
                  >
                    {open === c.id ? "Collapse" : "Expand"}
                  </button>
                  <div className="mt-3 font-mono text-[10px] text-[var(--pg-muted)]">
                    {c.id} · {new Date(c.posted_at).toLocaleString()}
                  </div>
                </div>
                <div className="flex flex-col items-end gap-2">
                  {c.status === "new" && (
                    <button
                      onClick={() => setStatus(c.id, "read")}
                      className="pg-btn"
                      data-testid={`admin-contact-mark-read-${c.id}`}
                    >
                      Mark read
                    </button>
                  )}
                  {c.status !== "resolved" && (
                    <button
                      onClick={() => setStatus(c.id, "resolved")}
                      className="pg-btn pg-btn-solid"
                      data-testid={`admin-contact-resolve-${c.id}`}
                    >
                      Resolve
                    </button>
                  )}
                  <button
                    onClick={() => del(c.id)}
                    className="text-[var(--pg-secondary)] hover:text-[var(--pg-text)] p-2"
                    data-testid={`admin-contact-delete-${c.id}`}
                    aria-label="Delete"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

/* -------------------- Applications -------------------- */
const APP_STATUSES = ["new", "reviewed", "shortlisted", "rejected"];

function ApplicationsPanel() {
  const [items, setItems] = useState([]);
  const [filter, setFilter] = useState("all");
  const [jobFilter, setJobFilter] = useState("all");
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(null);

  const load = () => {
    setLoading(true);
    api
      .get("/admin/applications", { params: { status: filter } })
      .then((r) => setItems(r.data))
      .finally(() => setLoading(false));
  };
  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filter]);

  const jobTitles = Array.from(new Set(items.map((a) => a.job_title))).sort();
  const displayed =
    jobFilter === "all"
      ? items
      : items.filter((a) => a.job_title === jobFilter);

  const setStatus = async (id, status) => {
    try {
      await api.patch(`/admin/applications/${id}`, { status });
      toast.success(`Marked ${status}`);
      load();
    } catch (err) {
      toast.error(err?.response?.data?.detail || "Could not update");
    }
  };

  const del = async (id) => {
    if (!window.confirm("Delete this application?")) return;
    await api.delete(`/admin/applications/${id}`);
    toast.success("Deleted");
    load();
  };

  const statusColor = {
    new: "border-[var(--pg-secondary)] text-[var(--pg-secondary)]",
    reviewed: "border-[var(--pg-accent)] text-[var(--pg-accent)]",
    shortlisted: "border-[var(--pg-primary)] text-[var(--pg-primary)]",
    rejected: "border-[var(--pg-muted)] text-[var(--pg-muted)]",
  };

  return (
    <div className="space-y-6" data-testid="admin-applications-panel">
      <div className="flex flex-wrap items-center gap-3">
        <div className="flex gap-2 flex-wrap">
          {["all", ...APP_STATUSES].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-2 font-mono text-[10px] uppercase tracking-[0.2em] border transition-colors ${
                filter === f
                  ? "border-[var(--pg-primary)] text-[var(--pg-primary)]"
                  : "border-[var(--pg-border)] text-[var(--pg-text-2)] hover:text-[var(--pg-text)]"
              }`}
              data-testid={`admin-applications-filter-${f}`}
            >
              {f}
            </button>
          ))}
        </div>
        {jobTitles.length > 0 && (
          <div className="flex items-center gap-2 ml-auto">
            <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-[var(--pg-muted)]">
              Job:
            </span>
            <select
              value={jobFilter}
              onChange={(e) => setJobFilter(e.target.value)}
              className="pg-input py-2 text-xs font-mono uppercase tracking-widest max-w-[280px]"
              data-testid="admin-applications-job-filter"
            >
              <option value="all">All roles</option>
              {jobTitles.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      {loading ? (
        <div className="text-[var(--pg-muted)] font-mono text-sm">Loading…</div>
      ) : displayed.length === 0 ? (
        <div
          className="border border-[var(--pg-border)] p-10 text-center text-[var(--pg-text-2)]"
          data-testid="admin-applications-empty"
        >
          No applications in this view.
        </div>
      ) : (
        <div className="space-y-3">
          {displayed.map((a) => (
            <div
              key={a.id}
              className="border border-[var(--pg-border)] p-5 hover:border-[var(--pg-primary)] transition-colors"
              data-testid={`admin-application-${a.id}`}
            >
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-3 flex-wrap">
                    <div className="font-display text-lg">{a.name}</div>
                    <span
                      className={`font-mono text-[10px] uppercase tracking-[0.15em] px-2 py-1 border ${statusColor[a.status] || statusColor.new}`}
                      data-testid={`admin-application-status-${a.id}`}
                    >
                      {a.status}
                    </span>
                    <span className="font-mono text-[10px] text-[var(--pg-muted)] uppercase tracking-widest">
                      {a.job_title}
                    </span>
                  </div>
                  <div className="mt-1 text-sm text-[var(--pg-text-2)]">
                    <a href={`mailto:${a.email}`} className="hover:text-[var(--pg-primary)]">
                      {a.email}
                    </a>
                    {" · "}
                    {a.phone}
                    {a.portfolio_url ? (
                      <>
                        {" · "}
                        <a
                          href={a.portfolio_url}
                          target="_blank"
                          rel="noreferrer"
                          className="hover:text-[var(--pg-primary)]"
                        >
                          portfolio
                        </a>
                      </>
                    ) : null}
                  </div>
                  <div className="mt-2 font-mono text-[10px] text-[var(--pg-muted)]">
                    Experience: {a.experience}
                  </div>
                  <p
                    className={`mt-3 text-[var(--pg-text-2)] leading-relaxed ${
                      open === a.id ? "" : "line-clamp-2"
                    }`}
                  >
                    {a.cover_letter}
                  </p>
                  <button
                    onClick={() => setOpen(open === a.id ? null : a.id)}
                    className="mt-2 font-mono text-[10px] uppercase tracking-[0.2em] text-[var(--pg-primary)] hover:underline"
                    data-testid={`admin-application-toggle-${a.id}`}
                  >
                    {open === a.id ? "Collapse" : "Expand"}
                  </button>
                  <div className="mt-3 font-mono text-[10px] text-[var(--pg-muted)]">
                    {a.id} · {new Date(a.posted_at).toLocaleString()}
                  </div>
                </div>
                <div className="flex flex-col items-end gap-2 min-w-[140px]">
                  <select
                    value={a.status}
                    onChange={(e) => setStatus(a.id, e.target.value)}
                    className="pg-input py-2 text-xs font-mono uppercase tracking-widest"
                    data-testid={`admin-application-status-select-${a.id}`}
                  >
                    {APP_STATUSES.map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                  <button
                    onClick={() => del(a.id)}
                    className="text-[var(--pg-secondary)] hover:text-[var(--pg-text)] p-2"
                    data-testid={`admin-application-delete-${a.id}`}
                    aria-label="Delete"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

/* -------------------- Site Content Editor -------------------- */
function SiteContentPanel() {
  const { content, refresh } = useSite();
  const [form, setForm] = useState(content);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    setForm(content);
  }, [content]);

  const update = (path, value) => {
    setForm((prev) => {
      const [group, key] = path.split(".");
      return { ...prev, [group]: { ...prev[group], [key]: value } };
    });
  };

  const submit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await api.put("/admin/site", form);
      toast.success("Site content updated");
      refresh();
    } catch (err) {
      toast.error(err?.response?.data?.detail || "Could not save");
    } finally {
      setSubmitting(false);
    }
  };

  const reset = () => setForm(content);

  const heroFields = [
    ["eyebrow", "Hero eyebrow line", "input"],
    ["title_prefix", "Hero title (part 1)", "textarea"],
    ["title_accent", "Accent word (italic cyan)", "input"],
    ["title_suffix", "Hero title (part 3)", "input"],
    ["subtitle", "Hero subtitle paragraph", "textarea"],
    ["currently_shipping", "Right panel line", "input"],
  ];
  const contactFields = [
    ["email", "Email"],
    ["phone_display", "Phone (display)"],
    ["phone_href", "Phone (tel: link, digits only)"],
    ["whatsapp_number", "WhatsApp number (E.164, no +)"],
    ["location", "Location"],
  ];
  const brandFields = [
    ["tagline", "Brand tagline"],
    ["footer_desc", "Footer description paragraph"],
  ];

  return (
    <form
      onSubmit={submit}
      className="grid lg:grid-cols-12 gap-8"
      data-testid="admin-site-panel"
    >
      <aside className="lg:col-span-4 space-y-4 h-fit lg:sticky lg:top-4">
        <div className="border border-[var(--pg-border)] bg-[var(--pg-surface)] p-6">
          <div className="font-mono text-[11px] uppercase tracking-[0.25em] text-[var(--pg-primary)]">
            [ Site Content ]
          </div>
          <h2 className="mt-3 font-display text-2xl">Edit copy without code.</h2>
          <p className="mt-3 text-sm text-[var(--pg-text-2)]">
            Live changes on all public pages — hero, contact info, WhatsApp
            number, footer copy.
          </p>
          <div className="mt-6 flex flex-col gap-3">
            <button
              type="submit"
              disabled={submitting}
              className="pg-btn pg-btn-solid justify-center"
              data-testid="admin-site-save"
            >
              {submitting ? "Saving…" : "Save changes"}
            </button>
            <button
              type="button"
              onClick={reset}
              className="pg-btn justify-center"
              data-testid="admin-site-reset"
            >
              Reset to loaded
            </button>
          </div>
        </div>

        <div className="border border-[var(--pg-border)] bg-[var(--pg-surface)] p-6">
          <div className="font-mono text-[11px] uppercase tracking-[0.25em] text-[var(--pg-accent)]">
            [ Google Search Console ]
          </div>
          <p className="mt-3 text-sm text-[var(--pg-text-2)]">
            Track impressions & CTR from Google Search.
          </p>
          <ol className="mt-4 space-y-2 text-sm text-[var(--pg-text-2)] list-decimal pl-5">
            <li>
              Go to{" "}
              <a
                href="https://search.google.com/search-console"
                target="_blank"
                rel="noreferrer"
                className="text-[var(--pg-primary)] hover:underline"
              >
                Search Console
              </a>{" "}
              and add prismgrim.com.
            </li>
            <li>Verify via DNS TXT record (recommended).</li>
            <li>
              Submit sitemap URL:{" "}
              <span className="font-mono text-[11px] text-[var(--pg-primary)]">
                https://prismgrim.com/api/sitemap.xml
              </span>
            </li>
            <li>Wait 24–48h for first coverage report.</li>
          </ol>
        </div>
      </aside>

      <div className="lg:col-span-8 space-y-6">
        <Group title="Hero section">
          {heroFields.map(([k, label, type]) => (
            <Field key={k} label={label}>
              {type === "textarea" ? (
                <textarea
                  rows={2}
                  className="pg-input resize-y"
                  value={form.hero[k] || ""}
                  onChange={(e) => update(`hero.${k}`, e.target.value)}
                  data-testid={`admin-site-hero-${k}`}
                />
              ) : (
                <input
                  className="pg-input"
                  value={form.hero[k] || ""}
                  onChange={(e) => update(`hero.${k}`, e.target.value)}
                  data-testid={`admin-site-hero-${k}`}
                />
              )}
            </Field>
          ))}
          <div className="text-[11px] font-mono text-[var(--pg-muted)]">
            Title renders as: “
            <span className="text-[var(--pg-text-2)]">
              {form.hero.title_prefix}
            </span>
            <span className="text-[var(--pg-primary)] italic">
              {form.hero.title_accent}
            </span>
            <span className="text-[var(--pg-text-2)]">
              {form.hero.title_suffix}
            </span>
            ”
          </div>
        </Group>

        <Group title="Contact info">
          {contactFields.map(([k, label]) => (
            <Field key={k} label={label}>
              <input
                className="pg-input"
                value={form.contact[k] || ""}
                onChange={(e) => update(`contact.${k}`, e.target.value)}
                data-testid={`admin-site-contact-${k}`}
              />
            </Field>
          ))}
        </Group>

        <Group title="Brand & Footer">
          {brandFields.map(([k, label]) => (
            <Field key={k} label={label}>
              <textarea
                rows={2}
                className="pg-input resize-y"
                value={form.brand[k] || ""}
                onChange={(e) => update(`brand.${k}`, e.target.value)}
                data-testid={`admin-site-brand-${k}`}
              />
            </Field>
          ))}
        </Group>
      </div>
    </form>
  );
}

function Group({ title, children }) {
  return (
    <section className="border border-[var(--pg-border)] bg-[var(--pg-surface)] p-6 md:p-8">
      <div className="font-mono text-[11px] uppercase tracking-[0.25em] text-[var(--pg-primary)] mb-6">
        {title}
      </div>
      <div className="space-y-4">{children}</div>
    </section>
  );
}

function Field({ label, children }) {
  return (
    <div>
      <label className="pg-label">{label}</label>
      {children}
    </div>
  );
}

