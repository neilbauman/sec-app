// app/configuration/primary/page.tsx
import PageHeader from "@/components/ui/PageHeader";
import FrameworkEditor from "@/components/framework/FrameworkEditor";
import { getFrameworkData } from "@/lib/framework-server";

export default async function PrimaryFrameworkPage() {
  const data = await getFrameworkData();

  return (
    <div className="space-y-6">
      <PageHeader
        group="configuration"
        page="primary"
        breadcrumb={[{ label: "Configuration", href: "/configuration" }, { label: "Primary Framework" }]}
      />

      <div className="bg-white rounded-xl border shadow-sm p-6">
        <FrameworkEditor data={data} />
      </div>
    </div>
  );
}
