// /app/configuration/page.tsx
import Link from "next/link";
import { ToolsetHeader } from "@/components/ui/ToolsetHeader";
import { Cog } from "lucide-react";
import { makeBreadcrumbs } from "@/lib/breadcrumbs";

const tools = [
  {
    title: "Primary Framework Editor",
    description: "Define and manage the global SSC framework including pillars, themes, and subthemes.",
    href: "/configuration/primary",
  },
  {
    title: "Comprehensive Framework Editor",
    description: "Manage the detailed SSC framework with extended classifications.",
    href: "/configuration/comprehensive",
  },
];

export default function ConfigurationPage() {
  const breadcrumbs = makeBreadcrumbs([
    { label: "Dashboard", href: "/" },
    { label: "Configuration" },
  ]);

  return (
    <main className="p-6 space-y-6">
      <ToolsetHeader
        title="SSC Configuration"
        description="Manage the SSC global framework and defaults."
        group="Configuration"
        icon={Cog}
        breadcrumbs={breadcrumbs}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {tools.map((tool) => (
          <Link
            key={tool.title}
            href={tool.href}
            className="block rounded-lg border p-6 hover:shadow-md transition bg-white"
          >
            <h2 className="text-lg font-semibold">{tool.title}</h2>
            <p className="text-sm text-gray-600">{tool.description}</p>
          </Link>
        ))}
      </div>
    </main>
  );
}
