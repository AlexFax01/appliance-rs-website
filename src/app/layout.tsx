import type { Metadata } from "next";
import { Inter, Roboto_Condensed } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter", display: "swap" });
const robotoCondensed = Roboto_Condensed({
  subsets: ["latin"],
  variable: "--font-heading",
  display: "swap",
});
const siteStage = process.env.NEXT_PUBLIC_SITE_STAGE ?? "preview";
const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://appliance-rs-demo.vercel.app";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: "Appliance RS | Appliance Repair in Upstate South Carolina",
  description:
    "Fast, trusted appliance repair across Upstate South Carolina. Call, text, or request a callback from Appliance RS.",
  alternates: { canonical: "/" },
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
