import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import {
  Plus, Trash2, Pencil, X, Check, Printer, FileText, ExternalLink, Send,
} from "lucide-react";
import api from "@/lib/api";
import {
  emptyInvoice,
  SERVICE_PRESETS,
  INDIAN_STATES,
  computeTotals,
  formatINR,
  isIntraState,
} from "@/lib/invoiceUtils";
import { useSite } from "@/lib/site";
import InvoiceTemplate from "@/components/invoices/InvoiceTemplate";

const STATUSES = ["draft", "sent", "paid", "overdue", "cancelled"];
const STATUS_COLOR = {
  draft: "border-[var(--pg-muted)] text-[var(--pg-muted)]",
  sent: "border-[var(--pg-accent)] text-[var(--pg-accent)]",
  paid: "border-[var(--pg-primary)] text-[var(--pg-primary)]",
  overdue: "border-[var(--pg-secondary)] text-[var(--pg-secondary)]",
  cancelled: "border-[var(--pg-muted)] text-[var(--pg-muted)]",
};

export default function InvoicesPanel() {
  const { content: site } = useSite();
  const [items, setItems] = useState([]);
  const [filter, setFilter] = useState("all");
  const [editing, setEditing] = useState(null); // invoice object being edited or null
  const [previewing, setPreviewing] = useState(null); // invoice being previewed
  const [sending, setSending] = useState(null); // invoice being sent
  const [loading, setLoading] = useState(true);

  const load = () => {
    setLoading(true);
    api
      .get("/admin/invoices", { params: { status: filter } })
      .then((r) => setItems(r.data))
      .finally(() => setLoading(false));
  };
  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filter]);

  const startCreate = async () => {
    const seed = emptyInvoice();
    try {
      const { data } = await api.get("/admin/invoices/next-number");
      seed.number = data.number;
    } catch {
      /* keep blank */
    }
    const preset = SERVICE_PRESETS[seed.service_type];
    if (preset) {
      seed.items = preset.items.map((x) => ({ ...x }));
      seed.template = preset.template;
      seed.terms = preset.terms;
    }
    // Seed payment from site defaults if set
    if (site?.payment) {
      seed.payment = { ...seed.payment, ...site.payment };
    }
    setEditing(seed);
  };

  const startEdit = (inv) => setEditing({ ...inv });

  const del = async (id) => {
    if (!window.confirm("Delete this invoice?")) return;
    await api.delete(`/admin/invoices/${id}`);
    toast.success("Deleted");
    load();
  };

  const setStatus = async (inv, status) => {
    const body = { ...inv, status };
    delete body.id;
    delete body.created_at;
    delete body.updated_at;
    await api.put(`/admin/invoices/${inv.id}`, body);
    toast.success(`Marked ${status}`);
    load();
  };

  if (editing) {
    return (
      <InvoiceEditor
        invoice={editing}
        onCancel={() => setEditing(null)}
        onSaved={(saved) => {
          setEditing(null);
          setPreviewing(saved);
          load();
        }}
      />
    );
  }

  if (previewing) {
    return (
      <>
        <InvoicePreviewView
          invoice={previewing}
          onBack={() => setPreviewing(null)}
          onEdit={() => {
            const target = previewing;
            setPreviewing(null);
            startEdit(target);
          }}
          onSend={() => setSending(previewing)}
        />
        {sending && (
          <SendInvoiceDialog
            invoice={sending}
            onClose={() => setSending(null)}
            onSent={(updated) => {
              setSending(null);
              if (updated) {
                setPreviewing(updated);
                load();
              }
            }}
          />
        )}
      </>
    );
  }

  return (
    <div className="space-y-6" data-testid="admin-invoices-panel">
      <div className="flex flex-wrap items-center gap-3 justify-between">
        <div className="flex gap-2 flex-wrap">
          {["all", ...STATUSES].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-2 font-mono text-[10px] uppercase tracking-[0.2em] border transition-colors ${
                filter === f
                  ? "border-[var(--pg-primary)] text-[var(--pg-primary)]"
                  : "border-[var(--pg-border)] text-[var(--pg-text-2)] hover:text-[var(--pg-text)]"
              }`}
              data-testid={`admin-invoices-filter-${f}`}
            >
              {f}
            </button>
          ))}
        </div>
        <button
          onClick={startCreate}
          className="pg-btn pg-btn-solid"
          data-testid="admin-invoice-create"
        >
          <Plus size={14} /> New invoice
        </button>
      </div>

      {loading ? (
        <div className="text-[var(--pg-muted)] font-mono text-sm">Loading…</div>
      ) : items.length === 0 ? (
        <div
          className="border border-[var(--pg-border)] p-10 text-center text-[var(--pg-text-2)]"
          data-testid="admin-invoices-empty"
        >
          No invoices in this view. Create your first invoice to get started.
        </div>
      ) : (
        <div className="space-y-3">
          {items.map((inv) => {
            const totals = computeTotals(inv.items || []);
            return (
              <div
                key={inv.id}
                className="border border-[var(--pg-border)] p-5 hover:border-[var(--pg-primary)] transition-colors"
                data-testid={`admin-invoice-${inv.id}`}
              >
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-3 flex-wrap">
                      <div className="font-display text-lg">{inv.number}</div>
                      <span
                        className={`font-mono text-[10px] uppercase tracking-[0.15em] px-2 py-1 border ${STATUS_COLOR[inv.status] || STATUS_COLOR.draft}`}
                      >
                        {inv.status}
                      </span>
                      <span className="font-mono text-[10px] uppercase tracking-widest text-[var(--pg-muted)]">
                        {inv.template}
                      </span>
                    </div>
                    <div className="mt-1 text-sm text-[var(--pg-text-2)]">
                      {inv.client?.name || "—"}{" "}
                      {inv.client?.gstin ? `· ${inv.client.gstin}` : ""}
                    </div>
                    <div className="mt-2 flex flex-wrap items-baseline gap-6">
                      <div>
                        <div className="font-mono text-[10px] uppercase tracking-widest text-[var(--pg-muted)]">
                          Total
                        </div>
                        <div className="font-display text-xl text-[var(--pg-primary)]">
                          {formatINR(totals.total)}
                        </div>
                      </div>
                      <div>
                        <div className="font-mono text-[10px] uppercase tracking-widest text-[var(--pg-muted)]">
                          Issued
                        </div>
                        <div className="text-sm">{inv.issued_date}</div>
                      </div>
                      <div>
                        <div className="font-mono text-[10px] uppercase tracking-widest text-[var(--pg-muted)]">
                          Due
                        </div>
                        <div className="text-sm">{inv.due_date || "—"}</div>
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-2 min-w-[160px]">
                    <select
                      value={inv.status}
                      onChange={(e) => setStatus(inv, e.target.value)}
                      className="pg-input py-2 text-xs font-mono uppercase tracking-widest"
                      data-testid={`admin-invoice-status-${inv.id}`}
                    >
                      {STATUSES.map((s) => (
                        <option key={s} value={s}>
                          {s}
                        </option>
                      ))}
                    </select>
                    <div className="flex gap-2">
                      <button
                        onClick={() => setPreviewing(inv)}
                        className="pg-btn"
                        data-testid={`admin-invoice-preview-${inv.id}`}
                      >
                        <FileText size={14} /> Preview
                      </button>
                      <button
                        onClick={() => setSending(inv)}
                        className="pg-btn pg-btn-solid"
                        data-testid={`admin-invoice-send-${inv.id}`}
                      >
                        <Send size={14} /> Send
                      </button>
                      <a
                        href={`/admin/invoice/${inv.id}/print`}
                        target="_blank"
                        rel="noreferrer"
                        className="pg-btn"
                        data-testid={`admin-invoice-print-${inv.id}`}
                      >
                        <Printer size={14} /> Print
                      </a>
                    </div>
                    <div className="flex gap-2 mt-1">
                      <button
                        onClick={() => startEdit(inv)}
                        className="text-[var(--pg-text-2)] hover:text-[var(--pg-primary)] p-2"
                        data-testid={`admin-invoice-edit-${inv.id}`}
                        aria-label="Edit"
                      >
                        <Pencil size={14} />
                      </button>
                      <button
                        onClick={() => del(inv.id)}
                        className="text-[var(--pg-secondary)] hover:text-[var(--pg-text)] p-2"
                        data-testid={`admin-invoice-delete-${inv.id}`}
                        aria-label="Delete"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
      {sending && (
        <SendInvoiceDialog
          invoice={sending}
          onClose={() => setSending(null)}
          onSent={() => {
            setSending(null);
            load();
          }}
        />
      )}
    </div>
  );
}

/* ----------------- Preview view ----------------- */
function InvoicePreviewView({ invoice, onBack, onEdit, onSend }) {
  return (
    <div className="space-y-6" data-testid="invoice-preview-view">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <div className="font-mono text-[11px] uppercase tracking-[0.25em] text-[var(--pg-primary)]">
            [ Invoice preview ]
          </div>
          <h2 className="mt-2 font-display text-2xl">{invoice.number}</h2>
          {invoice.sent_to && (
            <div className="mt-1 font-mono text-[10px] uppercase tracking-widest text-[var(--pg-muted)]">
              Last sent to {invoice.sent_to}{invoice.sent_at ? ` · ${new Date(invoice.sent_at).toLocaleString()}` : ""}
            </div>
          )}
        </div>
        <div className="flex flex-wrap gap-2">
          <button onClick={onBack} className="pg-btn" data-testid="invoice-preview-back">
            ← Back to list
          </button>
          <button onClick={onEdit} className="pg-btn" data-testid="invoice-preview-edit">
            <Pencil size={14} /> Edit
          </button>
          <button
            onClick={onSend}
            className="pg-btn pg-btn-solid"
            data-testid="invoice-preview-send"
          >
            <Send size={14} /> Send to client
          </button>
          <a
            href={`/admin/invoice/${invoice.id}/print`}
            target="_blank"
            rel="noreferrer"
            className="pg-btn"
            data-testid="invoice-preview-print"
          >
            <Printer size={14} /> Print <ExternalLink size={12} />
          </a>
        </div>
      </div>
      <InvoiceTemplate invoice={invoice} mode="preview" />
    </div>
  );
}

/* ----------------- Send dialog ----------------- */
function SendInvoiceDialog({ invoice, onClose, onSent }) {
  const [to, setTo] = useState(invoice?.client?.email || "");
  const [message, setMessage] = useState("");
  const [ccAdmin, setCcAdmin] = useState(true);
  const [sending, setSending] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    if (!to) {
      toast.error("Recipient email is required");
      return;
    }
    setSending(true);
    try {
      const { data } = await api.post(`/admin/invoices/${invoice.id}/send`, {
        to,
        message,
        cc_admin: ccAdmin,
      });
      toast.success(data?.message || "Invoice sent");
      onSent({ ...invoice, status: "sent", sent_to: to, sent_at: new Date().toISOString() });
    } catch (err) {
      toast.error(err?.response?.data?.detail || "Could not send invoice");
    } finally {
      setSending(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-[80] bg-black/70 backdrop-blur-sm flex items-start md:items-center justify-center p-4 overflow-y-auto"
      data-testid="invoice-send-dialog"
    >
      <form
        onSubmit={submit}
        className="relative w-full max-w-lg bg-[var(--pg-surface)] border border-[var(--pg-border)] p-6 md:p-8 my-8"
      >
        <button
          type="button"
          className="absolute top-3 right-3 text-[var(--pg-text-2)] hover:text-[var(--pg-text)] transition-colors"
          onClick={onClose}
          data-testid="invoice-send-close"
          aria-label="Close"
        >
          <X size={16} />
        </button>
        <div className="font-mono text-[11px] uppercase tracking-[0.25em] text-[var(--pg-primary)]">
          [ Send invoice ]
        </div>
        <h3 className="mt-2 font-display text-2xl leading-tight">
          Email {invoice.number} to client
        </h3>
        <p className="mt-2 text-sm text-[var(--pg-text-2)]">
          A PDF copy is attached automatically. Status flips to <b>sent</b> if
          the invoice is currently a draft.
        </p>

        <div className="mt-6 space-y-4">
          <div>
            <label className="pg-label">Recipient email</label>
            <input
              required
              type="email"
              className="pg-input"
              value={to}
              onChange={(e) => setTo(e.target.value)}
              data-testid="invoice-send-to"
              placeholder="client@example.com"
            />
          </div>
          <div>
            <label className="pg-label">Personal note (optional)</label>
            <textarea
              rows={4}
              className="pg-input resize-y"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Anything you want to say — otherwise a friendly default is used."
              data-testid="invoice-send-message"
            />
          </div>
          <label className="flex items-center gap-3 text-sm text-[var(--pg-text-2)]">
            <input
              type="checkbox"
              checked={ccAdmin}
              onChange={(e) => setCcAdmin(e.target.checked)}
              data-testid="invoice-send-cc-admin"
              className="accent-[var(--pg-primary)]"
            />
            Also send a copy to admin (prismgrim@gmail.com)
          </label>
        </div>

        <div className="mt-6 flex justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="pg-btn"
            data-testid="invoice-send-cancel"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={sending}
            className="pg-btn pg-btn-solid"
            data-testid="invoice-send-submit"
          >
            <Send size={14} /> {sending ? "Sending…" : "Send now"}
          </button>
        </div>
      </form>
    </div>
  );
}

/* ----------------- Editor form ----------------- */
function InvoiceEditor({ invoice, onCancel, onSaved }) {
  const [form, setForm] = useState(invoice);
  const [submitting, setSubmitting] = useState(false);
  const totals = useMemo(() => computeTotals(form.items || []), [form.items]);
  const intra = isIntraState(form.biller, form.client);

  const isEdit = Boolean(invoice.id);

  const set = (path, value) => {
    setForm((prev) => {
      const p = { ...prev };
      const keys = path.split(".");
      let target = p;
      for (let i = 0; i < keys.length - 1; i++) {
        target[keys[i]] = { ...target[keys[i]] };
        target = target[keys[i]];
      }
      target[keys[keys.length - 1]] = value;
      return p;
    });
  };

  const applyPreset = (key) => {
    const preset = SERVICE_PRESETS[key];
    if (!preset) return;
    setForm((prev) => ({
      ...prev,
      service_type: key,
      template: preset.template,
      items: preset.items.map((x) => ({ ...x })),
      terms: preset.terms,
    }));
  };

  const updateItem = (idx, field, value) => {
    setForm((prev) => {
      const next = [...prev.items];
      next[idx] = { ...next[idx], [field]: value };
      return { ...prev, items: next };
    });
  };

  const addItem = () => {
    const base = intra
      ? { cgst_rate: 9, sgst_rate: 9, igst_rate: 0 }
      : { cgst_rate: 0, sgst_rate: 0, igst_rate: 18 };
    setForm((prev) => ({
      ...prev,
      items: [
        ...prev.items,
        { description: "", hsn_sac: "", quantity: 1, rate: 0, ...base },
      ],
    }));
  };

  const removeItem = (idx) => {
    setForm((prev) => ({
      ...prev,
      items: prev.items.filter((_, i) => i !== idx),
    }));
  };

  const flipTaxScheme = () => {
    setForm((prev) => ({
      ...prev,
      items: prev.items.map((it) =>
        intra
          ? { ...it, cgst_rate: 0, sgst_rate: 0, igst_rate: (Number(it.cgst_rate) || 0) + (Number(it.sgst_rate) || 0) || 18 }
          : { ...it, cgst_rate: (Number(it.igst_rate) || 0) / 2 || 9, sgst_rate: (Number(it.igst_rate) || 0) / 2 || 9, igst_rate: 0 }
      ),
    }));
  };

  const save = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    const body = { ...form };
    delete body.id;
    delete body.created_at;
    delete body.updated_at;
    try {
      const { data } = isEdit
        ? await api.put(`/admin/invoices/${invoice.id}`, body)
        : await api.post("/admin/invoices", body);
      toast.success(isEdit ? "Invoice updated" : "Invoice created");
      onSaved(data);
    } catch (err) {
      toast.error(err?.response?.data?.detail || "Could not save");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={save} className="space-y-6" data-testid="admin-invoice-editor">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <div className="font-mono text-[11px] uppercase tracking-[0.25em] text-[var(--pg-primary)]">
            [ {isEdit ? "Edit invoice" : "New invoice"} ]
          </div>
          <h2 className="mt-2 font-display text-2xl">
            {form.number || "Untitled"}
          </h2>
        </div>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={onCancel}
            className="pg-btn"
            data-testid="admin-invoice-cancel"
          >
            <X size={14} /> Cancel
          </button>
          <button
            type="submit"
            disabled={submitting}
            className="pg-btn pg-btn-solid"
            data-testid="admin-invoice-save"
          >
            <Check size={14} /> {submitting ? "Saving…" : isEdit ? "Update" : "Create"}
          </button>
        </div>
      </div>

      {/* Meta */}
      <section className="pg-card p-6 grid md:grid-cols-4 gap-4">
        <div>
          <label className="pg-label">Invoice #</label>
          <input
            required
            className="pg-input"
            value={form.number}
            onChange={(e) => set("number", e.target.value)}
            data-testid="invoice-number"
          />
        </div>
        <div>
          <label className="pg-label">Issue date</label>
          <input
            required
            type="date"
            className="pg-input"
            value={form.issued_date}
            onChange={(e) => set("issued_date", e.target.value)}
            data-testid="invoice-issued-date"
          />
        </div>
        <div>
          <label className="pg-label">Due date</label>
          <input
            type="date"
            className="pg-input"
            value={form.due_date}
            onChange={(e) => set("due_date", e.target.value)}
            data-testid="invoice-due-date"
          />
        </div>
        <div>
          <label className="pg-label">Status</label>
          <select
            className="pg-input"
            value={form.status}
            onChange={(e) => set("status", e.target.value)}
            data-testid="invoice-status"
          >
            {STATUSES.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </div>
        <div className="md:col-span-2">
          <label className="pg-label">Service preset</label>
          <select
            className="pg-input"
            value={form.service_type}
            onChange={(e) => applyPreset(e.target.value)}
            data-testid="invoice-service-preset"
          >
            {Object.entries(SERVICE_PRESETS).map(([k, v]) => (
              <option key={k} value={k}>{v.label}</option>
            ))}
          </select>
        </div>
        <div className="md:col-span-2">
          <label className="pg-label">Template</label>
          <div className="flex gap-2 flex-wrap">
            {["modern", "classic", "corporate"].map((tp) => (
              <button
                key={tp}
                type="button"
                onClick={() => set("template", tp)}
                className={`px-4 py-2 font-mono text-[10px] uppercase tracking-[0.2em] border transition-colors ${
                  form.template === tp
                    ? "border-[var(--pg-primary)] text-[var(--pg-primary)] bg-[var(--pg-surface-2)]"
                    : "border-[var(--pg-border)] text-[var(--pg-text-2)] hover:text-[var(--pg-text)]"
                }`}
                data-testid={`invoice-template-${tp}`}
              >
                {tp}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Parties */}
      <section className="grid md:grid-cols-2 gap-4">
        <PartyForm
          label="Biller (you)"
          party={form.biller}
          onChange={(k, v) => set(`biller.${k}`, v)}
          testPrefix="invoice-biller"
        />
        <PartyForm
          label="Client"
          party={form.client}
          onChange={(k, v) => set(`client.${k}`, v)}
          testPrefix="invoice-client"
        />
      </section>

      {/* Tax scheme */}
      <section className="pg-card p-4 flex flex-wrap items-center gap-4 justify-between">
        <div>
          <div className="font-mono text-[11px] uppercase tracking-[0.2em] text-[var(--pg-muted)]">
            Tax scheme
          </div>
          <div className="mt-1 text-sm">
            Detected:{" "}
            <span className="text-[var(--pg-primary)] font-semibold">
              {intra ? "Intra-state (CGST + SGST)" : "Inter-state (IGST)"}
            </span>
          </div>
        </div>
        <button
          type="button"
          onClick={flipTaxScheme}
          className="pg-btn"
          data-testid="invoice-flip-tax"
        >
          Switch to {intra ? "IGST" : "CGST+SGST"}
        </button>
      </section>

      {/* Items */}
      <section className="pg-card p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="font-mono text-[11px] uppercase tracking-[0.2em] text-[var(--pg-muted)]">
            Line items ({form.items.length})
          </div>
          <button
            type="button"
            onClick={addItem}
            className="pg-btn"
            data-testid="invoice-add-item"
          >
            <Plus size={14} /> Add item
          </button>
        </div>
        <div className="space-y-3">
          {form.items.map((it, idx) => (
            <div
              key={idx}
              className="grid grid-cols-12 gap-2 items-start border border-[var(--pg-border)] p-3"
              data-testid={`invoice-item-${idx}`}
            >
              <div className="col-span-12 md:col-span-4">
                <label className="pg-label">Description</label>
                <input
                  required
                  className="pg-input"
                  value={it.description}
                  onChange={(e) => updateItem(idx, "description", e.target.value)}
                />
              </div>
              <div className="col-span-6 md:col-span-1">
                <label className="pg-label">HSN/SAC</label>
                <input
                  className="pg-input"
                  value={it.hsn_sac}
                  onChange={(e) => updateItem(idx, "hsn_sac", e.target.value)}
                />
              </div>
              <div className="col-span-3 md:col-span-1">
                <label className="pg-label">Qty</label>
                <input
                  required
                  type="number"
                  step="0.01"
                  min="0.01"
                  className="pg-input"
                  value={it.quantity}
                  onChange={(e) => updateItem(idx, "quantity", parseFloat(e.target.value) || 0)}
                />
              </div>
              <div className="col-span-3 md:col-span-2">
                <label className="pg-label">Rate (₹)</label>
                <input
                  required
                  type="number"
                  min="0"
                  step="0.01"
                  className="pg-input"
                  value={it.rate}
                  onChange={(e) => updateItem(idx, "rate", parseFloat(e.target.value) || 0)}
                />
              </div>
              <div className="col-span-4 md:col-span-1">
                <label className="pg-label">CGST %</label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  step="0.5"
                  className="pg-input"
                  value={it.cgst_rate}
                  onChange={(e) => updateItem(idx, "cgst_rate", parseFloat(e.target.value) || 0)}
                />
              </div>
              <div className="col-span-4 md:col-span-1">
                <label className="pg-label">SGST %</label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  step="0.5"
                  className="pg-input"
                  value={it.sgst_rate}
                  onChange={(e) => updateItem(idx, "sgst_rate", parseFloat(e.target.value) || 0)}
                />
              </div>
              <div className="col-span-4 md:col-span-1">
                <label className="pg-label">IGST %</label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  step="0.5"
                  className="pg-input"
                  value={it.igst_rate}
                  onChange={(e) => updateItem(idx, "igst_rate", parseFloat(e.target.value) || 0)}
                />
              </div>
              <div className="col-span-12 md:col-span-1 flex md:justify-end items-end">
                {form.items.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeItem(idx)}
                    className="text-[var(--pg-secondary)] hover:text-[var(--pg-text)] p-2"
                    aria-label="Remove item"
                  >
                    <Trash2 size={14} />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
        {/* Totals summary */}
        <div className="mt-6 pt-4 border-t border-[var(--pg-border)] flex justify-end">
          <div className="w-full max-w-[320px] space-y-2 text-sm">
            <Row label="Subtotal" value={formatINR(totals.subtotal)} />
            {totals.cgst > 0 && <Row label="CGST" value={formatINR(totals.cgst)} />}
            {totals.sgst > 0 && <Row label="SGST" value={formatINR(totals.sgst)} />}
            {totals.igst > 0 && <Row label="IGST" value={formatINR(totals.igst)} />}
            <div className="flex justify-between pt-2 border-t border-[var(--pg-border)]">
              <span className="font-semibold">Total</span>
              <span className="font-bold text-lg text-[var(--pg-primary)]">
                {formatINR(totals.total)}
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Notes & terms */}
      <section className="pg-card p-6 grid md:grid-cols-2 gap-4">
        <div>
          <label className="pg-label">Notes (customer-facing)</label>
          <textarea
            rows={3}
            className="pg-input resize-y"
            value={form.notes}
            onChange={(e) => set("notes", e.target.value)}
            data-testid="invoice-notes"
          />
        </div>
        <div>
          <label className="pg-label">Terms & payment instructions</label>
          <textarea
            rows={3}
            className="pg-input resize-y"
            value={form.terms}
            onChange={(e) => set("terms", e.target.value)}
            data-testid="invoice-terms"
          />
        </div>
      </section>

      <PaymentSection payment={form.payment || {}} onChange={(k, v) => set(`payment.${k}`, v)} />
    </form>
  );
}

/* ----------------- Payment editor + QR upload ----------------- */
function PaymentSection({ payment, onChange }) {
  const [preview, setPreview] = useState(payment.qr_data_url || "");
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    setPreview(payment.qr_data_url || "");
  }, [payment.qr_data_url]);

  const handleFile = (file) => {
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      toast.error("QR must be an image (PNG/JPG/SVG)");
      return;
    }
    if (file.size > 500 * 1024) {
      toast.error("QR image too large (max 500KB). Compress it and try again.");
      return;
    }
    setUploading(true);
    const reader = new FileReader();
    reader.onload = (e) => {
      const dataUrl = String(e.target?.result || "");
      onChange("qr_data_url", dataUrl);
      setPreview(dataUrl);
      setUploading(false);
      toast.success("QR uploaded");
    };
    reader.onerror = () => {
      setUploading(false);
      toast.error("Could not read file");
    };
    reader.readAsDataURL(file);
  };

  const clearQR = () => {
    onChange("qr_data_url", "");
    setPreview("");
  };

  const fields = [
    ["account_name", "Account name"],
    ["bank_name", "Bank name"],
    ["account_number", "Account number"],
    ["ifsc", "IFSC code"],
    ["upi_id", "UPI ID"],
  ];

  return (
    <section className="pg-card p-6" data-testid="invoice-payment-section">
      <div className="flex items-center justify-between mb-4">
        <div>
          <div className="font-mono text-[11px] uppercase tracking-[0.2em] text-[var(--pg-primary)]">
            [ Payment details ]
          </div>
          <div className="mt-1 text-sm text-[var(--pg-text-2)]">
            Renders on the invoice PDF so the client can pay in one tap.
          </div>
        </div>
      </div>
      <div className="grid md:grid-cols-12 gap-6">
        <div className="md:col-span-8 grid md:grid-cols-2 gap-4">
          {fields.map(([k, label]) => (
            <div key={k}>
              <label className="pg-label">{label}</label>
              <input
                className="pg-input"
                value={payment[k] || ""}
                onChange={(e) =>
                  onChange(k, k === "ifsc" ? e.target.value.toUpperCase() : e.target.value)
                }
                data-testid={`invoice-payment-${k}`}
              />
            </div>
          ))}
        </div>
        <div className="md:col-span-4">
          <label className="pg-label">Payment QR (PNG / JPG · max 500KB)</label>
          <div className="border border-[var(--pg-border)] p-3 flex flex-col items-center">
            {preview ? (
              <img
                src={preview}
                alt="Payment QR preview"
                className="w-40 h-40 object-contain bg-white p-2 border border-[var(--pg-border-soft)]"
                data-testid="invoice-payment-qr-preview"
              />
            ) : (
              <div
                className="w-40 h-40 flex items-center justify-center border border-dashed border-[var(--pg-border)] text-[var(--pg-muted)] text-[11px] font-mono uppercase tracking-widest"
                data-testid="invoice-payment-qr-empty"
              >
                No QR yet
              </div>
            )}
            <label
              className="mt-3 pg-btn cursor-pointer"
              data-testid="invoice-payment-qr-upload-label"
            >
              {uploading ? "Reading…" : preview ? "Replace QR" : "Upload QR"}
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => handleFile(e.target.files?.[0])}
                data-testid="invoice-payment-qr-upload"
              />
            </label>
            {preview && (
              <button
                type="button"
                onClick={clearQR}
                className="mt-2 text-[11px] font-mono uppercase tracking-widest text-[var(--pg-secondary)] hover:text-[var(--pg-text)]"
                data-testid="invoice-payment-qr-clear"
              >
                Remove QR
              </button>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

function Row({ label, value }) {
  return (
    <div className="flex justify-between text-[var(--pg-text-2)]">
      <span>{label}</span>
      <span>{value}</span>
    </div>
  );
}

function PartyForm({ label, party, onChange, testPrefix }) {
  return (
    <div className="pg-card p-6">
      <div className="font-mono text-[11px] uppercase tracking-[0.2em] text-[var(--pg-muted)] mb-4">
        {label}
      </div>
      <div className="space-y-3">
        <div>
          <label className="pg-label">Name</label>
          <input
            required
            className="pg-input"
            value={party.name}
            onChange={(e) => onChange("name", e.target.value)}
            data-testid={`${testPrefix}-name`}
          />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="pg-label">GSTIN</label>
            <input
              className="pg-input"
              value={party.gstin || ""}
              onChange={(e) => onChange("gstin", e.target.value.toUpperCase())}
              data-testid={`${testPrefix}-gstin`}
            />
          </div>
          <div>
            <label className="pg-label">State</label>
            <select
              className="pg-input"
              value={party.state_code || ""}
              onChange={(e) => {
                const code = e.target.value;
                const name = INDIAN_STATES.find((s) => s[0] === code)?.[1] || "";
                onChange("state_code", code);
                onChange("state", name);
              }}
              data-testid={`${testPrefix}-state`}
            >
              <option value="">Select state</option>
              {INDIAN_STATES.map(([code, name]) => (
                <option key={code} value={code}>
                  {code} — {name}
                </option>
              ))}
            </select>
          </div>
        </div>
        <div>
          <label className="pg-label">Address</label>
          <textarea
            rows={2}
            className="pg-input resize-y"
            value={party.address || ""}
            onChange={(e) => onChange("address", e.target.value)}
            data-testid={`${testPrefix}-address`}
          />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="pg-label">Email</label>
            <input
              type="email"
              className="pg-input"
              value={party.email || ""}
              onChange={(e) => onChange("email", e.target.value)}
              data-testid={`${testPrefix}-email`}
            />
          </div>
          <div>
            <label className="pg-label">Phone</label>
            <input
              className="pg-input"
              value={party.phone || ""}
              onChange={(e) => onChange("phone", e.target.value)}
              data-testid={`${testPrefix}-phone`}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
