import { appliances, business, serviceAreas, siteUrl, type Appliance } from "@/content/site";

function serialize(data: object) {
  return JSON.stringify(data).replace(/</g, "\\u003c");
}

export function HomeStructuredData() {
  const organizationId = `${siteUrl}/#organization`;
  const data = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": organizationId,
        name: business.name,
        legalName: business.legalName,
        url: `${siteUrl}/`,
        logo: `${siteUrl}/images/brand/appliance-rs-logo.webp`,
        image: `${siteUrl}/images/hero/hero-1600.webp`,
        telephone: business.callPhone.e164,
        sameAs: [business.googleProfile],
        description: "Residential appliance repair serving Greenville, Spartanburg, Greer, Simpsonville, and nearby communities in Upstate South Carolina.",
        areaServed: serviceAreas.map((area) => ({ "@type": "City", name: `${area.name}, South Carolina` })),
      },
      {
        "@type": "WebSite",
        "@id": `${siteUrl}/#website`,
        url: `${siteUrl}/`,
        name: business.name,
        publisher: { "@id": organizationId },
        inLanguage: "en-US",
      },
      ...appliances.map((service) => serviceSchema(service)),
    ],
  };
  return <script dangerouslySetInnerHTML={{ __html: serialize(data) }} type="application/ld+json" />;
}

function serviceSchema(service: Appliance) {
  return {
    "@type": "Service",
    "@id": `${siteUrl}/${service.slug}/#service`,
    name: service.pageTitle,
    serviceType: service.title.replace(" / ", " and ") + " repair",
    url: `${siteUrl}/${service.slug}/`,
    description: service.metaDescription,
    provider: { "@id": `${siteUrl}/#organization` },
    areaServed: serviceAreas.map((area) => ({ "@type": "City", name: `${area.name}, South Carolina` })),
    offers: {
      "@type": "Offer",
      description: "A flat $85 service call covers the visit and diagnosis. Diagnostics are waived with an approved repair.",
      price: "85",
      priceCurrency: "USD",
    },
  };
}

export function ServiceStructuredData({ service }: { service: Appliance }) {
  const data = {
    "@context": "https://schema.org",
    "@graph": [
      serviceSchema(service),
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: `${siteUrl}/` },
          { "@type": "ListItem", position: 2, name: service.title, item: `${siteUrl}/${service.slug}/` },
        ],
      },
    ],
  };
  return <script dangerouslySetInnerHTML={{ __html: serialize(data) }} type="application/ld+json" />;
}

export function ServiceAreasStructuredData() {
  const data = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: `${siteUrl}/` },
      { "@type": "ListItem", position: 2, name: "Service Areas", item: `${siteUrl}/service-areas/` },
    ],
  };
  return <script dangerouslySetInnerHTML={{ __html: serialize(data) }} type="application/ld+json" />;
}
