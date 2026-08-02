import { computeTotals, formatINR, amountInWords } from "@/lib/invoiceUtils";

/**
 * InvoiceTemplate — renders one of 3 templates.
 * `mode="preview"` shows the invoice inside admin (theme-aware colors).
 * `mode="print"` forces white background + black text for A4 printing.
 */
export default function InvoiceTemplate({ invoice, mode = "preview" }) {
  if (!invoice) return null;
  const t = invoice.template || "modern";
  const totals = computeTotals(invoice.items || []);

  const printClass =
    mode === "print"
      ? "bg-white text-black w-[210mm] min-h-[297mm] mx-auto p-[18mm] print:p-[18mm] print:shadow-none print:w-full print:min-h-0"
      : "bg-[var(--pg-surface)] text-[var(--pg-text)] p-8 border border-[var(--pg-border)]";

  const wrapperClass = `${printClass} ${mode === "print" ? "" : "rounded-none"}`;

  const props = { invoice, totals, mode };

  return (
    <div className={wrapperClass} data-testid={`invoice-template-${t}`}>
      {t === "classic" ? (
        <ClassicTemplate {...props} />
      ) : t === "corporate" ? (
        <CorporateTemplate {...props} />
      ) : (
        <ModernTemplate {...props} />
      )}
    </div>
  );
}

/* Palette helpers so both preview and print look right */
const c = (mode) => ({
  ink: mode === "print" ? "#000" : "var(--pg-text)",
  ink2: mode === "print" ? "#444" : "var(--pg-text-2)",
  muted: mode === "print" ? "#666" : "var(--pg-muted)",
  line: mode === "print" ? "#111" : "var(--pg-border)",
  soft: mode === "print" ? "#e5e5e5" : "var(--pg-border-soft)",
  accent: mode === "print" ? "#0e7490" : "var(--pg-primary)",
  bgSoft: mode === "print" ? "#f7f7f6" : "var(--pg-surface-2)",
});

/* ============ Modern ============ */
function ModernTemplate({ invoice, totals, mode }) {
  const col = c(mode);
  return (
    <div className="font-mono" style={{ color: col.ink }}>
      <header className="flex items-start justify-between border-b pb-6" style={{ borderColor: col.line }}>
        <div>
          <div className="text-[10px] tracking-[0.35em] uppercase" style={{ color: col.accent }}>
            PrismGrim · Tax Invoice
          </div>
          <h1 className="mt-3 text-4xl font-bold tracking-tight" style={{ fontFamily: "Unbounded, sans-serif" }}>
            {invoice.number || "INVOICE"}
          </h1>
          <div className="mt-2 text-xs uppercase tracking-widest" style={{ color: col.ink2 }}>
            Issued {invoice.issued_date} · Due {invoice.due_date || "—"}
          </div>
        </div>
        <div className="text-right text-xs">
          <div className="text-[10px] tracking-[0.35em] uppercase" style={{ color: col.muted }}>
            Billed by
          </div>
          <div className="mt-2 text-sm font-semibold" style={{ color: col.ink }}>
            {invoice.biller.name}
          </div>
          <div style={{ color: col.ink2 }}>{invoice.biller.address}</div>
          <div>GSTIN: {invoice.biller.gstin}</div>
          <div>{invoice.biller.email}</div>
          <div>{invoice.biller.phone}</div>
        </div>
      </header>

      <section className="mt-8">
        <div className="text-[10px] tracking-[0.35em] uppercase" style={{ color: col.muted }}>
          Billed to
        </div>
        <div className="mt-2 text-sm font-semibold">{invoice.client.name || "—"}</div>
        <div className="text-xs" style={{ color: col.ink2 }}>
          {invoice.client.address}
        </div>
        {invoice.client.gstin && <div className="text-xs">GSTIN: {invoice.client.gstin}</div>}
        {invoice.client.email && <div className="text-xs">{invoice.client.email}</div>}
      </section>

      <ItemsTable invoice={invoice} totals={totals} mode={mode} tight />
      <TotalsBlock totals={totals} mode={mode} align="right" />
      <Footer invoice={invoice} totals={totals} mode={mode} />
    </div>
  );
}

