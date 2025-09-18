// /app/page.tsx
import Link from "next/link";
import { Layers, Info, Cog, Globe, Database } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

export default function DashboardPage() {
  return (
    <main className="p-6 space-y-6">
      <header className="flex items-center space-x-2">
        <Layers className="w-6 h-6 text-orange-600" />
        <h1 className="text-2xl font-bold">
          Shelter and Settlement Severity Classification Toolset
        </h1>
      </header>

      <div className="grid gap-6 md:grid-cols-2">
        <Link href="/about">
          <Card className="hover:shadow-lg transition cursor-pointer">
            <CardContent className="p-6 flex items-start space-x-4">
              <Info className="w-6 h-6 text-blue-500" />
              <div>
                <h2 className="text-lg font-semibold">About</h2>
                <p className="text-sm text-gray-600">
                  Overview of the SSC and toolset.
                </p>
              </div>
            </CardContent>
          </Card>
        </Link>

        <Link href="/configuration">
          <Card className="hover:shadow-lg transition cursor-pointer">
            <CardContent className="p-6 flex items-start space-x-4">
              <Cog className="w-6 h-6 text-green-600" />
              <div>
                <h2 className="text-lg font-semibold">SSC Configuration</h2>
                <p className="text-sm text-gray-600">
                  Manage the SSC global framework and defaults.
                </p>
              </div>
            </CardContent>
          </Card>
        </Link>

        <Link href="/countries">
          <Card className="hover:shadow-lg transition cursor-pointer">
            <CardContent className="p-6 flex items-start space-x-4">
              <Globe className="w-6 h-6 text-purple-600" />
              <div>
                <h2 className="text-lg font-semibold">Country Configurations</h2>
                <p className="text-sm text-gray-600">
                  Configure baselines like places, shapes, and populations.
                </p>
              </div>
            </CardContent>
          </Card>
        </Link>

        <Link href="/instances">
          <Card className="hover:shadow-lg transition cursor-pointer">
            <CardContent className="p-6 flex items-start space-x-4">
              <Database className="w-6 h-6 text-orange-600" />
              <div>
                <h2 className="text-lg font-semibold">SSC Instances</h2>
                <p className="text-sm text-gray-600">
                  Use defaults to calculate and edit SSC instances.
                </p>
              </div>
            </CardContent>
          </Card>
        </Link>
      </div>
    </main>
  );
}
