// /app/configuration/page.tsx
import { ToolHeader } from "@/components/ui/ToolHeader";

export default function ConfigurationPage() {
  return (
    <div className="space-y-6">
      <ToolHeader
        title="SSC Configuration"
        description="Configure pillars, themes, sub-themes, and indicators."
        breadcrumbs={[
          { label: "Dashboard", href: "/" },
          { label: "Configuration" },
        ]}
        group="Configuration"
      />

      <p className="text-gray-600">Select a configuration tool from the options above.</p>
    </div>
  );
}
