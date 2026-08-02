import { createContext, useContext, useEffect, useState, useCallback } from "react";
import api from "@/lib/api";

const DEFAULTS = {
  hero: {
    eyebrow: "Digital · Design · Development · Growth",
    title_prefix: "One Stop Solution\nfor your ",
    title_accent: "all digital",
    title_suffix: " needs.",
    subtitle:
      "PrismGrim is a full-service digital studio delivering web development, social media marketing, graphic design, Google Ads, hosting and domain services — trusted by brands that ship.",
    currently_shipping: "Brand systems for 6 clients this quarter.",
  },
  contact: {
    email: "prismgrim@gmail.com",
    phone_display: "+91 98898 90386",
    phone_href: "+919889890386",
    whatsapp_number: "919889890386",
    location: "Lucknow, India",
  },
  brand: {
    tagline: "One Stop Solution for your all Digital Needs.",
    footer_desc:
      "One Stop Solution for your all Digital Needs. Websites, growth marketing, brand identity — engineered to ship.",
  },
  payment: {
    bank_name: "",
    account_name: "PrismGrim",
    account_number: "",
    ifsc: "",
    upi_id: "prismgrim@upi",
    qr_data_url: "",
  },
};

const SiteContext = createContext({
  content: DEFAULTS,
  refresh: () => {},
  loaded: false,
});

export function SiteContentProvider({ children }) {
  const [content, setContent] = useState(DEFAULTS);
  const [loaded, setLoaded] = useState(false);

  const refresh = useCallback(async () => {
    try {
      const { data } = await api.get("/site");
      if (data && data.hero) {
        setContent({
          hero: { ...DEFAULTS.hero, ...data.hero },
          contact: { ...DEFAULTS.contact, ...data.contact },
          brand: { ...DEFAULTS.brand, ...data.brand },
          payment: { ...DEFAULTS.payment, ...(data.payment || {}) },
        });
      }
    } catch {
      /* keep defaults */
    } finally {
      setLoaded(true);
    }
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  return (
    <SiteContext.Provider value={{ content, refresh, loaded }}>
      {children}
    </SiteContext.Provider>
  );
}

export const useSite = () => useContext(SiteContext);
export const SITE_DEFAULTS = DEFAULTS;
