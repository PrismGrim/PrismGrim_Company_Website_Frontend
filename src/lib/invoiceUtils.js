/* Utility helpers for the invoice generator */

export const INDIAN_STATES = [
  ["01", "Jammu & Kashmir"], ["02", "Himachal Pradesh"], ["03", "Punjab"],
  ["04", "Chandigarh"], ["05", "Uttarakhand"], ["06", "Haryana"],
  ["07", "Delhi"], ["08", "Rajasthan"], ["09", "Uttar Pradesh"],
  ["10", "Bihar"], ["11", "Sikkim"], ["12", "Arunachal Pradesh"],
  ["13", "Nagaland"], ["14", "Manipur"], ["15", "Mizoram"], ["16", "Tripura"],
  ["17", "Meghalaya"], ["18", "Assam"], ["19", "West Bengal"],
  ["20", "Jharkhand"], ["21", "Odisha"], ["22", "Chhattisgarh"],
  ["23", "Madhya Pradesh"], ["24", "Gujarat"], ["25", "Daman & Diu"],
  ["26", "Dadra & Nagar Haveli"], ["27", "Maharashtra"], ["28", "Andhra Pradesh"],
  ["29", "Karnataka"], ["30", "Goa"], ["31", "Lakshadweep"], ["32", "Kerala"],
  ["33", "Tamil Nadu"], ["34", "Puducherry"], ["35", "Andaman & Nicobar"],
  ["36", "Telangana"], ["37", "Andhra Pradesh (New)"], ["38", "Ladakh"],
];

/* Service presets — each preset seeds default line items */
export const SERVICE_PRESETS = {
  web_development: {
    label: "Website Design & Development",
    template: "modern",
    items: [
      {
        description: "Website design & development (custom stack)",
        hsn_sac: "998314",
        quantity: 1,
        rate: 50000,
        cgst_rate: 9,
        sgst_rate: 9,
        igst_rate: 0,
      },
    ],
    terms:
      "50% advance, 50% on delivery. Bank transfer / UPI accepted. Late fee 2% per week.",
  },
  social_media: {
    label: "Social Media Marketing (Monthly)",
    template: "corporate",
    items: [
      {
        description: "Social media management — content, community & ads (1 month)",
        hsn_sac: "998365",
        quantity: 1,
        rate: 30000,
        cgst_rate: 9,
        sgst_rate: 9,
        igst_rate: 0,
      },
    ],
    terms: "Monthly retainer, billed in advance. Ad spend not included.",
  },
  graphic_design: {
    label: "Graphic Design & Branding",
    template: "classic",
    items: [
      {
        description: "Logo suite (3 concepts, 2 revisions, brand guidelines)",
        hsn_sac: "998391",
        quantity: 1,
        rate: 25000,
        cgst_rate: 9,
        sgst_rate: 9,
        igst_rate: 0,
      },
    ],
    terms: "50% advance. Files delivered in AI, SVG, PNG, PDF.",
  },
  google_ads: {
    label: "Google Ads (Setup + Management)",
    template: "modern",
    items: [
      {
        description: "Google Ads campaign setup",
        hsn_sac: "998365",
        quantity: 1,
        rate: 15000,
        cgst_rate: 9,
        sgst_rate: 9,
        igst_rate: 0,
      },
      {
        description: "Monthly optimisation & reporting",
        hsn_sac: "998365",
        quantity: 1,
        rate: 12000,
        cgst_rate: 9,
        sgst_rate: 9,
        igst_rate: 0,
      },
    ],
    terms: "Google ad spend is billed separately by Google.",
  },
  hosting: {
    label: "Hosting (Annual)",
    template: "classic",
    items: [
      {
        description: "Managed cloud hosting — 1 year (99.9% uptime SLA)",
        hsn_sac: "998315",
        quantity: 1,
        rate: 6000,
        cgst_rate: 9,
        sgst_rate: 9,
        igst_rate: 0,
      },
    ],
    terms: "Renewable annually. SSL and daily backups included.",
  },
  custom: {
    label: "Custom",
    template: "modern",
    items: [
      {
        description: "",
        hsn_sac: "",
        quantity: 1,
        rate: 0,
        cgst_rate: 9,
        sgst_rate: 9,
        igst_rate: 0,
      },
    ],
    terms: "",
  },
};

