// /app/configuration/comprehensive/page.tsx
import { ToolHeader } from "@/components/ui/ToolHeader";

export default function ComprehensiveFrameworkEditorPage() {
  return (
    <div className="space-y-6">
      <ToolHeader
        title="Comprehensive Framework Editor"
        description="Configure pillars, themes, sub-themes, and indicators in detail."
        breadcrumbs={[
          { label: "Dashboard", href: "/" },
          { label: "Configuration", href: "/configuration" },
          { label: "Comprehensive Framework Editor" },
        ]}
        group="Configuration"
      />

      <p className="text-gray-600">Comprehensive editor functionality coming soon.</p>
    </div>
  );
}
