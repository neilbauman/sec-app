// app/framework/primary/editor/page.tsx
import { fetchFramework } from "@/lib/framework";
import PrimaryFrameworkEditorClient from "@/components/PrimaryFrameworkEditorClient";
import type { Pillar } from "@/types/framework";

export default async function FrameworkEditorPage() {
  const pillars: Pillar[] = await fetchFramework();

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Framework Editor</h1>
      {pillars.length === 0 ? (
        <p className="text-gray-600">No pillars found.</p>
      ) : (
        // ✅ Use `data`, not `pillars`
        <PrimaryFrameworkEditorClient data={pillars} />
      )}
    </div>
  );
}
