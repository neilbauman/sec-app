// app/configuration/primary/page.tsx
import PageHeader from "@/components/ui/PageHeader";

export default function PrimaryFrameworkEditorPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        group="configuration"
        page="primary"
        breadcrumb={[
          { label: "Dashboard", href: "/" },
          { label: "Configuration", href: "/configuration" },
          { label: "Primary Framework Editor" },
        ]}
      />

      <div className="bg-white rounded-lg shadow p-6 space-y-4">
        <h2 className="text-lg font-semibold">Primary Framework Editor</h2>
        <p className="text-gray-600">
          This page is a stable placeholder while we restore the interactive editor.
          Deployments should stay green and navigation remains correct.
        </p>

        <div className="rounded-md border border-gray-200 p-4">
          <p className="text-sm text-gray-700 mb-2">
            Example structure (non-interactive):
          </p>
          <ul className="list-disc pl-5 space-y-1 text-gray-800">
            <li>Pillar: Shelter
              <ul className="list-disc pl-5">
                <li>Theme: Adequacy
                  <ul className="list-disc pl-5">
                    <li>Subtheme: Overcrowding</li>
                    <li>Subtheme: Structural Safety</li>
                  </ul>
                </li>
                <li>Theme: Affordability</li>
              </ul>
            </li>
            <li>Pillar: Settlements</li>
          </ul>
        </div>

        <p className="text-xs text-gray-500">
          When ready, we’ll swap this section for the client editor component.
        </p>
      </div>
    </div>
  );
}
