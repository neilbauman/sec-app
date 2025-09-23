// app/configuration/primary/page.tsx
import PageHeader from "@/components/ui/PageHeader";
import FrameworkEditor from "@/components/framework/FrameworkEditor";
import { fetchFramework, NestedPillar } from "@/lib/framework-client";

export default async function PrimaryFrameworkEditorPage() {
  // Fetch framework directly
  const initialData: NestedPillar[] = await fetchFramework();

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
        <FrameworkEditor initialData={initialData} />
      </div>
    </div>
  );
}
