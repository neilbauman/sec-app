// /app/configuration/comprehensive/page.tsx
export const dynamic = "force-dynamic";

import { getFramework } from "@/lib/framework";

export default async function ComprehensiveFrameworkPage() {
  const framework = await getFramework();

  return (
    <main className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">Comprehensive Framework Editor</h1>
      <p className="text-gray-600">Read-only framework data for now.</p>
      <pre className="bg-gray-100 p-4 rounded text-sm">
        {JSON.stringify(framework, null, 2)}
      </pre>
    </main>
  );
}
