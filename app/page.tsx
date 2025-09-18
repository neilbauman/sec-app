import { Layers, Info, Cog, Globe, Database } from "lucide-react";

const groups = [
  {
    title: "About",
    description: "Overview of the SSC and this toolset.",
    icon: Info,
    color: "text-blue-500",
    href: "/about",
  },
  {
    title: "SSC Configuration",
    description: "Manage global SSC framework and defaults.",
    icon: Cog,
    color: "text-green-600",
    href: "/configuration",
  },
  {
    title: "Country Configuration",
    description: "Configure country-level baselines, mapping, and population data.",
    icon: Globe,
    color: "text-orange-500",
    href: "/country",
  },
  {
    title: "SSC Instances",
    description: "Perform calculations and manage SSC instances.",
    icon: Database,
    color: "text-purple-600",
    href: "/instances",
  },
];

export default function DashboardPage() {
  return (
    <main className="p-6">
      <div className="flex items-center space-x-2 mb-6 text-rust-600 font-bold text-xl">
        <Layers className="w-6 h-6" />
        <h1>Shelter and Settlement Severity Classification Toolset</h1>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {groups.map((g, i) => (
          <a
            key={i}
            href={g.href}
            className="p-6 rounded-xl shadow bg-white hover:bg-gray-50 transition block"
          >
            <div className="flex items-center space-x-3">
              <g.icon className={`w-6 h-6 ${g.color}`} />
              <h2 className="text-lg font-semibold">{g.title}</h2>
            </div>
            <p className="text-sm text-gray-600 mt-2">{g.description}</p>
          </a>
        ))}
      </div>
    </main>
  );
}
