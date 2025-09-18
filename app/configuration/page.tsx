// /app/configuration/page.tsx
import { makeBreadcrumbs } from "@/lib/breadcrumbs";
import ToolsetHeader from "@/components/ui/ToolsetHeader";

export default function ConfigurationPage() {
  const breadcrumbs = makeBreadcrumbs([
    { label: "Dashboard", href: "/" },
    { label: "Configuration" },
  ]);

  return (
    <main className="p-6">
      <ToolsetHeader
        title="SSC Configuration"
        description="Manage the SSC global framework and defaults."
        group="Configuration"
        breadcrumbs={breadcrumbs}
      />
      <p className="mt-6 text-gray-700">
        Choose a configuration tool from the menu.
      </p>
    </main>
  );
}
