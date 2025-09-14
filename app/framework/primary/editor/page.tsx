// app/framework/primary/editor/page.tsx
import { fetchFramework } from "./actions";
import type { Pillar } from "@/types/framework";
import PrimaryFrameworkEditorClient from "@/components/PrimaryFrameworkEditorClient";

export default async function PrimaryFrameworkEditorPage() {
  const pillars: Pillar[] = await fetchFramework();

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Primary Framework Editor</h1>
      {pillars.length === 0 ? (
        <p className="text-gray-600">No pillars found.</p>
      ) : (
        <PrimaryFrameworkEditorClient data={pillars} />
      )}
    </div>
  );
}
