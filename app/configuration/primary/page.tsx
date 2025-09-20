// app/configuration/primary/page.tsx
import PageHeader from "@/components/ui/PageHeader";
import FrameworkEditor from "@/components/framework/FrameworkEditor";
import { fetchFramework } from "@/lib/framework-client";
import { withRefCodes } from "@/lib/refCodes";
import type { NestedPillar } from "@/lib/framework-client";

export default async function PrimaryFrameworkEditorPage() {
  const rawData = await fetchFramework();

  // Normalize: ensures ref_code, pillar_code, theme_code are filled
  const framework = withRefCodes({ pillars: rawData });

  // Tell TS: this is a NestedPillar[], but normalized
  const pillarsWithCodes = framework.pillars as NestedPillar[];

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
