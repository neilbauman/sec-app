// app/configuration/primary/page.tsx
import PageHeader from "@/components/ui/PageHeader";
import FrameworkEditor from "@/components/framework/FrameworkEditor";
import { fetchFramework } from "@/lib/framework-client";
import { normalizeFramework } from "@/lib/refCodes";

export default async function PrimaryFrameworkEditorPage() {
  // Fetch raw framework from DB
  const framework = await fetchFramework();

  // Normalize pillars → adds ref_code, pillar_code, theme_code
  const normalized = normalizeFramework(framework);

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

      <div className="bg-white rounded-xl border shadow-sm p-4">
        <FrameworkEditor data={normalized.pillars} />
      </div>
    </div>
  );
}
