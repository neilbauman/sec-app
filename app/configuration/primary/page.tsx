// app/configuration/primary/page.tsx
import PageHeader from "@/components/ui/PageHeader";
import FrameworkEditor from "@/components/framework/FrameworkEditor";
import { fetchFramework } from "@/lib/framework-client";
import { NestedPillar } from "@/lib/types"; // ✅ correct source of truth

export default async function PrimaryFrameworkEditorPage() {
  const initialPillars: NestedPillar[] = await fetchFramework();

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
        <FrameworkEditor initialPillars={initialPillars} />
      </div>
    </div>
  );
}
