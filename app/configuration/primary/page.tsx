// app/configuration/primary/page.tsx
import PageHeader from "@/components/ui/PageHeader";
import FrameworkEditor from "@/components/framework/FrameworkEditor";
import { fetchFramework } from "@/lib/framework-client";
import { groups } from "@/lib/headerConfig";

export const dynamic = "force-dynamic"; // avoid prerender errors

export default async function PrimaryFrameworkPage() {
  const data = await fetchFramework();
  const page = groups.configuration.pages.primary;

  return (
    <div className="space-y-6">
      <PageHeader
        title={page.title}
        description={page.description}
        breadcrumb={[
          { label: "Configuration", href: "/configuration" },
          { label: "Primary Framework" },
        ]}
      />
      <FrameworkEditor data={data} />
    </div>
  );
}
