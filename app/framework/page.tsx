import PageHeader from "@/components/ui/PageHeader.tsx";
import Breadcrumbs from "@/components/ui/Breadcrumbs.tsx";
import PrimaryFrameworkEditorClient from "@/components/ui/PrimaryFrameworkEditorClient.tsx";

export default function FrameworkPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Frameworks"
        description="Manage both Primary and Comprehensive frameworks."
      />

      <Breadcrumbs
        items={[
          { label: "Dashboard", href: "/" },
          { label: "Frameworks", href: "/framework" },
        ]}
      />

      <div className="rounded-lg border bg-white p-6 shadow-sm">
        <PrimaryFrameworkEditorClient />
      </div>
    </div>
  );
}
