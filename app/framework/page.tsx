import PageHeader from "@/components/ui/PageHeader";
import Breadcrumbs from "@/components/ui/Breadcrumbs";

export default function FrameworkPage() {
  return (
    <div className="space-y-8">
      <PageHeader
        title="Framework"
        description="Choose between managing the Primary or Comprehensive framework."
      />
      <Breadcrumbs
        items={[
          { label: "Dashboard", href: "/" },
          { label: "Framework" },
        ]}
      />
      <div className="space-y-4">
        <p>
          Navigate to the editor you want to configure:
        </p>
        <ul className="list-disc list-inside text-blue-600">
          <li><a href="/framework/primary">Primary Framework Editor</a></li>
          <li><a href="/framework/comprehensive">Comprehensive Framework Editor</a></li>
        </ul>
      </div>
    </div>
  );
}
