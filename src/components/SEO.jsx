import { Helmet } from "react-helmet-async";

const DEFAULTS = {
  siteName: "PrismGrim",
  baseUrl: "https://prismgrim.com",
  defaultImage: "https://prismgrim.com/og-cover.jpg",
  twitter: "@prismgrim",
};

export default function SEO({
  title,
  description,
  path = "/",
  image = DEFAULTS.defaultImage,
  type = "website",
  noindex = false,
  jsonLd,
}) {
  const fullTitle = title
    ? `${title} · ${DEFAULTS.siteName}`
    : `${DEFAULTS.siteName} — One Stop Solution for your all Digital Needs`;
  const canonical = `${DEFAULTS.baseUrl}${path}`;

  return (
    <Helmet prioritizeSeoTags>
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={canonical} />
      {noindex && <meta name="robots" content="noindex,nofollow" />}
      {/* Open Graph */}
      <meta property="og:type" content={type} />
      <meta property="og:site_name" content={DEFAULTS.siteName} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={canonical} />
      <meta property="og:image" content={image} />
      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:site" content={DEFAULTS.twitter} />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />
      {jsonLd && (
        <script type="application/ld+json">{JSON.stringify(jsonLd)}</script>
      )}
    </Helmet>
  );
}

/* ------------ Reusable JSON-LD builders ------------ */
export const orgJsonLd = () => ({
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "PrismGrim",
  url: DEFAULTS.baseUrl,
  logo: `${DEFAULTS.baseUrl}/logo.png`,
  description:
    "Full-service digital studio delivering web development, social media marketing, graphic design, Google Ads, hosting and domain services.",
  email: "prismgrim@gmail.com",
  telephone: "+91-98898-90386",
  address: {
    "@type": "PostalAddress",
    addressLocality: "Lucknow",
    addressCountry: "IN",
  },
  sameAs: [
    "https://wa.me/919889890386",
  ],
});

export const jobPostingJsonLd = (job) => ({
  "@context": "https://schema.org",
  "@type": "JobPosting",
  title: job.title,
  description: job.description,
  datePosted: job.posted_at,
  employmentType: (job.type || "Full-time").toUpperCase().replace("-", "_"),
  hiringOrganization: {
    "@type": "Organization",
    name: "PrismGrim",
    sameAs: DEFAULTS.baseUrl,
    logo: `${DEFAULTS.baseUrl}/logo.png`,
  },
  jobLocation: {
    "@type": "Place",
    address: {
      "@type": "PostalAddress",
      addressLocality: job.location || "Lucknow",
      addressCountry: "IN",
    },
  },
  ...(job.salary && {
    baseSalary: {
      "@type": "MonetaryAmount",
      currency: "INR",
      value: {
        "@type": "QuantitativeValue",
        value: job.salary,
        unitText: "YEAR",
      },
    },
  }),
});

export const creativeWorkJsonLd = (items) => ({
  "@context": "https://schema.org",
  "@type": "ItemList",
  itemListElement: items.map((p, i) => ({
    "@type": "ListItem",
    position: i + 1,
    item: {
      "@type": "CreativeWork",
      name: p.title,
      description: p.description,
      image: p.image_url,
      creator: { "@type": "Organization", name: "PrismGrim" },
      dateCreated: p.year,
    },
  })),
});
