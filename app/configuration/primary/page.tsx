// /app/framework/primary/page.tsx
import { getFramework } from "@/lib/framework";
import PrimaryFrameworkEditorClient from "@/components/ui/PrimaryFrameworkEditorClient";

export default async function FrameworkPrimaryPage() {
  // ✅ fetch data
  const framework = await getFramework();

  return (
    <main className="p-6 space-y-6">
      <PrimaryFrameworkEditorClient framework={framework} />
    </main>
  );
}
