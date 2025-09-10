// app/admin/framework/primary/editor/page.tsx
import Link from "next/link";
import AppHeader from "@/components/AppHeader";
import PrimaryFrameworkCards from "@/components/PrimaryFrameworkCards";
import { fetchFrameworkList } from "@/lib/framework";
import { Download, Upload } from "lucide-react";
import ActionIcon from "@/components/ActionIcon";

export default async function Page() {
  const data = await fetchFrameworkList();

  const pillars = (Array.isArray(data?.pillars) ? data!.pillars : []).map((p: any) => ({
    id: String(p.id ?? ""),
    code: String(p.code ?? ""),
    name: String(p.name ?? ""),
    description: p.description ?? "",
    sort_order: Number(p.sort_order ?? 0),
  }));

  const themes = (Array.isArray(data?.themes) ? data!.themes : []).map((t: any) => ({
    id: String(t.id ?? ""),
    code: String(t.code ?? ""),
    pillar_id: t.pillar_id ?? null,
    pillar_code: t.pillar_code ?? null,
    name: String(t.name ?? ""),
    description: t.description ?? "",
    sort_order: Number(t.sort_order ?? 0),
  }));

  const subthemes = (Array.isArray(data?.subthemes) ? data!.subthemes : []).map((s: any) => ({
    id: String(s.id ?? ""),
    code: String(s.code ?? ""),
    theme_id: s.theme_id ?? null,
    theme_code: s.theme_code ?? null,
    name: String(s.name ?? ""),
    description: s.description ?? "",
    sort_order: Number(s.sort_order ?? 0),
  }));

  return (
    <>
      <AppHeader
        title="Primary Framework Editor"
        breadcrumbs={[
          { href: "/admin", label: "Dashboard" },
          { label: "Primary Framework Editor" },
        ]}
      />

      <main className="mx-auto max-w-6xl px-4 pb-12 pt-6">
        {/* Top actions row: CSV Import/Export placeholders */}
        <div className="mb-4 flex items-center justify-between">
          <div className="text-sm text-gray-500">
            Manage pillars, themes, and subthemes.
          </div>
          <div className="flex items-center gap-2">
            <ActionIcon title="Import CSV (coming soon)" disabled>
              <Upload className="h-4 w-4" aria-hidden="true" />
            </ActionIcon>
            <ActionIcon title="Export CSV (coming soon)" disabled>
              <Download className="h-4 w-4" aria-hidden="true" />
            </ActionIcon>
          </div>
        </div>

        <PrimaryFrameworkCards
          defaultOpen={false}
          pillars={pillars}
          themes={themes}
          subthemes={subthemes}
          actions={{}} // read-only placeholders for now
        />
      </main>
    </>
  );
}
