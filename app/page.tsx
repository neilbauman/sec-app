"use client";

import Link from "next/link";
import { Info, Settings, Globe, Database } from "lucide-react";

export default function DashboardPage() {
  return (
    <div className="space-y-10">
      {/* Title with Icon */}
      <div className="flex items-center gap-3">
        <Database className="w-8 h-8 text-blue-600" />
        <h1 className="text-2xl font-bold">
          Shelter and Settlements Severity Classification Toolset
        </h1>
      </div>
      <p className="text-gray-600 max-w-3xl">
        Welcome to the Shelter and Settlements Severity Classification Toolset (SSC). 
        This tool helps configure, manage, and evaluate primary and comprehensive frameworks, 
        country datasets, and SSC instances.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* About */}
        <div className="p-6 border rounded-xl shadow-sm bg-white hover:shadow-md transition">
          <div className="flex items-center gap-2 mb-3">
            <Info className="w-5 h-5 text-blue-600" />
            <h2 className="text-lg font-semibold">About</h2>
          </div>
          <p className="text-gray-600">
            Welcome to the Shelter and Settlements Severity Classification Toolset (SSC). 
            This tool helps configure, manage, and evaluate primary and comprehensive frameworks, 
            country datasets, and SSC instances.
          </p>
        </div>

        {/* SSC Configuration */}
        <Link href="/configuration" className="block">
          <div className="p-6 border rounded-xl shadow-sm bg-white hover:shadow-md transition cursor-pointer">
            <div className="flex items-center gap-2 mb-3">
              <Settings className="w-5 h-5 text-green-600" />
              <h2 className="text-lg font-semibold">SSC Configuration</h2>
            </div>
            <p className="text-gray-600 mb-3">
              Manage framework editors and configure SSC components.
            </p>
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
        </Link>

        {/* Country Configuration */}
        <div className="p-6 border rounded-xl shadow-sm bg-white hover:shadow-md transition">
          <div className="flex items-center gap-2 mb-3">
            <Globe className="w-5 h-5 text-purple-600" />
            <h2 className="text-lg font-semibold">Country Configuration</h2>
          </div>
          <p className="text-gray-600">
            Set up baseline datasets and mapping boundaries.
          </p>
        </div>

        {/* SSC Instances */}
        <div className="p-6 border rounded-xl shadow-sm bg-white hover:shadow-md transition">
          <div className="flex items-center gap-2 mb-3">
            <Database className="w-5 h-5 text-red-600" />
            <h2 className="text-lg font-semibold">SSC Instances</h2>
          </div>
          <p className="text-gray-600">
            Manage post-disaster and secondary datasets to calculate severity scores.
          </p>
        </div>
      </div>
    </div>
  );
}
