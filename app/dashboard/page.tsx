// app/dashboard/page.tsx
import Link from "next/link";
import { PageHeader, Breadcrumb, CsvActions } from "@/lib/ui";

export default function DashboardPage() {
  return (
    <main className="min-h-dvh bg-gray-50">
      <PageHeader
        title="Dashboard"
        breadcrumb={
          <Breadcrumb items={[{ label: "Home", href: "/" }, { label: "Dashboard" }]} />
        }
        actions={<CsvActions disableImport disableExport />}
      />

      <div className="mx-auto max-w-6xl px-4 py-6 space-y-6">
        <div className="rounded-xl border bg-white p-6">
          <div className="mb-2 text-lg font-semibold">Framework</div>
          <p className="text-sm text-gray-600">
            Manage pillars, themes, and subthemes for the Shelter and Settlements Vulnerability Index.
          </p>
          <div className="mt-4">
            <Link
              href="/admin/framework/primary/editor"
              className="inline-flex items-center rounded-md border px-3 py-1.5 text-sm hover:bg-gray-50"
            >
              Go to Framework Editor
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
