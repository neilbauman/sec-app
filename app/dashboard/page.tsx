// app/dashboard/page.tsx
import Link from "next/link";
import { PageHeader } from "@/lib/ui";
import { Upload, Download } from "lucide-react";

export default function DashboardPage() {
  return (
    <main className="min-h-dvh bg-gray-50">
      <PageHeader
        title="Dashboard"
        breadcrumb={
          <div className="flex items-center gap-2">
            <Link href="/" className="text-blue-600 hover:underline">
              Home
            </Link>
            <span className="text-gray-400">/</span>
            <span className="text-gray-700">Dashboard</span>
          </div>
        }
        actions={
          <>
            <button
              type="button"
              title="Import CSV (placeholder)"
              className="rounded border border-gray-300 bg-white px-2.5 py-1.5 text-sm text-gray-700 hover:bg-gray-50"
            >
              <span className="inline-flex items-center gap-1">
                <Upload className="h-4 w-4" />
                Import CSV
              </span>
            </button>
            <button
              type="button"
              title="Export CSV (placeholder)"
              className="rounded border border-gray-300 bg-white px-2.5 py-1.5 text-sm text-gray-700 hover:bg-gray-50"
            >
              <span className="inline-flex items-center gap-1">
                <Download className="h-4 w-4" />
                Export CSV
              </span>
            </button>
          </>
        }
      />

      <div className="mx-auto max-w-6xl px-4 py-6">
        <div className="grid gap-4 md:grid-cols-2">
          <Link
            href="/admin/framework/primary/editor"
            className="block rounded-xl border border-gray-200 bg-white p-4 hover:border-gray-300 hover:shadow-sm"
          >
            <div className="text-sm font-semibold text-gray-900">
              Primary Framework Editor
            </div>
            <p className="mt-1 text-sm text-gray-600">
              Manage pillars, themes, and subthemes.
            </p>
          </Link>

          <Link
            href="/framework"
            className="block rounded-xl border border-gray-200 bg-white p-4 hover:border-gray-300 hover:shadow-sm"
          >
            <div className="text-sm font-semibold text-gray-900">
              Public Framework View
            </div>
            <p className="mt-1 text-sm text-gray-600">
              Browse the hierarchy as users will see it.
            </p>
          </Link>
        </div>
      </div>
    </main>
  );
}
