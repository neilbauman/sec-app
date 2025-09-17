import Link from "next/link";

export default function DashboardPage() {
  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-semibold">
        Shelter and Settlements Severity Classification Toolset
      </h1>
      <p className="text-gray-600">
        Welcome to the Shelter and Settlements Severity Classification Toolset (SSC).
        This tool helps configure, manage, and evaluate primary and comprehensive frameworks,
        country datasets, and SSC instances.
      </p>

      <div className="space-y-6">
        {/* About */}
        <div className="p-4 border rounded-lg shadow-sm bg-white">
          <h2 className="text-lg font-semibold mb-2">About</h2>
          <p className="text-gray-600">
            Welcome to the Shelter and Settlements Severity Classification Toolset (SSC). This tool
            helps configure, manage, and evaluate primary and comprehensive frameworks, country
            datasets, and SSC instances.
          </p>
        </div>

        {/* SSC Configuration */}
        <div className="p-4 border rounded-lg shadow-sm bg-white">
          <h2 className="text-lg font-semibold mb-2">SSC Configuration</h2>
          <ul className="list-disc list-inside text-blue-600 space-y-1">
            <li>
              <Link href="/configuration/primary" className="hover:underline">
                Primary Framework Editor
              </Link>
            </li>
            <li>
              <Link href="/configuration/comprehensive" className="hover:underline">
                Comprehensive Framework Editor
              </Link>
            </li>
          </ul>
        </div>

        {/* Country Configuration */}
        <div className="p-4 border rounded-lg shadow-sm bg-white">
          <h2 className="text-lg font-semibold mb-2">Country Configuration</h2>
          <p className="text-gray-600">Set up baseline datasets and mapping boundaries.</p>
        </div>

        {/* SSC Instances */}
        <div className="p-4 border rounded-lg shadow-sm bg-white">
          <h2 className="text-lg font-semibold mb-2">SSC Instances</h2>
          <p className="text-gray-600">
            Manage post-disaster and secondary datasets to calculate severity scores.
          </p>
        </div>
      </div>
    </div>
  );
}
