// app/about/page.tsx
import ToolsetHeader from "@/components/ui/ToolsetHeader";
import { makeBreadcrumbs } from "@/lib/breadcrumbs";
import { Info } from "lucide-react";

export const dynamic = "force-dynamic";

export default function AboutPage() {
  const breadcrumbs = makeBreadcrumbs([
    { label: "Dashboard", href: "/" },
    { label: "About" },
  ]);

  return (
    <main className="p-6">
      <ToolsetHeader
        title="About"
        description="Overview of the Shelter and Settlement Severity Classification toolset."
        group="About"
        groupIcon={Info}   // ✅ component type
        icon={Info}        // ✅ component type
        breadcrumbs={breadcrumbs}
      />
      <div className="mt-6 text-gray-600">
        <p>This is the About page. Static placeholder content goes here.</p>
      </div>
    </main>
  );
}
