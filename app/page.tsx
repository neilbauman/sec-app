// /app/page.tsx
import { Info, Cog, Globe, Database, Layers } from "lucide-react";

export default function DashboardPage() {
  const cards = [
    {
      title: "About",
      description: "Overview of the SSC and toolset.",
      icon: Info,
      href: "/about",
      color: "bg-blue-100 text-blue-700",
    },
    {
      title: "SSC Configuration",
      description: "Manage the SSC global framework and defaults.",
      icon: Cog,
      href: "/configuration",
      color: "bg-green-100 text-green-700",
    },
    {
      title: "Country Configurations",
      description: "Configure baselines like places, shapes, and populations.",
      icon: Globe,
      href: "/countries",
      color: "bg-purple-100 text-purple-700",
    },
    {
      title: "SSC Instances",
      description: "Use defaults to calculate and edit SSC instances.",
      icon: Database,
      href: "/instances",
      color: "bg-orange-100 text-orange-700",
    },
  ];

  return (
    <main className="p-6">
      {/* Toolset Title */}
      <div className="flex items-center space-x-2 text-rust-600 mb-6">
        <Layers className="w-7 h-7" />
        <h1 className="text-2xl font-bold">
          Shelter and Settlement Severity Classification Toolset
        </h1>
      </div>

      {/* Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {cards.map((card, i) => (
          <a
            key={i}
            href={card.href}
            className={`p-6 rounded-xl shadow-sm border hover:shadow-md transition ${card.color}`}
          >
            <div className="flex items-center space-x-3">
              <card.icon className="w-6 h-6" />
              <h2 className="text-lg font-semibold">{card.title}</h2>
            </div>
            <p className="mt-2 text-sm">{card.description}</p>
          </a>
        ))}
      </div>
    </main>
  );
}
