import Link from "next/link";
import { FileText, Globe, Server, Info } from "lucide-react";

export default function Dashboard() {
  return (
    <div className="space-y-8">
      {/* Page Title */}
      <div className="flex items-center justify-between border-b pb-4">
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
      </div>

      {/* Navigation Blocks */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Framework Config */}
        <div className="border rounded-lg p-6 shadow-sm bg-white hover:shadow-md transition">
          <div className="flex items-center space-x-2 mb-3">
            <FileText className="text-blue-600" size={20} />
            <h2 className="text-lg font-semibold">Framework Configuration</h2>
          </div>
          <p className="text-sm text-gray-500 mb-4">
            Manage the structure and details of the framework.
          </p>
          <ul className="space-y-2">
            <li>
              <Link
                href="/framework/primary/editor"
                className="text-blue-600 hover:underline"
              >
                Primary Framework Editor
              </Link>
            </li>
            <li>
              <Link
                href="/framework/comprehensive/editor"
                className="text-blue-600 hover:underline"
              >
                Comprehensive Framework Editor
              </Link>
            </li>
          </ul>
        </div>

        {/* Country Config */}
        <div className="border rounded-lg p-6 shadow-sm bg-white hover:shadow-md transition">
          <div className="flex items-center space-x-2 mb-3">
            <Globe className="text-green-600" size={20} />
            <h2 className="text-lg font-semibold">Country Configuration</h2>
          </div>
          <p className="text-sm text-gray-500">
            Coming soon — configure countries in the system.
          </p>
        </div>

        {/* SSC Management */}
        <div className="border rounded-lg p-6 shadow-sm bg-white hover:shadow-md transition">
          <div className="flex items-center space-x-2 mb-3">
            <Server className="text-purple-600" size={20} />
            <h2 className="text-lg font-semibold">SSC Instance Management</h2>
          </div>
          <p className="text-sm text-gray-500">
            Coming soon — manage SSC instances.
          </p>
        </div>

        {/* About */}
        <div className="border rounded-lg p-6 shadow-sm bg-white hover:shadow-md transition">
          <div className="flex items-center space-x-2 mb-3">
            <Info className="text-gray-600" size={20} />
            <h2 className="text-lg font-semibold">About</h2>
          </div>
          <p className="text-sm text-gray-500 mb-2">
            Learn more about this tool and its purpose.
          </p>
          <Link href="/about" className="text-blue-600 hover:underline">
            About Page
          </Link>
        </div>
      </div>
    </div>
  );
}
