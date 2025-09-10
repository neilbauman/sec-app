// app/dashboard/page.tsx
import Link from "next/link";
import { PageHeader, CsvActions, Crumb } from "@/lib/ui";
import { ArrowRight } from "lucide-react";

export default function DashboardPage() {
  return (
    <main className="min-h-dvh bg-gray-50">
      <PageHeader
        title="Dashboard"
        breadcrumb={[{ label: "Home", href: "/" }, { label: "Dashboard" }]}
        actions={<CsvActions disabled />}
      />

      <div className="mx-auto max-w-6xl px-4 pb-12">
        <section className="grid gap-4 md:grid-cols-2">
          {/* Card: Framework Editor */}
          <div className="rounded-xl border bg-white p-5 shadow-sm">
            <div className="mb-2 text-sm text-gray-500">Manage framework</div>
            <h2 className="text-lg font-semibold text-gray-900">Primary Framework Editor</h2>
            <p className="mt-1 text-sm text-gray-600">
              View and organize pillars, themes, and subthemes. Add, edit, and reorder items.
            </p>
            <div className="mt-4">
              <Link
                href="/admin/framework/primary/editor"
                className="inline-flex items-center gap-2 rounded-lg border px-3 py-1.5 text-sm text-gray-700 hover:bg-gray-50"
                title="Open Framework Editor"
              >
                Open Editor <ArrowRight size={16} />
              </Link>
            </div>
          </div>

          {/* Card: Indicators (future) */}
          <div className="rounded-xl border bg-white p-5 shadow-sm">
            <div className="mb-2 text-sm text-gray-500">Manage data</div>
            <h2 className="text-lg font-semibold text-gray-900">Indicators</h2>
            <p className="mt-1 text-sm text-gray-600">
              Define and maintain indicators mapped to subthemes. (Coming soon)
            </p>
            <div className="mt-4">
              <button
                type="button"
                className="inline-flex cursor-not-allowed items-center gap-2 rounded-lg border px-3 py-1.5 text-sm text-gray-400"
                title="Coming soon"
                disabled
              >
                Configure <ArrowRight size={16} />
              </button>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
