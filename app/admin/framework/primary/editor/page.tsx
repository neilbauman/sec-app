// app/admin/framework/primary/editor/page.tsx
import Link from "next/link";
import { PageHeader, CsvActions } from "@/lib/ui";
import PrimaryFrameworkCards from "@/components/PrimaryFrameworkCards";
import { fetchFrameworkList } from "@/lib/framework";
import type { Pillar, Theme, Subtheme } from "@/types/framework";

export default async function Page() {
  const data = await fetchFrameworkList();

  return (
    <main className="min-h-dvh bg-gray-50">
      <PageHeader
        title="Primary Framework Editor"
        breadcrumb={
          <>
            <Link href="/" className="text-gray-500 hover:text-gray-900">Home</Link>
            <span className="mx-1">/</span>
            <Link href="/dashboard" className="text-gray-500 hover:text-gray-900">Dashboard</Link>
            <span className="mx-1">/</span>
            <span className="text-gray-900">Primary Editor</span>
          </>
        }
        actions={<CsvActions disableImport disableExport />}
      />

      <div className="mx-auto max-w-6xl px-4 py-6">
        <PrimaryFrameworkCards
          defaultOpen={false}
          pillars={data.pillars as Pillar[]}
          themes={data.themes as Theme[]}
          subthemes={data.subthemes as Subtheme[]}
          actions={
            // keep aligned to the right; real hooks wired later
            <div className="flex items-center gap-2">
              {/* Example disabled action placeholders */}
            </div>
          }
        />
      </div>
    </main>
  );
}
