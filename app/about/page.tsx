// /app/about/page.tsx
export const dynamic = "force-dynamic";

import ToolsetHeader from "@/components/ui/ToolsetHeader";
import { groupIcons } from "@/lib/icons";
import { makeBreadcrumbs } from "@/lib/breadcrumbs";

export default function AboutPage() {
  const breadcrumbs = makeBreadcrumbs([
    { label: "Dashboard", href: "/" },
    { label: "About" },
  ]);
  return (
    <main className="p-6">
      <ToolsetHeader
        title="About"
        description="Overview of the Shelter and Settlement Severity Classification toolset."
        group="About"
        groupIcon={groupIcons.about.icon}
        breadcrumbs={breadcrumbs}
      />
      <p className="text-gray-600">Coming soon.</p>
    </main>
  );
}
