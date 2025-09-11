// app/dashboard/page.tsx
import Link from "next/link";
import { PageHeader, Breadcrumb, CsvActions, Card, CardBody } from "@/lib/ui";

export default function DashboardPage() {
  return (
    <main className="min-h-dvh bg-gray-50">
      <PageHeader
        title="Dashboard"
        breadcrumb={<Breadcrumb items={[{ label: "Home", href: "/" }, { label: "Dashboard" }]} />}
        actions={<CsvActions disableImport disableExport />}
      />

      <div className="mx-auto max-w-6xl px-4 py-6 space-y-6">
        <Card>
          <CardBody>
            <div className="flex items-center justify-between">
              <div>
                <div className="text-lg font-semibold text-gray-900">Primary Framework</div>
                <div className="text-sm text-gray-600">Browse and edit the hierarchy</div>
              </div>
              <Link
                href="/admin/framework/primary/editor"
                className="rounded border px-3 py-1.5 text-sm hover:bg-gray-50"
              >
                Open Editor
              </Link>
            </div>
          </CardBody>
        </Card>
      </div>
    </main>
  );
}
