// app/page.tsx
import PageHeader from "@/components/ui/PageHeader";

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        group="configuration"
        page="index"
        breadcrumb={[{ label: "Dashboard" }]}
      />

      <div className="prose max-w-none">
        <p>
          Welcome to the <strong>Shelter and Settlement Severity Classification Toolset</strong>.
        </p>
        <p>
          Use the navigation to explore SSC groups and tools. More functionality will appear here as we restore the dashboard.
        </p>
      </div>
    </div>
  );
}
