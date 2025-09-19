// app/configuration/page.tsx
import PageHeader from "@/components/ui/PageHeader";

export default function ConfigurationPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        group="configuration"
        page="index"
        breadcrumb={[
          { label: "Dashboard", href: "/" },
          { label: "Configuration" },
        ]}
      />
      <div className="prose max-w-none">
        <p>
          Manage and adjust the global configuration of the SSC toolset. Choose
          a tool below to continue.
        </p>
        <ul className="list-disc list-inside mt-4">
          <li>
            <a href="/configuration/primary" className="text-brand-green font-medium">
              Primary Framework Editor
            </a>
          </li>
          <li>
            <a href="/configuration/settings" className="text-brand-green font-medium">
              Settings
            </a>
          </li>
          <li>
            <a href="/configuration/advanced" className="text-brand-green font-medium">
              Advanced Configuration
            </a>
          </li>
        </ul>
      </div>
    </div>
  );
}
