import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";

const inter = localFont({src: './fonts/inter-latin.woff2', weight:'100 900', variable: "--font-inter", display: "optional"});
const robotoCondensed = localFont({
  src: './fonts/roboto-condensed-latin.woff2', weight:'100 900',
  variable: "--font-heading",
  display: "optional",
});
const siteStage = process.env.NEXT_PUBLIC_SITE_STAGE ?? "preview";
const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://appliance-rs-website.vercel.app";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: "Appliance RS | Appliance Repair in Upstate South Carolina",
  description:
    "Fast, trusted appliance repair across Upstate South Carolina. Call, text, or request a callback from Appliance RS.",
  alternates: { canonical: "/" },
  icons: { icon: "/images/brand/appliance-rs-logo.webp" },
  robots:
    siteStage === "production"
      ? { index: true, follow: true }
      : { index: false, follow: false, nocache: true },
  openGraph: {
    title: "Appliance RS | Local. Trusted. Reliable.",
    description:
      "Local appliance repair for refrigerators, washers, dryers, dishwashers, ovens, microwaves, and ice makers.",
    type: "website",
    url: "/",
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en">
      <body className={`${inter.variable} ${robotoCondensed.variable}`}>{children}</body>
    </html>
  );
}
