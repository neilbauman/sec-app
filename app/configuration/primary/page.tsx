// app/configuration/primary/page.tsx
import PageHeader from "@/components/ui/PageHeader";
import FrameworkEditor from "@/components/framework/FrameworkEditor";
import { fetchFramework, NestedPillar } from "@/lib/framework-client";


export default async function PrimaryFrameworkEditorPage() {
  // Fetch from DB and normalize into ref_code / pillar_code / theme_code
  const nested = await fetchFramework();
  const framework = normalizeFramework(nested);

  return (
    <div className="space-y-6">
      <PageHeader
        group="configuration"
        page="primary"
        breadcrumb={[
          { label: "Dashboard", href: "/" },
          { label: "Configuration", href: "/configuration" },
          { label: "Primary Framework" },
        ]}
      />

      <div className="bg-white rounded-xl border shadow-sm p-6">
        {/* Framework Editor Table */}
        <FrameworkEditor data={framework} />
      </div>
    </div>
  );
}
