// app/about/page.tsx
import PageHeader from "@/components/ui/PageHeader";

export default function AboutPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        group="about"
        page="index"
        breadcrumb={[
          { label: "Dashboard", href: "/" },
          { label: "About" },
        ]}
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <a
          href="/about/what-is-ssc"
          className="block rounded-xl border border-blue-200 bg-white p-6 shadow hover:shadow-md transition"
        >
          <h3 className="text-lg font-semibold text-blue-600">What is SSC?</h3>
          <p className="mt-2 text-sm text-gray-600">
            Learn about the Shelter and Settlement Severity Classification (SSC)
            system and its purpose.
          </p>
        </a>

        <a
          href="/about/using"
          className="block rounded-xl border border-blue-200 bg-white p-6 shadow hover:shadow-md transition"
        >
          <h3 className="text-lg font-semibold text-blue-600">Using the Toolset</h3>
          <p className="mt-2 text-sm text-gray-600">
            Practical guidelines and instructions for applying the SSC toolset in
            assessments.
          </p>
        </a>

        <a
          href="/about/guidelines"
          className="block rounded-xl border border-blue-200 bg-white p-6 shadow hover:shadow-md transition"
        >
          <h3 className="text-lg font-semibold text-blue-600">
            Implementation Guidelines
          </h3>
          <p className="mt-2 text-sm text-gray-600">
            Key steps, process recommendations, and methodology for SSC
            implementation.
          </p>
        </a>
      </div>
    </div>
  );
}
