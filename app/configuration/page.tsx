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
        group="Configuration" // ✅ capitalized
      />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Cards/links to editors go here */}
      </div>
    </div>
  );
}
