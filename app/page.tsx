import Link from "next/link";
import { Card, CardContent } from "@/components/Card";
import { Info, Settings, Globe, Layers } from "lucide-react";

export default function Dashboard() {
  return (
    <div className="space-y-8">
      {/* ✅ App Header with Icon */}
      <div className="flex items-center space-x-3">
        <Layers className="w-8 h-8 text-gray-700" />
        <h1 className="text-3xl font-bold">
          Shelter and Settlements Severity Index Tool
        </h1>
      </div>

      {/* About Section */}
      <Card>
        <CardContent>
          <div className="flex items-center space-x-2 mb-2">
            <Info className="w-5 h-5 text-blue-500" />
            <h2 className="text-xl font-semibold">About</h2>
          </div>
          <p className="text-gray-700">
            Welcome to the Shelter and Settlements Severity Index Tool. Use this
            dashboard to manage and edit your framework.
          </p>
        </CardContent>
      </Card>

      {/* SSC Configuration Section */}
      <Card>
        <CardContent>
          <div className="flex items-center space-x-2 mb-2">
            <Settings className="w-5 h-5 text-green-600" />
            <h2 className="text-xl font-semibold">SSC Configuration</h2>
          </div>
          <ul className="list-disc list-inside text-blue-600 space-y-1">
            <li>
              <Link href="/framework">Primary Framework Editor</Link>
            </li>
            <li>
              <Link href="/framework/comprehensive">
                Comprehensive Framework Editor
              </Link>
            </li>
          </ul>
        </CardContent>
      </Card>

      {/* Country Configuration Section */}
      <Card>
        <CardContent>
          <div className="flex items-center space-x-2 mb-2">
            <Globe className="w-5 h-5 text-purple-600" />
            <h2 className="text-xl font-semibold">Country Configuration</h2>
         