/* Format Indian rupees with lakh/crore grouping */
export const formatINR = (n) => {
  const num = Number(n) || 0;
  return `₹${num.toLocaleString("en-IN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
};

/* Compute per-item + invoice totals */
export function computeTotals(items = []) {
  const lines = items.map((it) => {
    const qty = Number(it.quantity) || 0;
    const rate = Number(it.rate) || 0;
    const sub = qty * rate;
    const cgst = (sub * (Number(it.cgst_rate) || 0)) / 100;
    const sgst = (sub * (Number(it.sgst_rate) || 0)) / 100;
    const igst = (sub * (Number(it.igst_rate) || 0)) / 100;
    const total = sub + cgst + sgst + igst;
    return { sub, cgst, sgst, igst, total };
  });
  const subtotal = lines.reduce((s, l) => s + l.sub, 0);
  const cgst = lines.reduce((s, l) => s + l.cgst, 0);
  const sgst = lines.reduce((s, l) => s + l.sgst, 0);
  const igst = lines.reduce((s, l) => s + l.igst, 0);
  const total = subtotal + cgst + sgst + igst;
  return { lines, subtotal, cgst, sgst, igst, total };
}

/* Convert number to Indian words (up to 99,99,99,999) */
const ONES = [
  "", "One", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight", "Nine",
  "Ten", "Eleven", "Twelve", "Thirteen", "Fourteen", "Fifteen", "Sixteen",
  "Seventeen", "Eighteen", "Nineteen",
];
const TENS = ["", "", "Twenty", "Thirty", "Forty", "Fifty", "Sixty", "Seventy", "Eighty", "Ninety"];

const twoDigits = (n) => {
  if (n < 20) return ONES[n];
  const t = Math.floor(n / 10);
  const o = n % 10;
  return TENS[t] + (o ? " " + ONES[o] : "");
};

export function numberToIndianWords(num) {
  const n = Math.floor(Math.abs(num));
  if (n === 0) return "Zero";
  let result = "";
  const crore = Math.floor(n / 10000000);
  const lakh = Math.floor((n / 100000) % 100);
  const thousand = Math.floor((n / 1000) % 100);
  const hundred = Math.floor((n / 100) % 10);
  const remainder = n % 100;
  if (crore) result += twoDigits(crore) + " Crore ";
  if (lakh) result += twoDigits(lakh) + " Lakh ";
  if (thousand) result += twoDigits(thousand) + " Thousand ";
  if (hundred) result += ONES[hundred] + " Hundred ";
  if (remainder) result += (result ? "and " : "") + twoDigits(remainder);
  return result.trim();
}

export function amountInWords(n) {
  const rounded = Math.round(Number(n || 0) * 100) / 100;
  const rupees = Math.floor(rounded);
  const paise = Math.round((rounded - rupees) * 100);
  let text = numberToIndianWords(rupees) + " Rupees";
  if (paise) text += " and " + numberToIndianWords(paise) + " Paise";
  return text + " Only";
}

/* Given biller & client state codes, decide intra vs inter state */
export function isIntraState(biller, client) {
  const b = (biller?.state_code || "").trim();
  const c = (client?.state_code || "").trim();
  if (!b || !c) return true; // default intra
  return b === c;
}

export const DEFAULT_BILLER = {
  name: "PrismGrim",
  gstin: "09IFZPD5542C1Z2",
  address: "Lucknow, Uttar Pradesh, India",
  email: "prismgrim@gmail.com",
  phone: "+91 98898 90386",
  state: "Uttar Pradesh",
  state_code: "09",
};

export const emptyInvoice = () => ({
  number: "",
  template: "modern",
  service_type: "web_development",
  issued_date: new Date().toISOString().slice(0, 10),
  due_date: new Date(Date.now() + 15 * 24 * 3600 * 1000).toISOString().slice(0, 10),
  status: "draft",
  currency: "INR",
  biller: { ...DEFAULT_BILLER },
  client: {
    name: "",
    gstin: "",
    address: "",
    email: "",
    phone: "",
    state: "",
    state_code: "",
  },
  items: [
    {
      description: "",
      hsn_sac: "",
      quantity: 1,
      rate: 0,
      cgst_rate: 9,
      sgst_rate: 9,
      igst_rate: 0,
    },
  ],
  notes: "",
  terms: "",
  payment: {
    bank_name: "",
    account_name: "PrismGrim",
    account_number: "",
    ifsc: "",
    upi_id: "prismgrim@upi",
    qr_data_url: "",
  },
});
