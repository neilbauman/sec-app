import ToolsetHeader from "@/components/ui/ToolsetHeader";
import { Cog, FileText } from "lucide-react";

const editors = [
  {
    title: "Primary Framework Editor",
    description: "Manage global pillars, themes, and subthemes.",
    icon: FileText,
    href: "/configuration/primary",
  },
  {
    title: "Comprehensive Framework Editor",
    description: "Full SSC framework editor including indicators.",
    icon: FileText,
    href: "/configuration/comprehensive",
  },
];

export default function ConfigurationPage() {
  const breadcrumbs = [
    { label: "Dashboard", href: "/" },
    { label: "Configuration" },
  ];

  return (
    <main className="p-6">
      <ToolsetHeader
        title="SSC Configuration"
        description="Manage the SSC global framework and defaults."
        group="Configuration"
        icon={Cog}
        breadcrumbs={breadcrumbs}
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {editors.map((e, i) => (
          <a
            key={i}
            href={e.href}
            className="p-4 rounded-lg shadow bg-white hover:bg-gray-50 transition block"
          >
            <div className="flex items-center space-x-2">
              <e.icon className="w-5 h-5 text-green-600" />
              <h3 className="font-semibold">{e.title}</h3>
            </div>
            <p className="text-sm text-gray-600 mt-1">{e.description}</p>
          </a>
        ))}
      </div>
    </main>
  );
}
