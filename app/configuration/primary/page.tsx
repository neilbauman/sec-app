// /app/configuration/primary/page.tsx
export const dynamic = "force-dynamic";  // ✅ ensures runtime rendering

import { getFramework } from "@/lib/framework";
import PrimaryFrameworkEditorClient from "@/components/ui/PrimaryFrameworkEditorClient";

export default async function PrimaryFrameworkPage() {
  const framework = await getFramework();

  return (
    <main className="p-6">
      <PrimaryFrameworkEditorClient framework={framework} />
    </main>
  );
}
