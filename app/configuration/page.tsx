import ToolsetHeader from "@/components/ui/ToolsetHeader";
import { makeBreadcrumbs } from "@/lib/breadcrumbs";
import { Cog, FileText } from "lucide-react";

export default function ConfigurationPage() {
  const breadcrumbs = makeBreadcrumbs([
    { label: "Dashboard", href: "/" },
    { label: "Configuration" },
  ]);

  const tools = [
    {
      title: "Primary Framework Editor",
      description: "Define and manage the SSC framework pillars, themes, and subthemes.",
      href: "/configuration/primary",
      icon: <FileText className="w-5 h-5 text-orange-600" />,
    },
    {
      title: "Comprehensive Framework Editor",
      description: "Edit the full SSC framework including all levels and indicators.",
      href: "/configuration/comprehensive",
      icon: <FileText className="w-5 h-5 text-orange-600" />,
    },
  ];

  return (
    <main className="p-6">
      <ToolsetHeader
        title="SSC Configuration"
        description="Manage the SSC global framework and defaults."
        group="Configuration"
        groupIcon={<Cog className="w-5 h-5" />}
        breadcrumbs={breadcrumbs}
      />

      {/* Mini Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
        {tools.map((tool, idx) => (
          <a
            key={idx}
            href={tool.href}
            className="p-4 border rounded-lg shadow-sm hover:shadow-md transition bg-white"
          >
            <div className="flex items-center space-x-2 mb-2">
              {tool.icon}
              <h4 className="font-semibold">{tool.title}</h4>
            </div>
            <p className="text-sm text-gray-600">{tool.description}</p>
          </a>
        ))}
      </div>
    </main>
  );
}