/* ============ Classic ============ */
function ClassicTemplate({ invoice, totals, mode }) {
  const col = c(mode);
  return (
    <div style={{ color: col.ink, fontFamily: "'IBM Plex Sans', sans-serif" }}>
      <div
        className="text-center border-4 py-6"
        style={{ borderColor: col.line, borderStyle: "double" }}
      >
        <div className="text-3xl font-bold tracking-widest">TAX INVOICE</div>
        <div className="text-xs uppercase tracking-[0.3em] mt-1" style={{ color: col.ink2 }}>
          Original for recipient
        </div>
      </div>

      <div className="grid grid-cols-2 mt-6 border" style={{ borderColor: col.line }}>
        <PartyBlock title="From" party={invoice.biller} col={col} rightBorder />
        <PartyBlock title="Bill To" party={invoice.client} col={col} />
      </div>

      <div className="grid grid-cols-3 mt-0 border border-t-0" style={{ borderColor: col.line }}>
        <MetaCell col={col} label="Invoice #" value={invoice.number} rightBorder />
        <MetaCell col={col} label="Issue Date" value={invoice.issued_date} rightBorder />
        <MetaCell col={col} label="Due Date" value={invoice.due_date || "—"} />
      </div>

      <ItemsTable invoice={invoice} totals={totals} mode={mode} bordered />
      <TotalsBlock totals={totals} mode={mode} align="right" bordered />
      <Footer invoice={invoice} totals={totals} mode={mode} bordered />
    </div>
  );
}

function PartyBlock({ title, party, col, rightBorder }) {
  return (
    <div
      className="p-4"
      style={{ borderRight: rightBorder ? `1px solid ${col.line}` : undefined }}
    >
      <div className="text-[10px] tracking-[0.3em] uppercase" style={{ color: col.muted }}>
        {title}
      </div>
      <div className="mt-2 text-sm font-semibold">{party.name || "—"}</div>
      <div className="text-xs" style={{ color: col.ink2 }}>{party.address}</div>
      {party.gstin && <div className="text-xs mt-1">GSTIN: {party.gstin}</div>}
      {party.state && (
        <div className="text-xs">State: {party.state} ({party.state_code})</div>
      )}
      {party.email && <div className="text-xs">{party.email}</div>}
      {party.phone && <div className="text-xs">{party.phone}</div>}
    </div>
  );
}

function MetaCell({ label, value, col, rightBorder }) {
  return (
    <div
      className="p-3"
      style={{ borderRight: rightBorder ? `1px solid ${col.line}` : undefined }}
    >
      <div className="text-[10px] tracking-[0.3em] uppercase" style={{ color: col.muted }}>
        {label}
      </div>
      <div className="mt-1 text-sm font-semibold">{value || "—"}</div>
    </div>
  );
}

/* ============ Corporate ============ */
function CorporateTemplate({ invoice, totals, mode }) {
  const col = c(mode);
  return (
    <div style={{ color: col.ink, fontFamily: "'IBM Plex Sans', sans-serif" }}>
      <header
        className="flex items-start justify-between p-6"
        style={{ background: col.bgSoft }}
      >
        <div className="flex items-center gap-4">
          <img src="/logo.png" alt="PrismGrim" className="h-12 w-auto" />
          <div>
            <div className="text-sm font-semibold">{invoice.biller.name}</div>
            <div className="text-xs" style={{ color: col.ink2 }}>{invoice.biller.address}</div>
            <div className="text-xs">GSTIN: {invoice.biller.gstin}</div>
          </div>
        </div>
        <div className="text-right">
          <div className="text-3xl font-bold" style={{ fontFamily: "Unbounded, sans-serif", color: col.accent }}>
            INVOICE
          </div>
          <div className="text-xs mt-1" style={{ color: col.ink2 }}>{invoice.number}</div>
          <div className="text-xs">Issued {invoice.issued_date}</div>
          <div className="text-xs">Due {invoice.due_date || "—"}</div>
        </div>
      </header>

      <section className="grid grid-cols-2 mt-6">
        <div>
          <div className="text-[10px] tracking-[0.3em] uppercase" style={{ color: col.muted }}>
            Bill to
          </div>
          <div className="mt-2 text-base font-semibold">{invoice.client.name || "—"}</div>
          <div className="text-xs" style={{ color: col.ink2 }}>{invoice.client.address}</div>
          {invoice.client.gstin && <div className="text-xs">GSTIN: {invoice.client.gstin}</div>}
          {invoice.client.state && (
            <div className="text-xs">State: {invoice.client.state} ({invoice.client.state_code})</div>
          )}
          {invoice.client.email && <div className="text-xs">{invoice.client.email}</div>}
        </div>
        <div className="text-right">
          <div className="text-[10px] tracking-[0.3em] uppercase" style={{ color: col.muted }}>
            Amount due
          </div>
          <div className="mt-2 text-3xl font-bold" style={{ color: col.accent, fontFamily: "Unbounded, sans-serif" }}>
            {formatINR(totals.total)}
          </div>
        </div>
      </section>

      <ItemsTable invoice={invoice} totals={totals} mode={mode} tight />
      <TotalsBlock totals={totals} mode={mode} align="right" />
      <Footer invoice={invoice} totals={totals} mode={mode} />
    </div>
  );
}

