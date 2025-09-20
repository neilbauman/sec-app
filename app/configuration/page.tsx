// app/configuration/page.tsx
import PageHeader from "@/components/ui/PageHeader";

const tools = [
  {
    href: "/configuration/primary",
    title: "Primary Framework Editor",
    description: "Define and manage pillars, themes, and subthemes of the SSC framework.",
  },
  {
    href: "/configuration/comprehensive",
    title: "Comprehensive Framework Editor",
    description: "Work with the full SSC framework including all pillars, themes, and subthemes.",
  },
];

export default function ConfigurationPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        group="configuration"
        page="index"
        breadcrumb={[{ label: "Configuration" }]}
      />
      <div className="prose max-w-none">
        <p>
          Manage and adjust the global configuration of the SSC toolset. Choose
          a tool below to continue.
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {tools.map((tool) => (
          <a
            key={tool.href}
            href={tool.href}
            className="block rounded-lg border border-gray-200 bg-white p-6 shadow hover:shadow-md transition"
          >
            <h3 className="text-lg font-semibold text-brand-green">
              {tool.title}
            </h3>
            <p className="mt-2 text-sm text-gray-600">{tool.description}</p>
          </a>
        ))}
      </div>
    </div>
  );
}
