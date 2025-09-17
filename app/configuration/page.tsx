import ToolHeader from "@/components/ui/ToolHeader";

export default function ConfigurationPage() {
  return (
    <div className="space-y-6">
      <ToolHeader
        pageTitle="SSC Configuration"
        pageDescription="Manage frameworks, instances, and related settings."
        breadcrumbs={[{ label: "Dashboard", href: "/" }]}
      />
      <p className="text-gray-700">
        Select a tool from the SSC Configuration section.
      </p>
    </div>
  );
}
