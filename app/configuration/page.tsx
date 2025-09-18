// /app/configuration/page.tsx
export const dynamic = "force-dynamic";

import ToolsetHeader from "@/components/ui/ToolsetHeader";
import MiniCard from "@/components/ui/MiniCard";
import { groupIcons, editorIcon } from "@/lib/icons";
import { makeBreadcrumbs } from "@/lib/breadcrumbs";

export default function ConfigurationPage() {
  const breadcrumbs = makeBreadcrumbs([
    { label: "Dashboard", href: "/" },
    { label: "Configuration" },
  ]);
  return (
    <main className="p-6">
      <ToolsetHeader
        title="Configuration"
        description="Manage the SSC global framework and defaults."
        group="Configuration"
        groupIcon={groupIcons.configuration.icon}
        breadcrumbs={breadcrumbs}
      />
      <div className="grid gap-2 mt-6">
        <MiniCard
          title="Primary Framework Editor"
          href="/configuration/primary"
          {...editorIcon}
        />
        <MiniCard
          title="Comprehensive Framework Editor"
          href="/configuration/comprehensive"
          {...editorIcon}
        />
      </div>
    </main>
  );
}
