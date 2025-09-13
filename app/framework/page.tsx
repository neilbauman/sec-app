import { fetchFramework } from "@/lib/framework";
import PrimaryFrameworkCards from "@/components/PrimaryFrameworkCards";

export default async function FrameworkPage() {
  let pillars = [];

  try {
    pillars = await fetchFramework();
  } catch (error) {
    console.error("FrameworkPage failed:", error);
    return <div className="text-red-600">Error loading data</div>;
  }

  if (!pillars || pillars.length === 0) {
    return <div className="text-gray-600">⚠️ No framework data found</div>;
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Framework Editor</h1>
      <PrimaryFrameworkCards pillars={pillars} />
    </div>
  );
}
