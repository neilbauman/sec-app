// /app/page.tsx (Dashboard)
export const dynamic = "force-dynamic";

import DashboardCard from "@/components/ui/DashboardCard";
import ToolsetHeader from "@/components/ui/ToolsetHeader";
import { groupIcons } from "@/lib/icons";
import { makeBreadcrumbs } from "@/lib/breadcrumbs";

export default function DashboardPage() {
  const breadcrumbs = makeBreadcrumbs([{ label: "Dashboard" }]);
  return (
    <main className="p-6">
      <ToolsetHeader
        title="Dashboard"
        description="Overview of the SSC toolset."
        group="Dashboard"
        groupIcon={groupIcons.about.icon}
        breadcrumbs={breadcrumbs}
      />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
        <DashboardCard
          title="About"
          description="Learn about the SSC and this toolset."
          href="/about"
          {...groupIcons.about}
        />
        <DashboardCard
          title="SSC Configuration"
          description="Manage the SSC global framework and defaults."
          href="/configuration"
          {...groupIcons.configuration}
        />
      </div>
    </main>
  );
}
