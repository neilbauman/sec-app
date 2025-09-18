// /app/configuration/comprehensive/page.tsx
export const dynamic = "force-dynamic";

import { getFramework } from "@/lib/framework";
import ComprehensiveFrameworkEditorClient from "@/components/ui/ComprehensiveFrameworkEditorClient";

export default async function ComprehensiveFrameworkPage() {
  const framework = await getFramework();

  return (
    <main className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">Comprehensive Framework Editor</h1>
      <p className="text-gray-600">View and edit the full framework.</p>
      <ComprehensiveFrameworkEditorClient framework={framework} />
    </main>
  );
}
