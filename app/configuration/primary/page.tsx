// app/configuration/primary/page.tsx
import PageHeader from "@/components/ui/PageHeader";
import FrameworkEditor from "@/components/framework/FrameworkEditor";
import { fetchFramework } from "@/lib/framework-client";

export default async function PrimaryFrameworkEditorPage() {
  const framework = await fetchFramework(); // already NestedPillar[]

  return (
    <div className="space-y-6">
      <PageHeader
        group="configuration"
        page="primary"
        breadcrumb={[
          { label: "Dashboard", href: "/" },
          { label: "Configuration", href: "/configuration" },
          { label: "Primary Framework" },
        ]}
      />

      <FrameworkEditor data={framework} />
    </div>
  );
}
