// /components/ui/PrimaryFrameworkEditorClient.tsx
"use client";

export default function PrimaryFrameworkEditorClient({ framework }: { framework: any[] }) {
  if (!framework || framework.length === 0) {
    return <p>No framework data found in the database.</p>;
  }

  return (
    <div className="space-y-6">
      {framework.map((pillar) => (
        <div key={pillar.id} className="border p-4 rounded">
          <h2 className="font-bold">{pillar.name}</h2>
          <p className="text-sm text-gray-600">{pillar.description}</p>

          {pillar.themes?.map((theme: any) => (
            <div key={theme.id} className="ml-4 mt-2">
              <h3 className="font-semibold">{theme.name}</h3>
              <p className="text-xs text-gray-500">{theme.description}</p>

              {theme.subthemes?.map((sub: any) => (
                <div key={sub.id} className="ml-6 mt-1">
                  <span className="text-sm">{sub.name}</span>
                  <p className="text-xs text-gray-400">{sub.description}</p>
                </div>
              ))}
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}
