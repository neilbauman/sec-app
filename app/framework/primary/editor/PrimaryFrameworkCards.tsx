import { Pillar } from "@/types/framework";

type Props = {
  pillars: Pillar[];
};

export default function PrimaryFrameworkCards({ pillars }: Props) {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {pillars.map((pillar) => (
        <div
          key={pillar.id}
          className="p-4 bg-white border rounded-lg shadow-sm"
        >
          <h2 className="text-lg font-semibold">
            {pillar.code} – {pillar.name}
          </h2>
          {pillar.description && (
            <p className="text-sm text-gray-600">{pillar.description}</p>
          )}
          <p className="text-xs text-gray-400">Sort order: {pillar.sort_order}</p>
        </div>
      ))}
    </div>
  );
}
