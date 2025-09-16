import PageHeader from "@/components/ui/PageHeader.tsx";
import Breadcrumbs from "@/components/ui/Breadcrumbs.tsx";
import PrimaryFrameworkEditorClient from "@/components/ui/PrimaryFrameworkEditorClient.tsx";

export default function PrimaryFrameworkPage() {
  return (
    <div className="space-y-6">
      <PageHeader title="Primary Framework" subtitle="Configure pillars, themes, and sub-themes." />

      <Breadcrumbs
        items={[
          { label: "Dashboard", href: "/" },
          { label: "Frameworks", href: "/framework" },
          { label: "Primary Framework", href: "/framework/primary" },
        ]}
      />

      <div className="p-4 border rounded-lg bg-white shadow">
        <PrimaryFrameworkEditorClient />
      </div>
    </div>
  );
}
