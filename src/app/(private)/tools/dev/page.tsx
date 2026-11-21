import type { Metadata } from "next";
import { JsonTool } from "@/components/json-tool";
import { PageHeading } from "@/components/page-heading";

export const metadata: Metadata = { title: "Development" };

export default function DevPage() {
  return (
    <>
      <PageHeading title="Development" description="Format JSON in your browser." />
      <JsonTool />
    </>
  );
}
