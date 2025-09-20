// app/configuration/primary/page.tsx
import PageHeader from "@/components/ui/PageHeader";
import FrameworkEditor from "@/components/framework/FrameworkEditor";
import { fetchFramework } from "@/lib/framework-client";
import { withRefCodes } from "@/lib/refCodes";

export default async function PrimaryFrameworkEditorPage() {
  // fetch raw DB framework
  const rawData = await fetchFramework();

  // normalize ref codes (P1, T1.2, ST1.2.1, etc.)
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

      {/* pass only the normalized pillar array */}
      <FrameworkEditor data={framework.pillars} />
    </div>
  );
}