/* ============ Shared table & totals ============ */
function ItemsTable({ invoice, totals, mode, tight, bordered }) {
  const col = c(mode);
  const border = `1px solid ${col.line}`;
  const rowStyle = { borderBottom: `1px solid ${col.soft}` };
  return (
    <table
      className="w-full mt-8 text-xs"
      style={bordered ? { border } : {}}
    >
      <thead>
        <tr style={{ background: col.bgSoft }}>
          <th className="text-left p-2 uppercase tracking-widest" style={{ color: col.muted, fontSize: 10 }}>#</th>
          <th className="text-left p-2 uppercase tracking-widest" style={{ color: col.muted, fontSize: 10 }}>Description</th>
          <th className="text-left p-2 uppercase tracking-widest" style={{ color: col.muted, fontSize: 10 }}>HSN/SAC</th>
          <th className="text-right p-2 uppercase tracking-widest" style={{ color: col.muted, fontSize: 10 }}>Qty</th>
          <th className="text-right p-2 uppercase tracking-widest" style={{ color: col.muted, fontSize: 10 }}>Rate</th>
          <th className="text-right p-2 uppercase tracking-widest" style={{ color: col.muted, fontSize: 10 }}>CGST</th>
          <th className="text-right p-2 uppercase tracking-widest" style={{ color: col.muted, fontSize: 10 }}>SGST</th>
          <th className="text-right p-2 uppercase tracking-widest" style={{ color: col.muted, fontSize: 10 }}>IGST</th>
          <th className="text-right p-2 uppercase tracking-widest" style={{ color: col.muted, fontSize: 10 }}>Total</th>
        </tr>
      </thead>
      <tbody>
        {invoice.items.map((it, i) => {
          const line = totals.lines[i] || {};
          return (
            <tr key={i} style={tight ? rowStyle : rowStyle}>
              <td className="p-2 align-top">{i + 1}</td>
              <td className="p-2 align-top">{it.description}</td>
              <td className="p-2 align-top">{it.hsn_sac || "—"}</td>
              <td className="p-2 align-top text-right">{it.quantity}</td>
              <td className="p-2 align-top text-right">{formatINR(it.rate)}</td>
              <td className="p-2 align-top text-right">
                {formatINR(line.cgst)}
                <div style={{ color: col.muted, fontSize: 9 }}>{it.cgst_rate}%</div>
              </td>
              <td className="p-2 align-top text-right">
                {formatINR(line.sgst)}
                <div style={{ color: col.muted, fontSize: 9 }}>{it.sgst_rate}%</div>
              </td>
              <td className="p-2 align-top text-right">
                {formatINR(line.igst)}
                <div style={{ color: col.muted, fontSize: 9 }}>{it.igst_rate}%</div>
              </td>
              <td className="p-2 align-top text-right font-semibold">{formatINR(line.total)}</td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}

function TotalsBlock({ totals, mode }) {
  const col = c(mode);
  const rows = [
    ["Subtotal", totals.subtotal],
    ["CGST", totals.cgst],
    ["SGST", totals.sgst],
    ["IGST", totals.igst],
  ].filter(([, v], i) => (i === 0 ? true : v > 0));
  return (
    <div className="flex justify-end mt-6">
      <div className="w-full max-w-[320px] text-sm">
        {rows.map(([k, v]) => (
          <div key={k} className="flex justify-between py-1" style={{ borderBottom: `1px solid ${col.soft}` }}>
            <span style={{ color: col.ink2 }}>{k}</span>
            <span>{formatINR(v)}</span>
          </div>
        ))}
        <div
          className="flex justify-between py-2 mt-1"
          style={{ borderTop: `2px solid ${col.line}`, borderBottom: `2px solid ${col.line}` }}
        >
          <span className="font-semibold">Total</span>
          <span className="font-bold text-lg" style={{ color: col.accent }}>
            {formatINR(totals.total)}
          </span>
        </div>
      </div>
    </div>
  );
}

function Footer({ invoice, totals, mode }) {
  const col = c(mode);
  const p = invoice.payment || {};
  const hasPay =
    p.bank_name || p.account_number || p.upi_id || p.qr_data_url;
  return (
    <>
      <div className="mt-6 text-xs italic" style={{ color: col.ink2 }}>
        <span style={{ color: col.muted, fontStyle: "normal" }}>Amount in words: </span>
        {amountInWords(totals.total)}
      </div>
      {hasPay && (
        <table
          className="w-full mt-6 text-xs"
          style={{ border: `1px solid ${col.line}` }}
        >
          <tbody>
            <tr>
              <td className="align-top p-4">
                <div className="text-[10px] tracking-[0.3em] uppercase" style={{ color: col.muted }}>
                  Pay via UPI or bank transfer
                </div>
                <div className="mt-2 leading-relaxed" style={{ color: col.ink2 }}>
                  {p.account_name && (<div><b style={{ color: col.ink }}>Account name:</b> {p.account_name}</div>)}
                  {p.bank_name && (<div><b style={{ color: col.ink }}>Bank:</b> {p.bank_name}</div>)}
                  {p.account_number && (<div><b style={{ color: col.ink }}>A/c No:</b> {p.account_number}</div>)}
                  {p.ifsc && (<div><b style={{ color: col.ink }}>IFSC:</b> {p.ifsc}</div>)}
                  {p.upi_id && (
                    <div>
                      <b style={{ color: col.ink }}>UPI:</b>{" "}
                      <span style={{ color: col.accent }}>{p.upi_id}</span>
                    </div>
                  )}
                </div>
              </td>
              <td
                width={140}
                className="align-top p-4 text-center"
                style={{ borderLeft: `1px solid ${col.line}` }}
              >
                {p.qr_data_url ? (
                  <>
                    <img
                      src={p.qr_data_url}
                      alt="Payment QR"
                      width={110}
                      height={110}
                      style={{ display: "block", margin: "0 auto", border: `1px solid ${col.soft}`, padding: 4, background: "#fff" }}
                    />
                    <div className="mt-1 text-[9px]" style={{ color: col.muted }}>
                      Scan to pay
                    </div>
                  </>
                ) : (
                  <div className="text-[9px] pt-8" style={{ color: col.muted }}>
                    No QR uploaded
                  </div>
                )}
              </td>
            </tr>
          </tbody>
        </table>
      )}
      {invoice.notes && (
        <div className="mt-6">
          <div className="text-[10px] tracking-[0.3em] uppercase" style={{ color: col.muted }}>
            Notes
          </div>
          <div className="mt-1 text-xs" style={{ color: col.ink2 }}>{invoice.notes}</div>
        </div>
      )}
      {invoice.terms && (
        <div className="mt-4">
          <div className="text-[10px] tracking-[0.3em] uppercase" style={{ color: col.muted }}>
            Terms & Payment
          </div>
          <div className="mt-1 text-xs whitespace-pre-line" style={{ color: col.ink2 }}>
            {invoice.terms}
          </div>
        </div>
      )}
      <div
        className="mt-10 flex items-end justify-between pt-4"
        style={{ borderTop: `1px solid ${col.line}` }}
      >
        <div className="text-[10px]" style={{ color: col.muted }}>
          This is a computer-generated invoice. Signature not required.
        </div>
        <div className="text-right">
          <div className="text-xs font-semibold">For {invoice.biller.name}</div>
          <div className="text-[10px] mt-6" style={{ color: col.muted }}>
            Authorised Signatory
          </div>
        </div>
      </div>
    </>
  );
}
