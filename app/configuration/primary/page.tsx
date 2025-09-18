// /app/configuration/primary/page.tsx
export const dynamic = "force-dynamic";

import PrimaryFrameworkEditorClient from "@/components/ui/PrimaryFrameworkEditorClient";
import { getFramework } from "@/lib/framework";
import { ToolHeader } from "@/components/ui/ToolHeader";
import { makeBreadcrumbs } from "@/lib/breadcrumbs";

export default async function PrimaryFrameworkPage() {
  const framework = await getFramework();

  const breadcrumbs = makeBreadcrumbs([
    { label: "Dashboard", href: "/" },
    { label: "Configuration", href: "/configuration" },
    { label: "Primary Framework", href: "/configuration/primary" },
  ]);

  return (
    <main className="p-6 space-y-6">
      <ToolHeader
        title="Primary Framework Editor"
        breadcrumbs={breadcrumbs}
        group="Configuration"
      />
      <PrimaryFrameworkEditorClient data={framework} />
    </main>
  );
}
