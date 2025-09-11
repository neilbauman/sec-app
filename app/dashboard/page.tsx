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
        {/* Get started */}
        <section className="rounded-2xl border bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold">Get started</h2>
          <p className="mt-1 text-sm text-gray-600">
            Jump into editing the Primary Framework or browse admin utilities.
          </p>

          <div className="mt-4 flex flex-wrap gap-3">
            <Link
              href="/admin/framework/primary/editor"
              className="inline-flex items-center gap-2 rounded-lg border px-3 py-2 text-sm hover:bg-gray-50"
            >
              Open Primary Framework Editor
            </Link>

            <Link
              href="/admin"
              className="inline-flex items-center gap-2 rounded-lg border px-3 py-2 text-sm hover:bg-gray-50"
            >
              Admin Home
            </Link>
          </div>
        </section>

        {/* CSV actions (placeholder, disabled) */}
        <section className="rounded-2xl border bg-white p-6 shadow-sm">
          <h3 className="text-base font-medium">Data import &amp; export</h3>
          <p className="mt-1 text-sm text-gray-600">
            CSV import/export placeholders are shown below. We’ll wire these up next.
          </p>
          <div className="mt-3">
            <CsvActions disableImport disableExport />
          </div>
        </section>
      </div>
    </main>
  );
}
