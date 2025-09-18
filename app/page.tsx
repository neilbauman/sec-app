// /app/page.tsx
import Link from "next/link";
import { Layers, Info, Cog, Globe, Database } from "lucide-react";

const groups = [
  {
    title: "About",
    description: "Overview of the SSC and toolset.",
    href: "/about",
    icon: Info,
    color: "text-blue-600 bg-blue-50",
  },
  {
    title: "SSC Configuration",
    description: "Manage the SSC global framework and defaults.",
    href: "/configuration",
    icon: Cog,
    color: "text-green-600 bg-green-50",
  },
  {
    title: "Country Configurations",
    description: "Configure place names, shapes, populations, etc.",
    href: "/countries",
    icon: Globe,
    color: "text-teal-600 bg-teal-50",
  },
  {
    title: "SSC Instances",
    description: "Perform calculations and manage SSC data.",
    href: "/instances",
    icon: Database,
    color: "text-purple-600 bg-purple-50",
  },
];

export default function DashboardPage() {
  return (
    <main className="p-6 space-y-8">
      {/* Toolset Title */}
      <div className="flex items-center gap-2">
        <Layers className="text-orange-600 h-6 w-6" />
        <h1 className="text-2xl font-bold">
          Shelter and Settlement Severity Classification Toolset
        </h1>
      </div>

      {/* Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {groups.map((g) => (
          <Link
            key={g.title}
            href={g.href}
            className="block rounded-lg border p-6 hover:shadow-md transition bg-white"
          >
            <div className="flex items-center gap-3 mb-2">
              <g.icon className={`h-6 w-6 ${g.color}`} />
              <h2 className="text-lg font-semibold">{g.title}</h2>
            </div>
            <p className="text-sm text-gray-600">{g.description}</p>
          </Link>
        ))}
      </div>
    </main>
  );
}
