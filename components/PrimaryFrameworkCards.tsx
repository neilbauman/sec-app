// app/components/PrimaryFrameworkCards.tsx
import type { Pillar } from "@/types/pillar";

interface Props {
  pillars: Pillar[];
}

export default function PrimaryFrameworkCards({ pillars }: Props) {
  return (
    <div className="grid grid-cols-1 gap-6">
      {pillars.map((pillar) => (
        <div key={pillar.id} className="border rounded-xl shadow p-4">
          <h2 className="text-lg font-semibold">
            {pillar.ref_code} – {pillar.name}
          </h2>
          {pillar.description && (
            <p className="text-sm text-gray-600">{pillar.description}</p>
          )}

          {pillar.themes && pillar.themes.length > 0 && (
            <ul className="list-disc pl-6 mt-2">
              {pillar.themes.map((theme) => (
                <li key={theme.id}>
                  {theme.ref_code} – {theme.name}
                </li>
              ))}
            </ul>
          )}
        </div>
      ))}
    </div>
  );
}
