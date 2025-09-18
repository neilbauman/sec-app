// /app/configuration/primary/page.tsx
import { getFramework } from "@/lib/framework";
import PrimaryFrameworkEditorClient from "@/components/ui/PrimaryFrameworkEditorClient";
import { ToolHeader } from "@/components/ui/ToolHeader";
import { makeBreadcrumbs } from "@/lib/breadcrumbs";

export const dynamic = "force-dynamic"; // ✅ force server render

export default async function PrimaryFrameworkPage() {
  const framework = await getFramework();
  const breadcrumbs = makeBreadcrumbs([
    { label: "Configuration", href: "/configuration" },
    { label: "Primary Framework Editor" },
  ]);

  return (
    <main className="p-6">
      <ToolHeader
        title="Primary Framework Editor"
        group="Configuration"
        breadcrumbs={breadcrumbs}
      />
      <PrimaryFrameworkEditorClient framework={framework} />
    </main>
  );
}
