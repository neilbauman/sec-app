// app/configuration/comprehensive/page.tsx
import PageHeader from "@/components/ui/PageHeader";
import { groups } from "@/lib/headerConfig";

export default function ComprehensiveFrameworkEditorPage() {
  const cfg = groups.configuration;

  return (
    <div className="space-y-6">
      <PageHeader
        group="configuration"
        page="comprehensive"
        breadcrumb={[{ label: "Configuration", href: "/configuration" }, { label: "Comprehensive Framework Editor" }]}
      />

      <div className="bg-white rounded-xl border shadow-sm p-6 space-y-4">
        <p className="text-gray-700">
          Placeholder: A comprehensive editor for defining pillars, themes,
          subthemes, indicators and advanced relationships in the SSC framework.
        </p>
        <p className="text-gray-700">
          When ready, this page can host a richer editor UI. For now, it serves
          as a placeholder linked from the Configuration group.
        </p>
        <a
          href="/configuration"
          className={`${cfg.color} hover:underline font-medium`}
        >
          ← Back to SSC Configuration
        </a>
      </div>
    </div>
  );
}
