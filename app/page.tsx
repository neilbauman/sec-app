// app/page.tsx
"use client";

import { Layers } from "lucide-react";
import { Card, CardContent } from "@/components/Card";

export default function Dashboard() {
  return (
    <div className="space-y-8">
      {/* ✅ App Header with Icon */}
      <div className="flex items-center space-x-3">
        <Layers className="w-8 h-8 text-gray-700" />
        <h1 className="text-3xl font-bold">Social Systems Compass</h1>
      </div>

      {/* ✅ About Section */}
      <Card>
        <CardContent>
          <h2 className="text-xl font-semibold mb-2">About</h2>
          <p className="text-sm text-gray-600">
            The Social Systems Compass (SSC) helps configure, manage, and evaluate
            primary and comprehensive frameworks, country datasets, and SSC instances.
          </p>
        </CardContent>
      </Card>

      {/* ✅ SSC Configuration Section */}
      <Card>
        <CardContent>
          <h2 className="text-xl font-semibold mb-2">SSC Configuration</h2>
          <ul className="list-disc pl-5 text-sm text-gray-600">
            <li>Primary Framework Editor</li>
            <li>Comprehensive Framework Editor</li>
          </ul>
        </CardContent>
      </Card>

      {/* ✅ Country Configuration Section */}
      <Card>
        <CardContent>
          <h2 className="text-xl font-semibold mb-2">Country Configuration</h2>
          <p className="text-sm text-gray-600">Set up baseline datasets and mapping boundaries.</p>
        </CardContent>
      </Card>

      {/* ✅ SSC Instances Section */}
      <Card>
        <CardContent>
          <h2 className="text-xl font-semibold mb-2">SSC Instances</h2>
          <p className="text-sm text-gray-600">
            Manage post-disaster and secondary datasets to calculate severity scores.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
