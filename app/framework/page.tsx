import PageHeader from "@/components/ui/PageHeader";
import Breadcrumbs from "@/components/ui/Breadcrumbs";

export default function FrameworkPage() {
  return (
    <div className="space-y-6">
      <PageHeader title="Frameworks" subtitle="Manage all frameworks here." />

      <Breadcrumbs
        items={[
          { label: "Dashboard", href: "/" },
          { label: "Frameworks", href: "/framework" },
        ]}
      />

      <div className="p-4 border rounded-lg bg-white shadow">
        <p>This is the Framework landing page. Select a tool from the sidebar.</p>
      </div>
    </div>
  );
}
