import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ServiceLandingPage } from "@/components/ServiceLandingPage";
import { appliances, serviceBySlug, type Appliance } from "@/content/site";

export const dynamicParams = false;

export function generateStaticParams() {
  return appliances.map((service) => ({ service: service.slug }));
}

function resolveService(slug: string) {
  return serviceBySlug[slug as Appliance["slug"]];
}

export async function generateMetadata({ params }: { params: Promise<{ service: string }> }): Promise<Metadata> {
  const { service: slug } = await params;
  const service = resolveService(slug);
  if (!service) return {};
  const path = `/${service.slug}/`;
  return {
    title: service.pageTitle,
    description: service.metaDescription,
    alternates: { canonical: path },
    openGraph: { title: `${service.pageTitle} | Appliance RS`, description: service.metaDescription, url: path, images: [{ url: service.image, alt: service.alt }] },
    twitter: { card: "summary_large_image", title: service.pageTitle, description: service.metaDescription, images: [service.image] },
  };
}

export default async function ServicePage({ params }: { params: Promise<{ service: string }> }) {
  const { service: slug } = await params;
  const service = resolveService(slug);
  if (!service) notFound();
  return <ServiceLandingPage service={service} />;
}
