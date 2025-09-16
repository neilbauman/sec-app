import { Layers } from "lucide-react";
import Link from "next/link";
import Breadcrumbs from "@/components/ui/Breadcrumbs";

export default function Dashboard() {
  return (
    <div className="space-y-8">
      {/* ✅ App Header with Icon */}
      <div className="flex items-center space-x-3">
        <Layers className="w-8 h-8 text-gray-700" />
        <h1 className="text-3xl font-bold">Shelter and Settlements Severity Classification Toolset</h1>
      </div>

      {/* ✅ Breadcrumb below header */}
      <Breadcrumbs
        items={[
          { label: "Dashboard", href: "/" }
        ]}
      />

      {/* ✅ About Section */}
      <div className="p-6 bg-white rounded-2xl shadow">
        <h2 className="text-xl font-semibold mb-2">About</h2>
        <p>
          Welcome to the Shelter and Settlements Severity Classification Toolset (SSC). 
          This tool helps configure, manage, and evaluate primary and comprehensive frameworks, 
          country datasets, and SSC instances.
        </p>
      </div>

      {/* ✅ SSC Configuration Section */}
      <div className="p-6 bg-white rounded-2xl shadow">
        <h2 className="text-xl font-semibold mb-2">SSC Configuration</h2>
        <ul className="list-disc list-inside space-y-1 text-blue-600">
          <li><Link href="/framework/primary">Primary Framework Editor</Link></li>
          <li><Link href="/framework/comprehensive">Comprehensive Framework Editor</Link></li>
        </ul>
      </div>

      {/* ✅ Country Configuration Section */}
      <div className="p-6 bg-white rounded-2xl shadow">
        <h2 className="text-xl font-semibold mb-2">Country Configuration</h2>
        <p className="text-gray-700">Set up baseline datasets and mapping boundaries.</p>
      </div>

      {/* ✅ SSC Instances Section */}
      <div className="p-6 bg-white rounded-2xl shadow">
        <h2 className="text-xl font-semibold mb-2">SSC Instances</h2>
        <p className="text-gray-700">
          Manage post-disaster and secondary datasets to calculate severity scores.
        </p>
      </div>
    </div>
  );
}
