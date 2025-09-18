// /app/configuration/primary/page.tsx
import { ToolHeader } from "@/components/ui/ToolHeader";
import { Settings } from "lucide-react";
import { getFramework } from "@/lib/framework";
import PrimaryFrameworkEditorClient from "@/components/ui/PrimaryFrameworkEditorClient";

export default async function PrimaryFrameworkPage() {
  const framework = await getFramework();

  return (
    <main className="p-6">
      <ToolHeader
        group="SSC Configuration"
        groupIcon={Settings}
        title="Primary Framework Editor"
        description="Manage the pillars, themes, and subthemes of the SSC primary framework."
        breadcrumbs={[
          { label: "Dashboard", href: "/" },
          { label: "Configuration", href: "/configuration" },
          { label: "Primary Framework" },
        ]}
      />
      <PrimaryFrameworkEditorClient framework={framework} />
    </main>
  );
}
