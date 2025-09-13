// app/framework/primary/editor/page.tsx
import { fetchFramework } from "@/lib/framework";
import PrimaryFrameworkEditorClient from "./PrimaryFrameworkEditorClient";

export default async function PrimaryFrameworkEditorPage() {
  const pillars = await fetchFramework();

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Primary Framework Editor</h1>
      {pillars.length === 0 ? (
        <p className="bg-yellow-100 text-yellow-800 p-4 rounded">
          No framework data available.
        </p>
      ) : (
        // ✅ Pass data with the correct prop name
        <PrimaryFrameworkEditorClient initialData={pillars} />
      )}
    </div>
  );
}
