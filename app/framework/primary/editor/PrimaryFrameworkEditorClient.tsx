"use client";

import { useEffect, useState } from "react";
import type { Pillar } from "@/types/framework";

interface Props {
  initialData: Pillar[];
}

export default function PrimaryFrameworkEditorClient({ initialData }: Props) {
  const [pillars, setPillars] = useState<Pillar[]>(initialData || []);

  useEffect(() => {
    console.log("Framework editor received pillars:", pillars);
  }, [pillars]);

  if (!pillars || pillars.length === 0) {
    return (
      <div className="p-6">
        <h2 className="text-xl font-bold mb-4">Primary Framework Editor</h2>
        <p className="bg-yellow-100 text-yellow-800 p-4 rounded">
          No framework data available.
        </p>
      </div>
    );
  }

  return (
    <div className="p-6">
      <h2 className="text-xl font-bold mb-4">Primary Framework Editor</h2>

      {/* Debug mode: render JSON */}
      <pre className="bg-gray-100 p-4 rounded text-sm overflow-x-auto">
        {JSON.stringify(pillars, null, 2)}
      </pre>
    </div>
  );
}
