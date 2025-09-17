import ToolHeader from "@/components/ui/ToolHeader"

export default function ConfigurationPage() {
  return (
    <div className="space-y-6">
      <ToolHeader
        pageTitle="SSC Configuration"
        pageDescription="Manage frameworks and SSC configuration."
        breadcrumbs={[
          { label: "Dashboard", href: "/" },
          { label: "SSC Configuration" },
        ]}
        group="configuration"
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* SSC Config Cards */}
      </div>
    </div>
  )
}
