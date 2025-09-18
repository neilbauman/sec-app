// /app/configuration/primary/page.tsx
import { getFramework } from "@/lib/framework";
import PrimaryFrameworkEditorClient from "@/components/ui/PrimaryFrameworkEditorClient";

// ✅ mark page as dynamic to avoid prerender errors
export const dynamic = "force-dynamic";

export default async function PrimaryFrameworkPage() {
  const framework = await getFramework();

  return (
    <main className="p-6 space-y-6">
      <PrimaryFrameworkEditorClient data={framework} />
    </main>
  );
}
