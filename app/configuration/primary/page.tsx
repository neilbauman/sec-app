// /app/configuration/primary/page.tsx
import { fetchFramework } from "@/lib/framework";
import PrimaryFrameworkEditorClient from "@/components/ui/PrimaryFrameworkEditorClient";

export default async function PrimaryFrameworkPage() {
  const framework = await fetchFramework();

  return (
    <main className="p-6 space-y-6">
      <PrimaryFrameworkEditorClient data={framework} />
    </main>
  );
}
