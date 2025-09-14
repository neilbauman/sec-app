// app/framework/page.tsx
import { fetchFramework } from "@/lib/framework";
import PrimaryFrameworkCards from "@/components/PrimaryFrameworkCards";
import type { Pillar } from "@/types/framework";

export default async function FrameworkPage() {
  const pillars: Pillar[] = await fetchFramework();

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Framework</h1>
      <PrimaryFrameworkCards pillars={pillars} />
    </div>
  );
}
