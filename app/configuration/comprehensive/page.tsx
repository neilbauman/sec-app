import ToolHeader from "@/components/ui/ToolHeader";

export default function ComprehensiveFrameworkPage() {
  return (
    <div className="space-y-6">
      <ToolHeader
        title="Comprehensive Framework Editor"
        description="Configure pillars, themes, sub-themes, and indicators."
        breadcrumbs={[
          { label: "Dashboard", href: "/" },
          { label: "SSC Configuration", href: "/configuration" },
          { label: "Comprehensive Framework Editor", href: "/configuration/comprehensive" },
        ]}
      />
      <div className="p-4 border rounded bg-white shadow-sm">
        <p className="text-gray-600">
          Placeholder for Comprehensive Framework Editor.
        </p>
      </div>
    </div>
  );
}
