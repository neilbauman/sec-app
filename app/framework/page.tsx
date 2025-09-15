// app/framework/page.tsx
import { fetchFramework } from "@/lib/framework";
import PrimaryFrameworkCards from "./primary/editor/PrimaryFrameworkCards";

export default async function FrameworkPage() {
  const pillars = await fetchFramework();

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Framework Editor</h1>

      {pillars.length === 0 ? (
        <>
          <p className="text-gray-600">No pillars found.</p>

          {/* ✅ Debug: dump raw data */}
          <pre className="mt-6 bg-gray-100 p-4 text-xs overflow-x-auto">
            {JSON.stringify(pillars, null, 2)}
          </pre>
        </>
      ) : (
        <>
          <PrimaryFrameworkCards pillars={pillars} />

          {/* ✅ Debug: also show raw JSON even if we render */}
          <pre className="mt-6 bg-gray-100 p-4 text-xs overflow-x-auto">
            {JSON.stringify(pillars, null, 2)}
          </pre>
        </>
      )}
    </div>
  );
}
