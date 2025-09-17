import { ToolHeader } from "@/components/ui/ToolHeader";

export default function ComprehensiveFrameworkEditorPage() {
  return (
    <div className="space-y-6">
      <ToolHeader
        pageTitle="Comprehensive Framework Editor"
        pageDescription="Configure pillars, themes, sub-themes, and indicators."
        breadcrumbs={[
          { label: "Dashboard", href: "/" },
          { label: "SSC Configuration", href: "/configuration" },
          { label: "Comprehensive Framework Editor" },
        ]}
        group="configuration"
      />

      <p className="text-gray-600">Coming soon...</p>
    </div>
  );
}
