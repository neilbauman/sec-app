import PageHeader from "@/components/ui/PageHeader.tsx";

export default function PrimaryFrameworkPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Primary Framework Editor"
        description="Create and manage pillars, themes, and subthemes."
      />

      <div className="rounded-lg border bg-white p-6 shadow-sm">
        <p className="text-gray-600">
          Placeholder: Primary Framework Editor will be built here.
        </p>
      </div>
    </div>
  );
}
