import { getFramework } from "@/lib/framework";
import PrimaryFrameworkEditorClient from "@/components/ui/PrimaryFrameworkEditorClient";

export default async function Page() {
  const framework = await getFramework(); // ✅ fetch pillars/themes/subthemes

  return (
    <main className="p-6 space-y-6">
      <h1 className="text-xl font-bold">Primary Framework Editor (Read-Only)</h1>
      <PrimaryFrameworkEditorClient framework={framework} /> {/* ✅ pass data */}
    </main>
  );
}
