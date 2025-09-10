// app/admin/framework/primary/editor/page.tsx
import Link from "next/link";
import { PageHeader, Breadcrumb, CsvActions } from "@/lib/ui";
import PrimaryFrameworkCards from "@/components/PrimaryFrameworkCards";
import { fetchFrameworkList, type Pillar, type Theme, type Subtheme } from "@/lib/framework";

export default async function Page() {
  const data = await fetchFrameworkList();

  return (
    <main className="min-h-dvh bg-gray-50">
      <PageHeader
        title="Primary Framework Editor"
        breadcrumb={<Breadcrumb items={[{ label: "Dashboard", href: "/dashboard" }, { label: "Framework Editor" }]} />}
        actions={<CsvActions disableImport disableExport />}
      />

      <div className="mx-auto max-w-6xl px-4 py-6 space-y-6">
        <PrimaryFrameworkCards
          defaultOpen={false}
          pillars={data.pillars as Pillar[]}
          themes={data.themes as Theme[]}
          subthemes={data.subthemes as Subtheme[]}
        />
      </div>
    </main>
  );
}
