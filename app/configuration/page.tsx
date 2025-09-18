// /app/configuration/page.tsx
import { Cog } from "lucide-react";
import { makeBreadcrumbs } from "@/lib/breadcrumbs";
import { ToolsetHeader } from "@/components/ui/ToolsetHeader";

export const dynamic = "force-dynamic";

export default function ConfigurationPage() {
  const breadcrumbs = makeBreadcrumbs(["dashboard", "configuration"]);

  const cards = [
    {
      title: "Primary Framework Editor",
      description: "Define and manage the global SSC pillars, themes, and subthemes.",
      href: "/configuration/primary",
    },
    {
      title: "Comprehensive Framework Editor",
      description: "Extended editor for detailed SSC framework configuration.",
      href: "/configuration/comprehensive",
    },
  ];

  return (
    <main className="p-6">
      <ToolsetHeader
        title="Configuration"
        group="Configuration"
        description="Manage the SSC global framework and defaults."
        breadcrumbs={breadcrumbs}
        icon={Cog}
      />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {cards.map((card) => (
          <a key={card.title} href={card.href} className="border rounded-lg p-4 bg-white shadow hover:shadow-md">
            <h3 className="text-lg font-semibold mb-2">{card.title}</h3>
            <p className="text-sm text-gray-600">{card.description}</p>
          </a>
        ))}
      </div>
    </main>
  );
}
