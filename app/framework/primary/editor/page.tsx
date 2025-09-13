// app/framework/primary/editor/page.tsx
import { fetchFramework } from "@/lib/framework";
import PrimaryFrameworkEditorClient from "./PrimaryFrameworkEditorClient";

export default async function PrimaryFrameworkEditorPage() {
  const pillars = await fetchFramework();

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Primary Framework Editor</h1>
      {pillars.length === 0 ? (
        <p className="text-yellow-700 bg-yellow-100 p-4 rounded">
          No framework data available.
        </p>
      ) : (
        <PrimaryFrameworkEditorClient pillars={pillars} />
      )}
    </div>
  );
}
