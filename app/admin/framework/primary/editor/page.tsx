// /app/admin/framework/primary/editor/page.tsx
import { PageHeader, Breadcrumb, CsvActions } from "@/lib/ui";
import PrimaryFrameworkCards from "@/components/PrimaryFrameworkCards";
import { fetchFrameworkList } from "@/lib/framework";
import Link from "next/link";

export default async function Page() {
  const data = await fetchFrameworkList();

  return (
    <main className="min-h-dvh bg-gray-50">
      <PageHeader
        title="Primary Framework Editor"
        breadcrumb={
          <Breadcrumb
            items={[
              { label: "Dashboard", href: "/dashboard" },
              { label: "Admin", href: "/admin" },
              { label: "Framework", href: "/admin/framework" },
              { label: "Primary", href: "/admin/framework/primary" },
              { label: "Editor" },
            ]}
          />
        }
        actions={<CsvActions disableImport disableExport />}
      />

      <div className="mx-auto max-w-6xl px-4 py-6">
        <PrimaryFrameworkCards
          defaultOpen={false}
          pillars={data.pillars}
          themes={data.themes}
          subthemes={data.subthemes}
        />
        <div className="mt-6 text-sm text-gray-600">
          <Link className="text-blue-600 hover:underline" href="/dashboard">
            ← Back to Dashboard
          </Link>
        </div>
      </div>
    </main>
  );
}
