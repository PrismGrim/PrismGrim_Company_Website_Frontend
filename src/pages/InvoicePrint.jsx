import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Printer, ArrowLeft } from "lucide-react";
import api from "@/lib/api";
import InvoiceTemplate from "@/components/invoices/InvoiceTemplate";

export default function InvoicePrintPage() {
  const { id } = useParams();
  const [inv, setInv] = useState(null);
  const [error, setError] = useState("");
  const [token] = useState(() => localStorage.getItem("pg_admin_token") || "");

  useEffect(() => {
    if (!token) {
      setError("Admin login required. Open /admin first.");
      return;
    }
    api
      .get(`/admin/invoices/${id}`)
      .then((r) => setInv(r.data))
      .catch((e) => setError(e?.response?.data?.detail || "Not found"));
  }, [id, token]);

  if (error) {
    return (
      <div
        className="min-h-screen flex items-center justify-center p-8 bg-[var(--pg-bg)] text-[var(--pg-text)]"
        data-testid="invoice-print-error"
      >
        <div className="max-w-md text-center">
          <div className="font-mono text-[11px] uppercase tracking-[0.25em] text-[var(--pg-secondary)]">
            [ Error ]
          </div>
          <h1 className="mt-3 font-display text-3xl">{error}</h1>
          <Link to="/admin" className="pg-btn mt-6 inline-flex">
            <ArrowLeft size={14} /> Back to Admin
          </Link>
        </div>
      </div>
    );
  }
  if (!inv) return null;

  return (
    <div className="min-h-screen bg-[#dcdad3] text-[var(--pg-text)]" data-testid="invoice-print-page">
      <div className="print:hidden sticky top-0 z-10 border-b border-[var(--pg-border)] bg-[var(--pg-bg)] text-[var(--pg-text)] px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link to="/admin" className="text-sm text-[var(--pg-text-2)] hover:text-[var(--pg-text)]">
            <ArrowLeft size={14} className="inline" /> Admin
          </Link>
          <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-[var(--pg-muted)]">
            {inv.number} · {inv.template} · {inv.status}
          </span>
        </div>
        <button
          onClick={() => window.print()}
          className="pg-btn pg-btn-solid"
          data-testid="invoice-print-btn"
        >
          <Printer size={14} /> Print / Save PDF
        </button>
      </div>

      <div className="py-10 print:py-0">
        <InvoiceTemplate invoice={inv} mode="print" />
      </div>

      <style>{`
        @media print {
          html, body { background: #fff !important; }
          @page { size: A4; margin: 0; }
        }
      `}</style>
    </div>
  );
}
