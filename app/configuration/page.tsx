// /app/configuration/page.tsx
export const dynamic = "force-dynamic";

import Link from "next/link";
import { ToolsetHeader } from "@/components/ui/ToolsetHeader";
import { makeBreadcrumbs } from "@/lib/breadcrumbs";
import { Card, CardContent } from "@/components/ui/card";

export default function ConfigurationLandingPage() {
  const breadcrumbs = makeBreadcrumbs([
    { label: "Dashboard", href: "/" },
    { label: "Configuration", href: "/configuration" },
  ]);

  return (
    <main className="p-6">
      <ToolsetHeader
        title="SSC Configuration"
        group="Configuration"
        description="Manage and edit the Shelter and Settlement Severity Classification (SSC) framework."
        breadcrumbs={breadcrumbs}
      />

      <div className="grid gap-6 md:grid-cols-2 mt-6">
        <Link href="/configuration/primary">
          <Card className="cursor-pointer hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <h2 className="text-lg font-semibold">Primary Framework Editor</h2>
              <p className="text-sm text-muted-foreground">
                Define and manage the global SSC framework including pillars,
                themes, and subthemes.
              </p>
            </CardContent>
          </Card>
        </Link>

        <Link href="/configuration/comprehensive">
          <Card className="cursor-pointer hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <h2 className="text-lg font-semibold">Comprehensive Framework Editor</h2>
              <p className="text-sm text-muted-foreground">
                Configure the full SSC framework including indicators and scoring.
              </p>
            </CardContent>
          </Card>
        </Link>
      </div>
    </main>
  );
}
