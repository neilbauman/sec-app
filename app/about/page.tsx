// /app/about/page.tsx
import Image from "next/image";
import { makeBreadcrumbs } from "@/lib/breadcrumbs";
import { ToolsetHeader } from "@/components/ui/ToolsetHeader";

export const dynamic = "force-dynamic";

export default function AboutPage() {
  const breadcrumbs = makeBreadcrumbs(["dashboard", "about"]);

  return (
    <main className="p-6">
      <ToolsetHeader
        title="About"
        group="About"
        description="Overview of the Shelter and Settlement Severity Classification Toolset."
        breadcrumbs={breadcrumbs}
      />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <h3 className="text-lg font-semibold mb-2">What is the SSC?</h3>
          <p className="text-gray-700 mb-4">
            The Shelter and Settlement Severity Classification (SSC) Toolset helps analyze, configure, and manage
            humanitarian shelter data. It provides a structured framework to manage global defaults, country-specific
            baselines, and SSC instances for field use.
          </p>
        </div>
        <div className="bg-gray-100 rounded flex items-center justify-center">
          <Image
            src="/placeholder-diagram.png"
            alt="SSC Diagram Placeholder"
            width={400}
            height={300}
          />
        </div>
      </div>
    </main>
  );
}
