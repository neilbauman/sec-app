// /app/configuration/page.tsx
import Link from "next/link";
import { ToolsetHeader } from "@/components/ui/ToolsetHeader";
import { Cog } from "lucide-react";
import { makeBreadcrumbs } from "@/lib/breadcrumbs";

export const dynamic = "force-dynamic";

export default function ConfigurationPage() {
  const breadcrumbs = makeBreadcrumbs(["dashboard", "configuration"]);

  return (
    <main className="p-6">
      <ToolsetHeader
        title="SSC Configuration"
        description="Manage the SSC global framework and defaults."
        group="Configuration"
        icon={Cog}
        breadcrumbs={breadcrumbs}
      />

      <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-6">
        <Link href="/configuration/primary" className="block">
          <div className="bg-white shadow rounded-xl p-6 hover:shadow-md transition">
            <h3 className="font-semibold">Primary Framework Editor</h3>
            <p className="text-sm text-gray-600">Manage pillars, themes, and subthemes.</p>
          </div>
        </Link>

        <Link href="/configuration/comprehensive" className="block">
          <div className="bg-white shadow rounded-xl p-6 hover:shadow-md transition">
            <h3 className="font-semibold">Comprehensive Framework Editor</h3>
            <p className="text-sm text-gray-600">Manage all framework elements in detail.</p>
          </div>
        </Link>
      </div>
    </main>
  );
}
