// /app/framework/primary/page.tsx
import { ToolHeader } from "@/components/ui/ToolHeader";
import PrimaryFrameworkEditorClient from "@/components/ui/PrimaryFrameworkEditorClient";

export default function FrameworkPrimaryPage() {
  return (
    <main className="p-6 space-y-6">
      <ToolHeader
        title="Framework – Primary"
        breadcrumbs={[
          { label: "Dashboard", href: "/" },
          { label: "Framework" },
          { label: "Primary" },
        ]}
        group="Instances"
      />
      <PrimaryFrameworkEditorClient />
    </main>
  );
}
