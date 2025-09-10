// app/admin/framework/primary/editor/page.tsx
import Link from "next/link";
import PrimaryFrameworkCards from "@/components/PrimaryFrameworkCards";
import { fetchFrameworkList, type Pillar, type Theme, type Subtheme } from "@/lib/framework";

export default async function Page() {
  const data = await fetchFrameworkList();

  // Defensive shape
  const pillars = (data?.pillars ?? []) as Pillar[];
  const themes = (data?.themes ?? []) as Theme[];
  const subthemes = (data?.subthemes ?? []) as Subtheme[];

  return (
    <main className="p-6">
      <div className="mb-4 flex items-center justify-between">
        <h1 className="text-xl font-semibold">Primary Framework</h1>
        <Link href="/admin" className="text-sm text-blue-600 hover:underline">
          Back
        </Link>
      </div>

      <PrimaryFrameworkCards
        defaultOpen={false}
        pillars={pillars}
        themes={themes}
        subthemes={subthemes}
        actions={{}} // read-only for now
      />
    </main>
  );
}
