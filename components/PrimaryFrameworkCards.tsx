// components/PrimaryFrameworkCards.tsx
import type { Pillar } from "@/types/framework";

interface Props {
  pillar: Pillar;
}

export default function PrimaryFrameworkCards({ pillar }: Props) {
  return (
    <div className="border rounded-lg p-4 shadow-sm bg-white">
      <div className="flex flex-col mb-2">
        <span className="font-semibold">{pillar.name}</span>
        <span className="text-xs text-gray-500">{pillar.ref_code}</span>
      </div>
      {pillar.description && (
        <p className="text-sm text-gray-700 mb-2">{pillar.description}</p>
      )}

      {pillar.themes?.length > 0 && (
        <ul className="list-disc ml-5 text-sm text-gray-800">
          {pillar.themes.map((theme) => (
            <li key={theme.id}>
              <span className="font-medium">{theme.name}</span> –{" "}
              {theme.description}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
