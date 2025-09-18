// /app/configuration/primary/page.tsx
import { getFramework } from "@/lib/framework";
import PrimaryFrameworkEditorClient from "@/components/ui/PrimaryFrameworkEditorClient";
import { ToolHeader } from "@/components/ui/ToolHeader";

export default async function PrimaryFrameworkPage() {
  // ✅ Load framework from DB
  const framework = await getFramework();

  return (
    <main className="p-6 space-y-6">
      <ToolHeader
        title="Primary Framework Editor"
        description="View pillars, themes, and subthemes from the database."
        breadcrumbs={[
          { label: "Configuration", href: "/configuration" },
          { label: "Primary Framework" },
        ]}
        group="Configuration"
      />

      {/* ✅ Pass framework into client editor */}
      <PrimaryFrameworkEditorClient framework={framework} />
    </main>
  );
}
