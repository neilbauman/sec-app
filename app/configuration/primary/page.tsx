// app/configuration/primary/page.tsx
import PageHeader from "@/components/ui/PageHeader";
import FrameworkEditor from "@/components/framework/FrameworkEditor";
import { fetchFramework } from "@/lib/framework-client";

export default async function PrimaryFrameworkPage() {
  const data = await fetchFramework();

  return (
    <div className="space-y-6">
      <PageHeader group="configuration" page="primary" />

      <div className="bg-white rounded-xl border shadow-sm p-6">
        <FrameworkEditor data={data} />
      </div>
    </div>
  );
}
