// /app/configuration/page.tsx
export const dynamic = "force-dynamic";

import Link from "next/link";
import { ToolsetHeader } from "@/components/ui/ToolsetHeader";
import { makeBreadcrumbs } from "@/lib/breadcrumbs";
import { Cog } from "lucide-react";

export default function ConfigurationPage() {
  const breadcrumbs = makeBreadcrumbs([
    { label: "Dashboard", href: "/" },
    { label: "Configuration" }
  ]);

  return (
    <main className="p-6">
      <ToolsetHeader
        title="SSC Configuration"
        description="Manage the SSC global framework and defaults."
        group="Configuration"
        groupIcon={<Cog className="w-5 h-5 text-green-600" />}
        breadcrumbs={breadcrumbs}
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6">
        <Link href="/configuration/primary" className="block">
          <div className="p-4 border rounded-lg hover:shadow-md transition bg-white">
            <h3 className="font-semibold text-lg">Primary Framework Editor</h3>
            <p className="text-sm text-gray-600">
              Define and manage the global SSC framework including pillars, themes, and subthemes.
            </p>
          </div>
        </Link>

        <Link href="/configuration/comprehensive" className="block">
          <div className="p-4 border rounded-lg hover:shadow-md transition bg-white">
            <h3 className="font-semibold text-lg">Comprehensive Framework Editor</h3>
            <p className="text-sm text-gray-600">
              Manage and edit detailed framework elements, indicators, and relationships.
            </p>
          </div>
        </Link>
      </div>
    </main>
  );
}
