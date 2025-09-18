// /app/page.tsx
import { Info, Cog } from "lucide-react";
import { makeBreadcrumbs } from "@/lib/breadcrumbs";
import { ToolsetHeader } from "@/components/ui/ToolsetHeader";

export default function DashboardPage() {
  const breadcrumbs = makeBreadcrumbs(["dashboard"]);

  const cards = [
    {
      title: "About",
      description: "Learn about the SSC and this toolset.",
      href: "/about",
      icon: Info,
    },
    {
      title: "Configuration",
      description: "Manage SSC global framework and defaults.",
      href: "/configuration",
      icon: Cog,
    },
  ];

  return (
    <main className="p-6">
      <ToolsetHeader
        title="Dashboard"
        group="Home"
        description="Overview of the SSC Toolset"
        breadcrumbs={breadcrumbs}
      />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {cards.map((card) => (
          <a key={card.title} href={card.href} className="border rounded-lg p-4 bg-white shadow hover:shadow-md">
            <div className="flex items-center space-x-3 mb-2">
              <card.icon className="w-6 h-6 text-rust-600" />
              <h3 className="text-lg font-semibold">{card.title}</h3>
            </div>
            <p className="text-sm text-gray-600">{card.description}</p>
          </a>
        ))}
      </div>
    </main>
  );
}
