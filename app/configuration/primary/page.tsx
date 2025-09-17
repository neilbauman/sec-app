// /app/configuration/primary/page.tsx
import { ToolHeader } from "@/components/ui/ToolHeader";
import PrimaryFrameworkEditorClient from "@/components/ui/PrimaryFrameworkEditorClient";

export default function PrimaryFrameworkPage() {
  return (
    <main className="p-6 space-y-6">
      <ToolHeader
        title="Primary Framework Editor"
        breadcrumbs={[
          { label: "Dashboard", href: "/" },
          { label: "Configuration", href: "/configuration" },
          { label: "Primary Framework Editor" },
        ]}
        group="Configuration"
      />
      <PrimaryFrameworkEditorClient />
    </main>
  );
}
