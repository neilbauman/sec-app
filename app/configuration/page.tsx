// /app/configuration/page.tsx
import { ToolHeader } from "@/components/ui/ToolHeader";

export default function ConfigurationPage() {
  return (
    <main className="p-6 space-y-6">
      <ToolHeader
        title="SSC Configuration"
        breadcrumbs={[
          { label: "Dashboard", href: "/" },
          { label: "Configuration" },
        ]}
        group="Configuration"
      />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* configuration cards go here */}
      </div>
    </main>
  );
}
