// app/framework/primary/page.tsx
import PrimaryFrameworkEditorClient from "../../../components/ui/PrimaryFrameworkEditorClient";
import PageHeader from "../../../components/ui/PageHeader";
import Breadcrumbs from "../../../components/ui/Breadcrumbs";

export default function PrimaryFrameworkPage() {
  return (
    <div className="space-y-8">
      {/* Header + Breadcrumbs */}
      <PageHeader
        title="Primary Framework Editor"
        description="Manage pillars, themes, and subthemes for the primary framework."
      />
      <Breadcrumbs
        items={[
          { label: "Dashboard", href: "/" },
          { label: "Framework", href: "/framework" },
          { label: "Primary Framework Editor" },
        ]}
      />

      {/* Client-side editor */}
      <PrimaryFrameworkEditorClient />
    </div>
  );
}
