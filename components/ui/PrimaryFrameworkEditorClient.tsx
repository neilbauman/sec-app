// /components/ui/PrimaryFrameworkEditorClient.tsx
"use client";

import type { Pillar } from "@/types/framework";

type Props = { framework: Pillar[] };

export default function PrimaryFrameworkEditorClient({ framework }: Props) {
  if (!framework?.length) {
    return (
      <div className="text-gray-600">
        No framework found. Add your first pillar to get started.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {framework.map((p) => (
        <div key={p.id} className="rounded-lg border p-4">
          <div className="font-semibold">
            {p.name || "(Untitled Pillar)"}{" "}
            <span className="text-sm text-gray-500">• {p.description}</span>
          </div>

          {!!p.themes?.length && (
            <ul className="mt-2 ml-4 list-disc space-y-2">
              {p.themes.map((t) => (
                <li key={t.id}>
                  <div className="font-medium">
                    {t.name || "(Untitled Theme)"}{" "}
                    <span className="text-sm text-gray-500">• {t.description}</span>
                  </div>

                  {!!t.subthemes?.length && (
                    <ul className="mt-1 ml-6 list-[circle] space-y-1">
                      {t.subthemes.map((s) => (
                        <li key={s.id}>
                          {s.name || "(Untitled Sub-theme)"}{" "}
                          <span className="text-sm text-gray-500">• {s.description}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </li>
              ))}
            </ul>
          )}
        </div>
      ))}
    </div>
  );
}
