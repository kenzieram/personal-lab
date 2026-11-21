import type { Metadata } from "next";
import { NetworkCalculator } from "@/components/network-calculator";
import { PageHeading } from "@/components/page-heading";

export const metadata: Metadata = { title: "Networking" };

export default function NetworkPage() {
  return (
    <>
      <PageHeading title="Networking" description="Calculate IPv4 network boundaries locally in your browser." />
      <NetworkCalculator />
    </>
  );
}
