// app/framework/page.tsx
import { fetchFramework } from "@/app/framework/primary/editor/actions";
import PrimaryFrameworkCards from "@/app/framework/primary/editor/PrimaryFrameworkCards";
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
