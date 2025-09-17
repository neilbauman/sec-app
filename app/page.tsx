// app/page.tsx
import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { Layers, Cog, Globe, Database, Info } from "lucide-react"
import ToolHeader from "@/components/ui/ToolHeader"

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <ToolHeader
        pageTitle="Shelter and Settlements Severity Classification Toolset"
        pageDescription="Welcome to the Shelter and Settlements Severity Classification Toolset (SSC). This tool helps configure, manage, and evaluate primary and comprehensive frameworks, country datasets, and SSC instances."
        breadcrumbs={[{ label: "Dashboard" }]}
        group="dashboard"
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* About */}
        <Card className="rounded-2xl shadow-sm hover:shadow-md transition">
          <CardContent className="p-6 space-y-2">
            <div className="flex items-center space-x-3">
              <Info className="w-6 h-6 text-blue-500" />
              <h2 className="text-lg font-semibold">About</h2>
            </div>
            <p className="text-sm text-gray-600">
              Welcome to the Shelter and Settlements Severity Classification Toolset (SSC). 
              This tool helps configure, manage, and evaluate primary and comprehensive frameworks, 
              country datasets, and SSC instances.
            </p>
          </CardContent>
        </Card>

        {/* SSC Configuration */}
        <Card className="rounded-2xl shadow-sm hover:shadow-md transition">
          <CardContent className="p-6 space-y-2">
            <div className="flex items-center space-x-3">
              <Cog className="w-6 h-6 text-green-500" />
              <h2 className="text-lg font-semibold">SSC Configuration</h2>
            </div>
            <p className="text-sm text-gray-600">
              Manage framework editors and configure SSC components.
            </p>
            <ul className="list-disc list-inside text-blue-600 text-sm pl-2">
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
          </CardContent>
        </Card>

        {/* Country Configuration */}
        <Card className="rounded-2xl shadow-sm hover:shadow-md transition">
          <CardContent className="p-6 space-y-2">
            <div className="flex items-center space-x-3">
              <Globe className="w-6 h-6 text-purple-500" />
              <h2 className="text-lg font-semibold">Country Configuration</h2>
            </div>
            <p className="text-sm text-gray-600">
              Set up baseline datasets and mapping boundaries.
            </p>
          </CardContent>
        </Card>

        {/* SSC Instances */}
        <Card className="rounded-2xl shadow-sm hover:shadow-md transition">
          <CardContent className="p-6 space-y-2">
            <div className="flex items-center space-x-3">
              <Database className="w-6 h-6 text-red-500" />
              <h2 className="text-lg font-semibold">SSC Instances</h2>
            </div>
            <p className="text-sm text-gray-600">
              Manage post-disaster and secondary datasets to calculate severity scores.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
