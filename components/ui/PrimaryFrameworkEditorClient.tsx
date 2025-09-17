"use client";

import { generateRefCodes } from "@/lib/refCodes";
import type { Pillar } from "@/types/framework";

interface Props {
  framework: Pillar[];
}

export default function PrimaryFrameworkEditorClient({ framework }: Props) {
  const frameworkWithCodes = generateRefCodes(framework);

  return (
    <div>
      {frameworkWithCodes.map((pillar) => (
        <div key={pillar.id} className="mb-6">
          <h2 className="font-bold">
            {pillar.ref_code} – {pillar.name}
          </h2>
          <p>{pillar.description}</p>

          {pillar.themes.map((theme) => (
            <div key={theme.id} className="ml-6 mt-2">
              <h3>
                {theme.ref_code} – {theme.name}
              </h3>
              <p>{theme.description}</p>

              {theme.subthemes.map((sub) => (
                <div key={sub.id} className="ml-6 mt-1">
                  <strong>{sub.ref_code}</strong> – {sub.name}
                  <p>{sub.description}</p>
                </div>
              ))}
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}
