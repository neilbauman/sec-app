// app/page.tsx
import PageHeader from "@/components/ui/PageHeader";
import Link from "next/link";
import { Info, Settings, Globe, BarChart2 } from "lucide-react";

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        group="dashboard"
        page="index"
        breadcrumb={[{ label: "Dashboard" }]}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* About Group */}
        <div className="p-6 bg-white rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center space-x-2 mb-2">
            <Info className="w-5 h-5 text-blue-600" />
            <h3 className="font-semibold text-gray-900">About</h3>
          </div>
          <p className="text-sm text-gray-600 mb-3">
            Learn about the SSC, its purpose, and how to use this toolset
            effectively.
          </p>
          <ul className="list-disc list-inside text-sm text-gray-700 space-y-1">
            <li>
              <Link href="/about/what-is-ssc" className="hover:underline">
                What is SSC?
              </Link>
            </li>
            <li>
              <Link href="/about/using" className="hover:underline">
                Using this Toolset
              </Link>
            </li>
          </ul>
        </div>

        {/* Configuration Group */}
        <div className="p-6 bg-white rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center space-x-2 mb-2">
            <Settings className="w-5 h-5 text-green-600" />
            <h3 className="font-semibold text-gray-900">Configuration</h3>
          </div>
          <p className="text-sm text-gray-600 mb-3">
            Manage and adjust the global configuration of the SSC toolset,
            including framework editors.
          </p>
          <ul className="list-disc list-inside text-sm text-gray-700 space-y-1">
            <li>
              <Link href="/configuration/primary" className="hover:underline">
                Primary Framework Editor
              </Link>
            </li>
            <li>
              <Link
                href="/configuration/comprehensive"
                className="hover:underline"
              >
                Comprehensive Framework Editor
              </Link>
            </li>
          </ul>
        </div>

        {/* Country Configuration Group */}
        <div className="p-6 bg-white rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center space-x-2 mb-2">
            <Globe className="w-5 h-5 text-purple-600" />
            <h3 className="font-semibold text-gray-900">
              Country Configuration
            </h3>
          </div>
          <p className="text-sm text-gray-600 mb-3">
            Manage SSC settings and framework customization for specific
            countries.
          </p>
          <ul className="list-disc list-inside text-sm text-gray-700 space-y-1">
            <li>
              <Link href="/country" className="hover:underline">
                Country Configuration
              </Link>
            </li>
          </ul>
        </div>

        {/* SSC Instances Group */}
        <div className="p-6 bg-white rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center space-x-2 mb-2">
            <BarChart2 className="w-5 h-5 text-orange-500" />
            <h3 className="font-semibold text-gray-900">SSC Instances</h3>
          </div>
          <p className="text-sm text-gray-600 mb-3">
            Create, manage, and explore SSC instances across contexts.
          </p>
          <ul className="list-disc list-inside text-sm text-gray-700 space-y-1">
            <li>
              <Link href="/instances" className="hover:underline">
                Manage SSC Instances
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
