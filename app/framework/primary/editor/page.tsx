// app/framework/primary/editor/page.tsx
import { Suspense } from "react";
import PrimaryFrameworkEditorClient from "@/components/PrimaryFrameworkEditorClient";
import { fetchFramework } from "@/lib/framework";

export default async function PrimaryFrameworkEditorPage() {
  const data = await fetchFramework();

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Primary Framework Editor</h1>
      <Suspense fallback={<p>Loading framework data…</p>}>
        {data.length === 0 ? (
          <div className="p-4 bg-yellow-50 text-yellow-700 border border-yellow-200 rounded">
            No framework data available.
          </div>
        ) : (
          <PrimaryFrameworkEditorClient data={data} />
        )}
      </Suspense>
    </div>
  );
}
