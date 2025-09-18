// /app/page.tsx
export const dynamic = "force-dynamic";

import { getFramework } from "@/lib/framework";

export default async function HomePage() {
  const framework = await getFramework();

  return (
    <main className="p-6 space-y-6">
      <h1 className="text-3xl font-bold">SSC Dashboard</h1>
      <p className="text-gray-600">
        Welcome to the Shelter and Settlements Severity Classification Toolset (SSC).
      </p>
      <pre className="bg-gray-100 p-4 rounded text-sm">
        {JSON.stringify(framework, null, 2)}
      </pre>
    </main>
  );
}
