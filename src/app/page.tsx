import type { Metadata } from "next";
import { ApplianceWebsite } from "@/components/ApplianceWebsite";

export const metadata: Metadata = {
  alternates: { canonical: "/" },
  openGraph: { url: "/" },
};

export default function Home() {
  return <ApplianceWebsite />;
}
