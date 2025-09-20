// app/configuration/primary/page.tsx
export const dynamic = "force-dynamic";

import { fetchFramework } from "@/lib/framework-client";
import FrameworkEditor from "@/components/framework/FrameworkEditor";

export default async function PrimaryFrameworkPage() {
  const data = await fetchFramework();
  return <FrameworkEditor data={data} />;
}
