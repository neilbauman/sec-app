// app/framework/primary/editor/PrimaryFrameworkCards.tsx
type Props = {
  pillars: any[];
};

export default function PrimaryFrameworkCards({ pillars }: Props) {
  return (
    <div className="space-y-6">
      {pillars.map((pillar: any) => (
        <div key={pillar.id} className="border rounded-lg p-4 shadow">
          <h2 className="text-xl font-semibold">{pillar.name}</h2>
          {pillar.description && (
            <p className="text-gray-600">{pillar.description}</p>
          )}

          {pillar.themes?.length > 0 && (
            <div className="mt-4 space-y-2">
              {pillar.themes.map((theme: any) => (
                <div key={theme.id} className="border-l-4 pl-3">
                  <h3 className="text-lg font-medium">{theme.name}</h3>
                  {theme.description && (
                    <p className="text-sm text-gray-500">{theme.description}</p>
                  )}

                  {theme.subthemes?.length > 0 && (
                    <div className="mt-2 space-y-1">
                      {theme.subthemes.map((sub: any) => (
                        <div key={sub.id} className="ml-4">
                          <h4 className="font-medium">{sub.name}</h4>
                          {sub.description && (
                            <p className="text-xs text-gray-500">{sub.description}</p>
                          )}

                          {sub.indicators?.length > 0 && (
                            <ul className="ml-6 list-disc text-xs text-gray-600">
                              {sub.indicators.map((ind: any) => (
                                <li key={ind.id}>
                                  {ind.name}{" "}
                                  {ind.criteria_levels?.length > 0 && (
                                    <ul className="ml-4 list-circle">
                                      {ind.criteria_levels.map((cl: any) => (
                                        <li key={cl.id}>
                                          {cl.label} (score: {cl.default_score})
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
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
