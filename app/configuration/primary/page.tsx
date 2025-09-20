import FrameworkEditor from "@/components/framework/FrameworkEditor";
import { fetchFramework } from "@/lib/framework-client";

export default async function PrimaryFrameworkEditorPage() {
  const pillars = await fetchFramework(); // ✅ fetch framework data
  return <FrameworkEditor data={pillars} />; // ✅ pass into component
}
