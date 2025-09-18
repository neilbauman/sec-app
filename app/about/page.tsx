// /app/about/page.tsx
import Image from "next/image";
import { ToolsetHeader } from "@/components/ui/ToolsetHeader";
import { Info } from "lucide-react";
import { makeBreadcrumbs } from "@/lib/breadcrumbs";

export const dynamic = "force-dynamic";

export default function AboutPage() {
  const breadcrumbs = makeBreadcrumbs(["dashboard", "about"]);

  return (
    <main className="p-6">
      <ToolsetHeader
        title="About"
        description="Overview of the Shelter and Settlement Severity Classification toolset."
        group="About"
        icon={Info}
        breadcrumbs={breadcrumbs}
      />

      <div className="mt-6 space-y-4">
        <p>
          The Shelter and Settlement Severity Classification (SSC) toolset provides a structured
          way to assess and classify severity across different dimensions of shelter and settlement
          needs in humanitarian contexts.
        </p>
        <Image
          src="/placeholder-diagram.png"
          alt="SSC diagram placeholder"
          width={800}
          height={400}
          className="rounded-xl border shadow"
        />
      </div>
    </main>
  );
}
