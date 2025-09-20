// app/configuration/primary/page.tsx
import PageHeader from "@/components/ui/PageHeader";
import FrameworkEditor from "@/components/framework/FrameworkEditor";
import { fetchFramework } from "@/lib/framework-client";
import { withRefCodes } from "@/lib/refCodes";

export default async function PrimaryFrameworkEditorPage() {
  const rawData = await fetchFramework();

  // Normalize & assert ref_code presence
  const framework = withRefCodes({ pillars: rawData });

  // Explicit cast: ensures all pillars have ref_code now
  const pillarsWithCodes = framework.pillars as {
    id: string;
    ref_code: string;
    name: string;
    description: string;
    sort_order: number;
    themes: any[]; // allow nested objects without over-specifying here
  }[];

  return (
    <div className="space-y-6">
      <PageHeader
        group="configuration"
        page="primary"
        breadcrumb={[
          { label: "Dashboard", href: "/" },
          { label: "Configuration", href: "/configuration" },
          { label: "Primary Framework Editor" },
        ]}
      />
      <FrameworkEditor data={pillarsWithCodes} />
    </div>
  );
}
