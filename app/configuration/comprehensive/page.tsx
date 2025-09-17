import ToolHeader from "@/components/ui/ToolHeader";

export default function ComprehensiveFrameworkPage() {
  return (
    <div className="space-y-6">
      <ToolHeader
        pageTitle="Comprehensive Framework Editor"
        pageDescription="Configure pillars, themes, sub-themes, and indicators."
        breadcrumbs={[
          { label: "Dashboard", href: "/" },
          { label: "SSC Configuration", href: "/configuration" },
          { label: "Comprehensive Framework Editor" },
        ]}
        group="framework" // ✅ green cog, aligns with dashboard grouping
      />

      {/* Placeholder until functionality is built */}
      <div className="p-6 bg-white border rounded-2xl shadow-sm">
        <p className="text-gray-600">
          The Comprehensive Framework Editor will be implemented here.
        </p>
      </div>
    </div>
  );
}
