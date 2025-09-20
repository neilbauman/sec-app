// app/configuration/primary/page.tsx
import FrameworkEditor from "@/components/framework/FrameworkEditor";
import { fetchFramework } from "@/lib/framework-client";

export const dynamic = "force-dynamic";

export default async function PrimaryFrameworkEditorPage() {
  const data = await fetchFramework();
  return <FrameworkEditor data={data} />;
}
