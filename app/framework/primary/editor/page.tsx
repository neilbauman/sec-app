// app/framework/primary/editor/page.tsx
import { fetchFramework } from "@/lib/framework";
import PrimaryFrameworkEditorClient from "./PrimaryFrameworkEditorClient";

/**
 * Server component page for framework editor.
 */
export default async function PrimaryFrameworkEditorPage() {
  try {
    // Fetch data from Supabase
    const pillars = await fetchFramework();

    return (
      <div className="p-6">
        <PrimaryFrameworkEditorClient initialPillars={pillars ?? []} />
      </div>
    );
  } catch (err) {
    console.error("❌ Error loading data in PrimaryFrameworkEditorPage:", err);
    return (
      <div className="p-6 text-red-600">
        <p>Error loading data</p>
      </div>
    );
  }
}
