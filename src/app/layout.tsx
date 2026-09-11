import type { Metadata } from "next";
import type { ReactNode } from "react";
import localFont from "next/font/local";
import { ConsentManager } from "@/components/ConsentManager";
import { GoogleMeasurement } from "@/components/GoogleMeasurement";
import { InteractionTracking } from "@/components/InteractionTracking";
import { siteUrl as canonicalSiteUrl } from "@/content/site";
import "./globals.css";

const inter = localFont({src: './fonts/inter-latin.woff2', weight:'100 900', variable: "--font-inter", display: "optional"});
const robotoCondensed = localFont({
  src: './fonts/roboto-condensed-latin.woff2', weight:'100 900',
  variable: "--font-heading",
  display: "optional",
});
const siteStage = process.env.NEXT_PUBLIC_SITE_STAGE ?? "preview";
const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? canonicalSiteUrl;

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  verification: {
    google: "WF7qLzpFsgOX6lWvPObL9WX49wcYextpvDWkwIsH4uc",
  },
  title: { default: "Appliance RS | Appliance Repair in Upstate South Carolina", template: "%s | Appliance RS" },
  description:
    "Fast, trusted appliance repair across Upstate South Carolina. Call Appliance RS or prepare a service request by text.",
  applicationName: "Appliance RS",
  manifest: "/site.webmanifest",
  icons: {
    icon: [{ url: "/favicon-32.png", sizes: "32x32", type: "image/png" }],
    apple: [{ url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" }],
  },
  robots:
    siteStage === "production"
      ? { index: true, follow: true }
      : { index: false, follow: false, nocache: true },
  openGraph: {
    title: "Appliance RS | Local. Trusted. Reliable.",
    description:
      "Local appliance repair for refrigerators, washers, dryers, dishwashers, ovens, microwaves, and ice makers.",
    type: "website",
    siteName: "Appliance RS",
    locale: "en_US",
    images: [{ url: "/images/hero/hero-1600.webp", width: 1600, height: 1067, alt: "Appliance RS technician helping a homeowner" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Appliance RS | Appliance Repair in Upstate South Carolina",
    description: "Local appliance repair for homes across Upstate South Carolina.",
    images: ["/images/hero/hero-1600.webp"],
  },
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en-US">
      <head><GoogleMeasurement /></head>
      <body className={`${inter.variable} ${robotoCondensed.variable}`}>
        <InteractionTracking />
        {children}
        <ConsentManager />
      </body>
    </html>
  );
}
