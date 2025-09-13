// app/framework/page.tsx
import { fetchFramework } from "@/lib/framework";
import PrimaryFrameworkEditorClient from "./primary/editor/PrimaryFrameworkEditorClient";

export default async function FrameworkPage() {
  const pillars = await fetchFramework();

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Framework Editor</h1>
      <PrimaryFrameworkEditorClient pillars={pillars} />
    </div>
  );
}
