// app/framework/page.tsx
import { fetchFramework } from "@/lib/framework";
import PrimaryFrameworkCards from "@/components/PrimaryFrameworkCards";

export default async function FrameworkPage() {
  const pillars = await fetchFramework();

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Framework</h1>
      <div className="grid grid-cols-1 gap-6">
        {pillars.map((pillar) => (
          <PrimaryFrameworkCards key={pillar.id} pillar={pillar} />
        ))}
      </div>
    </div>
  );
}
