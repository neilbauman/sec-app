import ToolHeader from "@/components/ui/ToolHeader"

export default function Page() {
  return (
    <div className="space-y-6">
      <ToolHeader
        pageTitle="Shelter and Settlements Severity Classification Toolset"
        pageDescription="Welcome to the Shelter and Settlements Severity Classification Toolset (SSC). This tool helps configure, manage, and evaluate primary and comprehensive frameworks, country datasets, and SSC instances."
        breadcrumbs={[{ label: "Dashboard" }]}
        group="dashboard"
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Cards here */}
      </div>
    </div>
  )
}
