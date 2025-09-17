import { getPrimaryFramework } from "@/lib/framework";

export default async function PrimaryFrameworkPage() {
  const framework = await getPrimaryFramework();

  return (
    <main className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">Primary Framework Editor (Read-Only)</h1>

      {framework.length === 0 ? (
        <p className="text-gray-600">No framework data found in the database.</p>
      ) : (
        <div className="space-y-8">
          {framework.map((pillar) => (
            <section key={pillar.id} className="space-y-2">
              <h2 className="text-xl font-semibold">
                {pillar.sort_order ?? "—"}. {pillar.name}
              </h2>
              {pillar.description && (
                <p className="text-gray-600">{pillar.description}</p>
              )}

              {pillar.themes.length > 0 && (
                <ul className="mt-2 ml-4 list-disc space-y-2">
                  {pillar.themes.map((theme) => (
                    <li key={theme.id}>
                      <div className="font-medium">
                        {theme.sort_order ?? "—"}. {theme.name}
                      </div>
                      {theme.description && (
                        <div className="text-gray-600 text-sm">{theme.description}</div>
                      )}

                      {theme.subthemes.length > 0 && (
                        <ul className="mt-1 ml-5 list-[circle] space-y-1">
                          {theme.subthemes.map((st) => (
                            <li key={st.id}>
                              <div>
                                {st.sort_order ?? "—"}. {st.name}
                              </div>
                              {st.description && (
                                <div className="text-gray-600 text-xs">{st.description}</div>
                              )}
                            </li>
                          ))}
                        </ul>
                      )}
                    </li>
                  ))}
                </ul>
              )}
            </section>
          ))}
        </div>
      )}
    </main>
  );
}
