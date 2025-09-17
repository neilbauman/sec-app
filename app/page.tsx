// /app/page.tsx
import { ToolHeader } from "@/components/ui/ToolHeader";

export default function Page() {
  return (
    <main className="p-6 space-y-6">
      <ToolHeader
        title="SSC Dashboard"
        description="Welcome to the Shelter and Settlements Severity Classification Toolset (SSC)."
        breadcrumbs={[{ label: "Dashboard" }]}
        group="Configuration" // ✅ required
      />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Add dashboard widgets or cards here */}
      </div>
    </main>
  );
}
