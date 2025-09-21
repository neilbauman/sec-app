// app/configuration/comprehensive/page.tsx
import PageHeader from "@/components/ui/PageHeader";
import FrameworkEditor from "@/components/framework/FrameworkEditor";
import { fetchFramework, NestedPillar } from "@/lib/framework-client";

export default async function ComprehensiveFrameworkEditorPage() {
  const framework = await fetchFramework();

  return (
    <div className="space-y-6">
      <PageHeader
        group="configuration"
        page="comprehensive"
        breadcrumb={[
          { label: "Dashboard", href: "/" },
          { label: "Configuration", href: "/configuration" },
          { label: "Comprehensive Framework" },
        ]}
      />

      <div className="bg-white rounded-xl border shadow-sm p-6 space-y-4">
        <p className="text-gray-700">
          Placeholder: A comprehensive editor for defining pillars, themes,
          subthemes, indicators and advanced relationships in the SSC framework.
        </p>
        <p className="text-gray-700">
          Framework data is already being fetched here. We’ll extend this page
          with a more detailed editor UI later.
        </p>
      </div>
    </div>
  );
}
