// app/configuration/primary/page.tsx
import FrameworkEditor from "@/components/framework/FrameworkEditor";
import { fetchFramework } from "@/lib/framework-client";

export default async function PrimaryFrameworkEditorPage() {
  // Fetch the data server-side
  const pillars = await fetchFramework();

  return <FrameworkEditor data={pillars} />;
}
