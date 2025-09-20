import FrameworkEditor from "@/components/framework/FrameworkEditor";
import { fetchFramework } from "@/lib/framework-client";

export default async function PrimaryFrameworkEditorPage() {
  // Fetch pillars with themes + subthemes
  const pillars = await fetchFramework();

  return <FrameworkEditor data={pillars} />;
}
