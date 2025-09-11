// app/admin/framework/primary/editor/page.tsx
import { PageHeader, Breadcrumb, CsvActions } from "@/lib/ui";
import PrimaryFrameworkCards from "@/components/PrimaryFrameworkCards";
import { fetchFrameworkList } from "@/lib/framework";
import type { Pillar, Theme, Subtheme } from "@/types/framework";

export default async function Page() {
  const { pillars, themes, subthemes } = await fetchFrameworkList();

  return (
    <main className="min-h-dvh bg-gray-50">
      <PageHeader
        title="Primary Framework Editor"
        breadcrumb={
          <Breadcrumb
            items={[
              { label: "Dashboard", href: "/dashboard" },
              { label: "Admin", href: "/admin" },
              { label: "Primary Framework" },
            ]}
          />
        }
        actions={<CsvActions disableImport disableExport />}
      />

      <div className="mx-auto max-w-6xl px-4 py-6">
        <PrimaryFrameworkCards
          defaultOpen={false}
          data={{ pillars: pillars as Pillar[], themes: themes as Theme[], subthemes: subthemes as Subtheme[] }}
          actions={{}} // keep the right-side actions column aligned; no-op for now
        />
      </div>
    </main>
  );
}
