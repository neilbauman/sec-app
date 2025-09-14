// app/framework/primary/editor/page.tsx

import { getFramework } from "./actions";
import PrimaryFrameworkCards from "./PrimaryFrameworkCards";

export default async function FrameworkEditorPage() {
  const pillars = await getFramework();

  return (
    <div className="p-6">
      <h1 className="mb-6 text-2xl font-bold">Framework Editor</h1>
      {pillars.length === 0 ? (
        <p className="text-gray-600">No pillars found. Add some to begin.</p>
      ) : (
        <PrimaryFrameworkCards pillars={pillars} />
      )}
    </div>
  );
}
