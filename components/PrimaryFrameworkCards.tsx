// components/PrimaryFrameworkCards.tsx
import { Database } from "@/types/supabase";

type Pillar = Database["public"]["Tables"]["pillars"]["Row"];
type Theme = Database["public"]["Tables"]["themes"]["Row"];
type Subtheme = Database["public"]["Tables"]["subthemes"]["Row"];
type Indicator = Database["public"]["Tables"]["indicators"]["Row"];

interface FrameworkData extends Pillar {
  themes: (Theme & {
    subthemes: (Subtheme & {
      indicators: Indicator[];
    })[];
  })[];
}

export default function PrimaryFrameworkCards({ pillar }: { pillar: FrameworkData }) {
  return (
    <div className="border rounded-lg p-4 bg-white shadow">
      <h2 className="text-xl font-semibold">{pillar.name}</h2>
      <p className="text-gray-600">{pillar.description}</p>
      <div className="mt-4 space-y-4">
        {pillar.themes.map((theme) => (
          <div key={theme.id}>
            <h3 className="text-lg font-bold">{theme.name}</h3>
            <p className="text-gray-600">{theme.description}</p>
            <div className="ml-4 space-y-2">
              {theme.subthemes.map((subtheme) => (
                <div key={subtheme.id}>
                  <h4 className="font-medium">{subtheme.name}</h4>
                  <p className="text-gray-500">{subtheme.description}</p>
                  {subtheme.indicators.length > 0 && (
                    <ul className="ml-4 list-disc text-gray-700">
                      {subtheme.indicators.map((indicator) => (
                        <li key={indicator.id}>
                          <span className="font-medium">{indicator.name}</span>{" "}
                          {indicator.description && (
                            <span className="text-gray-500">- {indicator.description}</span>
                          )}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
