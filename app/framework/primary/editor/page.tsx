import { fetchFramework } from "@/lib/framework";
import PrimaryFrameworkEditorClient from "./PrimaryFrameworkEditorClient";

export default async function FrameworkEditorPage() {
  const pillars = await fetchFramework();

  return (
    <PrimaryFrameworkEditorClient initialPillars={pillars ?? []} />
  );
}
