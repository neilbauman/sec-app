// /app/configuration/primary/page.tsx
import { getFramework } from "@/lib/framework";
import PrimaryFrameworkEditorClient from "@/components/ui/PrimaryFrameworkEditorClient";

export default async function PrimaryFrameworkEditorPage() {
  const framework = await getFramework();

  return (
    <main className="p-6 space-y-6">
      <h1 className="text-xl font-bold">Primary Framework Editor (Read-Only)</h1>
      {framework.length === 0 ? (
        <p>No framework data found in the database.</p>
      ) : (
        <PrimaryFrameworkEditorClient framework={framework} />
      )}
    </main>
  );
}
