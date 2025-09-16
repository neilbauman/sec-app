"use client";

import Link from "next/link";
import { Layers, Settings, Globe, Server } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import Breadcrumbs from "@/components/ui/Breadcrumbs.tsx";

export default function Dashboard() {
  return (
    <div className="space-y-8">
      {/* ✅ App Header with Icon */}
      <div className="flex items-center space-x-3">
        <Layers className="w-8 h-8 text-gray-700" />
        <h1 className="text-3xl font-bold">
          Shelter and Settlements Severity Classification Toolset
        </h1>
      </div>

      {/* ✅ Breadcrumb */}
      <Breadcrumbs
        items={[
          { label: "Dashboard", href: "/" },
        ]}
      />

      {/* ✅ About Section */}
      <Card>
        <CardContent>
          <div className="flex items-center space-x-2 mb-2">
            <Layers className="w-5 h-5 text-blue-500" />
            <h2 className="text-xl font-semibold">About</h2>
          </div>
          <p className="text-sm text-gray-600">
            Welcome to the Shelter and Settlements Severity Classification Toolset (SSC).
            Use this dashboard to configure frameworks, manage country data, and
            set up SSC instances.
          </p>
        </CardContent>
      </Card>

      {/* ✅ SSC Configuration Section */}
      <Card>
        <CardContent>
          <div className="flex items-center space-x-2 mb-2">
            <Settings className="w-5 h-5 text-green-500" />
            <h2 className="text-xl font-semibold">SSC Configuration</h2>
          </div>
          <ul className="list-disc pl-5 text-sm text-gray-600">
            <li>
              <Link href="/framework/primary" className="text-blue-600 hover:underline">
                Primary Framework Editor
              </Link>
            </li>
            <li>
              <Link href="/framework/comprehensive" className="text-blue-600 hover:underline">
                Comprehensive Framework Editor
              </Link>
            </li>
          </ul>
        </CardContent>
      </Card>

      {/* ✅ Country Configuration Section */}
      <Card>
        <CardContent>
          <div className="flex items-center space-x-2 mb-2">
            <Globe className="w-5 h-5 text-purple-500" />
            <h2 className="text-xl font-semibold">Country Configuration</h2>
          </div>
          <p className="text-sm text-gray-600">
            <Link href="/country" className="text-blue-600 hover:underline">
              Manage Country Data
            </Link>
          </p>
        </CardContent>
      </Card>

      {/* ✅ SSC Instances Section */}
      <Card>
        <CardContent>
          <div className="flex items-center space-x-2 mb-2">
            <Server className="w-5 h-5 text-orange-500" />
            <h2 className="text-xl font-semibold">SSC Instances</h2>
          </div>
          <p className="text-sm text-gray-600">
            <Link href="/instances" className="text-blue-600 hover:underline">
              Manage SSC Instances
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
