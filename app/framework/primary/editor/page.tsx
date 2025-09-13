// app/framework/primary/editor/page.tsx
import { fetchFramework } from "@/lib/framework";
import PrimaryFrameworkCards from "./PrimaryFrameworkCards";

export default async function PrimaryFrameworkEditorPage() {
  const pillars = await fetchFramework();

  if (!pillars?.length) {
    return <p className="text-red-600">Error loading data</p>;
  }

  return <PrimaryFrameworkCards pillars={pillars} />;
}
