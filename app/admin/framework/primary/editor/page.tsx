// app/admin/framework/primary/editor/page.tsx
import Link from "next/link";
import PrimaryFrameworkCards from "@/components/PrimaryFrameworkCards";
import { fetchFrameworkList, type Pillar, type Theme, type Subtheme } from "@/lib/framework";
import { PageHeader } from "@/lib/ui";
import { Upload, Download } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function Page() {
  const data = await fetchFrameworkList();

  return (
    <main className="min-h-dvh bg-gray-50">
      <PageHeader
        title="Primary Framework Editor"
        breadcrumb={
          <div className="flex items-center gap-2">
            <Link href="/dashboard" className="text-gray-600 hover:text-gray-900">
              Dashboard
            </Link>
            <span className="text-gray-400">/</span>
            <span className="text-gray-900">Primary Framework</span>
          </div>
        }
        actions={
          <div className="flex items-center gap-2">
            {/* CSV placeholders */}
            <button className="flex items-center gap-2 rounded-md border px-3 py-1.5 text-sm hover:bg-gray-50">
              <Upload className="h-4 w-4" />
              Import CSV
            </button>
            <button className="flex items-center gap-2 rounded-md border px-3 py-1.5 text-sm hover:bg-gray-50">
              <Download className="h-4 w-4" />
              Export CSV
            </button>
          </div>
        }
      />

      <div className="mx-auto max-w-6xl px-4">
        <PrimaryFrameworkCards
          defaultOpen={false}
          pillars={data.pillars as Pillar[]}
          themes={data.themes as Theme[]}
          subthemes={data.subthemes as Subtheme[]}
          // read-only for now; actions area stays aligned to the right
          actions={{}}
        />
      </div>
    </main>
  );
}
