// app/configuration/primary/page.tsx
import PageHeader from "@/components/ui/PageHeader";
import FrameworkEditor from "@/components/framework/FrameworkEditor";
import { fetchFramework } from "@/lib/framework-client";
import { withRefCodes, NormalizedPillar } from "@/lib/refCodes";

export default async function PrimaryFrameworkEditorPage() {
  const rawData = await fetchFramework();
  const framework = withRefCodes({ pillars: rawData });

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
      <FrameworkEditor data={framework.pillars as NormalizedPillar[]} />
    </div>
  );
}
