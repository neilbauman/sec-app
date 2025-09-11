// app/dashboard/page.tsx
import Link from "next/link";
import { PageHeader, Breadcrumb, CsvActions, Card } from "@/lib/ui";
import { ArrowRight } from "lucide-react";

export default function DashboardPage() {
  return (
    <main className="min-h-dvh bg-gray-50">
      <PageHeader
        title="Dashboard"
        breadcrumb={<Breadcrumb items={[{ label: "Home", href: "/" }, { label: "Dashboard" }]} />}
        actions={<CsvActions disableImport disableExport />}
      />
      <div className="mx-auto max-w-6xl px-4 py-6 space-y-6">
        <Card className="p-6">
          <div className="flex flex-col gap-2">
            <h2 className="text-lg font-semibold text-gray-900">Framework</h2>
            <p className="text-gray-600">
              View and edit the Shelter &amp; Settlements Vulnerability Index framework.
            </p>
            <div>
              <Link
                href="/admin/framework/primary/editor"
                className="inline-flex items-center gap-2 rounded-lg border px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                Go to Primary Framework Editor
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </Card>
      </div>
    </main>
  );
}
