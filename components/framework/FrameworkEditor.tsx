"use client";

import { useState } from "react";
import PageHeader from "../ui/PageHeader";
import {
  NestedPillar,
  NestedTheme,
  Subtheme,
  fetchFramework,
} from "@/lib/framework-client";

type FrameworkEditorProps = {
  data: NestedPillar[];
};

type ModalState =
  | { type: "add-pillar" }
  | { type: "add-theme"; parentId: string }
  | { type: "add-subtheme"; parentId: string }
  | null;

export default function FrameworkEditor({ data }: FrameworkEditorProps) {
  const [pillars, setPillars] = useState<NestedPillar[]>(data);
  const [modal, setModal] = useState<ModalState>(null);

  return (
    <div className="p-4">
      <PageHeader
        title="Primary Framework Editor"
        description="Define and manage pillars, themes, and subthemes of the SSC framework."
        breadcrumb={[
          { label: "Dashboard", href: "/" },
          { label: "Configuration", href: "/configuration" },
          { label: "Primary" },
        ]}
      />

      {/* Pillars */}
      <div className="space-y-6">
        {pillars.map((pillar) => (
          <div key={pillar.id} className="border rounded p-4">
            <h2 className="text-lg font-semibold">{pillar.name}</h2>
            <p className="text-sm text-gray-600">{pillar.description}</p>

            {/* Themes */}
            <div className="ml-4 mt-3 space-y-4">
              {pillar.themes.map((theme: NestedTheme) => (
                <div key={theme.id} className="border-l-2 pl-3">
                  <h3 className="font-medium">{theme.name}</h3>
                  <p className="text-sm text-gray-500">{theme.description}</p>

                  {/* Subthemes */}
                  <ul className="ml-4 list-disc text-sm">
                    {theme.subthemes.map((sub: Subtheme) => (
                      <li key={sub.id}>
                        <span className="font-medium">{sub.name}</span> —{" "}
                        {sub.description}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
