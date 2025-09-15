// app/framework/page.tsx
import { fetchFramework } from "@/lib/framework";
import PrimaryFrameworkCards from "./primary/editor/PrimaryFrameworkCards";

export default async function FrameworkPage() {
  const pillars = await fetchFramework();

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Framework Editor</h1>

      {pillars.length === 0 ? (
        <p className="text-gray-600">No pillars found.</p>
      ) : (
        <PrimaryFrameworkCards pillars={pillars} />
      )}
    </div>
  );
}
