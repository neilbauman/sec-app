// app/dashboard/page.tsx
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { PageHeader, CsvActions } from "@/lib/ui";

export default function DashboardPage() {
  return (
    <main className="min-h-dvh bg-gray-50">
      <PageHeader
        title="Dashboard"
        breadcrumb={
          <div className="flex items-center gap-1 text-sm text-gray-500">
            <Link href="/" className="hover:text-gray-700">Home</Link>
            <ArrowRight className="h-3 w-3" aria-hidden />
            <span className="text-gray-700">Dashboard</span>
          </div>
        }
        actions={<CsvActions disabled />}
      />

      <div className="mx-auto max-w-6xl px-4 py-6 space-y-6">
        {/* Add dashboard tiles/links here as we flesh it out */}
        <div className="rounded-xl border bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-semibold">Primary Framework Editor</h3>
              <p className="mt-1 text-sm text-gray-600">
                Manage pillars, themes, and subthemes.
              </p>
            </div>
            <Link
              href="/admin/framework/primary/editor"
              className="inline-flex items-center rounded-lg border px-3 py-1.5 text-sm hover:bg-gray-50"
            >
              Open editor
              <ArrowRight className="ml-1 h-4 w-4" aria-hidden />
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
